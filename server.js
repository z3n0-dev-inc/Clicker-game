// ==========================================
// COOKIE EMPIRE ULTIMATE BACKEND V2.0
// The Most Advanced Cookie Clicker Backend
// Better than PlayFab, Firebase, and everything else
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
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Owner-Code', 'X-Mod-Code']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(__dirname));

// Request logging middleware
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
})
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// ==========================================
// ADVANCED PLAYER SCHEMA
// ==========================================
const PlayerSchema = new mongoose.Schema({
  playerId: { type: String, required: true, unique: true, index: true },
  playerName: { type: String, required: true, index: true },
  
  // Core Stats
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
  
  // Game Data
  upgrades: { type: Array, default: [] },
  prestigeUpgrades: { type: Array, default: [] },
  achievements: { type: Array, default: [] },
  currentGameMode: { type: String, default: 'classic' },
  gameModes: { type: Array, default: [] },
  
  // Cosmetics System
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
  
  // Gift Tracking
  cosmeticGifts: { type: Array, default: [] },
  
  // Advanced Stats
  stats: {
    playTime: { type: Number, default: 0 },
    fastestClick: { type: Number, default: Infinity },
    longestStreak: { type: Number, default: 0 },
    totalPrestige: { type: Number, default: 0 },
    cosmeticsUnlocked: { type: Number, default: 1 },
    achievementsUnlocked: { type: Number, default: 0 }
  },
  
  // Moderation
  warnings: { type: Number, default: 0 },
  muted: { type: Boolean, default: false },
  muteExpires: { type: Date, default: null },
  banned: { type: Boolean, default: false },
  banReason: { type: String, default: null },
  banExpires: { type: Date, default: null },
  
  // Roles
  isOwner: { type: Boolean, default: false },
  isModerator: { type: Boolean, default: false },
  isZ3N0: { type: Boolean, default: false },
  
  // Meta
  ipAddress: { type: String, default: null },
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  lastSaved: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes for performance
PlayerSchema.index({ totalCookiesEarned: -1 });
PlayerSchema.index({ level: -1 });
PlayerSchema.index({ prestige: -1 });
PlayerSchema.index({ playerName: 'text' });

const Player = mongoose.model('Player', PlayerSchema);

// ==========================================
// MODERATION LOG SCHEMA
// ==========================================
const ModLogSchema = new mongoose.Schema({
  moderator: { type: String, required: true },
  action: { type: String, required: true },
  targetPlayerId: { type: String, required: true },
  targetPlayerName: { type: String },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
});

ModLogSchema.index({ timestamp: -1 });
ModLogSchema.index({ targetPlayerId: 1 });

const ModLog = mongoose.model('ModLog', ModLogSchema);

// ==========================================
// ANALYTICS SCHEMA
// ==========================================
const AnalyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  totalPlayers: { type: Number, default: 0 },
  activePlayers: { type: Number, default: 0 },
  newPlayers: { type: Number, default: 0 },
  totalCookies: { type: Number, default: 0 },
  totalClicks: { type: Number, default: 0 },
  totalPrestige: { type: Number, default: 0 }
});

const Analytics = mongoose.model('Analytics', AnalyticsSchema);

// ==========================================
// GIFT TRANSACTION SCHEMA
// ==========================================
const GiftTransactionSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  itemType: { type: String, required: true },
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

GiftTransactionSchema.index({ to: 1 });
GiftTransactionSchema.index({ timestamp: -1 });

const GiftTransaction = mongoose.model('GiftTransaction', GiftTransactionSchema);

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================
const verifyOwner = (req, res, next) => {
  const ownerCode = req.body.ownerCode || req.headers['x-owner-code'];
  
  if (ownerCode !== OWNER_CODE) {
    return res.status(403).json({ 
      success: false, 
      error: 'Invalid owner code',
      code: 'FORBIDDEN'
    });
  }
  
  next();
};

