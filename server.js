// ==========================================
// COOKIE EMPIRE ULTIMATE BACKEND V2.0
// ==========================================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const OWNER_CODE = 'EMPIRE2025';
const MODERATOR_CODE = 'MOD2025';

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], allowedHeaders: ['Content-Type', 'Authorization', 'X-Owner-Code', 'X-Mod-Code'] }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(__dirname));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ==========================================
// MONGODB CONNECTION
// ==========================================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cookie-empire-ultimate', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => { console.error('❌ MongoDB Error:', err); process.exit(1); });

// ==========================================
// PLAYER SCHEMA
// ==========================================
const PlayerSchema = new mongoose.Schema({
  playerId: { type: String, required: true, unique: true, index: true },
  playerName: { type: String, required: true, index: true },
  cookies: { type: Number, default: 0 },
  totalCookiesEarned: { type: Number, default: 0 },
  cookiesPerClick: { type: Number, default: 1 },
  cookiesPerSecond: { type: Number, default: 0 },
  totalClicks: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  prestige: { type: Number, default: 0 },
  prestigeTokens: { type: Number, default: 0 },
  criticalFails: { type: Number, default: 0 },
  upgrades: { type: Array, default: [] },
  prestigeUpgrades: { type: Array, default: [] },
  achievements: { type: Array, default: [] },
  currentGameMode: { type: String, default: 'classic' },
  gameModes: { type: Array, default: [] },
  ownedCosmetics: {
    cookies: { type: Array, default: ['default'] },
    themes: { type: Array, default: ['default'] },
    effects: { type: Array, default: ['none'] },
    titles: { type: Array, default: ['none'] },
    badges: { type: Array, default: [] }
  },
  equippedCosmetics: {
    cookie: { type: String, default: 'default' },
    theme: { type: String, default: 'default' },
    effect: { type: String, default: 'none' },
    title: { type: String, default: 'none' },
    badge: { type: String, default: null }
  },
  cosmeticGifts: { type: Array, default: [] },
  stats: {
    playTime: { type: Number, default: 0 },
    fastestClick: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalPrestige: { type: Number, default: 0 },
    cosmeticsUnlocked: { type: Number, default: 1 },
    achievementsUnlocked: { type: Number, default: 0 }
  },
  warnings: { type: Number, default: 0 },
  muted: { type: Boolean, default: false },
  muteExpires: { type: Number, default: null },
  kicked: { type: Boolean, default: false },
  kickedAt: { type: Number, default: null },
  banned: { type: Boolean, default: false },
  banReason: { type: String, default: null },
  banExpires: { type: Number, default: null },
  isOwner: { type: Boolean, default: false },
  isModerator: { type: Boolean, default: false },
  isZ3N0: { type: Boolean, default: false },
  ipAddress: { type: String, default: null },
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  lastSaved: { type: Date, default: Date.now }
}, { timestamps: true });

PlayerSchema.index({ totalCookiesEarned: -1 });
PlayerSchema.index({ level: -1 });
PlayerSchema.index({ prestige: -1 });

const Player = mongoose.model('Player', PlayerSchema);

const ModLogSchema = new mongoose.Schema({
  moderator: String,
  action: String,
  targetPlayerId: String,
  targetPlayerName: String,
  details: String,
  timestamp: { type: Date, default: Date.now }
});
const ModLog = mongoose.model('ModLog', ModLogSchema);

const GiftTransactionSchema = new mongoose.Schema({
  from: String,
  to: String,
  itemType: String,
  itemId: String,
  itemName: String,
  timestamp: { type: Date, default: Date.now }
});
const GiftTransaction = mongoose.model('GiftTransaction', GiftTransactionSchema);

// ==========================================
// AUTH MIDDLEWARE
// ==========================================
const verifyOwner = (req, res, next) => {
  const code = req.body?.ownerCode || req.headers['x-owner-code'];
  if (code !== OWNER_CODE) return res.status(403).json({ success: false, error: 'Forbidden', code: 'FORBIDDEN' });
  next();
};

