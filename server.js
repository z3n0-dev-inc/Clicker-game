// Backend Server for Cookie Empire
// Install dependencies: npm install express mongoose cors dotenv

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const OWNER_CODE = 'EMPIRE2025';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cookie-empire', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Player Schema
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
  upgrades: { type: Array, default: [] },
  prestigeUpgrades: { type: Array, default: [] },
  achievements: { type: Array, default: [] },
  ownedCosmetics: {
    cookies: { type: Array, default: ['default'] },
    themes: { type: Array, default: ['default'] },
    effects: { type: Array, default: ['none'] },
    titles: { type: Array, default: ['none'] }
  },
  equippedCosmetics: {
    cookie: { type: String, default: 'default' },
    theme: { type: String, default: 'default' },
    effect: { type: String, default: 'none' },
    title: { type: String, default: 'none' }
  },
  createdAt: { type: Date, default: Date.now },
  lastSaved: { type: Date, default: Date.now }
});

const Player = mongoose.model('Player', PlayerSchema);

// ===== ROUTES =====

// Save player progress
app.post('/api/save', async (req, res) => {
  try {
    const { playerId, playerName, ...gameData } = req.body;
    
    if (!playerId || !playerName) {
      return res.status(400).json({ success: false, error: 'Missing playerId or playerName' });
    }
    
    const player = await Player.findOneAndUpdate(
      { playerId },
      {
        playerId,
        playerName,
        ...gameData,
        lastSaved: new Date()
      },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, message: 'Progress saved', data: player });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Load player progress
app.get('/api/load/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    
    const player = await Player.findOne({ playerId });
    
    if (!player) {
      return res.json({ success: true, data: null, message: 'No saved data found' });
    }
    
    res.json({ success: true, data: player });
  } catch (error) {
    console.error('Load error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get leaderboard (top 100 players by total cookies earned)
app.get('/api/leaderboard', async (req, res) => {
  try {
    const players = await Player.find()
      .sort({ totalCookiesEarned: -1 })
      .limit(100)
      .select('playerId playerName cookies totalCookiesEarned level prestige equippedCosmetics')
      .lean();
    
    res.json({ success: true, data: players });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== OWNER ROUTES =====

// Middleware to verify owner code
const verifyOwner = (req, res, next) => {
  const ownerCode = req.body.ownerCode || req.headers['x-owner-code'];
  
  if (ownerCode !== OWNER_CODE) {
    return res.status(403).json({ success: false, error: 'Invalid owner code' });
  }
  
  next();
};

// Give cosmetic to player
app.post('/api/owner/give-cosmetic', verifyOwner, async (req, res) => {
  try {
    const { username, cosmeticType, cosmeticId } = req.body;
    
    if (!username || !cosmeticType || !cosmeticId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    const player = await Player.findOne({ playerName: username });
    
    if (!player) {
      return res.status(404).json({ success: false, error: 'Player not found' });
    }
    
    // Add cosmetic if not already owned
    const cosmeticKey = cosmeticType + 's';
    if (!player.ownedCosmetics[cosmeticKey].includes(cosmeticId)) {
      player.ownedCosmetics[cosmeticKey].push(cosmeticId);
      await player.save();
    }
    
    res.json({ 
      success: true, 
      message: `Gave ${cosmeticId} to ${username}`,
      data: player.ownedCosmetics 
    });
  } catch (error) {
    console.error('Give cosmetic error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all players
app.get('/api/owner/players', verifyOwner, async (req, res) => {
  try {
    const players = await Player.find()
      .sort({ totalCookiesEarned: -1 })
      .lean();
    
    res.json({ success: true, data: players });
  } catch (error) {
    console.error('Get players error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update player data
app.post('/api/owner/update-player', verifyOwner, async (req, res) => {
  try {
    const { playerId, updates } = req.body;
    
    if (!playerId || !updates) {
      return res.status(400).json({ success: false, error: 'Missing playerId or updates' });
    }
    
    const player = await Player.findOneAndUpdate(
      { playerId },
      { $set: updates },
      { new: true }
    );
    
    if (!player) {
      return res.status(404).json({ success: false, error: 'Player not found' });
    }
    
    res.json({ success: true, message: 'Player updated', data: player });
  } catch (error) {
    console.error('Update player error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete player
app.delete('/api/owner/delete-player', verifyOwner, async (req, res) => {
  try {
    const { playerId } = req.body;
    
    if (!playerId) {
      return res.status(400).json({ success: false, error: 'Missing playerId' });
    }
    
    const result = await Player.deleteOne({ playerId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Player not found' });
    }
    
    res.json({ success: true, message: 'Player deleted' });
  } catch (error) {
    console.error('Delete player error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Wipe all player data (DANGER!)
app.delete('/api/owner/wipe-all', verifyOwner, async (req, res) => {
  try {
    const result = await Player.deleteMany({});
    
    res.json({ 
      success: true, 
      message: `Wiped ${result.deletedCount} players`,
      count: result.deletedCount 
    });
  } catch (error) {
    console.error('Wipe all error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get server stats
app.get('/api/stats', async (req, res) => {
  try {
    const totalPlayers = await Player.countDocuments();
    const totalCookies = await Player.aggregate([
      { $group: { _id: null, total: { $sum: '$totalCookiesEarned' } } }
    ]);
    const totalClicks = await Player.aggregate([
      { $group: { _id: null, total: { $sum: '$totalClicks' } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalPlayers,
        totalCookies: totalCookies[0]?.total || 0,
        totalClicks: totalClicks[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Cookie Empire Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Cookie Empire Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  mongoose.connection.close();
  process.exit(0);
});