const verifyModerator = (req, res, next) => {
  const modCode = req.body.modCode || req.headers['x-mod-code'];
  const ownerCode = req.body.ownerCode || req.headers['x-owner-code'];
  
  if (ownerCode === OWNER_CODE) {
    return next(); // Owners have mod permissions
  }
  
  if (modCode !== MODERATOR_CODE) {
    return res.status(403).json({ 
      success: false, 
      error: 'Invalid moderator code',
      code: 'FORBIDDEN'
    });
  }
  
  next();
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================
const generatePlayerId = () => {
  return 'player_' + crypto.randomBytes(8).toString('hex');
};

const sanitizePlayerData = (data) => {
  // Remove sensitive fields
  const sanitized = { ...data };
  delete sanitized.ipAddress;
  delete sanitized.__v;
  return sanitized;
};

const logModAction = async (moderator, action, targetPlayerId, targetPlayerName, details) => {
  try {
    await ModLog.create({
      moderator,
      action,
      targetPlayerId,
      targetPlayerName,
      details
    });
  } catch (error) {
    console.error('Mod log error:', error);
  }
};

// ==========================================
// BASIC PLAYER ROUTES
// ==========================================

// Save player progress
app.post('/api/save', async (req, res) => {
  try {
    const { playerId, playerName, ...gameData } = req.body;
    
    if (!playerId || !playerName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing playerId or playerName',
        code: 'MISSING_FIELDS'
      });
    }
    
    const updateData = {
      playerId,
      playerName,
      ...gameData,
      lastSaved: new Date(),
      lastLogin: new Date()
    };
    
    // Get IP address
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip) {
      updateData.ipAddress = ip;
    }
    
    const player = await Player.findOneAndUpdate(
      { playerId },
      updateData,
      { upsert: true, new: true }
    );
    
    res.json({ 
      success: true, 
      message: 'Progress saved successfully',
      data: sanitizePlayerData(player.toObject())
    });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save progress',
      details: error.message 
    });
  }
});

// Load player progress
app.get('/api/load/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    
    const player = await Player.findOne({ playerId });
    
    if (!player) {
      return res.json({ 
        success: true, 
        data: null, 
        message: 'No saved data found' 
      });
    }
    
    // Update last login
    player.lastLogin = new Date();
    await player.save();
    
    res.json({ 
      success: true, 
      data: sanitizePlayerData(player.toObject())
    });
  } catch (error) {
    console.error('Load error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to load progress',
      details: error.message 
    });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const sortBy = req.query.sortBy || 'totalCookiesEarned';
    
    const validSortFields = ['totalCookiesEarned', 'level', 'prestige', 'totalClicks'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'totalCookiesEarned';
    
    const players = await Player.find({ banned: { $ne: true } })
      .sort({ [sortField]: -1 })
      .limit(limit)
      .select('playerId playerName cookies totalCookiesEarned cookiesPerClick cookiesPerSecond level prestige equippedCosmetics isOwner isModerator isZ3N0 totalClicks')
      .lean();
    
    res.json({ 
      success: true, 
      data: players.map(p => sanitizePlayerData(p))
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch leaderboard',
      details: error.message 
    });
  }
});

// Get player profile (public)
app.get('/api/player/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    
    const player = await Player.findOne({ playerId })
      .select('-ipAddress -__v')
      .lean();
    
    if (!player) {
      return res.status(404).json({ 
        success: false, 
        error: 'Player not found' 
      });
    }
    
    res.json({ 
      success: true, 
      data: sanitizePlayerData(player)
    });
  } catch (error) {
    console.error('Get player error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch player',
      details: error.message 
    });
  }
});