const verifyModerator = (req, res, next) => {
  const ownerCode = req.body?.ownerCode || req.headers['x-owner-code'];
  const modCode = req.body?.modCode || req.headers['x-mod-code'];
  if (ownerCode === OWNER_CODE || modCode === MODERATOR_CODE) return next();
  return res.status(403).json({ success: false, error: 'Forbidden' });
};

// ==========================================
// HELPERS
// ==========================================
const sanitize = (obj) => {
  if (!obj) return obj;
  const o = typeof obj.toObject === 'function' ? obj.toObject() : { ...obj };
  delete o.ipAddress;
  delete o.__v;
  return o;
};

const logMod = async (moderator, action, targetId, targetName, details) => {
  try { await ModLog.create({ moderator, action, targetPlayerId: targetId, targetPlayerName: targetName, details }); }
  catch (e) { console.error('ModLog error:', e); }
};

// ==========================================
// PLAYER ROUTES
// ==========================================

// SAVE
app.post('/api/save', async (req, res) => {
  try {
    const { playerId, playerName, ...gameData } = req.body;
    if (!playerId || !playerName) return res.status(400).json({ success: false, error: 'Missing playerId or playerName' });
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const player = await Player.findOneAndUpdate(
      { playerId },
      { playerId, playerName, ...gameData, lastSaved: new Date(), lastLogin: new Date(), ipAddress: ip },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, message: 'Saved', data: sanitize(player) });
  } catch (e) {
    console.error('Save error:', e);
    res.status(500).json({ success: false, error: 'Save failed', details: e.message });
  }
});

// LOAD
app.get('/api/load/:playerId', async (req, res) => {
  try {
    const player = await Player.findOne({ playerId: req.params.playerId });
    if (!player) return res.json({ success: true, data: null });
    player.lastLogin = new Date();
    await player.save();
    res.json({ success: true, data: sanitize(player) });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Load failed', details: e.message });
  }
});

// LEADERBOARD
app.get('/api/leaderboard', async (req, res) => {
  try {
    const players = await Player.find({ banned: { $ne: true } })
      .sort({ totalCookiesEarned: -1 })
      .limit(100)
      .select('playerId playerName cookies totalCookiesEarned cookiesPerClick cookiesPerSecond level prestige equippedCosmetics totalClicks')
      .lean();
    res.json({ success: true, data: players.map(sanitize) });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Leaderboard failed', details: e.message });
  }
});

// GET PLAYER
app.get('/api/player/:playerId', async (req, res) => {
  try {
    const player = await Player.findOne({ playerId: req.params.playerId }).select('-ipAddress -__v').lean();
    if (!player) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: sanitize(player) });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

// SEARCH
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.status(400).json({ success: false, error: 'Query too short' });
    const players = await Player.find({
      $or: [{ playerName: { $regex: q, $options: 'i' } }, { playerId: { $regex: q, $options: 'i' } }],
      banned: { $ne: true }
    }).limit(20).select('playerId playerName level prestige totalCookiesEarned').lean();
    res.json({ success: true, data: players.map(sanitize) });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

// ==========================================
// OWNER ROUTES
// ==========================================

// GET ALL PLAYERS
app.get('/api/owner/players', verifyOwner, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 200, 500);
    const skip = (page - 1) * limit;
    const total = await Player.countDocuments();
    const players = await Player.find().sort({ totalCookiesEarned: -1 }).skip(skip).limit(limit).lean();
    res.json({ success: true, data: players, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed', details: e.message });
  }
});

// UPDATE PLAYER — the most important endpoint; handles nested paths correctly
app.post('/api/owner/update-player', verifyOwner, async (req, res) => {
  try {
    const { playerId, updates } = req.body;
    if (!playerId || !updates) return res.status(400).json({ success: false, error: 'Missing fields' });

    // Build flat $set object, handling nested correctly
    const setObj = {};
    for (const [key, value] of Object.entries(updates)) {
      setObj[key] = value;
    }

    const player = await Player.findOneAndUpdate(
      { playerId },
      { $set: setObj },
      { new: true, upsert: false }
    );

    if (!player) return res.status(404).json({ success: false, error: 'Player not found' });
    res.json({ success: true, data: sanitize(player) });
  } catch (e) {
    console.error('Update error:', e);
    res.status(500).json({ success: false, error: 'Update failed', details: e.message });
  }
});

