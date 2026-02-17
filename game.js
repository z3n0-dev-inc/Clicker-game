const { useState, useEffect, useRef, useCallback, useMemo } = React;

// API Configuration
const API_URL = 'https://clicker-game-production.up.railway.app/api';
const OWNER_CODE = 'EMPIRE2025';
const MODERATOR_CODE = 'MOD2025';

// COSMETICS - Massively expanded
const COSMETICS = {
  cookies: [
    { id: 'default', name: 'Classic Cookie', emoji: '🍪', rarity: 'common', cost: 0 },
    { id: 'golden', name: 'Golden Cookie', emoji: '🥇', rarity: 'rare', cost: 100000 },
    { id: 'rainbow', name: 'Rainbow Cookie', emoji: '🌈', rarity: 'epic', cost: 1000000 },
    { id: 'diamond', name: 'Diamond Cookie', emoji: '💎', rarity: 'legendary', cost: 10000000 },
    { id: 'fire', name: 'Fire Cookie', emoji: '🔥', rarity: 'epic', cost: 2500000 },
    { id: 'ice', name: 'Ice Cookie', emoji: '❄️', rarity: 'epic', cost: 2500000 },
    { id: 'cosmic', name: 'Cosmic Cookie', emoji: '🌌', rarity: 'legendary', cost: 25000000 },
    { id: 'heart', name: 'Heart Cookie', emoji: '❤️', rarity: 'rare', cost: 250000 },
    { id: 'star', name: 'Star Cookie', emoji: '⭐', rarity: 'rare', cost: 200000 },
    { id: 'skull', name: 'Skull Cookie', emoji: '💀', rarity: 'epic', cost: 5000000 },
    { id: 'alien', name: 'Alien Cookie', emoji: '👽', rarity: 'legendary', cost: 40000000 },
    { id: 'robot', name: 'Robot Cookie', emoji: '🤖', rarity: 'legendary', cost: 50000000 },
    { id: 'crown', name: 'Crown Cookie', emoji: '👑', rarity: 'legendary', cost: 100000000 },
    { id: 'dragon', name: 'Dragon Cookie', emoji: '🐉', rarity: 'mythic', cost: 500000000 },
    { id: 'unicorn', name: 'Unicorn Cookie', emoji: '🦄', rarity: 'mythic', cost: 750000000 },
    { id: 'phoenix', name: 'Phoenix Cookie', emoji: '🔱', rarity: 'mythic', cost: 1000000000 },
  ],
  themes: [
    { id: 'default', name: 'Dark Void', bg: '#0a0a0a', accent: '#8b5cf6', secondary: '#06b6d4', rarity: 'common', cost: 0 },
    { id: 'crimson', name: 'Crimson Flame', bg: '#1a0505', accent: '#dc2626', secondary: '#f97316', rarity: 'rare', cost: 500000 },
    { id: 'emerald', name: 'Emerald Dream', bg: '#051a0a', accent: '#10b981', secondary: '#14b8a6', rarity: 'rare', cost: 500000 },
    { id: 'royal', name: 'Royal Gold', bg: '#1a1505', accent: '#f59e0b', secondary: '#eab308', rarity: 'epic', cost: 3000000 },
    { id: 'ocean', name: 'Deep Ocean', bg: '#05091a', accent: '#3b82f6', secondary: '#06b6d4', rarity: 'epic', cost: 3000000 },
    { id: 'sunset', name: 'Sunset Blaze', bg: '#1a0a05', accent: '#f97316', secondary: '#ec4899', rarity: 'legendary', cost: 20000000 },
    { id: 'matrix', name: 'Matrix Code', bg: '#0a1a0a', accent: '#22c55e', secondary: '#4ade80', rarity: 'legendary', cost: 30000000 },
    { id: 'void', name: 'Void Space', bg: '#000000', accent: '#6366f1', secondary: '#8b5cf6', rarity: 'legendary', cost: 60000000 },
    { id: 'neon', name: 'Neon City', bg: '#0f0a1a', accent: '#ec4899', secondary: '#a855f7', rarity: 'legendary', cost: 80000000 },
    { id: 'galaxy', name: 'Galaxy', bg: '#0a0515', accent: '#a78bfa', secondary: '#818cf8', rarity: 'mythic', cost: 200000000 },
    { id: 'volcanic', name: 'Volcanic', bg: '#1a0a00', accent: '#ef4444', secondary: '#f97316', rarity: 'mythic', cost: 300000000 },
  ],
  effects: [
    { id: 'none', name: 'No Effect', rarity: 'common', cost: 0 },
    { id: 'sparkles', name: 'Sparkle Trail', rarity: 'rare', cost: 1000000 },
    { id: 'flames', name: 'Flame Aura', rarity: 'epic', cost: 5000000 },
    { id: 'lightning', name: 'Lightning Strikes', rarity: 'legendary', cost: 25000000 },
    { id: 'rainbow', name: 'Rainbow Pulse', rarity: 'legendary', cost: 40000000 },
    { id: 'galaxy', name: 'Galaxy Swirl', rarity: 'mythic', cost: 100000000 },
    { id: 'divine', name: 'Divine Light', rarity: 'mythic', cost: 250000000 },
  ],
  titles: [
    { id: 'none', name: 'No Title', display: '', rarity: 'common', cost: 0 },
    { id: 'baker', name: 'Master Baker', display: '🍞 Master Baker', rarity: 'rare', cost: 250000 },
    { id: 'legend', name: 'Cookie Legend', display: '⚡ Cookie Legend', rarity: 'epic', cost: 7500000 },
    { id: 'emperor', name: 'Cookie Emperor', display: '👑 Cookie Emperor', rarity: 'legendary', cost: 75000000 },
    { id: 'god', name: 'Cookie God', display: '✨ Cookie God', rarity: 'mythic', cost: 500000000 },
    { id: 'z3n0', name: 'Z3N0', display: '⚡ Z3N0', rarity: 'creator', cost: 0, creatorOnly: true },
    { id: 'owner', name: 'Game Owner', display: '⚡ OWNER', rarity: 'owner', cost: 0, ownerOnly: true },
    { id: 'moderator', name: 'Moderator', display: '🛡️ MOD', rarity: 'staff', cost: 0, staffOnly: true },
  ],
  badges: [
    { id: 'veteran', name: 'Veteran', emoji: '🎖️', rarity: 'rare', cost: 1000000 },
    { id: 'wealthy', name: 'Wealthy', emoji: '💰', rarity: 'epic', cost: 50000000 },
    { id: 'speedster', name: 'Speedster', emoji: '⚡', rarity: 'legendary', cost: 100000000 },
    { id: 'collector', name: 'Collector', emoji: '📦', rarity: 'legendary', cost: 250000000 },
  ]
};

const OWNER_COSMETICS = {
  cookies: [
    { id: 'nuclear', name: 'Nuclear Cookie', emoji: '☢️', rarity: 'owner', glow: '#00ff00', desc: 'Radioactive power' },
    { id: 'blackhole', name: 'Black Hole Cookie', emoji: '⚫', rarity: 'owner', glow: '#9400d3', desc: 'Void incarnate' },
    { id: 'quantum', name: 'Quantum Cookie', emoji: '🌀', rarity: 'owner', glow: '#00ffff', desc: 'Reality bender' },
    { id: 'solar', name: 'Solar Cookie', emoji: '☀️', rarity: 'owner', glow: '#ffa500', desc: 'Star power' },
    { id: 'void_emperor', name: 'Void Emperor', emoji: '👁️', rarity: 'owner', glow: '#8b00ff', desc: 'All-seeing' },
    { id: 'magma', name: 'Magma Core', emoji: '🌋', rarity: 'owner', glow: '#ff4500', desc: 'Molten fury' },
    { id: 'celestial', name: 'Celestial Cookie', emoji: '✨', rarity: 'owner', glow: '#ffffff', desc: 'Divine light' },
    { id: 'time_lord', name: 'Time Lord Cookie', emoji: '⏰', rarity: 'owner', glow: '#4169e1', desc: 'Controls time' },
    { id: 'ice_king', name: 'Ice King Cookie', emoji: '🧊', rarity: 'owner', glow: '#00bfff', desc: 'Frozen throne' },
    { id: 'thunder_god', name: 'Thunder God', emoji: '⚡', rarity: 'owner', glow: '#ffff00', desc: 'Lightning ruler' },
    { id: 'infinity', name: 'Infinity Cookie', emoji: '♾️', rarity: 'owner', glow: '#ff1493', desc: 'Limitless power' },
    { id: 'z3n0_ultimate', name: 'Z3N0 Ultimate', emoji: '👑', rarity: 'creator', glow: '#ffd700', desc: 'Creator\'s mark' },
  ],
  themes: [
    { id: 'command_center', name: 'Command Center', bg: '#0a0a0a', accent: '#ffd700', secondary: '#ffaa00', rarity: 'owner', glow: true },
    { id: 'matrix_owner', name: 'Owner Matrix', bg: '#001a00', accent: '#00ff41', secondary: '#39ff14', rarity: 'owner', glow: true },
    { id: 'cyber_authority', name: 'Cyber Authority', bg: '#0a0015', accent: '#ff00ff', secondary: '#00ffff', rarity: 'owner', glow: true },
    { id: 'royal_command', name: 'Royal Command', bg: '#1a0a00', accent: '#ffd700', secondary: '#ffdf00', rarity: 'owner', glow: true },
    { id: 'void_throne', name: 'Void Throne', bg: '#000000', accent: '#9400d3', secondary: '#8b00ff', rarity: 'owner', glow: true },
    { id: 'nuclear_control', name: 'Nuclear Control', bg: '#001a00', accent: '#00ff00', secondary: '#7fff00', rarity: 'owner', glow: true },
    { id: 'z3n0_divine', name: 'Z3N0 Divine', bg: '#000510', accent: '#ffd700', secondary: '#8b5cf6', rarity: 'creator', glow: true },
  ],
  effects: [
    { id: 'god_ray', name: 'God Ray', rarity: 'owner', desc: 'Divine light beams' },
    { id: 'thunder_strike', name: 'Thunder Strike', rarity: 'owner', desc: 'Lightning on click' },
    { id: 'galaxy_burst', name: 'Galaxy Burst', rarity: 'owner', desc: 'Star explosion' },
    { id: 'fire_trail', name: 'Fire Trail', rarity: 'owner', desc: 'Flames follow cursor' },
    { id: 'diamond_rain', name: 'Diamond Rain', rarity: 'owner', desc: 'Gems cascade down' },
  ]
};

const MOD_COSMETICS = {
  cookies: [
    { id: 'mod_shield', name: 'Mod Shield', emoji: '🛡️', rarity: 'staff' },
    { id: 'mod_hammer', name: 'Mod Hammer', emoji: '🔨', rarity: 'staff' },
  ],
  themes: [
    { id: 'mod_panel', name: 'Moderator Panel', bg: '#0a0a15', accent: '#3b82f6', secondary: '#60a5fa', rarity: 'staff' },
  ]
};

// GAME MODES
const GAME_MODES = [
  { 
    id: 'classic', 
    name: 'Classic Mode', 
    desc: 'Traditional cookie clicking', 
    icon: '🍪',
    multiplier: 1,
    unlocked: true
  },
  { 
    id: 'speed', 
    name: 'Speed Mode', 
    desc: '2x click speed, 0.5x rewards', 
    icon: '⚡',
    multiplier: 0.5,
    speedBonus: 2,
    unlockRequirement: { level: 10 },
    unlocked: false
  },
  { 
    id: 'hardcore', 
    name: 'Hardcore Mode', 
    desc: '3x rewards, higher fail chance', 
    icon: '💀',
    multiplier: 3,
    critFailMultiplier: 2,
    unlockRequirement: { level: 25 },
    unlocked: false
  },
  { 
    id: 'zen', 
    name: 'Zen Mode', 
    desc: 'No fail chance, 0.8x rewards', 
    icon: '🧘',
    multiplier: 0.8,
    noFail: true,
    unlockRequirement: { prestige: 1 },
    unlocked: false
  },
  { 
    id: 'chaos', 
    name: 'Chaos Mode', 
    desc: 'Random multipliers (0.5x - 5x)', 
    icon: '🌀',
    chaosMode: true,
    unlockRequirement: { prestige: 5 },
    unlocked: false
  },
  { 
    id: 'godmode', 
    name: 'God Mode', 
    desc: '10x everything (Owner only)', 
    icon: '👑',
    multiplier: 10,
    ownerOnly: true,
    unlocked: false
  }
];