// Search players
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query must be at least 2 characters' 
      });
    }
    
    const players = await Player.find({
      $or: [
        { playerName: { $regex: q, $options: 'i' } },
        { playerId: { $regex: q, $options: 'i' } }
      ],
      banned: { $ne: true }
    })
      .limit(20)
      .select('playerId playerName level prestige totalCookiesEarned')
      .lean();
    
    res.json({ 
      success: true, 
      data: players.map(p => sanitizePlayerData(p))
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Search failed',
      details: error.message 
    });
  }
});

// ==========================================
// OWNER ROUTES - ULTIMATE POWER
// ==========================================

// Get all players (paginated)
app.get('/api/owner/players', verifyOwner, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    
    const totalCount = await Player.countDocuments();
    const players = await Player.find()
      .sort({ totalCookiesEarned: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    res.json({ 
      success: true, 
      data: players,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalPlayers: totalCount
      }
    });
  } catch (error) {
    console.error('Get players error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch players',
      details: error.message 
    });
  }
});

// Update any player's data
app.post('/api/owner/update-player', verifyOwner, async (req, res) => {
  try {
    const { playerId, updates } = req.body;
    
    if (!playerId || !updates) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing playerId or updates' 
      });
    }
    
    // Handle nested updates (e.g., ownedCosmetics.cookies)
    const updateObject = {};
    for (const [key, value] of Object.entries(updates)) {
      if (key.includes('.')) {
        // Nested field like "ownedCosmetics.cookies"
        const parts = key.split('.');
        if (parts[0] === 'ownedCosmetics' && Array.isArray(value)) {
          // If it's an array, we need to push to it
          const player = await Player.findOne({ playerId });
          if (player && player.ownedCosmetics[parts[1]]) {
            if (!player.ownedCosmetics[parts[1]].includes(value[value.length - 1])) {
              player.ownedCosmetics[parts[1]].push(value[value.length - 1]);
              await player.save();
              continue;
            }
          }
        }
        updateObject[key] = value;
      } else {
        updateObject[key] = value;
      }
    }
    
    const player = await Player.findOneAndUpdate(
      { playerId },
      { $set: updateObject },
      { new: true }
    );
    
    if (!player) {
      return res.status(404).json({ 
        success: false, 
        error: 'Player not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Player updated successfully',
      data: player 
    });
  } catch (error) {
    console.error('Update player error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update player',
      details: error.message 
    });
  }
});

// Give resources to player
app.post('/api/owner/give-resources', verifyOwner, async (req, res) => {
  try {
    const { playerId, cookies, prestigeTokens, level, prestige } = req.body;
    
    if (!playerId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing playerId' 
      });
    }
    
    const player = await Player.findOne({ playerId });
    
    if (!player) {
      return res.status(404).json({ 
        success: false, 
        error: 'Player not found' 
      });
    }
    
    if (cookies) player.cookies += cookies;
    if (prestigeTokens) player.prestigeTokens += prestigeTokens;
    if (level) player.level = Math.max(player.level, level);
    if (prestige) player.prestige = Math.max(player.prestige, prestige);
    
    await player.save();
    
    res.json({ 
      success: true, 
      message: 'Resources given successfully',
      data: player 
    });
  } catch (error) {
    console.error('Give resources error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to give resources',
      details: error.message 
    });
  }
});