// GIVE RESOURCES
app.post('/api/owner/give-resources', verifyOwner, async (req, res) => {
  try {
    const { playerId, cookies, prestigeTokens, level, prestige } = req.body;
    if (!playerId) return res.status(400).json({ success: false, error: 'Missing playerId' });
    const incObj = {};
    if (cookies) incObj.cookies = cookies;
    if (prestigeTokens) incObj.prestigeTokens = prestigeTokens;
    const setObj = {};
    if (level) setObj.level = level;
    if (prestige) setObj.prestige = prestige;
    const updateQuery = {};
    if (Object.keys(incObj).length) updateQuery.$inc = incObj;
    if (Object.keys(setObj).length) updateQuery.$set = setObj;
    const player = await Player.findOneAndUpdate({ playerId }, updateQuery, { new: true });
    if (!player) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: sanitize(player) });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed', details: e.message });
  }
});

// GIVE COSMETIC (with gift log)
app.post('/api/owner/give-cosmetic', verifyOwner, async (req, res) => {
  try {
    const { playerId, cosmeticType, cosmeticId, cosmeticName, from } = req.body;
    if (!playerId || !cosmeticType || !cosmeticId) return res.status(400).json({ success: false, error: 'Missing fields' });
    const player = await Player.findOne({ playerId });
    if (!player) return res.status(404).json({ success: false, error: 'Not found' });
    const key = cosmeticType + 's';
    if (!player.ownedCosmetics[key]) player.ownedCosmetics[key] = [];
    if (player.ownedCosmetics[key].includes(cosmeticId)) return res.json({ success: false, error: 'Already owned' });
    player.ownedCosmetics[key].push(cosmeticId);
    const gift = { id: Date.now(), from: from || 'Owner', cosmeticType, cosmeticId, cosmeticName: cosmeticName || cosmeticId, timestamp: new Date().toISOString() };
    if (!player.cosmeticGifts) player.cosmeticGifts = [];
    player.cosmeticGifts.push(gift);
    player.markModified('ownedCosmetics');
    player.markModified('cosmeticGifts');
    await player.save();
    await GiftTransaction.create({ from: from || 'Owner', to: playerId, itemType: cosmeticType, itemId: cosmeticId, itemName: cosmeticName || cosmeticId });
    res.json({ success: true, data: player.ownedCosmetics });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed', details: e.message });
  }
});

// MASS GIVE COSMETIC
app.post('/api/owner/mass-give-cosmetic', verifyOwner, async (req, res) => {
  try {
    const { cosmeticType, cosmeticId, cosmeticName, from } = req.body;
    if (!cosmeticType || !cosmeticId) return res.status(400).json({ success: false, error: 'Missing fields' });
    const key = cosmeticType + 's';
    const gift = { id: Date.now(), from: from || 'Owner', cosmeticType, cosmeticId, cosmeticName: cosmeticName || cosmeticId, timestamp: new Date().toISOString() };
    const result = await Player.updateMany(
      { [`ownedCosmetics.${key}`]: { $ne: cosmeticId } },
      { $push: { [`ownedCosmetics.${key}`]: cosmeticId, cosmeticGifts: gift } }
    );
    res.json({ success: true, count: result.modifiedCount });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed', details: e.message });
  }
});

// MASS GIVE RESOURCES
app.post('/api/owner/mass-give-resources', verifyOwner, async (req, res) => {
  try {
    const { cookies, prestigeTokens } = req.body;
    const incObj = {};
    if (cookies && cookies > 0) incObj.cookies = cookies;
    if (prestigeTokens && prestigeTokens > 0) incObj.prestigeTokens = prestigeTokens;
    if (!Object.keys(incObj).length) return res.status(400).json({ success: false, error: 'No resources' });
    const result = await Player.updateMany({}, { $inc: incObj });
    res.json({ success: true, count: result.modifiedCount });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed', details: e.message });
  }
});