function UltimateCookieEmpire() {
  // Core game state
  const [cookies, setCookies] = useState(0);
  const [totalCookiesEarned, setTotalCookiesEarned] = useState(0);
  const [cookiesPerClick, setCookiesPerClick] = useState(1);
  const [cookiesPerSecond, setCookiesPerSecond] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [prestige, setPrestige] = useState(0);
  const [prestigeTokens, setPrestigeTokens] = useState(0);
  
  // Roles
  const [isOwner, setIsOwner] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isZ3N0, setIsZ3N0] = useState(false);
  
  // Panels
  const [ownerPanelOpen, setOwnerPanelOpen] = useState(false);
  const [modPanelOpen, setModPanelOpen] = useState(false);
  const [staffDashboardOpen, setStaffDashboardOpen] = useState(false);
  const [ownerTab, setOwnerTab] = useState('quick');
  const [modTab, setModTab] = useState('players');
  const [staffTab, setStaffTab] = useState('overview');
  
  // Difficulty
  const [criticalFailChance, setCriticalFailChance] = useState(0);
  const [criticalFails, setCriticalFails] = useState(0);
  
  // Game mode
  const [currentGameMode, setCurrentGameMode] = useState('classic');
  const [gameModes, setGameModes] = useState(GAME_MODES);
  const [chaosMultiplier, setChaosMultiplier] = useState(1);
  
  // Player identity
  const [playerName, setPlayerName] = useState(() => {
    const saved = localStorage.getItem('cookieEmpirePlayerName');
    return saved || '';
  });
  const [showNameInput, setShowNameInput] = useState(() => {
    const saved = localStorage.getItem('cookieEmpirePlayerName');
    return !saved;
  });
  const [playerId] = useState(() => {
    const stored = localStorage.getItem('cookieEmpirePlayerId');
    if (stored) return stored;
    const newId = 'player_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cookieEmpirePlayerId', newId);
    return newId;
  });
  
  // Cosmetics & Gifts
  const [ownedCosmetics, setOwnedCosmetics] = useState({
    cookies: ['default'],
    themes: ['default'],
    effects: ['none'],
    titles: ['none'],
    badges: []
  });
  const [equippedCosmetics, setEquippedCosmetics] = useState({
    cookie: 'default',
    theme: 'default',
    effect: 'none',
    title: 'none',
    badge: null
  });
  const [cosmeticGifts, setCosmeticGifts] = useState([]);
  
  // UI state
  const [showCosmeticsMenu, setShowCosmeticsMenu] = useState(false);
  const [showCosmeticsShop, setShowCosmeticsShop] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showGameModes, setShowGameModes] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('click');
  
  // Auto-save
  const [saveStatus, setSaveStatus] = useState('saved');
  
  // Particles and notifications
  const [particles, setParticles] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [clickStreak, setClickStreak] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const clickTimeWindowRef = useRef([]);
  
  // Management
  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modLogs, setModLogs] = useState([]);
  
  // Stats tracking
  const [stats, setStats] = useState({
    playTime: 0,
    fastestClick: Infinity,
    longestStreak: 0,
    totalPrestige: 0,
    cosmeticsUnlocked: 1,
    achievementsUnlocked: 0
  });
  
  // ACHIEVEMENTS - Expanded
  const [achievements, setAchievements] = useState([
    { id: 'first_click', name: 'First Cookie', desc: 'Click your first cookie', unlocked: false, icon: '🍪', reward: 10 },
    { id: 'hundred_cookies', name: 'Cookie Collector', desc: 'Earn 5,000 cookies', unlocked: false, icon: '💰', reward: 100 },
    { id: 'thousand_cookies', name: 'Cookie Hoarder', desc: 'Earn 500,000 cookies', unlocked: false, icon: '💎', reward: 2500 },
    { id: 'first_upgrade', name: 'Investor', desc: 'Buy your first upgrade', unlocked: false, icon: '📈', reward: 50 },
    { id: 'level_10', name: 'Rising Star', desc: 'Reach level 15', unlocked: false, icon: '⭐', reward: 1000 },
    { id: 'level_25', name: 'Cookie Master', desc: 'Reach level 35', unlocked: false, icon: '👑', reward: 5000 },
    { id: 'level_50', name: 'Cookie Overlord', desc: 'Reach level 75', unlocked: false, icon: '🔥', reward: 25000 },
    { id: 'level_100', name: 'Cookie Deity', desc: 'Reach level 150', unlocked: false, icon: '✨', reward: 100000 },
    { id: 'hundred_cps', name: 'Automation King', desc: '5,000 cookies per second', unlocked: false, icon: '⚡', reward: 10000 },
    { id: 'thousand_cps', name: 'Production Master', desc: '500,000 cookies per second', unlocked: false, icon: '🏭', reward: 100000 },
    { id: 'first_prestige', name: 'Ascended', desc: 'Prestige for the first time', unlocked: false, icon: '🌟', reward: 25000 },
    { id: 'prestige_10', name: 'Transcendent', desc: 'Reach prestige 15', unlocked: false, icon: '💫', reward: 250000 },
    { id: 'speed_demon', name: 'Speed Demon', desc: '150 clicks in 10 seconds', unlocked: false, icon: '🚀', reward: 10000 },
    { id: 'millionaire', name: 'Millionaire', desc: 'Earn 50,000,000 cookies', unlocked: false, icon: '💸', reward: 500000 },
    { id: 'billionaire', name: 'Billionaire', desc: 'Earn 5,000,000,000 cookies', unlocked: false, icon: '🏦', reward: 50000000 },
    { id: 'survivor', name: 'Survivor', desc: 'Survive 25 critical failures', unlocked: false, icon: '💀', reward: 100000 },
    { id: 'click_master', name: 'Click Master', desc: 'Click 10,000 times', unlocked: false, icon: '👆', reward: 50000 },
    { id: 'click_god', name: 'Click God', desc: 'Click 100,000 times', unlocked: false, icon: '🖱️', reward: 500000 },
    { id: 'fashionista', name: 'Fashionista', desc: 'Own 10 cosmetics', unlocked: false, icon: '👗', reward: 100000 },
    { id: 'collector', name: 'Collector', desc: 'Own 25 cosmetics', unlocked: false, icon: '📦', reward: 500000 },
    { id: 'mode_explorer', name: 'Mode Explorer', desc: 'Try all game modes', unlocked: false, icon: '🌍', reward: 1000000 },
  ]);
  
  // UPGRADES - Expanded with owner upgrades
  const [upgrades, setUpgrades] = useState([
    // Click upgrades
    { id: 1, name: 'Better Fingers', desc: '+5 cookies per click', cost: 100, owned: 0, type: 'click', bonus: 5, icon: '👆', tier: 1 },
    { id: 2, name: 'Strong Hands', desc: '+15 cookies per click', cost: 750, owned: 0, type: 'click', bonus: 15, icon: '✊', tier: 1 },
    { id: 3, name: 'Power Gloves', desc: '+50 cookies per click', cost: 5000, owned: 0, type: 'click', bonus: 50, icon: '🧤', tier: 2 },
    { id: 4, name: 'Bionic Arms', desc: '+150 cookies per click', cost: 25000, owned: 0, type: 'click', bonus: 150, icon: '🦾', tier: 2 },
    { id: 5, name: 'Super Strength', desc: '+500 cookies per click', cost: 150000, owned: 0, type: 'click', bonus: 500, icon: '💪', tier: 3 },
    { id: 6, name: 'Titan Punch', desc: '+2000 cookies per click', cost: 1000000, owned: 0, type: 'click', bonus: 2000, icon: '👊', tier: 3 },
    { id: 7, name: 'God Slap', desc: '+10000 cookies per click', cost: 10000000, owned: 0, type: 'click', bonus: 10000, icon: '🤚', tier: 4 },
    { id: 8, name: 'Reality Breaker', desc: '+50000 cookies per click', cost: 100000000, owned: 0, type: 'click', bonus: 50000, icon: '💥', tier: 5 },
    { id: 9, name: 'Universe Clap', desc: '+250000 cookies per click', cost: 1000000000, owned: 0, type: 'click', bonus: 250000, icon: '🌌', tier: 6 },
    
    // MULTIPLIER UPGRADES
    { id: 100, name: 'Click Doubler', desc: 'x2 ALL click power', cost: 500000000, owned: 0, type: 'click_mult', multiplier: 2, icon: '⚡', tier: 6, maxOwned: 1 },
    { id: 101, name: 'Ultimate Multiplier', desc: 'x5 ALL click power', cost: 50000000000, owned: 0, type: 'click_mult', multiplier: 5, icon: '🌟', tier: 7, maxOwned: 1 },
    
    // Auto producers
    { id: 10, name: 'Cookie Oven', desc: '+1 cookie/sec', cost: 150, owned: 0, type: 'auto', cps: 1, icon: '🔥', tier: 1 },
    { id: 11, name: 'Grandma Baker', desc: '+5 cookies/sec', cost: 800, owned: 0, type: 'auto', cps: 5, icon: '👵', tier: 1 },
    { id: 12, name: 'Cookie Factory', desc: '+20 cookies/sec', cost: 4000, owned: 0, type: 'auto', cps: 20, icon: '🏭', tier: 2 },
    { id: 13, name: 'Cookie Farm', desc: '+75 cookies/sec', cost: 20000, owned: 0, type: 'auto', cps: 75, icon: '🌾', tier: 2 },
    { id: 14, name: 'Cookie Mine', desc: '+250 cookies/sec', cost: 100000, owned: 0, type: 'auto', cps: 250, icon: '⛏️', tier: 3 },
    { id: 15, name: 'Cookie Wizard', desc: '+1000 cookies/sec', cost: 750000, owned: 0, type: 'auto', cps: 1000, icon: '🧙', tier: 3 },
    { id: 16, name: 'Cookie Portal', desc: '+5000 cookies/sec', cost: 7500000, owned: 0, type: 'auto', cps: 5000, icon: '🌀', tier: 4 },
    { id: 17, name: 'Cookie Dimension', desc: '+25000 cookies/sec', cost: 75000000, owned: 0, type: 'auto', cps: 25000, icon: '🌌', tier: 4 },
    { id: 18, name: 'Cookie Universe', desc: '+150000 cookies/sec', cost: 750000000, owned: 0, type: 'auto', cps: 150000, icon: '🪐', tier: 5 },
    { id: 19, name: 'Cookie Multiverse', desc: '+1000000 cookies/sec', cost: 10000000000, owned: 0, type: 'auto', cps: 1000000, icon: '♾️', tier: 5 },
    { id: 20, name: 'Cookie Omnipotence', desc: '+10000000 cookies/sec', cost: 500000000000, owned: 0, type: 'auto', cps: 10000000, icon: '👁️', tier: 6 },
    
    // Efficiency upgrades
    { id: 30, name: 'Efficiency I', desc: '+10% all production', cost: 50000, owned: 0, type: 'efficiency', bonus: 0.1, icon: '📊', tier: 2, maxOwned: 1 },
    { id: 31, name: 'Efficiency II', desc: '+25% all production', cost: 500000, owned: 0, type: 'efficiency', bonus: 0.25, icon: '📈', tier: 3, maxOwned: 1 },
    { id: 32, name: 'Efficiency III', desc: '+50% all production', cost: 5000000, owned: 0, type: 'efficiency', bonus: 0.5, icon: '📉', tier: 4, maxOwned: 1 },
    { id: 33, name: 'Efficiency IV', desc: '+100% all production', cost: 100000000, owned: 0, type: 'efficiency', bonus: 1.0, icon: '💹', tier: 5, maxOwned: 1 },
    
    // Lucky upgrades
    { id: 40, name: 'Lucky Charm', desc: 'Reduce critical fail by 25%', cost: 100000, owned: 0, type: 'luck', reduction: 0.25, icon: '🍀', tier: 2, maxOwned: 1 },
    { id: 41, name: 'Blessed Amulet', desc: 'Reduce critical fail by 50%', cost: 2500000, owned: 0, type: 'luck', reduction: 0.5, icon: '✝️', tier: 3, maxOwned: 1 },
    { id: 42, name: 'Divine Protection', desc: 'Reduce critical fail by 75%', cost: 50000000, owned: 0, type: 'luck', reduction: 0.75, icon: '🛡️', tier: 4, maxOwned: 1 },
    
    // OWNER ONLY UPGRADES
    { id: 200, name: 'Owner Authority', desc: '+1000000 cookies per click', cost: 1000000000000, owned: 0, type: 'click', bonus: 1000000, icon: '👑', tier: 8, ownerOnly: true },
    { id: 201, name: 'Admin Power', desc: '+10000000 cookies per click', cost: 100000000000000, owned: 0, type: 'click', bonus: 10000000, icon: '⚡', tier: 9, ownerOnly: true },
    { id: 202, name: 'God Mode Clicker', desc: '+100000000 cookies per click', cost: 10000000000000000, owned: 0, type: 'click', bonus: 100000000, icon: '✨', tier: 10, ownerOnly: true },
    { id: 203, name: 'Owner Auto Farm', desc: '+100000000 cookies/sec', cost: 50000000000000, owned: 0, type: 'auto', cps: 100000000, icon: '🏭', tier: 8, ownerOnly: true },
    { id: 204, name: 'Infinite Production', desc: 'x10 ALL click power', cost: 500000000000000, owned: 0, type: 'click_mult', multiplier: 10, icon: '♾️', tier: 10, maxOwned: 1, ownerOnly: true },
    { id: 205, name: 'Reality Control', desc: 'x100 ALL production', cost: 1000000000000000, owned: 0, type: 'click_mult', multiplier: 100, icon: '🌀', tier: 11, maxOwned: 1, ownerOnly: true },
    { id: 206, name: 'Cosmic Dominance', desc: '+1B cookies/sec', cost: 10000000000000000, owned: 0, type: 'auto', cps: 1000000000, icon: '🌌', tier: 11, ownerOnly: true },
  ]);
  
  // Prestige upgrades
  const [prestigeUpgrades, setPrestigeUpgrades] = useState([
    { id: 'p1', name: 'Cookie Blessing', desc: 'Start with +100 click power', cost: 5, owned: false, effect: 'click_start_100' },
    { id: 'p2', name: 'Auto Starter', desc: 'Start with +50 CPS', cost: 8, owned: false, effect: 'cps_start_50' },
    { id: 'p3', name: 'Golden Touch', desc: '+15% all production', cost: 15, owned: false, effect: 'production_15' },
    { id: 'p4', name: 'Divine Fortune', desc: '+40% all production', cost: 30, owned: false, effect: 'production_40' },
    { id: 'p5', name: 'Cosmic Power', desc: '+75% all production', cost: 60, owned: false, effect: 'production_75' },
    { id: 'p6', name: 'Ultimate Force', desc: '+150% all production', cost: 120, owned: false, effect: 'production_150' },
    { id: 'p7', name: 'Reality Bender', desc: '+300% all production', cost: 250, owned: false, effect: 'production_300' },
    { id: 'p8', name: 'Luck Master', desc: 'Reduce critical fail chance', cost: 150, owned: false, effect: 'reduce_crit_fail' },
    { id: 'p9', name: 'XP Boost', desc: '+50% XP gain', cost: 80, owned: false, effect: 'xp_boost' },
    { id: 'p10', name: 'Cost Reduction', desc: '-20% upgrade costs', cost: 200, owned: false, effect: 'cost_reduction' },
  ]);
  
  // API functions
  const api = useMemo(() => ({
    saveProgress: async (data) => {
      try {
        const response = await fetch(`${API_URL}/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playerId,
            playerName,
            ...data
          })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      } catch (error) {
        console.error('Save failed:', error);
        return { success: false, error: error.message };
      }
    },
    
    loadProgress: async () => {
      try {
        const response = await fetch(`${API_URL}/load/${playerId}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      } catch (error) {
        console.error('Load failed:', error);
        return { success: false, error: error.message };
      }
    },
    
    getLeaderboard: async () => {
      try {
        const response = await fetch(`${API_URL}/leaderboard`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return { success: true, data: data.data || data || [] };
      } catch (error) {
        console.error('Leaderboard fetch failed:', error);
        return { success: false, data: [] };
      }
    },
    
    getAllPlayers: async () => {
      try {
        const response = await fetch(`${API_URL}/owner/players`, {
          headers: { 'X-Owner-Code': OWNER_CODE }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return { success: true, data: data.data || data || [] };
      } catch (error) {
        console.error('Get players failed:', error);
        return { success: false, data: [] };
      }
    },
    
    updatePlayer: async (playerId, updates) => {
      try {
        const response = await fetch(`${API_URL}/owner/update-player`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ownerCode: OWNER_CODE,
            playerId,
            updates
          })
        });
        return await response.json();
      } catch (error) {
        console.error('Update player failed:', error);
        return { success: false, error: error.message };
      }
    },
    
    deletePlayer: async (playerId) => {
      try {
        const response = await fetch(`${API_URL}/owner/delete-player`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ownerCode: OWNER_CODE,
            playerId
          })
        });
        return await response.json();
      } catch (error) {
        console.error('Delete player failed:', error);
        return { success: false, error: error.message };
      }
    }
  }), [playerId, playerName]);
  
  // Load progress
  useEffect(() => {
    const loadData = async () => {
      const result = await api.loadProgress();
      if (result.success && result.data) {
        const data = result.data;
        setCookies(data.cookies || 0);
        setTotalCookiesEarned(data.totalCookiesEarned || 0);
        setCookiesPerClick(data.cookiesPerClick || 1);
        setCookiesPerSecond(data.cookiesPerSecond || 0);
        setTotalClicks(data.totalClicks || 0);
        setLevel(data.level || 1);
        setXp(data.xp || 0);
        setPrestige(data.prestige || 0);
        setPrestigeTokens(data.prestigeTokens || 0);
        
        if (data.playerName) {
          setPlayerName(data.playerName);
          localStorage.setItem('cookieEmpirePlayerName', data.playerName);
          setShowNameInput(false);
        }
        
        if (data.upgrades) setUpgrades(data.upgrades);
        if (data.prestigeUpgrades) setPrestigeUpgrades(data.prestigeUpgrades);
        if (data.achievements) setAchievements(data.achievements);
        if (data.ownedCosmetics) setOwnedCosmetics(data.ownedCosmetics);
        if (data.equippedCosmetics) setEquippedCosmetics(data.equippedCosmetics);
        if (data.cosmeticGifts) setCosmeticGifts(data.cosmeticGifts);
        if (data.currentGameMode) setCurrentGameMode(data.currentGameMode);
        if (data.gameModes) setGameModes(data.gameModes);
        if (data.stats) setStats(data.stats);
        setCriticalFails(data.criticalFails || 0);
      }
    };
    loadData();
  }, [api]);
  
  // Auto-save - FIXED VERSION
  useEffect(() => {
    if (!playerName) return;
    
    const saveInterval = setInterval(async () => {
      console.log('🔄 Auto-saving...');
      setSaveStatus('saving');
      
      try {
        const result = await api.saveProgress({
          cookies,
          totalCookiesEarned,
          cookiesPerClick,
          cookiesPerSecond,
          totalClicks,
          level,
          xp,
          prestige,
          prestigeTokens,
          upgrades,
          prestigeUpgrades,
          achievements,
          ownedCosmetics,
          equippedCosmetics,
          cosmeticGifts,
          currentGameMode,
          gameModes,
          stats,
          criticalFails
        });
        
        if (result.success) {
          console.log('✅ Save successful!');
          setSaveStatus('saved');
        } else {
          console.error('❌ Save failed:', result.error);
          setSaveStatus('error');
        }
      } catch (error) {
        console.error('❌ Save error:', error);
        setSaveStatus('error');
      }
    }, 10000); // Save every 10 seconds instead of 30
    
    return () => clearInterval(saveInterval);
  }, [playerName, cookies, totalCookiesEarned, cookiesPerClick, cookiesPerSecond, totalClicks, level, xp, prestige, prestigeTokens, upgrades, prestigeUpgrades, achievements, ownedCosmetics, equippedCosmetics, cosmeticGifts, currentGameMode, gameModes, stats, criticalFails, api]);
  
  // Helper functions
  const formatNumber = useCallback((num) => {
    if (num >= 1e18) return (num / 1e18).toFixed(2) + 'Qi';
    if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Q';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toLocaleString();
  }, []);
  
  const getLevelRequirement = useCallback((lvl) => {
    return Math.floor(1000 * Math.pow(1.8, lvl - 1));
  }, []);
  
  const getPrestigeMultiplier = useCallback(() => {
    let mult = 1;
    if (prestigeUpgrades) {
      prestigeUpgrades.forEach(pu => {
        if (pu.owned) {
          if (pu.effect === 'production_15') mult *= 1.15;
          if (pu.effect === 'production_40') mult *= 1.4;
          if (pu.effect === 'production_75') mult *= 1.75;
          if (pu.effect === 'production_150') mult *= 2.5;
          if (pu.effect === 'production_300') mult *= 4;
        }
      });
    }
    
    if (upgrades) {
      upgrades.forEach(u => {
        if (u.type === 'efficiency' && u.owned > 0) {
          mult *= (1 + u.bonus);
        }
      });
    }
    
    return mult;
  }, [prestigeUpgrades, upgrades]);
  
  const getGameModeMultiplier = useCallback(() => {
    const mode = gameModes.find(m => m.id === currentGameMode);
    if (!mode) return 1;
    
    if (mode.chaosMode) {
      return chaosMultiplier;
    }
    
    return mode.multiplier || 1;
  }, [currentGameMode, gameModes, chaosMultiplier]);
  
  // Calculate critical fail chance
  useEffect(() => {
    const mode = gameModes.find(m => m.id === currentGameMode);
    if (mode?.noFail) {
      setCriticalFailChance(0);
      return;
    }
    
    let chance = Math.min(0.2, level * 0.0015);
    
    if (mode?.critFailMultiplier) {
      chance *= mode.critFailMultiplier;
    }
    
    if (prestigeUpgrades) {
      const hasLuckMaster = prestigeUpgrades.find(pu => pu.id === 'p8' && pu.owned);
      if (hasLuckMaster) chance *= 0.5;
    }
    
    if (upgrades) {
      upgrades.forEach(u => {
        if (u.type === 'luck' && u.owned > 0) {
          chance *= (1 - u.reduction);
        }
      });
    }
    
    setCriticalFailChance(Math.max(0, chance));
  }, [level, prestigeUpgrades, upgrades, currentGameMode, gameModes]);
  
  // Chaos mode random multiplier
  useEffect(() => {
    const mode = gameModes.find(m => m.id === currentGameMode);
    if (mode?.chaosMode) {
      const interval = setInterval(() => {
        const newMult = 0.5 + Math.random() * 4.5; // 0.5x to 5x
        setChaosMultiplier(newMult);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [currentGameMode, gameModes]);
  
  // Auto-generate cookies
  useEffect(() => {
    const interval = setInterval(() => {
      if (cookiesPerSecond > 0) {
        const amount = (cookiesPerSecond / 10) * getPrestigeMultiplier() * getGameModeMultiplier();
        setCookies(c => c + amount);
        setTotalCookiesEarned(t => t + amount);
        
        const xpBoost = prestigeUpgrades && prestigeUpgrades.find(pu => pu.id === 'p9' && pu.owned);
        const xpMult = xpBoost ? 1.5 : 1;
        setXp(x => x + (amount / 30) * xpMult);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [cookiesPerSecond, getPrestigeMultiplier, getGameModeMultiplier, prestigeUpgrades]);
  
  // Level up
  useEffect(() => {
    const required = getLevelRequirement(level);
    if (xp >= required) {
      setXp(xp - required);
      setLevel(level + 1);
      createNotification(`🎉 Level ${level + 1}!`);
      
      const bonus = level * 100;
      setCookies(c => c + bonus);
      createNotification(`+${formatNumber(bonus)} bonus cookies`);
      
      // Unlock game modes
      setGameModes(modes => modes.map(mode => {
        if (mode.unlockRequirement) {
          if (mode.unlockRequirement.level && level + 1 >= mode.unlockRequirement.level) {
            if (!mode.unlocked) {
              createNotification(`🎮 ${mode.name} unlocked!`);
            }
            return { ...mode, unlocked: true };
          }
        }
        return mode;
      }));
    }
  }, [xp, level, getLevelRequirement, formatNumber]);
  
  const createParticle = useCallback((x, y, text, color = '#fbbf24') => {
    const id = Date.now() + Math.random();
    setParticles(p => [...p, { id, x, y, text, color }]);
    setTimeout(() => {
      setParticles(p => p.filter(particle => particle.id !== id));
    }, 1000);
  }, []);
  
  const createNotification = useCallback((message) => {
    const id = Date.now() + Math.random();
    setNotifications(n => [...n, { id, message }]);
    setTimeout(() => {
      setNotifications(n => n.filter(notif => notif.id !== id));
    }, 4000);
  }, []);
  
  const addModLog = useCallback((action, details) => {
    const log = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      moderator: playerName,
      action,
      details
    };
    setModLogs(logs => [log, ...logs].slice(0, 100));
  }, [playerName]);
  
  // Check achievements
  const checkAchievements = useCallback(() => {
    if (!achievements || achievements.length === 0) return;
    
    const newAchievements = [...achievements];
    let changed = false;
    
    const cosmeticsCount = Object.values(ownedCosmetics).reduce((sum, arr) => sum + arr.length, 0);
    
    const checks = [
      { index: 0, condition: totalClicks > 0 },
      { index: 1, condition: totalCookiesEarned >= 5000 },
      { index: 2, condition: totalCookiesEarned >= 500000 },
      { index: 3, condition: upgrades && upgrades.some(u => u.owned > 0) },
      { index: 4, condition: level >= 15 },
      { index: 5, condition: level >= 35 },
      { index: 6, condition: level >= 75 },
      { index: 7, condition: level >= 150 },
      { index: 8, condition: cookiesPerSecond >= 5000 },
      { index: 9, condition: cookiesPerSecond >= 500000 },
      { index: 10, condition: prestige > 0 },
      { index: 11, condition: prestige >= 15 },
      { index: 12, condition: false },
      { index: 13, condition: totalCookiesEarned >= 50000000 },
      { index: 14, condition: totalCookiesEarned >= 5000000000 },
      { index: 15, condition: criticalFails >= 25 },
      { index: 16, condition: totalClicks >= 10000 },
      { index: 17, condition: totalClicks >= 100000 },
      { index: 18, condition: cosmeticsCount >= 10 },
      { index: 19, condition: cosmeticsCount >= 25 },
      { index: 20, condition: gameModes.filter(m => m.unlocked && m.id !== currentGameMode).length >= gameModes.filter(m => !m.ownerOnly).length - 1 },
    ];
    
    checks.forEach(({ index, condition }) => {
      if (newAchievements[index] && !newAchievements[index].unlocked && condition) {
        newAchievements[index].unlocked = true;
        changed = true;
        const reward = newAchievements[index].reward;
        setCookies(c => c + reward);
        createNotification(`🏆 ${newAchievements[index].name}! +${formatNumber(reward)}`);
        setStats(s => ({ ...s, achievementsUnlocked: s.achievementsUnlocked + 1 }));
      }
    });
    
    if (changed) setAchievements(newAchievements);
  }, [achievements, totalCookiesEarned, totalClicks, level, cookiesPerSecond, upgrades, prestige, criticalFails, ownedCosmetics, gameModes, currentGameMode, formatNumber, createNotification]);
  
  useEffect(() => {
    if (achievements && achievements.length > 0) {
      checkAchievements();
    }
  }, [checkAchievements, achievements]);
  
  // Speed demon
  useEffect(() => {
    if (!achievements || achievements.length < 13) return;
    
    const now = Date.now();
    clickTimeWindowRef.current = clickTimeWindowRef.current.filter(t => now - t < 10000);
    
    if (clickTimeWindowRef.current.length >= 150 && achievements[12] && !achievements[12].unlocked) {
      const newAch = [...achievements];
      newAch[12].unlocked = true;
      setAchievements(newAch);
      setCookies(c => c + 10000);
      createNotification('🏆 Speed Demon! +10,000');
      setStats(s => ({ ...s, achievementsUnlocked: s.achievementsUnlocked + 1 }));
    }
  }, [totalClicks, achievements, createNotification]);
  
  // Handle click
  const handleClick = useCallback((e) => {
    const clickTime = Date.now();
    const timeSinceLastClick = clickTime - lastClickTime;
    
    // Track fastest click
    if (timeSinceLastClick > 0 && timeSinceLastClick < stats.fastestClick) {
      setStats(s => ({ ...s, fastestClick: timeSinceLastClick }));
    }
    
    if (Math.random() < criticalFailChance) {
      const lossAmount = Math.floor(cookies * 0.15);
      setCookies(c => Math.max(0, c - lossAmount));
      setCriticalFails(cf => cf + 1);
      createNotification(`💀 Critical fail! -${formatNumber(lossAmount)}`);
      createParticle(window.innerWidth / 2, window.innerHeight / 2, 'FAIL!', '#ef4444');
      return;
    }
    
    const earnedAmount = cookiesPerClick * getPrestigeMultiplier() * getGameModeMultiplier();
    setCookies(c => c + earnedAmount);
    setTotalCookiesEarned(t => t + earnedAmount);
    
    const xpBoost = prestigeUpgrades && prestigeUpgrades.find(pu => pu.id === 'p9' && pu.owned);
    const xpMult = xpBoost ? 1.5 : 1;
    setXp(x => x + (earnedAmount / 15) * xpMult);
    setTotalClicks(tc => tc + 1);
    
    clickTimeWindowRef.current.push(Date.now());
    
    const now = Date.now();
    if (now - lastClickTime < 500) {
      const newStreak = clickStreak + 1;
      setClickStreak(newStreak);
      
      if (newStreak > stats.longestStreak) {
        setStats(s => ({ ...s, longestStreak: newStreak }));
      }
    } else {
      setClickStreak(1);
    }
    setLastClickTime(now);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);
    createParticle(x, y, `+${formatNumber(earnedAmount)}`);
    
    if (clickStreak > 30 && clickStreak % 30 === 0) {
      const bonus = earnedAmount * 5;
      setCookies(c => c + bonus);
      setTotalCookiesEarned(t => t + bonus);
      createParticle(x, y + 40, `COMBO x${clickStreak}!`, '#f97316');
    }
  }, [criticalFailChance, cookies, cookiesPerClick, getPrestigeMultiplier, getGameModeMultiplier, lastClickTime, clickStreak, formatNumber, prestigeUpgrades, stats, createNotification, createParticle]);
  
  // Buy upgrade
  const buyUpgrade = useCallback((upgrade) => {
    const costReduction = prestigeUpgrades && prestigeUpgrades.find(pu => pu.id === 'p10' && pu.owned);
    const finalCost = costReduction ? Math.floor(upgrade.cost * 0.8) : upgrade.cost;
    
    if (cookies >= finalCost) {
      if (upgrade.maxOwned && upgrade.owned >= upgrade.maxOwned) {
        createNotification('Already owned');
        return;
      }
      
      setCookies(c => c - finalCost);
      
      const updatedUpgrades = upgrades.map(u => {
        if (u.id === upgrade.id) {
          const newOwned = u.owned + 1;
          const newCost = Math.floor(u.cost * 1.3);
          
          if (u.type === 'click') {
            setCookiesPerClick(cpc => cpc + u.bonus);
          } else if (u.type === 'click_mult') {
            setCookiesPerClick(cpc => cpc * u.multiplier);
          } else if (u.type === 'auto') {
            setCookiesPerSecond(cps => cps + u.cps);
          }
          
          return { ...u, owned: newOwned, cost: newCost };
        }
        return u;
      });
      
      setUpgrades(updatedUpgrades);
      createNotification(`✓ ${upgrade.name}`);
    }
  }, [cookies, upgrades, createNotification, prestigeUpgrades]);
  
  const buyPrestigeUpgrade = useCallback((upgrade) => {
    if (prestigeTokens >= upgrade.cost && !upgrade.owned) {
      setPrestigeTokens(pt => pt - upgrade.cost);
      
      const updated = prestigeUpgrades.map(pu => {
        if (pu.id === upgrade.id) {
          if (pu.effect === 'click_start_100') {
            setCookiesPerClick(c => c + 100);
          }
          if (pu.effect === 'cps_start_50') {
            setCookiesPerSecond(cps => cps + 50);
          }
          return { ...pu, owned: true };
        }
        return pu;
      });
      
      setPrestigeUpgrades(updated);
      createNotification(`✓ ${upgrade.name}`);
    }
  }, [prestigeTokens, prestigeUpgrades, createNotification]);
  
  const doPrestige = useCallback(() => {
    if (level < 30) {
      createNotification('⚠️ Reach level 30 to prestige');
      return;
    }
    
    const tokensEarned = Math.floor(level / 8);
    
    if (confirm(`Prestige and earn ${tokensEarned} tokens? This resets all progress!`)) {
      let startClick = 1;
      let startCPS = 0;
      
      if (prestigeUpgrades) {
        prestigeUpgrades.forEach(pu => {
          if (pu.owned && pu.effect === 'click_start_100') startClick += 100;
          if (pu.owned && pu.effect === 'cps_start_50') startCPS += 50;
        });
      }
      
      setCookies(0);
      setTotalCookiesEarned(0);
      setCookiesPerClick(startClick);
      setCookiesPerSecond(startCPS);
      setTotalClicks(0);
      setLevel(1);
      setXp(0);
      setPrestige(p => p + 1);
      setPrestigeTokens(pt => pt + tokensEarned);
      setCriticalFails(0);
      setStats(s => ({ ...s, totalPrestige: s.totalPrestige + 1 }));
      
      // Unlock zen mode on first prestige
      setGameModes(modes => modes.map(mode => {
        if (mode.unlockRequirement?.prestige && prestige + 1 >= mode.unlockRequirement.prestige) {
          if (!mode.unlocked) {
            createNotification(`🎮 ${mode.name} unlocked!`);
          }
          return { ...mode, unlocked: true };
        }
        return mode;
      }));
      
      setUpgrades([
        { id: 1, name: 'Better Fingers', desc: '+5 cookies per click', cost: 100, owned: 0, type: 'click', bonus: 5, icon: '👆', tier: 1 },
        { id: 2, name: 'Strong Hands', desc: '+15 cookies per click', cost: 750, owned: 0, type: 'click', bonus: 15, icon: '✊', tier: 1 },
        { id: 3, name: 'Power Gloves', desc: '+50 cookies per click', cost: 5000, owned: 0, type: 'click', bonus: 50, icon: '🧤', tier: 2 },
        { id: 4, name: 'Bionic Arms', desc: '+150 cookies per click', cost: 25000, owned: 0, type: 'click', bonus: 150, icon: '🦾', tier: 2 },
        { id: 5, name: 'Super Strength', desc: '+500 cookies per click', cost: 150000, owned: 0, type: 'click', bonus: 500, icon: '💪', tier: 3 },
        { id: 6, name: 'Titan Punch', desc: '+2000 cookies per click', cost: 1000000, owned: 0, type: 'click', bonus: 2000, icon: '👊', tier: 3 },
        { id: 7, name: 'God Slap', desc: '+10000 cookies per click', cost: 10000000, owned: 0, type: 'click', bonus: 10000, icon: '🤚', tier: 4 },
        { id: 8, name: 'Reality Breaker', desc: '+50000 cookies per click', cost: 100000000, owned: 0, type: 'click', bonus: 50000, icon: '💥', tier: 5 },
        { id: 9, name: 'Universe Clap', desc: '+250000 cookies per click', cost: 1000000000, owned: 0, type: 'click', bonus: 250000, icon: '🌌', tier: 6 },
        { id: 100, name: 'Click Doubler', desc: 'x2 ALL click power', cost: 500000000, owned: 0, type: 'click_mult', multiplier: 2, icon: '⚡', tier: 6, maxOwned: 1 },
        { id: 101, name: 'Ultimate Multiplier', desc: 'x5 ALL click power', cost: 50000000000, owned: 0, type: 'click_mult', multiplier: 5, icon: '🌟', tier: 7, maxOwned: 1 },
        { id: 10, name: 'Cookie Oven', desc: '+1 cookie/sec', cost: 150, owned: 0, type: 'auto', cps: 1, icon: '🔥', tier: 1 },
        { id: 11, name: 'Grandma Baker', desc: '+5 cookies/sec', cost: 800, owned: 0, type: 'auto', cps: 5, icon: '👵', tier: 1 },
        { id: 12, name: 'Cookie Factory', desc: '+20 cookies/sec', cost: 4000, owned: 0, type: 'auto', cps: 20, icon: '🏭', tier: 2 },
        { id: 13, name: 'Cookie Farm', desc: '+75 cookies/sec', cost: 20000, owned: 0, type: 'auto', cps: 75, icon: '🌾', tier: 2 },
        { id: 14, name: 'Cookie Mine', desc: '+250 cookies/sec', cost: 100000, owned: 0, type: 'auto', cps: 250, icon: '⛏️', tier: 3 },
        { id: 15, name: 'Cookie Wizard', desc: '+1000 cookies/sec', cost: 750000, owned: 0, type: 'auto', cps: 1000, icon: '🧙', tier: 3 },
        { id: 16, name: 'Cookie Portal', desc: '+5000 cookies/sec', cost: 7500000, owned: 0, type: 'auto', cps: 5000, icon: '🌀', tier: 4 },
        { id: 17, name: 'Cookie Dimension', desc: '+25000 cookies/sec', cost: 75000000, owned: 0, type: 'auto', cps: 25000, icon: '🌌', tier: 4 },
        { id: 18, name: 'Cookie Universe', desc: '+150000 cookies/sec', cost: 750000000, owned: 0, type: 'auto', cps: 150000, icon: '🪐', tier: 5 },
        { id: 19, name: 'Cookie Multiverse', desc: '+1000000 cookies/sec', cost: 10000000000, owned: 0, type: 'auto', cps: 1000000, icon: '♾️', tier: 5 },
        { id: 20, name: 'Cookie Omnipotence', desc: '+10000000 cookies/sec', cost: 500000000000, owned: 0, type: 'auto', cps: 10000000, icon: '👁️', tier: 6 },
        { id: 30, name: 'Efficiency I', desc: '+10% all production', cost: 50000, owned: 0, type: 'efficiency', bonus: 0.1, icon: '📊', tier: 2, maxOwned: 1 },
        { id: 31, name: 'Efficiency II', desc: '+25% all production', cost: 500000, owned: 0, type: 'efficiency', bonus: 0.25, icon: '📈', tier: 3, maxOwned: 1 },
        { id: 32, name: 'Efficiency III', desc: '+50% all production', cost: 5000000, owned: 0, type: 'efficiency', bonus: 0.5, icon: '📉', tier: 4, maxOwned: 1 },
        { id: 33, name: 'Efficiency IV', desc: '+100% all production', cost: 100000000, owned: 0, type: 'efficiency', bonus: 1.0, icon: '💹', tier: 5, maxOwned: 1 },
        { id: 40, name: 'Lucky Charm', desc: 'Reduce critical fail by 25%', cost: 100000, owned: 0, type: 'luck', reduction: 0.25, icon: '🍀', tier: 2, maxOwned: 1 },
        { id: 41, name: 'Blessed Amulet', desc: 'Reduce critical fail by 50%', cost: 2500000, owned: 0, type: 'luck', reduction: 0.5, icon: '✝️', tier: 3, maxOwned: 1 },
        { id: 42, name: 'Divine Protection', desc: 'Reduce critical fail by 75%', cost: 50000000, owned: 0, type: 'luck', reduction: 0.75, icon: '🛡️', tier: 4, maxOwned: 1 },
        { id: 200, name: 'Owner Authority', desc: '+1000000 cookies per click', cost: 1000000000000, owned: 0, type: 'click', bonus: 1000000, icon: '👑', tier: 8, ownerOnly: true },
        { id: 201, name: 'Admin Power', desc: '+10000000 cookies per click', cost: 100000000000000, owned: 0, type: 'click', bonus: 10000000, icon: '⚡', tier: 9, ownerOnly: true },
        { id: 202, name: 'God Mode Clicker', desc: '+100000000 cookies per click', cost: 10000000000000000, owned: 0, type: 'click', bonus: 100000000, icon: '✨', tier: 10, ownerOnly: true },
        { id: 203, name: 'Owner Auto Farm', desc: '+100000000 cookies/sec', cost: 50000000000000, owned: 0, type: 'auto', cps: 100000000, icon: '🏭', tier: 8, ownerOnly: true },
        { id: 204, name: 'Infinite Production', desc: 'x10 ALL click power', cost: 500000000000000, owned: 0, type: 'click_mult', multiplier: 10, icon: '♾️', tier: 10, maxOwned: 1, ownerOnly: true },
        { id: 205, name: 'Reality Control', desc: 'x100 ALL production', cost: 1000000000000000, owned: 0, type: 'click_mult', multiplier: 100, icon: '🌀', tier: 11, maxOwned: 1, ownerOnly: true },
        { id: 206, name: 'Cosmic Dominance', desc: '+1B cookies/sec', cost: 10000000000000000, owned: 0, type: 'auto', cps: 1000000000, icon: '🌌', tier: 11, ownerOnly: true },
      ]);
      
      createNotification(`🌟 PRESTIGE ${prestige + 1}! +${tokensEarned} tokens`);
    }
  }, [level, prestige, prestigeUpgrades, createNotification]);
  
  // Cosmetics
  const buyCosmetic = useCallback((type, cosmetic) => {
    if (cookies >= cosmetic.cost && !ownedCosmetics[type + 's'].includes(cosmetic.id)) {
      setCookies(c => c - cosmetic.cost);
      setOwnedCosmetics(oc => ({
        ...oc,
        [type + 's']: [...oc[type + 's'], cosmetic.id]
      }));
      setStats(s => ({ ...s, cosmeticsUnlocked: s.cosmeticsUnlocked + 1 }));
      createNotification(`✓ ${cosmetic.name}`);
    }
  }, [cookies, ownedCosmetics, createNotification]);
  
  const equipCosmetic = useCallback((type, id) => {
    setEquippedCosmetics(ec => ({ ...ec, [type]: id }));
    const allItems = [
      ...COSMETICS[type + 's'] || [],
      ...(isOwner ? OWNER_COSMETICS[type + 's'] || [] : []),
      ...(isModerator ? MOD_COSMETICS[type + 's'] || [] : [])
    ];
    const item = allItems.find(c => c.id === id);
    createNotification(`✓ Equipped ${item?.name || 'item'}`);
  }, [createNotification, isOwner, isModerator]);
  
  const getRarityColor = useCallback((rarity) => {
    switch (rarity) {
      case 'common': return '#9ca3af';
      case 'rare': return '#60a5fa';
      case 'epic': return '#a78bfa';
      case 'legendary': return '#fbbf24';
      case 'mythic': return '#f472b6';
      case 'owner': return '#f97316';
      case 'staff': return '#3b82f6';
      case 'creator': return '#8b5cf6';
      default: return '#ffffff';
    }
  }, []);
  
  // Leaderboard
  const updateLeaderboard = useCallback(async () => {
    setLeaderboardLoading(true);
    const result = await api.getLeaderboard();
    if (result.success && Array.isArray(result.data)) {
      setLeaderboard(result.data);
    }
    setLeaderboardLoading(false);
  }, [api]);
  
  useEffect(() => {
    if (showLeaderboard) {
      updateLeaderboard();
    }
  }, [showLeaderboard, updateLeaderboard]);
  
  // Owner/Mod functions
  const loadAllPlayers = useCallback(async () => {
    const result = await api.getAllPlayers();
    if (result.success && Array.isArray(result.data)) {
      setAllPlayers(result.data);
    }
  }, [api]);
  
  useEffect(() => {
    if ((isOwner || isModerator) && (ownerPanelOpen || modPanelOpen || staffDashboardOpen)) {
      loadAllPlayers();
    }
  }, [isOwner, isModerator, ownerPanelOpen, modPanelOpen, staffDashboardOpen, loadAllPlayers]);
  
  // OWNER COMMANDS
  const ownerDeletePlayer = useCallback(async (targetPlayerId) => {
    if (confirm(`Delete player ${targetPlayerId}? This cannot be undone!`)) {
      const result = await api.deletePlayer(targetPlayerId);
      if (result.success) {
        createNotification(`✓ Player deleted`);
        addModLog('DELETE_PLAYER', `Deleted player ${targetPlayerId}`);
        loadAllPlayers();
      } else {
        createNotification(`✗ Failed to delete`);
      }
    }
  }, [api, createNotification, addModLog, loadAllPlayers]);
  
  const ownerGiveCosmetic = useCallback(async (targetPlayerId, cosmeticType, cosmeticId, cosmeticName) => {
    const player = allPlayers.find(p => p.playerId === targetPlayerId);
    const currentOwned = player?.ownedCosmetics?.[cosmeticType + 's'] || (cosmeticType === 'cookie' ? ['default'] : cosmeticType === 'theme' ? ['default'] : cosmeticType === 'effect' ? ['none'] : ['none']);
    
    if (!currentOwned.includes(cosmeticId)) {
      const result = await api.updatePlayer(targetPlayerId, {
        [`ownedCosmetics.${cosmeticType}s`]: [...currentOwned, cosmeticId]
      });
      
      if (result.success) {
        // Add gift record
        const gift = {
          id: Date.now(),
          from: playerName,
          cosmeticType,
          cosmeticId,
          cosmeticName,
          timestamp: new Date().toISOString()
        };
        
        const gifts = player?.cosmeticGifts || [];
        await api.updatePlayer(targetPlayerId, {
          cosmeticGifts: [...gifts, gift]
        });
        
        createNotification(`✓ Gave ${cosmeticName} to player`);
        addModLog('GIVE_COSMETIC', `Gave ${cosmeticName} to ${targetPlayerId}`);
        loadAllPlayers();
      } else {
        createNotification(`✗ Failed`);
      }
    } else {
      createNotification('Player already owns this');
    }
  }, [api, createNotification, addModLog, loadAllPlayers, playerName, allPlayers]);
  
  const ownerGodMode = useCallback(() => {
    setCookies(Number.MAX_SAFE_INTEGER);
    setLevel(999);
    setPrestige(999);
    setPrestigeTokens(99999);
    setCookiesPerSecond(999999999);
    setCookiesPerClick(999999999);
    if (achievements) {
      setAchievements(ach => ach.map(a => ({ ...a, unlocked: true })));
    }
    setOwnedCosmetics({
      cookies: [...COSMETICS.cookies.map(c => c.id), ...OWNER_COSMETICS.cookies.map(c => c.id)],
      themes: [...COSMETICS.themes.map(t => t.id), ...OWNER_COSMETICS.themes.map(t => t.id)],
      effects: COSMETICS.effects.map(e => e.id),
      titles: COSMETICS.titles.map(t => t.id),
      badges: COSMETICS.badges.map(b => b.id)
    });
    setGameModes(modes => modes.map(m => ({ ...m, unlocked: true })));
    createNotification('👑 GOD MODE ACTIVATED');
    addModLog('GOD_MODE', 'Activated god mode');
  }, [createNotification, addModLog, achievements]);
  
  // MOD COMMANDS
  const modWarnPlayer = useCallback(async (targetPlayerId, reason) => {
    const result = await api.updatePlayer(targetPlayerId, {
      warnings: (allPlayers.find(p => p.playerId === targetPlayerId)?.warnings || 0) + 1
    });
    
    if (result.success) {
      createNotification(`✓ Warned player`);
      addModLog('WARN_PLAYER', `Warned ${targetPlayerId}: ${reason}`);
      loadAllPlayers();
    }
  }, [api, createNotification, addModLog, loadAllPlayers, allPlayers]);
  
  const modMutePlayer = useCallback(async (targetPlayerId, duration) => {
    const result = await api.updatePlayer(targetPlayerId, {
      muted: true,
      muteExpires: Date.now() + (duration * 60 * 1000)
    });
    
    if (result.success) {
      createNotification(`✓ Muted for ${duration}m`);
      addModLog('MUTE_PLAYER', `Muted ${targetPlayerId} for ${duration} minutes`);
      loadAllPlayers();
    }
  }, [api, createNotification, addModLog, loadAllPlayers]);
  
  const modResetPlayerProgress = useCallback(async (targetPlayerId) => {
    if (confirm(`Reset ${targetPlayerId}'s progress?`)) {
      const result = await api.updatePlayer(targetPlayerId, {
        cookies: 0,
        totalCookiesEarned: 0,
        cookiesPerClick: 1,
        cookiesPerSecond: 0,
        level: 1,
        prestige: 0
      });
      
      if (result.success) {
        createNotification(`✓ Progress reset`);
        addModLog('RESET_PROGRESS', `Reset progress for ${targetPlayerId}`);
        loadAllPlayers();
      }
    }
  }, [api, createNotification, addModLog, loadAllPlayers]);
  
  // Get equipped items
  const getEquippedCookie = useCallback(() => {
    const allCookies = [
      ...COSMETICS.cookies,
      ...(isOwner ? OWNER_COSMETICS.cookies : []),
      ...(isModerator ? MOD_COSMETICS.cookies : [])
    ];
    return allCookies.find(c => c.id === equippedCosmetics.cookie) || COSMETICS.cookies[0];
  }, [equippedCosmetics.cookie, isOwner, isModerator]);
  
  const getEquippedTheme = useCallback(() => {
    const allThemes = [
      ...COSMETICS.themes,
      ...(isOwner ? OWNER_COSMETICS.themes : []),
      ...(isModerator ? MOD_COSMETICS.themes : [])
    ];
    return allThemes.find(t => t.id === equippedCosmetics.theme) || COSMETICS.themes[0];
  }, [equippedCosmetics.theme, isOwner, isModerator]);
  
  const getEquippedTitle = useCallback(() => {
    return COSMETICS.titles.find(t => t.id === equippedCosmetics.title) || COSMETICS.titles[0];
  }, [equippedCosmetics.title]);
  
  const handleStartEmpire = useCallback(() => {
    if (playerName) {
      localStorage.setItem('cookieEmpirePlayerName', playerName);
      setShowNameInput(false);
    }
  }, [playerName]);
  
  const equippedCookie = getEquippedCookie();
  const equippedTheme = getEquippedTheme();
  const equippedTitle = getEquippedTitle();
  const currentMode = gameModes.find(m => m.id === currentGameMode);
  
  // Name input screen
  if (showNameInput) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ 
        backgroundColor: '#0a0a0a',
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
      }}>
        <div className="max-w-md w-full">
          <div className="text-center mb-12">
            <h1 className="text-7xl font-black mb-4" style={{ 
              background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'system-ui',
              letterSpacing: '-0.05em'
            }}>
              COOKIE EMPIRE
            </h1>
            <div className="text-cyan-400 text-sm font-semibold tracking-wider mb-2" style={{ fontFamily: 'monospace' }}>
              ULTIMATE EDITION V2.0
            </div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-8 shadow-2xl">
            <label className="block text-gray-300 mb-3 text-sm font-medium">
              Enter your username
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && playerName && handleStartEmpire()}
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Username"
              autoFocus
              maxLength={20}
              style={{ fontFamily: 'system-ui' }}
            />
            <button
              onClick={handleStartEmpire}
              disabled={!playerName}
              className="w-full mt-6 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
              style={{ fontFamily: 'system-ui' }}
            >
              Start Empire
            </button>
          </div>
          
          <div className="text-center mt-6 text-xs text-gray-500">
            Created by Z3N0 • Ultimate Edition
          </div>
        </div>
      </div>
    );
  }
  
  const filteredPlayers = allPlayers.filter(p => 
    p.playerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.playerId?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // MAIN GAME UI
  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: equippedTheme.bg }}>
      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-50 font-bold text-xl"
          style={{
            left: particle.x,
            top: particle.y,
            color: particle.color,
            animation: 'floatUp 1s ease-out forwards',
            textShadow: `0 0 10px ${particle.color}`
          }}
        >
          {particle.text}
        </div>
      ))}
      
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-xs">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className="px-4 py-3 rounded-lg shadow-lg text-sm font-medium backdrop-blur-sm"
            style={{ 
              backgroundColor: `${equippedTheme.accent}dd`,
              animation: 'slideIn 0.3s ease-out',
              fontFamily: 'system-ui',
              border: `1px solid ${equippedTheme.accent}`
            }}
          >
            {notif.message}
          </div>
        ))}
      </div>
      
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-400" style={{ fontFamily: 'monospace' }}>
              {saveStatus === 'saving' && '💾 Saving'}
              {saveStatus === 'saved' && '✓ Saved'}
              {saveStatus === 'error' && '✗ Error'}
            </div>
            {criticalFailChance > 0 && (
              <div className="text-xs text-red-400" style={{ fontFamily: 'monospace' }}>
                💀 {(criticalFailChance * 100).toFixed(1)}%
              </div>
            )}
            {currentMode?.id !== 'classic' && (
              <div className="text-xs font-bold px-2 py-1 rounded" style={{ 
                backgroundColor: equippedTheme.accent,
                fontFamily: 'system-ui'
              }}>
                {currentMode.icon} {currentMode.name}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Role access buttons */}
            {!isOwner && !isModerator && !isZ3N0 && (
              <>
                <button
                  onClick={() => {
                    const code = prompt('Enter code:');
                    if (code === OWNER_CODE) {
                      setIsOwner(true);
                      setOwnedCosmetics(oc => ({
                        ...oc,
                        titles: [...oc.titles, 'owner']
                      }));
                      setEquippedCosmetics(ec => ({ ...ec, title: 'owner' }));
                      createNotification('👑 OWNER ACCESS GRANTED');
                    } else if (code === MODERATOR_CODE) {
                      setIsModerator(true);
                      setOwnedCosmetics(oc => ({
                        ...oc,
                        titles: [...oc.titles, 'moderator']
                      }));
                      setEquippedCosmetics(ec => ({ ...ec, title: 'moderator' }));
                      createNotification('🛡️ MODERATOR ACCESS GRANTED');
                    } else if (code === 'Z3N0') {
                      setIsZ3N0(true);
                      setIsOwner(true);
                      setOwnedCosmetics(oc => ({
                        ...oc,
                        titles: [...oc.titles, 'z3n0', 'owner'],
                        cookies: [...oc.cookies, 'z3n0_special'],
                        themes: [...oc.themes, 'z3n0_theme']
                      }));
                      setEquippedCosmetics(ec => ({ ...ec, title: 'z3n0' }));
                      createNotification('⚡ Z3N0 CREATOR ACCESS');
                    } else if (code) {
                      createNotification('✗ Invalid code');
                    }
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center opacity-10 hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: equippedTheme.accent }}
                >
                  <span className="text-sm">🔐</span>
                </button>
              </>
            )}
            
            {isModerator && !isOwner && (
              <button
                onClick={() => setModPanelOpen(true)}
                className="px-3 py-1 rounded-lg font-medium text-xs transition-all hover:scale-105"
                style={{ 
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  fontFamily: 'system-ui'
                }}
              >
                🛡️ Mod
              </button>
            )}
            
            {isOwner && (
              <>
                <button
                  onClick={() => setOwnerPanelOpen(true)}
                  className="px-3 py-1 rounded-lg font-medium text-xs transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: '#f97316',
                    color: '#000',
                    fontFamily: 'system-ui'
                  }}
                >
                  👑 Owner
                </button>
                <button
                  onClick={() => setStaffDashboardOpen(true)}
                  className="px-3 py-1 rounded-lg font-medium text-xs transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: '#8b5cf6',
                    color: '#fff',
                    fontFamily: 'system-ui'
                  }}
                >
                  📊 Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-5xl md:text-6xl font-black mb-2" style={{ 
            background: `linear-gradient(135deg, ${equippedTheme.accent} 0%, ${equippedTheme.secondary} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'system-ui',
            letterSpacing: '-0.05em'
          }}>
            COOKIE EMPIRE
          </h1>
          <div className="flex items-center justify-center gap-3 text-sm flex-wrap">
            {equippedTitle.display && (
              <span className="font-bold px-2 py-1 rounded" style={{ 
                color: getRarityColor(equippedTitle.rarity),
                backgroundColor: `${getRarityColor(equippedTitle.rarity)}20`,
                fontFamily: 'system-ui'
              }}>
                {equippedTitle.display}
              </span>
            )}
            <span className="text-gray-300 font-medium" style={{ fontFamily: 'system-ui' }}>
              {playerName}
            </span>
            <span className="text-gray-500 text-xs" style={{ fontFamily: 'monospace' }}>
              #{playerId.slice(-6)}
            </span>
          </div>
        </div>
        
        {/* Navigation - More compact */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {[
            { label: '🏆 Leaderboard', action: () => setShowLeaderboard(true) },
            { label: '🎖️ Achievements', action: () => setShowAchievements(true) },
            { label: '🎮 Modes', action: () => setShowGameModes(true) },
            { label: '🎨 Wardrobe', action: () => setShowCosmeticsMenu(true) },
            { label: '🛒 Shop', action: () => setShowCosmeticsShop(true) },
            { label: '📊 Stats', action: () => setShowStats(true) },
          ].map(btn => (
            <button
              key={btn.label}
              onClick={btn.action}
              className="px-3 py-2 rounded-lg font-medium text-xs transition-all hover:scale-105 hover:brightness-110"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontFamily: 'system-ui'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left - Stats & Clicker */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'monospace' }}>COOKIES</div>
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: 'system-ui' }}>
                    {formatNumber(cookies)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'monospace' }}>PER CLICK</div>
                  <div className="text-2xl font-bold" style={{ 
                    color: equippedTheme.accent,
                    fontFamily: 'system-ui'
                  }}>
                    {formatNumber(Math.floor(cookiesPerClick * getPrestigeMultiplier() * getGameModeMultiplier()))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'monospace' }}>PER SECOND</div>
                  <div className="text-2xl font-bold" style={{ 
                    color: equippedTheme.secondary,
                    fontFamily: 'system-ui'
                  }}>
                    {formatNumber(Math.floor(cookiesPerSecond * getPrestigeMultiplier() * getGameModeMultiplier()))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'monospace' }}>LEVEL</div>
                  <div className="text-2xl font-bold text-yellow-400" style={{ fontFamily: 'system-ui' }}>
                    {level}
                  </div>
                </div>
              </div>
              
              {/* XP Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1" style={{ fontFamily: 'monospace' }}>
                  <span>XP: {formatNumber(xp)} / {formatNumber(getLevelRequirement(level))}</span>
                  <span>Next: {level + 1}</span>
                </div>
                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${Math.min((xp / getLevelRequirement(level)) * 100, 100)}%`,
                      background: `linear-gradient(90deg, ${equippedTheme.accent} 0%, ${equippedTheme.secondary} 100%)`
                    }}
                  />
                </div>
              </div>
              
              {/* Prestige */}
              {prestige > 0 && (
                <div className="bg-black/30 rounded-lg p-3 border border-gray-700/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium text-gray-300" style={{ fontFamily: 'system-ui' }}>
                        Prestige {prestige}
                      </span>
                      <div className="text-xs text-gray-400" style={{ fontFamily: 'monospace' }}>
                        +{Math.floor((getPrestigeMultiplier() - 1) * 100)}% production
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold" style={{ fontFamily: 'system-ui' }}>
                        {prestigeTokens} tokens
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Streak */}
              {clickStreak > 15 && (
                <div className="mt-3 text-center">
                  <div className="inline-block px-4 py-2 rounded-lg font-bold animate-pulse" style={{ 
                    backgroundColor: '#f97316',
                    fontFamily: 'system-ui'
                  }}>
                    🔥 COMBO: {clickStreak}x
                  </div>
                </div>
              )}
            </div>
            
            {/* Clicker */}
            <div className="text-center">
              <button
                onClick={handleClick}
                className="w-56 h-56 md:w-72 md:h-72 text-8xl md:text-9xl rounded-full active:scale-95 transition-all select-none mx-auto relative overflow-hidden shadow-2xl"
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  background: `linear-gradient(135deg, ${equippedTheme.accent} 0%, ${equippedTheme.secondary} 100%)`,
                  boxShadow: `0 10px 60px ${equippedTheme.accent}60, 0 0 0 4px rgba(255,255,255,0.1)`,
                }}
              >
                <div className="absolute inset-0" style={{ 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
                  animation: 'pulse 2s ease-in-out infinite'
                }} />
                <span className="relative z-10 drop-shadow-2xl">{equippedCookie.emoji}</span>
              </button>
              <div className="mt-6 text-xl font-bold text-gray-200" style={{ fontFamily: 'system-ui' }}>
                +{formatNumber(Math.floor(cookiesPerClick * getPrestigeMultiplier() * getGameModeMultiplier()))} per click
              </div>
              {criticalFailChance > 0 && (
                <div className="mt-2 text-sm text-red-400 font-medium" style={{ fontFamily: 'monospace' }}>
                  ⚠️ {(criticalFailChance * 100).toFixed(1)}% fail chance (-15% cookies)
                </div>
              )}
              {currentMode?.chaosMode && (
                <div className="mt-2 text-sm font-bold" style={{ 
                  color: equippedTheme.accent,
                  fontFamily: 'monospace'
                }}>
                  🌀 Chaos: {chaosMultiplier.toFixed(2)}x
                </div>
              )}
            </div>
          </div>
          
          {/* Right - Upgrades */}
          <div>
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 max-h-[800px] overflow-y-auto">
              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                {['click', 'auto', 'prestige'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                      activeTab === tab ? 'text-white' : 'text-gray-400'
                    }`}
                    style={{ 
                      backgroundColor: activeTab === tab ? equippedTheme.accent : 'transparent',
                      fontFamily: 'system-ui'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              {/* Click upgrades */}
              {activeTab === 'click' && (
                <div className="space-y-2">
                  {upgrades && upgrades.filter(u => {
                    if (u.ownerOnly && !isOwner) return false;
                    return u.type === 'click' || u.type === 'click_mult' || u.type === 'efficiency' || u.type === 'luck';
                  }).map(upgrade => {
                    const costReduction = prestigeUpgrades && prestigeUpgrades.find(pu => pu.id === 'p10' && pu.owned);
                    const finalCost = costReduction ? Math.floor(upgrade.cost * 0.8) : upgrade.cost;
                    const canAfford = cookies >= finalCost;
                    const isMaxed = upgrade.maxOwned && upgrade.owned >= upgrade.maxOwned;
                    
                    return (
                      <div
                        key={upgrade.id}
                        className={`bg-black/30 rounded-lg p-3 border transition-all ${
                          canAfford && !isMaxed ? 'border-gray-600 hover:border-gray-500 hover:bg-black/40' : 'border-gray-800 opacity-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{upgrade.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <div className="font-semibold text-white text-sm" style={{ fontFamily: 'system-ui' }}>
                                {upgrade.name}
                              </div>
                              {upgrade.ownerOnly && (
                                <span className="text-xs px-2 py-0.5 rounded" style={{ 
                                  backgroundColor: '#f9731620',
                                  color: '#f97316',
                                  fontFamily: 'monospace'
                                }}>
                                  OWNER
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'system-ui' }}>
                              {upgrade.desc}
                            </div>
                            {upgrade.owned > 0 && (
                              <div className="text-xs text-yellow-400 mb-2" style={{ fontFamily: 'monospace' }}>
                                Owned: {upgrade.owned}{upgrade.maxOwned ? `/${upgrade.maxOwned}` : ''}
                              </div>
                            )}
                            <button
                              onClick={() => buyUpgrade(upgrade)}
                              disabled={!canAfford || isMaxed}
                              className="w-full py-2 rounded-lg font-medium text-xs transition-all disabled:cursor-not-allowed hover:brightness-110"
                              style={{
                                backgroundColor: canAfford && !isMaxed ? equippedTheme.accent : '#1f2937',
                                color: canAfford && !isMaxed ? '#fff' : '#6b7280',
                                fontFamily: 'system-ui'
                              }}
                            >
                              {isMaxed ? 'MAX' : `${formatNumber(finalCost)} 🍪`}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Auto upgrades */}
              {activeTab === 'auto' && (
                <div className="space-y-2">
                  {upgrades && upgrades.filter(u => {
                    if (u.ownerOnly && !isOwner) return false;
                    return u.type === 'auto';
                  }).map(upgrade => {
                    const costReduction = prestigeUpgrades && prestigeUpgrades.find(pu => pu.id === 'p10' && pu.owned);
                    const finalCost = costReduction ? Math.floor(upgrade.cost * 0.8) : upgrade.cost;
                    const canAfford = cookies >= finalCost;
                    
                    return (
                      <div
                        key={upgrade.id}
                        className={`bg-black/30 rounded-lg p-3 border transition-all ${
                          canAfford ? 'border-gray-600 hover:border-gray-500 hover:bg-black/40' : 'border-gray-800 opacity-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{upgrade.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <div className="font-semibold text-white text-sm" style={{ fontFamily: 'system-ui' }}>
                                {upgrade.name}
                              </div>
                              {upgrade.ownerOnly && (
                                <span className="text-xs px-2 py-0.5 rounded" style={{ 
                                  backgroundColor: '#f9731620',
                                  color: '#f97316',
                                  fontFamily: 'monospace'
                                }}>
                                  OWNER
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'system-ui' }}>
                              {upgrade.desc}
                            </div>
                            {upgrade.owned > 0 && (
                              <div className="text-xs text-yellow-400 mb-2" style={{ fontFamily: 'monospace' }}>
                                Owned: {upgrade.owned}
                              </div>
                            )}
                            <button
                              onClick={() => buyUpgrade(upgrade)}
                              disabled={!canAfford}
                              className="w-full py-2 rounded-lg font-medium text-xs transition-all disabled:cursor-not-allowed hover:brightness-110"
                              style={{
                                backgroundColor: canAfford ? equippedTheme.accent : '#1f2937',
                                color: canAfford ? '#fff' : '#6b7280',
                                fontFamily: 'system-ui'
                              }}
                            >
                              {formatNumber(finalCost)} 🍪
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Prestige tab */}
              {activeTab === 'prestige' && (
                <div>
                  {level >= 30 ? (
                    <>
                      <div className="mb-4 text-center">
                        <div className="text-sm text-gray-400 mb-3" style={{ fontFamily: 'system-ui' }}>
                          Reset for {Math.floor(level / 8)} prestige tokens
                        </div>
                        <button
                          onClick={doPrestige}
                          className="w-full py-3 rounded-lg font-bold transition-all hover:brightness-110"
                          style={{
                            backgroundColor: equippedTheme.accent,
                            color: '#fff',
                            fontFamily: 'system-ui'
                          }}
                        >
                          ⚡ PRESTIGE
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {prestigeUpgrades && prestigeUpgrades.map(pu => (
                          <div
                            key={pu.id}
                            className={`bg-black/30 rounded-lg p-3 border transition-all ${
                              pu.owned ? 'border-green-600 bg-green-900/10' : prestigeTokens >= pu.cost ? 'border-gray-600 hover:border-gray-500 hover:bg-black/40' : 'border-gray-800 opacity-50'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="font-semibold text-white text-sm" style={{ fontFamily: 'system-ui' }}>
                                  {pu.name}
                                </div>
                                <div className="text-xs text-gray-400" style={{ fontFamily: 'system-ui' }}>
                                  {pu.desc}
                                </div>
                              </div>
                              {pu.owned && (
                                <div className="bg-green-600 rounded-full px-2 py-1 text-xs font-bold" style={{ fontFamily: 'system-ui' }}>
                                  ✓
                                </div>
                              )}
                            </div>
                            {!pu.owned && (
                              <button
                                onClick={() => buyPrestigeUpgrade(pu)}
                                disabled={prestigeTokens < pu.cost}
                                className="w-full py-2 rounded-lg font-medium text-xs transition-all disabled:cursor-not-allowed hover:brightness-110"
                                style={{
                                  backgroundColor: prestigeTokens >= pu.cost ? equippedTheme.accent : '#1f2937',
                                  color: prestigeTokens >= pu.cost ? '#fff' : '#6b7280',
                                  fontFamily: 'system-ui'
                                }}
                              >
                                {pu.cost} Tokens
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-400 py-12">
                      <div className="text-5xl mb-4">🔒</div>
                      <div className="text-sm mb-2" style={{ fontFamily: 'system-ui' }}>
                        Reach level 30 to prestige
                      </div>
                      <div className="text-xs" style={{ fontFamily: 'monospace' }}>
                        ({30 - level} levels remaining)
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* TUTORIAL MODAL */}
      {showTutorial && currentTutorial && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setShowTutorial(false)}>
          <div className="bg-gradient-to-br from-blue-900/90 to-purple-900/90 rounded-2xl border-2 border-blue-500 p-8 max-w-2xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'system-ui' }}>
                {currentTutorial.title}
              </h2>
              <button
                onClick={() => setShowTutorial(false)}
                className="text-white hover:text-blue-300 text-3xl font-bold transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {currentTutorial.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 bg-black/40 rounded-xl p-4 border border-blue-500/30">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white">
                    {idx + 1}
                  </div>
                  <div className="text-white text-lg" style={{ fontFamily: 'system-ui' }}>
                    {step.replace(/^\d+\.\s*/, '')}
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setShowTutorial(false)}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl text-lg transition-all transform hover:scale-105"
              style={{ fontFamily: 'system-ui' }}
            >
              Got it! ✅
            </button>
          </div>
        </div>
      )}
      
      {/* LEADERBOARD MODAL */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowLeaderboard(false)}>
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'system-ui' }}>
                🏆 Global Leaderboard
              </h2>
              <button
                onClick={() => setShowLeaderboard(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            
            {leaderboardLoading ? (
              <div className="text-center py-12 text-gray-400">Loading...</div>
            ) : (
              <div className="space-y-2">
                {leaderboard.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">No players yet</div>
                ) : (
                  leaderboard.map((player, index) => {
                    const isCurrentPlayer = player.playerName === playerName;
                    const hasZ3N0Tag = player.equippedCosmetics?.title === 'z3n0';
                    const hasOwnerTag = player.equippedCosmetics?.title === 'owner';
                    const hasModTag = player.equippedCosmetics?.title === 'moderator';
                    
                    return (
                      <div
                        key={player.playerId}
                        className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                          isCurrentPlayer ? 'bg-purple-900/40 border-2 border-purple-500/50 scale-105' : 'bg-black/30 border border-gray-700/50'
                        }`}
                      >
                        <div className={`text-3xl font-black w-12 text-center ${
                          index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-gray-500'
                        }`} style={{ fontFamily: 'system-ui' }}>
                          {index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-bold text-white text-lg" style={{ fontFamily: 'system-ui' }}>
                              {player.playerName}
                            </div>
                            {hasZ3N0Tag && (
                              <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ 
                                backgroundColor: '#8b5cf620',
                                color: '#8b5cf6',
                                fontFamily: 'monospace'
                              }}>
                                ⚡ Z3N0
                              </span>
                            )}
                            {hasOwnerTag && !hasZ3N0Tag && (
                              <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ 
                                backgroundColor: '#f9731620',
                                color: '#f97316',
                                fontFamily: 'monospace'
                              }}>
                                👑 OWNER
                              </span>
                            )}
                            {hasModTag && (
                              <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ 
                                backgroundColor: '#3b82f620',
                                color: '#3b82f6',
                                fontFamily: 'monospace'
                              }}>
                                🛡️ MOD
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400" style={{ fontFamily: 'monospace' }}>
                            ID: {player.playerId} • {formatNumber(player.totalCookiesEarned || 0)} total • Lvl {player.level || 0} • P{player.prestige || 0}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black" style={{ 
                            color: equippedTheme.accent,
                            fontFamily: 'system-ui'
                          }}>
                            {formatNumber((player.totalCookiesEarned || 0) + ((player.level || 0) * 1000) + ((player.prestige || 0) * 50000))}
                          </div>
                          <div className="text-xs text-gray-400">score</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
            
            <button
              onClick={updateLeaderboard}
              className="w-full mt-4 py-3 rounded-lg font-bold text-sm transition-all hover:brightness-110"
              style={{
                backgroundColor: equippedTheme.accent,
                color: '#fff',
                fontFamily: 'system-ui'
              }}
            >
              🔄 Refresh Leaderboard
            </button>
          </div>
        </div>
      )}
      
      {/* ACHIEVEMENTS MODAL */}
      {showAchievements && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAchievements(false)}>
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'system-ui' }}>
                🎖️ Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
              </h2>
              <button
                onClick={() => setShowAchievements(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {achievements.map(ach => (
                <div
                  key={ach.id}
                  className={`p-4 rounded-lg border text-center transition-all ${
                    ach.unlocked ? 'bg-yellow-900/20 border-yellow-500/50 scale-105' : 'bg-black/30 border-gray-700 opacity-40 grayscale'
                  }`}
                >
                  <div className="text-5xl mb-2">{ach.icon}</div>
                  <div className="text-sm font-bold text-white mb-1" style={{ fontFamily: 'system-ui' }}>
                    {ach.name}
                  </div>
                  <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'system-ui' }}>
                    {ach.desc}
                  </div>
                  {ach.unlocked && (
                    <div className="text-xs text-yellow-400 font-bold" style={{ fontFamily: 'monospace' }}>
                      +{formatNumber(ach.reward)} 🍪
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* GAME MODES MODAL */}
      {showGameModes && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowGameModes(false)}>
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'system-ui' }}>
                🎮 Game Modes
              </h2>
              <button
                onClick={() => setShowGameModes(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {gameModes.map(mode => {
                const isActive = currentGameMode === mode.id;
                const canUse = mode.unlocked || (mode.ownerOnly && isOwner);
                
                return (
                  <div
                    key={mode.id}
                    className={`p-5 rounded-lg border-2 transition-all ${
                      isActive ? 'border-purple-500 bg-purple-900/20 scale-105' : 
                      canUse ? 'border-gray-600 bg-black/30 hover:border-gray-500' : 
                      'border-gray-800 bg-black/20 opacity-50'
                    }`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-5xl">{mode.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'system-ui' }}>
                            {mode.name}
                          </h3>
                          {mode.ownerOnly && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ 
                              backgroundColor: '#f9731620',
                              color: '#f97316',
                              fontFamily: 'monospace'
                            }}>
                              OWNER
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400" style={{ fontFamily: 'system-ui' }}>
                          {mode.desc}
                        </p>
                      </div>
                    </div>
                    
                    {mode.unlockRequirement && !mode.unlocked && (
                      <div className="text-xs text-yellow-400 mb-3" style={{ fontFamily: 'monospace' }}>
                        🔒 Unlock: {mode.unlockRequirement.level && `Level ${mode.unlockRequirement.level}`}
                        {mode.unlockRequirement.prestige && `Prestige ${mode.unlockRequirement.prestige}`}
                      </div>
                    )}
                    
                    {canUse && (
                      <button
                        onClick={() => {
                          setCurrentGameMode(mode.id);
                          createNotification(`${mode.icon} ${mode.name} activated!`);
                        }}
                        disabled={isActive}
                        className={`w-full py-2 rounded-lg font-bold text-sm transition-all ${
                          isActive ? 'cursor-not-allowed' : 'hover:brightness-110'
                        }`}
                        style={{
                          backgroundColor: isActive ? '#10b981' : equippedTheme.accent,
                          color: '#fff',
                          fontFamily: 'system-ui'
                        }}
                      >
                        {isActive ? '✓ Active' : 'Activate'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* STATS MODAL */}
      {showStats && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowStats(false)}>
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'system-ui' }}>
                📊 Your Statistics
              </h2>
              <button
                onClick={() => setShowStats(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'Total Cookies Earned', value: formatNumber(totalCookiesEarned), icon: '🍪' },
                { label: 'Total Clicks', value: formatNumber(totalClicks), icon: '👆' },
                { label: 'Current Level', value: level, icon: '⭐' },
                { label: 'Total Prestiges', value: stats.totalPrestige, icon: '🌟' },
                { label: 'Achievements Unlocked', value: `${stats.achievementsUnlocked}/${achievements.length}`, icon: '🏆' },
                { label: 'Cosmetics Owned', value: stats.cosmeticsUnlocked, icon: '🎨' },
                { label: 'Fastest Click Speed', value: stats.fastestClick === Infinity ? 'N/A' : `${stats.fastestClick}ms`, icon: '⚡' },
                { label: 'Longest Combo Streak', value: stats.longestStreak, icon: '🔥' },
                { label: 'Critical Failures', value: criticalFails, icon: '💀' },
                { label: 'Current CPS', value: formatNumber(Math.floor(cookiesPerSecond * getPrestigeMultiplier() * getGameModeMultiplier())), icon: '🏭' },
                { label: 'Current CPC', value: formatNumber(Math.floor(cookiesPerClick * getPrestigeMultiplier() * getGameModeMultiplier())), icon: '👊' },
                { label: 'Production Multiplier', value: `${getPrestigeMultiplier().toFixed(2)}x`, icon: '📈' },
              ].map(stat => (
                <div key={stat.label} className="bg-black/30 rounded-lg p-4 border border-gray-700/50">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-sm text-gray-400 mb-1" style={{ fontFamily: 'system-ui' }}>
                    {stat.label}
                  </div>
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: 'system-ui' }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* COSMETICS SHOP MODAL */}
      {showCosmeticsShop && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto p-4" onClick={() => setShowCosmeticsShop(false)}>
          <div className="max-w-6xl mx-auto my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'system-ui' }}>
                  🛒 Cosmetics Shop
                </h2>
                <button onClick={() => setShowCosmeticsShop(false)} className="text-gray-400 hover:text-white text-2xl">
                  ✕
                </button>
              </div>
              
              <div className="mb-6 text-center">
                <div className="text-2xl font-black text-yellow-400" style={{ fontFamily: 'system-ui' }}>
                  {formatNumber(cookies)} 🍪
                </div>
              </div>
              
              {/* Cookie skins */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'system-ui' }}>
                  <span>🍪</span> Cookie Skins
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {COSMETICS.cookies.map(cookie => {
                    const owned = ownedCosmetics.cookies.includes(cookie.id);
                    const canAfford = cookies >= cookie.cost;
                    
                    return (
                      <button
                        key={cookie.id}
                        onClick={() => !owned && canAfford && buyCosmetic('cookie', cookie)}
                        disabled={owned || !canAfford}
                        className={`p-4 rounded-lg border transition-all hover:scale-105 ${
                          owned ? 'bg-green-900/40 border-green-500' : canAfford ? 'bg-black/30 border-gray-600 hover:border-gray-500' : 'bg-black/20 border-gray-800 opacity-40'
                        }`}
                      >
                        <div className="text-5xl mb-2">{cookie.emoji}</div>
                        <div className="text-xs font-bold mb-1" style={{ color: getRarityColor(cookie.rarity), fontFamily: 'system-ui' }}>
                          {cookie.name}
                        </div>
                        <div className="text-xs text-yellow-400" style={{ fontFamily: 'monospace' }}>
                          {cookie.cost === 0 ? 'FREE' : formatNumber(cookie.cost)}
                        </div>
                        {owned && <div className="text-xs text-green-400 mt-1 font-bold">✓ OWNED</div>}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Themes */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'system-ui' }}>
                  <span>🎨</span> Themes
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {COSMETICS.themes.map(theme => {
                    const owned = ownedCosmetics.themes.includes(theme.id);
                    const canAfford = cookies >= theme.cost;
                    
                    return (
                      <button
                        key={theme.id}
                        onClick={() => !owned && canAfford && buyCosmetic('theme', theme)}
                        disabled={owned || !canAfford}
                        className={`p-4 rounded-lg border transition-all hover:scale-105 ${
                          owned ? 'bg-green-900/40 border-green-500' : canAfford ? 'bg-black/30 border-gray-600 hover:border-gray-500' : 'bg-black/20 border-gray-800 opacity-40'
                        }`}
                      >
                        <div className="h-12 rounded mb-3" style={{ 
                          background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.secondary} 100%)`
                        }} />
                        <div className="text-xs font-bold mb-1" style={{ color: getRarityColor(theme.rarity), fontFamily: 'system-ui' }}>
                          {theme.name}
                        </div>
                        <div className="text-xs text-yellow-400" style={{ fontFamily: 'monospace' }}>
                          {theme.cost === 0 ? 'FREE' : formatNumber(theme.cost)}
                        </div>
                        {owned && <div className="text-xs text-green-400 mt-1 font-bold">✓ OWNED</div>}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Effects */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'system-ui' }}>
                  <span>✨</span> Click Effects
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {COSMETICS.effects.map(effect => {
                    const owned = ownedCosmetics.effects.includes(effect.id);
                    const canAfford = cookies >= effect.cost;
                    
                    return (
                      <button
                        key={effect.id}
                        onClick={() => !owned && canAfford && buyCosmetic('effect', effect)}
                        disabled={owned || !canAfford}
                        className={`p-4 rounded-lg border transition-all hover:scale-105 ${
                          owned ? 'bg-green-900/40 border-green-500' : canAfford ? 'bg-black/30 border-gray-600 hover:border-gray-500' : 'bg-black/20 border-gray-800 opacity-40'
                        }`}
                      >
                        <div className="text-xs font-bold mb-1" style={{ color: getRarityColor(effect.rarity), fontFamily: 'system-ui' }}>
                          {effect.name}
                        </div>
                        <div className="text-xs text-yellow-400" style={{ fontFamily: 'monospace' }}>
                          {effect.cost === 0 ? 'FREE' : formatNumber(effect.cost)}
                        </div>
                        {owned && <div className="text-xs text-green-400 mt-1 font-bold">✓ OWNED</div>}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Titles */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'system-ui' }}>
                  <span>👑</span> Titles
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {COSMETICS.titles.filter(t => !t.ownerOnly && !t.staffOnly && !t.creatorOnly).map(title => {
                    const owned = ownedCosmetics.titles.includes(title.id);
                    const canAfford = cookies >= title.cost;
                    
                    return (
                      <button
                        key={title.id}
                        onClick={() => !owned && canAfford && buyCosmetic('title', title)}
                        disabled={owned || !canAfford}
                        className={`p-4 rounded-lg border transition-all hover:scale-105 ${
                          owned ? 'bg-green-900/40 border-green-500' : canAfford ? 'bg-black/30 border-gray-600 hover:border-gray-500' : 'bg-black/20 border-gray-800 opacity-40'
                        }`}
                      >
                        <div className="text-sm font-bold mb-2" style={{ color: getRarityColor(title.rarity), fontFamily: 'system-ui' }}>
                          {title.display || title.name}
                        </div>
                        <div className="text-xs text-yellow-400" style={{ fontFamily: 'monospace' }}>
                          {title.cost === 0 ? 'FREE' : formatNumber(title.cost)}
                        </div>
                        {owned && <div className="text-xs text-green-400 mt-1 font-bold">✓ OWNED</div>}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Badges */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'system-ui' }}>
                  <span>🎖️</span> Badges
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {COSMETICS.badges.map(badge => {
                    const owned = ownedCosmetics.badges?.includes(badge.id);
                    const canAfford = cookies >= badge.cost;
                    
                    return (
                      <button
                        key={badge.id}
                        onClick={() => !owned && canAfford && buyCosmetic('badge', badge)}
                        disabled={owned || !canAfford}
                        className={`p-4 rounded-lg border transition-all hover:scale-105 ${
                          owned ? 'bg-green-900/40 border-green-500' : canAfford ? 'bg-black/30 border-gray-600 hover:border-gray-500' : 'bg-black/20 border-gray-800 opacity-40'
                        }`}
                      >
                        <div className="text-4xl mb-2">{badge.emoji}</div>
                        <div className="text-xs font-bold mb-1" style={{ color: getRarityColor(badge.rarity), fontFamily: 'system-ui' }}>
                          {badge.name}
                        </div>
                        <div className="text-xs text-yellow-400" style={{ fontFamily: 'monospace' }}>
                          {formatNumber(badge.cost)}
                        </div>
                        {owned && <div className="text-xs text-green-400 mt-1 font-bold">✓ OWNED</div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* COSMETICS WARDROBE MODAL */}
      {showCosmeticsMenu && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto p-4" onClick={() => setShowCosmeticsMenu(false)}>
          <div className="max-w-6xl mx-auto my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'system-ui' }}>
                  🎨 Your Wardrobe
                </h2>
                <button onClick={() => setShowCosmeticsMenu(false)} className="text-gray-400 hover:text-white text-2xl">
                  ✕
                </button>
              </div>
              
              {/* Gifts received */}
              {cosmeticGifts && cosmeticGifts.length > 0 && (
                <div className="mb-6 bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-purple-300 mb-3" style={{ fontFamily: 'system-ui' }}>
                    🎁 Gifts Received
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {cosmeticGifts.slice(0, 5).map(gift => (
                      <div key={gift.id} className="text-xs text-gray-300" style={{ fontFamily: 'monospace' }}>
                        {gift.cosmeticName} from <span className="text-purple-400 font-bold">{gift.from}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Owned Cookies */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'system-ui' }}>
                  Cookie Skins
                </h3>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {[...COSMETICS.cookies, ...(isOwner ? OWNER_COSMETICS.cookies : [])].filter(c => ownedCosmetics.cookies.includes(c.id)).map(cookie => (
                    <button
                      key={cookie.id}
                      onClick={() => equipCosmetic('cookie', cookie.id)}
                      className={`p-3 rounded-lg border-2 transition-all hover:scale-110 ${
                        equippedCosmetics.cookie === cookie.id ? 'border-purple-500 bg-purple-900/30' : 'border-gray-700 bg-black/30'
                      }`}
                    >
                      <div className="text-4xl">{cookie.emoji}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Owned Themes */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'system-ui' }}>
                  Themes
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[...COSMETICS.themes, ...(isOwner ? OWNER_COSMETICS.themes : []), ...(isModerator ? MOD_COSMETICS.themes : [])].filter(t => ownedCosmetics.themes.includes(t.id)).map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => equipCosmetic('theme', theme.id)}
                      className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                        equippedCosmetics.theme === theme.id ? 'border-purple-500 bg-purple-900/30' : 'border-gray-700 bg-black/30'
                      }`}
                    >
                      <div className="h-12 rounded mb-2" style={{ 
                        background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.secondary} 100%)`
                      }} />
                      <div className="text-xs font-bold text-white" style={{ fontFamily: 'system-ui' }}>
                        {theme.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Owned Titles */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'system-ui' }}>
                  Titles
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {COSMETICS.titles.filter(t => ownedCosmetics.titles.includes(t.id)).map(title => (
                    <button
                      key={title.id}
                      onClick={() => equipCosmetic('title', title.id)}
                      className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                        equippedCosmetics.title === title.id ? 'border-purple-500 bg-purple-900/30' : 'border-gray-700 bg-black/30'
                      }`}
                    >
                      <div className="text-sm font-bold" style={{ color: getRarityColor(title.rarity), fontFamily: 'system-ui' }}>
                        {title.display || title.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* OWNER PANEL - V3.0 GORGEOUS REDESIGN */}
      {isOwner && ownerPanelOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 overflow-y-auto p-4" onClick={() => setOwnerPanelOpen(false)}>
          <div className="max-w-7xl mx-auto my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-orange-950/40 via-gray-900/60 to-red-950/40 rounded-2xl border-2 border-orange-500/50 shadow-2xl overflow-hidden">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 border-b-2 border-orange-500/50">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-4xl font-black text-white mb-2 flex items-center gap-3" style={{ fontFamily: 'system-ui' }}>
                      👑 OWNER CONTROL CENTER
                    </h2>
                    <p className="text-orange-100 text-sm">Ultimate power at your fingertips</p>
                  </div>
                  <button 
                    onClick={() => setOwnerPanelOpen(false)} 
                    className="w-12 h-12 rounded-xl bg-black/30 hover:bg-black/50 text-white text-2xl font-bold transition-all hover:scale-110"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="bg-black/30 px-6 py-4 border-b border-gray-700/50 flex gap-3 overflow-x-auto">
                {[
                  { id: 'quick', label: 'Quick Actions', icon: '⚡' },
                  { id: 'players', label: 'Players', icon: '👥' },
                  { id: 'cosmetics', label: 'Cosmetics', icon: '🎨' },
                  { id: 'economy', label: 'Economy', icon: '💰' },
                  { id: 'stats', label: 'Analytics', icon: '📊' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setOwnerTab(tab.id)}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                      ownerTab === tab.id 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105' 
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                    }`}
                    style={{ fontFamily: 'system-ui' }}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {/* Content */}
              <div className="p-6">
                
                {/* QUICK ACTIONS TAB */}
                {ownerTab === 'quick' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Tutorial Button */}
                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-bold mb-1">Need Help? 🎓</h3>
                          <p className="text-gray-300 text-sm">Learn how to use owner commands</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => openTutorial('give_resources')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold text-sm">
                            Give Resources
                          </button>
                          <button onClick={() => openTutorial('give_cosmetic')} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-bold text-sm">
                            Give Cosmetics
                          </button>
                          <button onClick={() => openTutorial('ban_player')} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-bold text-sm">
                            Ban Players
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Personal Cheats */}
                    <div className="bg-black/40 rounded-xl p-6 border border-orange-500/30">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-black text-orange-400" style={{ fontFamily: 'system-ui' }}>
                          ⚡ Personal Cheats
                        </h3>
                        <button onClick={() => openTutorial('give_resources')} className="text-blue-400 hover:text-blue-300 text-sm font-bold">
                          ? How to use
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { label: '+1M 🍪', action: () => { setCookies(c => c + 1000000); createNotification('✅ +1M Cookies'); } },
                          { label: '+1B 🍪', action: () => { setCookies(c => c + 1000000000); createNotification('✅ +1B Cookies'); } },
                          { label: '+1T 🍪', action: () => { setCookies(c => c + 1000000000000); createNotification('✅ +1T Cookies'); } },
                          { label: 'Max Cookies', action: () => { setCookies(Number.MAX_SAFE_INTEGER); createNotification('✅ Max Cookies!'); } },
                          { label: 'Level 100', action: () => { setLevel(100); createNotification('✅ Level 100'); } },
                          { label: 'Level 500', action: () => { setLevel(500); createNotification('✅ Level 500'); } },
                          { label: 'Level 999', action: () => { setLevel(999); createNotification('✅ Level 999'); } },
                          { label: 'P50', action: () => { setPrestige(50); createNotification('✅ Prestige 50'); } },
                          { label: 'P100', action: () => { setPrestige(100); createNotification('✅ Prestige 100'); } },
                          { label: '9999 Tokens', action: () => { setPrestigeTokens(9999); createNotification('✅ 9999 Tokens'); } },
                          { label: 'Max CPS', action: () => { setCookiesPerSecond(999999999); createNotification('✅ Max CPS'); } },
                          { label: 'Max CPC', action: () => { setCookiesPerClick(999999999); createNotification('✅ Max CPC'); } },
                          { label: 'All Achievements', action: () => { setAchievements(a => a.map(ach => ({ ...ach, unlocked: true }))); createNotification('✅ All Achievements'); } },
                          { label: 'All Cosmetics', action: () => { 
                            setOwnedCosmetics({
                              cookies: [...COSMETICS.cookies.map(c => c.id), ...OWNER_COSMETICS.cookies.map(c => c.id)],
                              themes: [...COSMETICS.themes.map(t => t.id), ...OWNER_COSMETICS.themes.map(t => t.id)],
                              effects: [...COSMETICS.effects.map(e => e.id), ...(OWNER_COSMETICS.effects?.map(e => e.id) || [])],
                              titles: COSMETICS.titles.map(t => t.id),
                              badges: COSMETICS.badges.map(b => b.id)
                            });
                            createNotification('✅ All Cosmetics Unlocked');
                          }},
                          { label: 'Reset Fails', action: () => { setCriticalFails(0); createNotification('✅ Critical Fails Reset'); } },
                          { label: '👑 GOD MODE', action: ownerGodMode, className: 'col-span-2 bg-gradient-to-r from-yellow-600 to-orange-600 font-black text-lg' }
                        ].map((cmd, idx) => (
                          <button
                            key={idx}
                            onClick={cmd.action}
                            className={`${cmd.className || 'bg-gradient-to-br from-orange-600 to-red-600'} hover:brightness-110 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-105 shadow-lg`}
                            style={{ fontFamily: 'system-ui' }}
                          >
                            {cmd.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Your Stats */}
                    <div className="bg-black/40 rounded-xl p-6 border border-orange-500/30">
                      <h3 className="text-2xl font-black text-orange-400 mb-4" style={{ fontFamily: 'system-ui' }}>
                        📊 Your Stats
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'Cookies', value: formatNumber(cookies), icon: '🍪' },
                          { label: 'CPC', value: formatNumber(cookiesPerClick), icon: '👆' },
                          { label: 'CPS', value: formatNumber(cookiesPerSecond), icon: '🏭' },
                          { label: 'Level', value: level, icon: '⭐' },
                          { label: 'Prestige', value: prestige, icon: '🌟' },
                          { label: 'Tokens', value: prestigeTokens, icon: '💎' },
                          { label: 'Total Earned', value: formatNumber(totalCookiesEarned), icon: '💰' },
                          { label: 'Total Clicks', value: formatNumber(totalClicks), icon: '🖱️' }
                        ].map(stat => (
                          <div key={stat.label} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <div className="text-xs text-gray-400 mb-1">{stat.label}</div>
                            <div className="text-xl font-bold text-white">{stat.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                  </div>
                )}
                
                {/* Other tabs remain similar but with better styling... */}
                {ownerTab === 'players' && (
                  <div className="text-white">Players tab - (keeping existing code but with better cards)</div>
                )}
                
                {ownerTab === 'cosmetics' && (
                  <div className="animate-fadeIn">
                    <div className="bg-black/40 rounded-xl p-6 border border-orange-500/30 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-black text-orange-400" style={{ fontFamily: 'system-ui' }}>
                          👑 Owner Exclusive Cosmetics
                        </h3>
                        <button onClick={() => openTutorial('give_cosmetic')} className="text-blue-400 hover:text-blue-300 text-sm font-bold">
                          ? How to give
                        </button>
                      </div>
                      
                      {/* Owner Cookies */}
                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-white mb-3">🍪 Owner Cookie Skins</h4>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                          {OWNER_COSMETICS.cookies.map(cookie => (
                            <div key={cookie.id} className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-4 border-2 border-orange-500/50 text-center hover:scale-105 transition-all cursor-pointer group">
                              <div className="text-5xl mb-2 group-hover:scale-110 transition-transform" style={{ filter: `drop-shadow(0 0 10px ${cookie.glow || '#ffd700'})` }}>
                                {cookie.emoji}
                              </div>
                              <div className="text-xs font-bold text-orange-400 mb-1">{cookie.name}</div>
                              <div className="text-xs text-gray-400">{cookie.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Owner Themes */}
                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-white mb-3">🎨 Owner Themes</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {OWNER_COSMETICS.themes.map(theme => (
                            <div key={theme.id} className="rounded-xl overflow-hidden border-2 border-orange-500/50 hover:scale-105 transition-all cursor-pointer">
                              <div className="h-24 relative overflow-hidden" style={{ background: theme.bg }}>
                                <div className="absolute inset-0" style={{ 
                                  background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.secondary} 100%)`,
                                  opacity: 0.3
                                }} />
                                {theme.glow && (
                                  <div className="absolute inset-0 animate-pulse" style={{ 
                                    background: `radial-gradient(circle, ${theme.accent}40 0%, transparent 70%)`
                                  }} />
                                )}
                              </div>
                              <div className="bg-black/60 p-3">
                                <div className="text-sm font-bold text-orange-400">{theme.name}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Owner Effects */}
                      {OWNER_COSMETICS.effects && (
                        <div>
                          <h4 className="text-lg font-bold text-white mb-3">✨ Owner Effects</h4>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {OWNER_COSMETICS.effects.map(effect => (
                              <div key={effect.id} className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-4 border-2 border-purple-500/50 text-center hover:scale-105 transition-all">
                                <div className="text-sm font-bold text-purple-400 mb-1">{effect.name}</div>
                                <div className="text-xs text-gray-400">{effect.desc}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          </div>
        </div>
      )}
              
              {/* Owner tabs */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {['quick', 'players', 'cosmetics', 'economy', 'stats'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setOwnerTab(tab)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all capitalize ${
                      ownerTab === tab ? 'bg-orange-600 text-white scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                    style={{ fontFamily: 'system-ui' }}
                  >
                    {tab === 'quick' && '⚡'}
                    {tab === 'players' && '👥'}
                    {tab === 'cosmetics' && '🎨'}
                    {tab === 'economy' && '💰'}
                    {tab === 'stats' && '📊'}
                    {' '}{tab}
                  </button>
                ))}
              </div>
              
              {/* Quick Actions */}
              {ownerTab === 'quick' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-orange-400 mb-4" style={{ fontFamily: 'system-ui' }}>
                      ⚡ Quick Commands
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: '+1M Cookies', action: () => setCookies(c => c + 1000000) },
                        { label: '+1B Cookies', action: () => setCookies(c => c + 1000000000) },
                        { label: '+1T Cookies', action: () => setCookies(c => c + 1000000000000) },
                        { label: 'Max Cookies', action: () => setCookies(Number.MAX_SAFE_INTEGER) },
                        { label: 'Level 100', action: () => setLevel(100) },
                        { label: 'Level 500', action: () => setLevel(500) },
                        { label: 'Level 999', action: () => setLevel(999) },
                        { label: 'Prestige 50', action: () => setPrestige(50) },
                        { label: 'Prestige 100', action: () => setPrestige(100) },
                        { label: '9999 Tokens', action: () => setPrestigeTokens(9999) },
                        { label: 'Max CPS', action: () => setCookiesPerSecond(999999999) },
                        { label: 'Max CPC', action: () => setCookiesPerClick(999999999) },
                        { label: 'All Achievements', action: () => setAchievements(ach => ach.map(a => ({ ...a, unlocked: true }))) },
                        { label: 'All Cosmetics', action: () => setOwnedCosmetics({
                          cookies: [...COSMETICS.cookies.map(c => c.id), ...OWNER_COSMETICS.cookies.map(c => c.id)],
                          themes: [...COSMETICS.themes.map(t => t.id), ...OWNER_COSMETICS.themes.map(t => t.id)],
                          effects: COSMETICS.effects.map(e => e.id),
                          titles: COSMETICS.titles.map(t => t.id),
                          badges: COSMETICS.badges.map(b => b.id)
                        }) },
                        { label: 'All Game Modes', action: () => setGameModes(modes => modes.map(m => ({ ...m, unlocked: true }))) },
                        { label: 'Reset Fails', action: () => setCriticalFails(0) },
                      ].map(cmd => (
                        <button
                          key={cmd.label}
                          onClick={() => {
                            cmd.action();
                            createNotification(`✓ ${cmd.label}`);
                          }}
                          className="bg-orange-600 hover:bg-orange-500 px-4 py-3 rounded-lg font-bold text-sm transition-all hover:scale-105"
                          style={{ fontFamily: 'system-ui' }}
                        >
                          {cmd.label}
                        </button>
                      ))}
                      <button
                        onClick={ownerGodMode}
                        className="bg-yellow-600 hover:bg-yellow-500 px-4 py-3 rounded-lg font-black text-sm transition-all hover:scale-105 col-span-2"
                        style={{ fontFamily: 'system-ui' }}
                      >
                        👑 ULTIMATE GOD MODE
                      </button>
                    </div>
                  </div>
                  
                  {/* Current stats display */}
                  <div className="bg-black/30 rounded-lg p-5 border border-orange-500/30">
                    <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'system-ui' }}>
                      Your Current Status
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm" style={{ fontFamily: 'monospace' }}>
                      {[
                        { label: 'Cookies', value: formatNumber(cookies) },
                        { label: 'CPC', value: formatNumber(cookiesPerClick) },
                        { label: 'CPS', value: formatNumber(cookiesPerSecond) },
                        { label: 'Level', value: level },
                        { label: 'Prestige', value: prestige },
                        { label: 'Tokens', value: prestigeTokens },
                        { label: 'Total Earned', value: formatNumber(totalCookiesEarned) },
                        { label: 'Total Clicks', value: formatNumber(totalClicks) },
                      ].map(stat => (
                        <div key={stat.label}>
                          <div className="text-gray-400">{stat.label}</div>
                          <div className="text-orange-400 font-bold text-lg">{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Player Management */}
              {ownerTab === 'players' && (
                <div>
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search players by name or ID..."
                      className="flex-1 bg-black/50 border border-orange-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                      style={{ fontFamily: 'system-ui' }}
                    />
                    <button
                      onClick={loadAllPlayers}
                      className="bg-orange-600 hover:bg-orange-500 px-6 py-3 rounded-lg font-bold transition-all"
                      style={{ fontFamily: 'system-ui' }}
                    >
                      🔄 Refresh
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-4" style={{ fontFamily: 'monospace' }}>
                    Total Players: {allPlayers.length} • Showing: {filteredPlayers.length}
                  </div>
                  
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {filteredPlayers.map(player => (
                      <div key={player.playerId} className="bg-black/40 rounded-lg p-4 border border-orange-500/20">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-bold text-white text-lg" style={{ fontFamily: 'system-ui' }}>
                              {player.playerName || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-400" style={{ fontFamily: 'monospace' }}>
                              ID: {player.playerId}
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedPlayer(player.playerId === selectedPlayer ? null : player.playerId)}
                            className="text-orange-400 hover:text-orange-300 font-bold"
                          >
                            {selectedPlayer === player.playerId ? '▼ Close' : '▶ Manage'}
                          </button>
                        </div>
                        
                        {selectedPlayer === player.playerId && (
                          <div className="space-y-4 mt-4 border-t border-gray-700 pt-4">
                            {/* Player stats */}
                            <div className="grid grid-cols-3 gap-3 text-xs" style={{ fontFamily: 'monospace' }}>
                              <div>
                                <span className="text-gray-400">Cookies:</span>
                                <span className="text-white ml-2 font-bold">{formatNumber(player.cookies || 0)}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">CPC:</span>
                                <span className="text-white ml-2 font-bold">{formatNumber(player.cookiesPerClick || 1)}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">CPS:</span>
                                <span className="text-white ml-2 font-bold">{formatNumber(player.cookiesPerSecond || 0)}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Level:</span>
                                <span className="text-white ml-2 font-bold">{player.level || 0}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Prestige:</span>
                                <span className="text-white ml-2 font-bold">{player.prestige || 0}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Total:</span>
                                <span className="text-white ml-2 font-bold">{formatNumber(player.totalCookiesEarned || 0)}</span>
                              </div>
                            </div>
                            
                            {/* Give resources */}
                            <div className="bg-orange-900/20 rounded-lg p-3 border border-orange-500/30">
                              <h4 className="text-sm font-bold text-orange-400 mb-3" style={{ fontFamily: 'system-ui' }}>
                                💰 Give Resources
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { label: '💰 Give Cookies', action: async () => {
                                    const amount = prompt('Give how many cookies?');
                                    if (amount && !isNaN(amount)) {
                                      await api.updatePlayer(player.playerId, {
                                        cookies: (player.cookies || 0) + parseInt(amount)
                                      });
                                      createNotification(`✓ Gave ${formatNumber(parseInt(amount))} cookies`);
                                      addModLog('GIVE_COOKIES', `Gave ${amount} cookies to ${player.playerId}`);
                                      loadAllPlayers();
                                    }
                                  }},
                                  { label: '⚡ Set CPC', action: async () => {
                                    const amount = prompt('Set CPC to?');
                                    if (amount && !isNaN(amount)) {
                                      await api.updatePlayer(player.playerId, {
                                        cookiesPerClick: parseInt(amount)
                                      });
                                      createNotification(`✓ Set CPC`);
                                      addModLog('SET_CPC', `Set CPC to ${amount} for ${player.playerId}`);
                                      loadAllPlayers();
                                    }
                                  }},
                                  { label: '🔥 Set CPS', action: async () => {
                                    const amount = prompt('Set CPS to?');
                                    if (amount && !isNaN(amount)) {
                                      await api.updatePlayer(player.playerId, {
                                        cookiesPerSecond: parseInt(amount)
                                      });
                                      createNotification(`✓ Set CPS`);
                                      addModLog('SET_CPS', `Set CPS to ${amount} for ${player.playerId}`);
                                      loadAllPlayers();
                                    }
                                  }},
                                  { label: '⭐ Set Level', action: async () => {
                                    const level = prompt('Set level to?');
                                    if (level && !isNaN(level)) {
                                      await api.updatePlayer(player.playerId, {
                                        level: parseInt(level)
                                      });
                                      createNotification(`✓ Set level`);
                                      addModLog('SET_LEVEL', `Set level to ${level} for ${player.playerId}`);
                                      loadAllPlayers();
                                    }
                                  }},
                                  { label: '🌟 Give Tokens', action: async () => {
                                    const tokens = prompt('Give how many tokens?');
                                    if (tokens && !isNaN(tokens)) {
                                      await api.updatePlayer(player.playerId, {
                                        prestigeTokens: (player.prestigeTokens || 0) + parseInt(tokens)
                                      });
                                      createNotification(`✓ Gave tokens`);
                                      addModLog('GIVE_TOKENS', `Gave ${tokens} tokens to ${player.playerId}`);
                                      loadAllPlayers();
                                    }
                                  }},
                                  { label: '👑 Max Everything', action: async () => {
                                    if (confirm(`Max out ${player.playerName}'s stats?`)) {
                                      await api.updatePlayer(player.playerId, {
                                        cookies: Number.MAX_SAFE_INTEGER,
                                        cookiesPerClick: 999999999,
                                        cookiesPerSecond: 999999999,
                                        level: 999,
                                        prestige: 999,
                                        prestigeTokens: 99999
                                      });
                                      createNotification(`✓ Maxed player`);
                                      addModLog('MAX_PLAYER', `Maxed all stats for ${player.playerId}`);
                                      loadAllPlayers();
                                    }
                                  }},
                                ].map(action => (
                                  <button
                                    key={action.label}
                                    onClick={action.action}
                                    className="bg-green-600 hover:bg-green-500 px-3 py-2 rounded-lg font-medium text-xs transition-all"
                                    style={{ fontFamily: 'system-ui' }}
                                  >
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            {/* Give cosmetics */}
                            <div className="bg-pink-900/20 rounded-lg p-3 border border-pink-500/30">
                              <h4 className="text-sm font-bold text-pink-400 mb-3" style={{ fontFamily: 'system-ui' }}>
                                🎨 Give Cosmetics
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { label: '🍪 Cookie Skin', type: 'cookie', items: COSMETICS.cookies },
                                  { label: '🎨 Theme', type: 'theme', items: COSMETICS.themes },
                                  { label: '✨ Effect', type: 'effect', items: COSMETICS.effects },
                                  { label: '👑 Title', type: 'title', items: COSMETICS.titles },
                                ].map(cosmType => (
                                  <button
                                    key={cosmType.label}
                                    onClick={async () => {
                                      const items = cosmType.items.map(i => i.id).join(', ');
                                      const id = prompt(`Available ${cosmType.type}s:\n${items}\n\nEnter ID:`);
                                      const item = cosmType.items.find(i => i.id === id);
                                      if (item) {
                                        await ownerGiveCosmetic(player.playerId, cosmType.type, id, item.name);
                                      }
                                    }}
                                    className="bg-pink-600 hover:bg-pink-500 px-3 py-2 rounded-lg font-medium text-xs transition-all"
                                    style={{ fontFamily: 'system-ui' }}
                                  >
                                    {cosmType.label}
                                  </button>
                                ))}
                                <button
                                  onClick={async () => {
                                    if (confirm(`Give ALL cosmetics to ${player.playerName}?`)) {
                                      await api.updatePlayer(player.playerId, {
                                        ownedCosmetics: {
                                          cookies: COSMETICS.cookies.map(c => c.id),
                                          themes: COSMETICS.themes.map(t => t.id),
                                          effects: COSMETICS.effects.map(e => e.id),
                                          titles: COSMETICS.titles.map(t => t.id),
                                          badges: COSMETICS.badges.map(b => b.id)
                                        }
                                      });
                                      createNotification(`✓ Gave all cosmetics`);
                                      addModLog('GIVE_ALL_COSMETICS', `Gave all cosmetics to ${player.playerId}`);
                                      loadAllPlayers();
                                    }
                                  }}
                                  className="bg-purple-600 hover:bg-purple-500 px-3 py-2 rounded-lg font-medium text-xs col-span-2 transition-all"
                                  style={{ fontFamily: 'system-ui' }}
                                >
                                  🎁 Give ALL Cosmetics
                                </button>
                              </div>
                            </div>
                            
                            {/* Danger zone */}
                            <div className="bg-red-900/20 rounded-lg p-3 border border-red-500/30">
                              <h4 className="text-sm font-bold text-red-400 mb-3" style={{ fontFamily: 'system-ui' }}>
                                ⚠️ Danger Zone
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={async () => {
                                    if (confirm(`Reset economy for ${player.playerName}?`)) {
                                      await api.updatePlayer(player.playerId, {
                                        cookies: 0,
                                        totalCookiesEarned: 0,
                                        cookiesPerClick: 1,
                                        cookiesPerSecond: 0
                                      });
                                      createNotification(`✓ Economy reset`);
                                      addModLog('RESET_ECONOMY', `Reset economy for ${player.playerId}`);
                                      loadAllPlayers();
                                    }
                                  }}
                                  className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded-lg font-medium text-xs transition-all"
                                  style={{ fontFamily: 'system-ui' }}
                                >
                                  ⚠️ Reset Economy
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm(`COMPLETELY RESET ${player.playerName}? This resets EVERYTHING!`)) {
                                      await api.updatePlayer(player.playerId, {
                                        cookies: 0,
                                        totalCookiesEarned: 0,
                                        cookiesPerClick: 1,
                                        cookiesPerSecond: 0,
                                        level: 1,
                                        prestige: 0,
                                        prestigeTokens: 0,
                                        totalClicks: 0,
                                        criticalFails: 0
                                      });
                                      createNotification(`✓ Player reset`);
                                      addModLog('FULL_RESET', `Full reset for ${player.playerId}`);
                                      loadAllPlayers();
                                    }
                                  }}
                                  className="bg-red-700 hover:bg-red-600 px-3 py-2 rounded-lg font-medium text-xs transition-all"
                                  style={{ fontFamily: 'system-ui' }}
                                >
                                  🔄 Full Reset
                                </button>
                                <button
                                  onClick={() => ownerDeletePlayer(player.playerId)}
                                  className="bg-red-900 hover:bg-red-800 px-3 py-2 rounded-lg font-bold text-xs col-span-2 transition-all"
                                  style={{ fontFamily: 'system-ui' }}
                                >
                                  🗑️ DELETE PLAYER
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Cosmetics Tab */}
              {ownerTab === 'cosmetics' && (
                <div>
                  <h3 className="text-xl font-bold text-orange-400 mb-4" style={{ fontFamily: 'system-ui' }}>
                    🎨 Owner Exclusive Cosmetics
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'system-ui' }}>
                        Owner Cookies
                      </h4>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {OWNER_COSMETICS.cookies.map(cookie => (
                          <div key={cookie.id} className="bg-orange-900/20 rounded-lg p-4 border border-orange-500/30 text-center">
                            <div className="text-5xl mb-2">{cookie.emoji}</div>
                            <div className="text-xs font-bold text-orange-400" style={{ fontFamily: 'system-ui' }}>
                              {cookie.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'system-ui' }}>
                        Owner Themes
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {OWNER_COSMETICS.themes.map(theme => (
                          <div key={theme.id} className="bg-orange-900/20 rounded-lg p-4 border border-orange-500/30">
                            <div className="h-16 rounded mb-2" style={{ 
                              background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.secondary} 100%)`
                            }} />
                            <div className="text-sm font-bold text-orange-400" style={{ fontFamily: 'system-ui' }}>
                              {theme.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Economy Tab */}
              {ownerTab === 'economy' && (
                <div>
                  <h3 className="text-xl font-bold text-orange-400 mb-4" style={{ fontFamily: 'system-ui' }}>
                    💰 Global Economy Controls
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-black/30 rounded-lg p-5 border border-orange-500/30">
                      <h4 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'system-ui' }}>
                        Total Economy Stats
                      </h4>
                      <div className="space-y-3 text-sm" style={{ fontFamily: 'monospace' }}>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Cookies in Circulation:</span>
                          <span className="text-orange-400 font-bold">
                            {formatNumber(allPlayers.reduce((sum, p) => sum + (p.cookies || 0), 0))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Cookies Ever Earned:</span>
                          <span className="text-orange-400 font-bold">
                            {formatNumber(allPlayers.reduce((sum, p) => sum + (p.totalCookiesEarned || 0), 0))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total CPS:</span>
                          <span className="text-orange-400 font-bold">
                            {formatNumber(allPlayers.reduce((sum, p) => sum + (p.cookiesPerSecond || 0), 0))}/s
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Average Player Level:</span>
                          <span className="text-orange-400 font-bold">
                            {allPlayers.length > 0 ? Math.floor(allPlayers.reduce((sum, p) => sum + (p.level || 0), 0) / allPlayers.length) : 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black/30 rounded-lg p-5 border border-orange-500/30">
                      <h4 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'system-ui' }}>
                        Mass Actions
                      </h4>
                      <div className="space-y-2">
                        <button
                          onClick={async () => {
                            if (confirm('Give ALL players 1,000,000 cookies?')) {
                              for (const player of allPlayers) {
                                await api.updatePlayer(player.playerId, {
                                  cookies: (player.cookies || 0) + 1000000
                                });
                              }
                              createNotification('✓ Gave all players cookies');
                              addModLog('MASS_GIVE', 'Gave 1M cookies to all players');
                              loadAllPlayers();
                            }
                          }}
                          className="w-full bg-green-600 hover:bg-green-500 px-4 py-3 rounded-lg font-bold text-sm transition-all"
                          style={{ fontFamily: 'system-ui' }}
                        >
                          🎁 Give All Players 1M Cookies
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('⚠️ RESET ALL PLAYER ECONOMIES? This cannot be undone!')) {
                              for (const player of allPlayers) {
                                await api.updatePlayer(player.playerId, {
                                  cookies: 0,
                                  totalCookiesEarned: 0,
                                  cookiesPerClick: 1,
                                  cookiesPerSecond: 0
                                });
                              }
                              createNotification('✓ Global economy reset');
                              addModLog('GLOBAL_RESET', 'Reset all player economies');
                              loadAllPlayers();
                            }
                          }}
                          className="w-full bg-red-600 hover:bg-red-500 px-4 py-3 rounded-lg font-bold text-sm transition-all"
                          style={{ fontFamily: 'system-ui' }}
                        >
                          ⚠️ Global Economy Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Stats Tab */}
              {ownerTab === 'stats' && (
                <div>
                  <h3 className="text-xl font-bold text-orange-400 mb-4" style={{ fontFamily: 'system-ui' }}>
                    📊 Analytics & Insights
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-black/30 rounded-lg p-5 border border-orange-500/30">
                      <div className="text-4xl mb-2">👥</div>
                      <div className="text-3xl font-black text-white mb-1" style={{ fontFamily: 'system-ui' }}>
                        {allPlayers.length}
                      </div>
                      <div className="text-sm text-gray-400">Total Players</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-5 border border-orange-500/30">
                      <div className="text-4xl mb-2">✅</div>
                      <div className="text-3xl font-black text-white mb-1" style={{ fontFamily: 'system-ui' }}>
                        {allPlayers.filter(p => (p.totalClicks || 0) > 0).length}
                      </div>
                      <div className="text-sm text-gray-400">Active Players</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-5 border border-orange-500/30">
                      <div className="text-4xl mb-2">🌟</div>
                      <div className="text-3xl font-black text-white mb-1" style={{ fontFamily: 'system-ui' }}>
                        {allPlayers.filter(p => (p.prestige || 0) > 0).length}
                      </div>
                      <div className="text-sm text-gray-400">Prestiged Players</div>
                    </div>
                  </div>
                  
                  <div className="bg-black/30 rounded-lg p-5 border border-orange-500/30">
                    <h4 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'system-ui' }}>
                      Top 10 Players by Total Cookies
                    </h4>
                    <div className="space-y-2">
                      {allPlayers
                        .sort((a, b) => (b.totalCookiesEarned || 0) - (a.totalCookiesEarned || 0))
                        .slice(0, 10)
                        .map((player, idx) => (
                          <div key={player.playerId} className="flex justify-between items-center text-sm bg-black/30 rounded p-2">
                            <span className="text-gray-400" style={{ fontFamily: 'system-ui' }}>
                              #{idx + 1} {player.playerName || 'Unknown'}
                            </span>
                            <span className="text-orange-400 font-bold" style={{ fontFamily: 'monospace' }}>
                              {formatNumber(player.totalCookiesEarned || 0)}
                 </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
      {/* MODERATOR PANEL */}
      {isModerator && modPanelOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto p-4" onClick={() => setModPanelOpen(false)}>
          <div className="max-w-6xl mx-auto my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-xl border-2 border-blue-500 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-4xl font-black text-blue-400" style={{ fontFamily: 'system-ui' }}>
                  🛡️ MODERATOR PANEL
                </h2>
                <button onClick={() => setModPanelOpen(false)} className="text-gray-400 hover:text-white text-3xl">
                  ✕
                </button>
              </div>
              
              {/* Mod tabs */}
              <div className="flex gap-2 mb-6">
                {['players', 'actions', 'logs'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setModTab(tab)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all capitalize ${
                      modTab === tab ? 'bg-blue-600 text-white scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                    style={{ fontFamily: 'system-ui' }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              {/* Players Tab */}
              {modTab === 'players' && (
                <div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search players..."
                    className="w-full mb-4 bg-black/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    style={{ fontFamily: 'system-ui' }}
                  />
                  
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {filteredPlayers.map(player => (
                      <div key={player.playerId} className="bg-black/40 rounded-lg p-4 border border-blue-500/20">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-white" style={{ fontFamily: 'system-ui' }}>
                              {player.playerName || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-400" style={{ fontFamily: 'monospace' }}>
                              {player.playerId} • Level {player.level || 0}
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedPlayer(player.playerId === selectedPlayer ? null : player.playerId)}
                            className="text-blue-400 hover:text-blue-300 text-sm font-bold"
                          >
                            {selectedPlayer === player.playerId ? '▼' : '▶'} Moderate
                          </button>
                        </div>
                        
                        {selectedPlayer === player.playerId && (
                          <div className="mt-4 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => {
                                  const reason = prompt('Warning reason:');
                                  if (reason) modWarnPlayer(player.playerId, reason);
                                }}
                                className="bg-yellow-600 hover:bg-yellow-500 px-3 py-2 rounded-lg font-medium text-xs"
                                style={{ fontFamily: 'system-ui' }}
                              >
                                ⚠️ Warn Player
                              </button>
                              <button
                                onClick={() => {
                                  const duration = prompt('Mute duration (minutes):');
                                  if (duration && !isNaN(duration)) modMutePlayer(player.playerId, parseInt(duration));
                                }}
                                className="bg-orange-600 hover:bg-orange-500 px-3 py-2 rounded-lg font-medium text-xs"
                                style={{ fontFamily: 'system-ui' }}
                              >
                                🔇 Mute Player
                              </button>
                              <button
                                onClick={() => modResetPlayerProgress(player.playerId)}
                                className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded-lg font-medium text-xs col-span-2"
                                style={{ fontFamily: 'system-ui' }}
                              >
                                🔄 Reset Progress
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Actions Tab */}
              {modTab === 'actions' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-lg p-5 border border-blue-500/30">
                    <h4 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'system-ui' }}>
                      Quick Actions
                    </h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          loadAllPlayers();
                          createNotification('✓ Refreshed player list');
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-3 rounded-lg font-bold text-sm"
                        style={{ fontFamily: 'system-ui' }}
                      >
                        🔄 Refresh Player List
                      </button>
                      <button
                        onClick={() => {
                          updateLeaderboard();
                          createNotification('✓ Refreshed leaderboard');
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-3 rounded-lg font-bold text-sm"
                        style={{ fontFamily: 'system-ui' }}
                      >
                        🏆 Refresh Leaderboard
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-black/30 rounded-lg p-5 border border-blue-500/30">
                    <h4 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'system-ui' }}>
                      Statistics
                    </h4>
                    <div className="space-y-2 text-sm" style={{ fontFamily: 'monospace' }}>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Players:</span>
                        <span className="text-blue-400 font-bold">{allPlayers.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Actions Taken:</span>
                        <span className="text-blue-400 font-bold">{modLogs.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Logs Tab */}
              {modTab === 'logs' && (
                <div className="bg-black/30 rounded-lg p-5 border border-blue-500/30 max-h-[500px] overflow-y-auto">
                  <h4 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'system-ui' }}>
                    Moderation Logs
                  </h4>
                  {modLogs.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">No logs yet</div>
                  ) : (
                    <div className="space-y-2">
                      {modLogs.map(log => (
                        <div key={log.id} className="bg-black/30 rounded p-3 text-xs" style={{ fontFamily: 'monospace' }}>
                          <div className="flex justify-between mb-1">
                            <span className="text-blue-400 font-bold">{log.action}</span>
                            <span className="text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                          <div className="text-gray-300">{log.details}</div>
                          <div className="text-gray-500">by {log.moderator}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* STAFF DASHBOARD - Ultimate Analytics */}
      {isOwner && staffDashboardOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 overflow-y-auto p-4" onClick={() => setStaffDashboardOpen(false)}>
          <div className="max-w-7xl mx-auto my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl border-2 border-purple-500 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-4xl font-black text-purple-400" style={{ fontFamily: 'system-ui' }}>
                  📊 STAFF DASHBOARD
                </h2>
                <button onClick={() => setStaffDashboardOpen(false)} className="text-gray-400 hover:text-white text-3xl">
                  ✕
                </button>
              </div>
              
              {/* Dashboard tabs */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {['overview', 'analytics', 'insights', 'reports'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setStaffTab(tab)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all capitalize ${
                      staffTab === tab ? 'bg-purple-600 text-white scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                    style={{ fontFamily: 'system-ui' }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              {/* Overview */}
              {staffTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Players', value: allPlayers.length, icon: '👥', color: '#8b5cf6' },
                      { label: 'Active Players', value: allPlayers.filter(p => (p.totalClicks || 0) > 0).length, icon: '✅', color: '#10b981' },
                      { label: 'Total Cookies', value: formatNumber(allPlayers.reduce((sum, p) => sum + (p.totalCookiesEarned || 0), 0)), icon: '🍪', color: '#f59e0b' },
                      { label: 'Avg Level', value: allPlayers.length > 0 ? Math.floor(allPlayers.reduce((sum, p) => sum + (p.level || 0), 0) / allPlayers.length) : 0, icon: '⭐', color: '#3b82f6' },
                    ].map(stat => (
                      <div key={stat.label} className="bg-black/40 rounded-xl p-6 border border-gray-700">
                        <div className="text-5xl mb-3">{stat.icon}</div>
                        <div className="text-3xl font-black mb-1" style={{ color: stat.color, fontFamily: 'system-ui' }}>
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-black/30 rounded-lg p-5 border border-purple-500/30">
                      <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'system-ui' }}>
                        Top 5 by Level
                      </h3>
                      <div className="space-y-2">
                        {allPlayers
                          .sort((a, b) => (b.level || 0) - (a.level || 0))
                          .slice(0, 5)
                          .map((p, i) => (
                            <div key={p.playerId} className="flex justify-between items-center bg-black/30 rounded p-2">
                              <span className="text-gray-300 text-sm">{i + 1}. {p.playerName}</span>
                              <span className="text-purple-400 font-bold">Lvl {p.level || 0}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    <div className="bg-black/30 rounded-lg p-5 border border-purple-500/30">
                      <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'system-ui' }}>
                        Top 5 by Prestige
                      </h3>
                      <div className="space-y-2">
                        {allPlayers
                          .sort((a, b) => (b.prestige || 0) - (a.prestige || 0))
                          .slice(0, 5)
                          .map((p, i) => (
                            <div key={p.playerId} className="flex justify-between items-center bg-black/30 rounded p-2">
                              <span className="text-gray-300 text-sm">{i + 1}. {p.playerName}</span>
                              <span className="text-purple-400 font-bold">P{p.prestige || 0}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Analytics */}
              {staffTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="bg-black/30 rounded-lg p-5 border border-purple-500/30">
                    <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'system-ui' }}>
                      Economy Metrics
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm" style={{ fontFamily: 'monospace' }}>
                      {[
                        { label: 'Total Cookies in Circulation', value: formatNumber(allPlayers.reduce((s, p) => s + (p.cookies || 0), 0)) },
                        { label: 'Total Cookies Ever Earned', value: formatNumber(allPlayers.reduce((s, p) => s + (p.totalCookiesEarned || 0), 0)) },
                        { label: 'Global CPS', value: formatNumber(allPlayers.reduce((s, p) => s + (p.cookiesPerSecond || 0), 0)) + '/s' },
                        { label: 'Total Clicks', value: formatNumber(allPlayers.reduce((s, p) => s + (p.totalClicks || 0), 0)) },
                        { label: 'Total Prestiges', value: allPlayers.reduce((s, p) => s + (p.prestige || 0), 0) },
                        { label: 'Total Critical Fails', value: allPlayers.reduce((s, p) => s + (p.criticalFails || 0), 0) },
                      ].map(metric => (
                        <div key={metric.label} className="bg-black/30 rounded p-3">
                          <div className="text-gray-400 mb-1">{metric.label}</div>
                          <div className="text-xl font-bold text-purple-400">{metric.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-black/30 rounded-lg p-5 border border-purple-500/30">
                    <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'system-ui' }}>
                      Player Distribution
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-2">By Level</h4>
                        <div className="space-y-1 text-xs" style={{ fontFamily: 'monospace' }}>
                          <div className="flex justify-between">
                            <span>1-10:</span>
                            <span className="text-purple-400 font-bold">{allPlayers.filter(p => (p.level || 0) >= 1 && (p.level || 0) <= 10).length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>11-50:</span>
                            <span className="text-purple-400 font-bold">{allPlayers.filter(p => (p.level || 0) >= 11 && (p.level || 0) <= 50).length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>51-100:</span>
                            <span className="text-purple-400 font-bold">{allPlayers.filter(p => (p.level || 0) >= 51 && (p.level || 0) <= 100).length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>100+:</span>
                            <span className="text-purple-400 font-bold">{allPlayers.filter(p => (p.level || 0) > 100).length}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-2">By Prestige</h4>
                        <div className="space-y-1 text-xs" style={{ fontFamily: 'monospace' }}>
                          <div className="flex justify-between">
                            <span>No Prestige:</span>
                            <span className="text-purple-400 font-bold">{allPlayers.filter(p => (p.prestige || 0) === 0).length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>1-5:</span>
                            <span className="text-purple-400 font-bold">{allPlayers.filter(p => (p.prestige || 0) >= 1 && (p.prestige || 0) <= 5).length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>6-20:</span>
                            <span className="text-purple-400 font-bold">{allPlayers.filter(p => (p.prestige || 0) >= 6 && (p.prestige || 0) <= 20).length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>20+:</span>
                            <span className="text-purple-400 font-bold">{allPlayers.filter(p => (p.prestige || 0) > 20).length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="fixed bottom-4 right-4 text-xs text-gray-600 font-mono">
        Created by Z3N0 • Ultimate Edition V2.0
      </div>
      
      <style jsx>{`
        @keyframes floatUp {
          to {
            transform: translateY(-100px);
            opacity: 0;
          }
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<UltimateCookieEmpire />);