// Give cosmetic to player (with gift tracking)
app.post('/api/owner/give-cosmetic', verifyOwner, async (req, res) => {
  try {
    const { playerId, cosmeticType, cosmeticId, cosmeticName, from } = req.body;
    
    if (!playerId || !cosmeticType || !cosmeticId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }
    
    const player = await Player.findOne({ playerId });
    
    if (!player) {
      return res.status(404).json({ 
        success: false, 
        error: 'Player not found' 
      });
    }
    
    const cosmeticKey = cosmeticType + 's';
    
    // Check if already owned
    if (!player.ownedCosmetics[cosmeticKey]) {
      player.ownedCosmetics[cosmeticKey] = [];
    }
    
    if (player.ownedCosmetics[cosmeticKey].includes(cosmeticId)) {
      return res.json({ 
        success: false, 
        error: 'Player already owns this cosmetic' 
      });
    }
    
    // Add cosmetic
    player.ownedCosmetics[cosmeticKey].push(cosmeticId);
    
    // Add gift record
    const giftRecord = {
      id: Date.now(),
      from: from || 'Owner',
      cosmeticType,
      cosmeticId,
      cosmeticName: cosmeticName || cosmeticId,
      timestamp: new Date().toISOString()
    };
    
    if (!player.cosmeticGifts) {
      player.cosmeticGifts = [];
    }
    player.cosmeticGifts.push(giftRecord);
    
    await player.save();
    
    // Log gift transaction
    await GiftTransaction.create({
      from: from || 'Owner',
      to: playerId,
      itemType: cosmeticType,
      itemId: cosmeticId,
      itemName: cosmeticName || cosmeticId
    });
    
    res.json({ 
      success: true, 
      message: `Gave ${cosmeticName || cosmeticId} to player`,
      data: player.ownedCosmetics 
    });
  } catch (error) {
    console.error('Give cosmetic error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to give cosmetic',
      details: error.message 
    });
  }
});

// Mass give cosmetic to all players
app.post('/api/owner/mass-give-cosmetic', verifyOwner, async (req, res) => {
  try {
    const { cosmeticType, cosmeticId, cosmeticName, from } = req.body;
    
    if (!cosmeticType || !cosmeticId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }
    
    const cosmeticKey = cosmeticType + 's';
    const giftRecord = {
      id: Date.now(),
      from: from || 'Owner',
      cosmeticType,
      cosmeticId,
      cosmeticName: cosmeticName || cosmeticId,
      timestamp: new Date().toISOString()
    };
    
    const result = await Player.updateMany(
      { [`ownedCosmetics.${cosmeticKey}`]: { $ne: cosmeticId } },
      { 
        $push: { 
          [`ownedCosmetics.${cosmeticKey}`]: cosmeticId,
          cosmeticGifts: giftRecord
        }
      }
    );
    
    res.json({ 
      success: true, 
      message: `Gave ${cosmeticName || cosmeticId} to ${result.modifiedCount} players`,
      count: result.modifiedCount
    });
  } catch (error) {
    console.error('Mass give cosmetic error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to mass give cosmetic',
      details: error.message 
    });
  }
});

// Mass give resources to all players
app.post('/api/owner/mass-give-resources', verifyOwner, async (req, res) => {
  try {
    const { cookies, prestigeTokens } = req.body;
    
    const updateObject = {};
    if (cookies) updateObject.cookies = cookies;
    if (prestigeTokens) updateObject.prestigeTokens = prestigeTokens;
    
    if (Object.keys(updateObject).length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No resources specified' 
      });
    }
    
    const result = await Player.updateMany(
      {},
      { $inc: updateObject }
    );
    
    res.json({ 
      success: true, 
      message: `Gave resources to ${result.modifiedCount} players`,
      count: result.modifiedCount
    });
  } catch (error) {
    console.error('Mass give resources error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to mass give resources',
      details: error.message 
    });
  }
});

// Delete player
app.delete('/api/owner/delete-player', verifyOwner, async (req, res) => {
  try {
    const { playerId } = req.body;
    
    if (!playerId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing playerId' 
      });
    }
    
    const result = await Player.deleteOne({ playerId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Player not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Player deleted successfully' 
    });
  } catch (error) {
    console.error('Delete player error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete player',
      details: error.message 
    });
  }
});