// DELETE PLAYER
app.delete('/api/owner/delete-player', verifyOwner, async (req, res) => {
  try {
    const { playerId } = req.body;
    if (!playerId) return res.status(400).json({ success: false, error: 'Missing playerId' });
    const result = await Player.deleteOne({ playerId });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed', details: e.message });
  }
});

// BAN PLAYER
app.post('/api/owner/ban-player', verifyOwner, async (req, res) => {
  try {
    const { playerId, reason, duration } = req.body;
    if (!playerId) return res.status(400).json({ success: false, error: 'Missing playerId' });
    const banExpires = duration ? Date.now() + (duration * 60 * 1000) : null;
    const player = await Player.findOneAndUpdate(
      { playerId },
      { banned: true, banReason: reason || 'No reason', banExpires },
      { new: true }
    );
    if (!player) return res.status(404).json({ success: false, error: 'Not found' });
    await logMod('Owner', 'BAN', playerId, player.playerName, reason || 'No reason');
    res.json({ success: true, data: sanitize(player) });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed', details: e.message });
  }
});

// UNBAN PLAYER
app.post('/api/owner/unban-player', verifyOwner, async (req, res) => {
  try {
    const { playerId } = req.body;
    if (!playerId) return res.status(400).json({ success: false, error: 'Missing playerId' });
    const player = await Player.findOneAndUpdate({ playerId }, { banned: false, banReason: null, banExpires: null }, { new: true });
    if (!player) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: sanitize(player) });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed', details: e.message });
  }
});