// Ban player
app.post('/api/owner/ban-player', verifyOwner, async (req, res) => {
  try {
    const { playerId, reason, duration } = req.body;
    
    if (!playerId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing playerId' 
      });
    }
    
    const player = await Player.findOne({ playerId });
    
    if (!player) {
      return res.status(404).json({ 
        success: false, 
        error: 'Player not found' 
      });
    }
    
    player.banned = true;
    player.banReason = reason || 'No reason provided';
    
    if (duration) {
      const banExpires = new Date();
      banExpires.setMinutes(banExpires.getMinutes() + duration);
      player.banExpires = banExpires;
    } else {
      player.banExpires = null; // Permanent ban
    }
    
    await player.save();
    
    res.json({ 
      success: true, 
      message: 'Player banned successfully',
      data: player 
    });
  } catch (error) {
    console.error('Ban player error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to ban player',
      details: error.message 
    });
  }
});

// Unban player
app.post('/api/owner/unban-player', verifyOwner, async (req, res) => {
  try {
    const { playerId } = req.body;
    
    if (!playerId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing playerId' 
      });
    }
    
    const player = await Player.findOneAndUpdate(
      { playerId },
      { 
        banned: false, 
        banReason: null, 
        banExpires: null 
      },
      { new: true }
    );
    
    if (!player) {
      return res.status(404).json({ 
        success: false, 
        error: 'Player not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Player unbanned successfully',
      data: player 
    });
  } catch (error) {
    console.error('Unban player error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to unban player',
      details: error.message 
    });
  }
});

// Set player role
app.post('/api/owner/set-role', verifyOwner, async (req, res) => {
  try {
    const { playerId, role, value } = req.body;
    
    if (!playerId || !role) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing playerId or role' 
      });
    }
    
    const validRoles = ['isOwner', 'isModerator', 'isZ3N0'];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid role' 
      });
    }
    
    const player = await Player.findOneAndUpdate(
      { playerId },
      { [role]: value !== false },
      { new: true }
    );
    
    if (!player) {
      return res.status(404).json({ 
        success: false, 
        error: 'Player not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: `Player role updated successfully`,
      data: player 
    });
  } catch (error) {
    console.error('Set role error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to set role',
      details: error.message 
    });
  }
});

// Wipe all player data (NUCLEAR OPTION)
app.delete('/api/owner/wipe-all', verifyOwner, async (req, res) => {
  try {
    const { confirm } = req.body;
    
    if (confirm !== 'DELETE_EVERYTHING') {
      return res.status(400).json({ 
        success: false, 
        error: 'Confirmation required. Set confirm: "DELETE_EVERYTHING"' 
      });
    }
    
    const result = await Player.deleteMany({});
    await ModLog.deleteMany({});
    await GiftTransaction.deleteMany({});
    
    res.json({ 
      success: true, 
      message: `Wiped ${result.deletedCount} players and all related data`,
      count: result.deletedCount 
    });
  } catch (error) {
    console.error('Wipe all error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to wipe data',
      details: error.message 
    });
  }
});

// Get advanced analytics
app.get('/api/owner/analytics', verifyOwner, async (req, res) => {
  try {
    const totalPlayers = await Player.countDocuments();
    const activePlayers = await Player.countDocuments({ 
      lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
    });
    const bannedPlayers = await Player.countDocuments({ banned: true });
    
    const economyStats = await Player.aggregate([
      {
        $group: {
          _id: null,
          totalCookies: { $sum: '$cookies' },
          totalCookiesEarned: { $sum: '$totalCookiesEarned' },
          totalClicks: { $sum: '$totalClicks' },
          totalPrestige: { $sum: '$prestige' },
          avgLevel: { $avg: '$level' },
          avgCPS: { $avg: '$cookiesPerSecond' }
        }
      }
    ]);
    
    const levelDistribution = await Player.aggregate([
      {
        $bucket: {
          groupBy: '$level',
          boundaries: [1, 11, 51, 101, 201, Infinity],
          default: '201+',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);
    
    const prestigeDistribution = await Player.aggregate([
      {
        $bucket: {
          groupBy: '$prestige',
          boundaries: [0, 1, 6, 21, 51, Infinity],
          default: '51+',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);
    
    const topPlayers = await Player.find()
      .sort({ totalCookiesEarned: -1 })
      .limit(10)
      .select('playerId playerName totalCookiesEarned level prestige')
      .lean();
    
    res.json({ 
      success: true, 
      data: {
        players: {
          total: totalPlayers,
          active24h: activePlayers,
          banned: bannedPlayers,
          activePercentage: totalPlayers > 0 ? ((activePlayers / totalPlayers) * 100).toFixed(2) : 0
        },
        economy: economyStats[0] || {},
        distribution: {
          level: levelDistribution,
          prestige: prestigeDistribution
        },
        topPlayers
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch analytics',
      details: error.message 
    });
  }
});

// Get gift history
app.get('/api/owner/gift-history', verifyOwner, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    const totalCount = await GiftTransaction.countDocuments();
    const gifts = await GiftTransaction.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    res.json({ 
      success: true, 
      data: gifts,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalGifts: totalCount
      }
    });
  } catch (error) {
    console.error('Gift history error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch gift history',
      details: error.message 
    });
  }
});

// ==========================================
// MODERATOR ROUTES
// ==========================================

// Get players for moderation
app.get('/api/mod/players', verifyModerator, async (req, res) => {
  try {
    const players = await Player.find({ banned: { $ne: true } })
      .sort({ lastLogin: -1 })
      .limit(100)
      .select('playerId playerName level prestige warnings muted muteExpires lastLogin')
      .lean();
    
    res.json({ 
      success: true, 
      data: players.map(p => sanitizePlayerData(p))
    });
  } catch (error) {
    console.error('Mod get players error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch players',
      details: error.message 
    });
  }
});

// Warn player
app.post('/api/mod/warn-player', verifyModerator, async (req, res) => {
  try {
    const { playerId, reason, moderator } = req.body;
    
    if (!playerId || !reason) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing playerId or reason' 
      });
    }
    
    const player = await Player.findOneAndUpdate(
      { playerId },
      { $inc: { warnings: 1 } },
      { new: true }
    );
    
    if (!player) {
      return res.status(404).json({ 
        success: false, 
        error: 'Player not found' 
      });
    }
    
    await logModAction(
      moderator || 'Unknown Moderator',
      'WARN',
      playerId,
      player.playerName,
      reason
    );
    
    res.json({ 
      success: true, 
      message: 'Player warned successfully',
      data: player 
    });
  } catch (error) {
    console.error('Warn player error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to warn player',
      details: error.message 
    });
  }
});

// Mute player
app.post('/api/mod/mute-player', verifyModerator, async (req, res) => {
  try {
    const { playerId, duration, moderator } = req.body;
    
    if (!playerId || !duration) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing playerId or duration' 
      });
    }
    
    const muteExpires = new Date();
    muteExpires.setMinutes(muteExpires.getMinutes() + duration);
    
    const player = await Player.findOneAndUpdate(
      { playerId },
      { 
        muted: true,
        muteExpires
      },
      { new: true }
    );
    
    if (!player) {
      return res.status(404).json({ 
        success: false, 
        error: 'Player not found' 
      });
    }
    
    await logModAction(
      moderator || 'Unknown Moderator',
      'MUTE',
      playerId,
      player.playerName,
      `Muted for ${duration} minutes`
    );
    
    res.json({ 
      success: true, 
      message: 'Player muted successfully',
      data: player 
    });
  } catch (error) {
    console.error('Mute player error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to mute player',
      details: error.message 
    });
  }
});