// SET ROLE
app.post('/api/owner/set-role', verifyOwner, async (req, res) => {
  try {
    const { playerId, role, value } = req.body;
    const validRoles = ['isOwner', 'isModerator', 'isZ3N0'];
    if (!playerId || !validRoles.includes(role)) return res.status(400).json({ success: false, error: 'Invalid' });
    const player = await Player.findOneAndUpdate({ playerId }, { [role]: value !== false }, { new: true });
    if (!player) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: sanitize(player) });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

// WIPE ALL (nuclear)
app.delete('/api/owner/wipe-all', verifyOwner, async (req, res) => {
  try {
    const { confirm } = req.body;
    if (confirm !== 'DELETE_EVERYTHING') return res.status(400).json({ success: false, error: 'Confirmation required' });
    const result = await Player.deleteMany({});
    await ModLog.deleteMany({});
    await GiftTransaction.deleteMany({});
    res.json({ success: true, count: result.deletedCount });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

// ANALYTICS
app.get('/api/owner/analytics', verifyOwner, async (req, res) => {
  try {
    const total = await Player.countDocuments();
    const active = await Player.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 86400000) } });
    const banned = await Player.countDocuments({ banned: true });
    const economy = await Player.aggregate([{ $group: { _id: null, totalCookies: { $sum: '$cookies' }, totalEarned: { $sum: '$totalCookiesEarned' }, totalClicks: { $sum: '$totalClicks' }, totalPrestige: { $sum: '$prestige' }, avgLevel: { $avg: '$level' } } }]);
    const top = await Player.find().sort({ totalCookiesEarned: -1 }).limit(10).select('playerId playerName totalCookiesEarned level prestige').lean();
    res.json({ success: true, data: { players: { total, active, banned }, economy: economy[0] || {}, top } });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

// GIFT HISTORY
app.get('/api/owner/gift-history', verifyOwner, async (req, res) => {
  try {
    const gifts = await GiftTransaction.find().sort({ timestamp: -1 }).limit(100).lean();
    res.json({ success: true, data: gifts });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

// ==========================================
// MODERATOR ROUTES
// ==========================================

app.get('/api/mod/players', verifyModerator, async (req, res) => {
  try {
    const players = await Player.find({ banned: { $ne: true } }).sort({ lastLogin: -1 }).limit(100).select('playerId playerName level prestige warnings muted muteExpires lastLogin').lean();
    res.json({ success: true, data: players.map(sanitize) });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

app.post('/api/mod/warn-player', verifyModerator, async (req, res) => {
  try {
    const { playerId, reason, moderator } = req.body;
    if (!playerId) return res.status(400).json({ success: false, error: 'Missing playerId' });
    const player = await Player.findOneAndUpdate({ playerId }, { $inc: { warnings: 1 } }, { new: true });
    if (!player) return res.status(404).json({ success: false, error: 'Not found' });
    await logMod(moderator || 'Moderator', 'WARN', playerId, player.playerName, reason || '');
    res.json({ success: true, data: sanitize(player) });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

app.post('/api/mod/mute-player', verifyModerator, async (req, res) => {
  try {
    const { playerId, duration, moderator } = req.body;
    if (!playerId || !duration) return res.status(400).json({ success: false, error: 'Missing fields' });
    const muteExpires = Date.now() + (duration * 60 * 1000);
    const player = await Player.findOneAndUpdate({ playerId }, { muted: true, muteExpires }, { new: true });
    if (!player) return res.status(404).json({ success: false, error: 'Not found' });
    await logMod(moderator || 'Moderator', 'MUTE', playerId, player.playerName, `${duration}m`);
    res.json({ success: true, data: sanitize(player) });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

app.post('/api/mod/unmute-player', verifyModerator, async (req, res) => {
  try {
    const { playerId, moderator } = req.body;
    if (!playerId) return res.status(400).json({ success: false, error: 'Missing' });
    const player = await Player.findOneAndUpdate({ playerId }, { muted: false, muteExpires: null }, { new: true });
    if (!player) return res.status(404).json({ success: false, error: 'Not found' });
    await logMod(moderator || 'Moderator', 'UNMUTE', playerId, player.playerName, 'Unmuted');
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

app.get('/api/mod/logs', verifyModerator, async (req, res) => {
  try {
    const logs = await ModLog.find().sort({ timestamp: -1 }).limit(100).lean();
    res.json({ success: true, data: logs });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

// ==========================================
// UTILITY ROUTES
// ==========================================

app.get('/api/stats', async (req, res) => {
  try {
    const total = await Player.countDocuments();
    const active = await Player.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 86400000) } });
    const agg = await Player.aggregate([{ $group: { _id: null, totalCookies: { $sum: '$totalCookiesEarned' }, totalClicks: { $sum: '$totalClicks' } } }]);
    res.json({ success: true, data: { totalPlayers: total, activePlayers: active, totalCookies: agg[0]?.totalCookies || 0, totalClicks: agg[0]?.totalClicks || 0 } });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Cookie Empire V2.0 running!', uptime: process.uptime(), mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.get('/api/docs', (req, res) => {
  res.json({ success: true, version: '2.0.0', endpoints: {
    player: ['POST /api/save', 'GET /api/load/:id', 'GET /api/leaderboard', 'GET /api/player/:id', 'GET /api/search?q='],
    owner: ['GET /api/owner/players', 'POST /api/owner/update-player', 'POST /api/owner/give-resources', 'POST /api/owner/give-cosmetic', 'POST /api/owner/mass-give-cosmetic', 'POST /api/owner/mass-give-resources', 'DELETE /api/owner/delete-player', 'POST /api/owner/ban-player', 'POST /api/owner/unban-player', 'POST /api/owner/set-role', 'DELETE /api/owner/wipe-all', 'GET /api/owner/analytics', 'GET /api/owner/gift-history'],
    mod: ['GET /api/mod/players', 'POST /api/mod/warn-player', 'POST /api/mod/mute-player', 'POST /api/mod/unmute-player', 'GET /api/mod/logs'],
    util: ['GET /api/stats', 'GET /api/health', 'GET /api/docs']
  }});
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.use((req, res) => res.status(404).json({ success: false, error: 'Not found', path: req.path }));

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: 'Internal error' });
});

app.listen(PORT, () => {
  console.log('==========================================');
  console.log('🍪 COOKIE EMPIRE ULTIMATE BACKEND V2.0');
  console.log(`🚀 Port: ${PORT}`);
  console.log(`🔐 Owner: ${OWNER_CODE}`);
  console.log(`🛡️  Mod: ${MODERATOR_CODE}`);
  console.log('==========================================');
});

process.on('SIGTERM', () => { mongoose.connection.close(); process.exit(0); });
process.on('SIGINT', () => { mongoose.connection.close(); process.exit(0); });