// Unmute player
app.post('/api/mod/unmute-player', verifyModerator, async (req, res) => {
  try {
    const { playerId, moderator } = req.body;
    
    if (!playerId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing playerId' 
      });
    }
    
    const player = await Player.findOneAndUpdate(
      { playerId },
      { 
        muted: false,
        muteExpires: null
      },
      { new: true }
    );
    
    if (!player) {
      return res.status(404).json({ 
        success: false, 
        error: 'Player not found' 
      });
    }
    
    await logModAction(
      moderator || 'Unknown Moderator',
      'UNMUTE',
      playerId,
      player.playerName,
      'Unmuted'
    );
    
    res.json({ 
      success: true, 
      message: 'Player unmuted successfully',
      data: player 
    });
  } catch (error) {
    console.error('Unmute player error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to unmute player',
      details: error.message 
    });
  }
});

// Get moderation logs
app.get('/api/mod/logs', verifyModerator, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    const totalCount = await ModLog.countDocuments();
    const logs = await ModLog.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    res.json({ 
      success: true, 
      data: logs,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalLogs: totalCount
      }
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch logs',
      details: error.message 
    });
  }
});

// ==========================================
// STATS & ANALYTICS
// ==========================================

// Get server stats (public)
app.get('/api/stats', async (req, res) => {
  try {
    const totalPlayers = await Player.countDocuments();
    const activePlayers = await Player.countDocuments({ 
      lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
    });
    
    const stats = await Player.aggregate([
      {
        $group: {
          _id: null,
          totalCookies: { $sum: '$totalCookiesEarned' },
          totalClicks: { $sum: '$totalClicks' }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        totalPlayers,
        activePlayers,
        totalCookies: stats[0]?.totalCookies || 0,
        totalClicks: stats[0]?.totalClicks || 0
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch stats',
      details: error.message 
    });
  }
});

// ==========================================
// UTILITY ROUTES
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Cookie Empire Ultimate Backend V2.0 is running!',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Get API documentation
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    version: '2.0.0',
    endpoints: {
      player: {
        'POST /api/save': 'Save player progress',
        'GET /api/load/:playerId': 'Load player progress',
        'GET /api/leaderboard': 'Get leaderboard',
        'GET /api/player/:playerId': 'Get player profile',
        'GET /api/search?q=': 'Search players'
      },
      owner: {
        'GET /api/owner/players': 'Get all players (paginated)',
        'POST /api/owner/update-player': 'Update player data',
        'POST /api/owner/give-resources': 'Give resources to player',
        'POST /api/owner/give-cosmetic': 'Give cosmetic to player',
        'POST /api/owner/mass-give-cosmetic': 'Give cosmetic to all players',
        'POST /api/owner/mass-give-resources': 'Give resources to all players',
        'DELETE /api/owner/delete-player': 'Delete player',
        'POST /api/owner/ban-player': 'Ban player',
        'POST /api/owner/unban-player': 'Unban player',
        'POST /api/owner/set-role': 'Set player role',
        'DELETE /api/owner/wipe-all': 'Wipe all data (DANGER)',
        'GET /api/owner/analytics': 'Get advanced analytics',
        'GET /api/owner/gift-history': 'Get gift transaction history'
      },
      moderator: {
        'GET /api/mod/players': 'Get players for moderation',
        'POST /api/mod/warn-player': 'Warn player',
        'POST /api/mod/mute-player': 'Mute player',
        'POST /api/mod/unmute-player': 'Unmute player',
        'GET /api/mod/logs': 'Get moderation logs'
      },
      utility: {
        'GET /api/stats': 'Get server stats',
        'GET /api/health': 'Health check',
        'GET /api/docs': 'API documentation'
      }
    }
  });
});

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
  console.log('==========================================');
  console.log('🍪 COOKIE EMPIRE ULTIMATE BACKEND V2.0');
  console.log('==========================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log(`📖 Docs: http://localhost:${PORT}/api/docs`);
  console.log(`🔐 Owner Code: ${OWNER_CODE}`);
  console.log(`🛡️ Mod Code: ${MODERATOR_CODE}`);
  console.log('==========================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM received, shutting down gracefully...');
  mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('⚠️ SIGINT received, shutting down gracefully...');
  mongoose.connection.close();
  process.exit(0);
});
