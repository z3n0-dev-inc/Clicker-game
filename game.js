const { useState, useEffect, useRef, useCallback, useMemo } = React;

// API Configuration
const API_URL = 'https://clicker-game-production.up.railway.app/api';
const OWNER_CODE = 'EMPIRE2025';
const MODERATOR_CODE = 'MOD2025';

// COSMETICS
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
    { id: 'nuclear', name: 'Nuclear Cookie', emoji: '☢️', rarity: 'owner', glow: '#00ff00' },
    { id: 'blackhole', name: 'Black Hole Cookie', emoji: '⚫', rarity: 'owner', glow: '#9400d3' },
    { id: 'quantum', name: 'Quantum Cookie', emoji: '🌀', rarity: 'owner', glow: '#00ffff' },
    { id: 'solar', name: 'Solar Cookie', emoji: '☀️', rarity: 'owner', glow: '#ffa500' },
    { id: 'void_emperor', name: 'Void Emperor', emoji: '👁️', rarity: 'owner', glow: '#8b00ff' },
    { id: 'magma', name: 'Magma Core', emoji: '🌋', rarity: 'owner', glow: '#ff4500' },
    { id: 'celestial', name: 'Celestial Cookie', emoji: '✨', rarity: 'owner', glow: '#ffffff' },
    { id: 'time_lord', name: 'Time Lord Cookie', emoji: '⏰', rarity: 'owner', glow: '#4169e1' },
    { id: 'ice_king', name: 'Ice King Cookie', emoji: '🧊', rarity: 'owner', glow: '#00bfff' },
    { id: 'thunder_god', name: 'Thunder God', emoji: '⚡', rarity: 'owner', glow: '#ffff00' },
    { id: 'infinity', name: 'Infinity Cookie', emoji: '♾️', rarity: 'owner', glow: '#ff1493' },
    { id: 'z3n0_ultimate', name: 'Z3N0 Ultimate', emoji: '👑', rarity: 'creator', glow: '#ffd700' },
  ],
  themes: [
    { id: 'command_center', name: 'Command Center', bg: '#0a0a0a', accent: '#ffd700', secondary: '#ffaa00', rarity: 'owner' },
    { id: 'matrix_owner', name: 'Owner Matrix', bg: '#001a00', accent: '#00ff41', secondary: '#39ff14', rarity: 'owner' },
    { id: 'cyber_authority', name: 'Cyber Authority', bg: '#0a0015', accent: '#ff00ff', secondary: '#00ffff', rarity: 'owner' },
    { id: 'royal_command', name: 'Royal Command', bg: '#1a0a00', accent: '#ffd700', secondary: '#ffdf00', rarity: 'owner' },
    { id: 'void_throne', name: 'Void Throne', bg: '#000000', accent: '#9400d3', secondary: '#8b00ff', rarity: 'owner' },
    { id: 'z3n0_divine', name: 'Z3N0 Divine', bg: '#000510', accent: '#ffd700', secondary: '#8b5cf6', rarity: 'creator' },
  ],
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
  { id: 'classic', name: 'Classic Mode', desc: 'Traditional cookie clicking', icon: '🍪', multiplier: 1, unlocked: true },
  { id: 'speed', name: 'Speed Mode', desc: '2x click speed, 0.5x rewards', icon: '⚡', multiplier: 0.5, unlockRequirement: { level: 10 }, unlocked: false },
  { id: 'hardcore', name: 'Hardcore Mode', desc: '3x rewards, higher fail chance', icon: '💀', multiplier: 3, critFailMultiplier: 2, unlockRequirement: { level: 25 }, unlocked: false },
  { id: 'zen', name: 'Zen Mode', desc: 'No fail chance, 0.8x rewards', icon: '🧘', multiplier: 0.8, noFail: true, unlockRequirement: { prestige: 1 }, unlocked: false },
  { id: 'chaos', name: 'Chaos Mode', desc: 'Random multipliers (0.5x - 5x)', icon: '🌀', chaosMode: true, unlockRequirement: { prestige: 5 }, unlocked: false },
  { id: 'godmode', name: 'God Mode', desc: '10x everything (Owner only)', icon: '👑', multiplier: 10, ownerOnly: true, unlocked: false }
];

const DEFAULT_UPGRADES = [
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
];

function UltimateCookieEmpire() {
  const [cookies, setCookies] = useState(0);
  const [totalCookiesEarned, setTotalCookiesEarned] = useState(0);
  const [cookiesPerClick, setCookiesPerClick] = useState(1);
  const [cookiesPerSecond, setCookiesPerSecond] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [prestige, setPrestige] = useState(0);
  const [prestigeTokens, setPrestigeTokens] = useState(0);

  const [isOwner, setIsOwner] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isZ3N0, setIsZ3N0] = useState(false);

  const [ownerPanelOpen, setOwnerPanelOpen] = useState(false);
  const [modPanelOpen, setModPanelOpen] = useState(false);
  const [ownerTab, setOwnerTab] = useState('quick');
  const [modTab, setModTab] = useState('players');

  const [criticalFailChance, setCriticalFailChance] = useState(0);
  const [criticalFails, setCriticalFails] = useState(0);

  const [currentGameMode, setCurrentGameMode] = useState('classic');
  const [gameModes, setGameModes] = useState(GAME_MODES);
  const [chaosMultiplier, setChaosMultiplier] = useState(1);

  const [playerName, setPlayerName] = useState(() => localStorage.getItem('cookieEmpirePlayerName') || '');
  const [showNameInput, setShowNameInput] = useState(() => !localStorage.getItem('cookieEmpirePlayerName'));
  const [playerId] = useState(() => {
    const stored = localStorage.getItem('cookieEmpirePlayerId');
    if (stored) return stored;
    const newId = 'player_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cookieEmpirePlayerId', newId);
    return newId;
  });

  const [ownedCosmetics, setOwnedCosmetics] = useState({ cookies: ['default'], themes: ['default'], effects: ['none'], titles: ['none'], badges: [] });
  const [equippedCosmetics, setEquippedCosmetics] = useState({ cookie: 'default', theme: 'default', effect: 'none', title: 'none', badge: null });
  const [cosmeticGifts, setCosmeticGifts] = useState([]);

  const [showCosmeticsMenu, setShowCosmeticsMenu] = useState(false);
  const [showCosmeticsShop, setShowCosmeticsShop] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showGameModes, setShowGameModes] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('click');

  const [saveStatus, setSaveStatus] = useState('saved');

  const [particles, setParticles] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [clickStreak, setClickStreak] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const clickTimeWindowRef = useRef([]);

  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modLogs, setModLogs] = useState([]);
  const [playersLoading, setPlayersLoading] = useState(false);

  const [stats, setStats] = useState({ playTime: 0, fastestClick: Infinity, longestStreak: 0, totalPrestige: 0, cosmeticsUnlocked: 1, achievementsUnlocked: 0 });

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

  const [upgrades, setUpgrades] = useState(DEFAULT_UPGRADES);

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

  // ─────────────────────────────────────────
  // API
  // ─────────────────────────────────────────
  const api = useMemo(() => ({
    saveProgress: async (data) => {
      try {
        const res = await fetch(`${API_URL}/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId, playerName, ...data })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e) { return { success: false, error: e.message }; }
    },
    loadProgress: async () => {
      try {
        const res = await fetch(`${API_URL}/load/${playerId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e) { return { success: false, error: e.message }; }
    },
    getLeaderboard: async () => {
      try {
        const res = await fetch(`${API_URL}/leaderboard`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return { success: true, data: data.data || data || [] };
      } catch (e) { return { success: false, data: [] }; }
    },
    getAllPlayers: async () => {
      try {
        const res = await fetch(`${API_URL}/owner/players`, { headers: { 'X-Owner-Code': OWNER_CODE } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return { success: true, data: data.data || data || [] };
      } catch (e) { return { success: false, data: [] }; }
    },
    updatePlayer: async (targetId, updates) => {
      try {
        const res = await fetch(`${API_URL}/owner/update-player`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ownerCode: OWNER_CODE, playerId: targetId, updates })
        });
        return await res.json();
      } catch (e) { return { success: false, error: e.message }; }
    },
    deletePlayer: async (targetId) => {
      try {
        const res = await fetch(`${API_URL}/owner/delete-player`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ownerCode: OWNER_CODE, playerId: targetId })
        });
        return await res.json();
      } catch (e) { return { success: false, error: e.message }; }
    },
    banPlayer: async (targetId, reason, duration) => {
      try {
        const res = await fetch(`${API_URL}/owner/ban-player`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ownerCode: OWNER_CODE, playerId: targetId, reason, duration })
        });
        return await res.json();
      } catch (e) { return { success: false, error: e.message }; }
    },
    massGiveResources: async (cookieAmt, tokenAmt) => {
      try {
        const res = await fetch(`${API_URL}/owner/mass-give-resources`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ownerCode: OWNER_CODE, cookies: cookieAmt, prestigeTokens: tokenAmt })
        });
        return await res.json();
      } catch (e) { return { success: false, error: e.message }; }
    },
  }), [playerId, playerName]);

  // ─────────────────────────────────────────
  // LOAD
  // ─────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const result = await api.loadProgress();
      if (result.success && result.data) {
        const d = result.data;
        if (d.cookies !== undefined) setCookies(d.cookies);
        if (d.totalCookiesEarned !== undefined) setTotalCookiesEarned(d.totalCookiesEarned);
        if (d.cookiesPerClick !== undefined) setCookiesPerClick(d.cookiesPerClick);
        if (d.cookiesPerSecond !== undefined) setCookiesPerSecond(d.cookiesPerSecond);
        if (d.totalClicks !== undefined) setTotalClicks(d.totalClicks);
        if (d.level !== undefined) setLevel(d.level);
        if (d.xp !== undefined) setXp(d.xp);
        if (d.prestige !== undefined) setPrestige(d.prestige);
        if (d.prestigeTokens !== undefined) setPrestigeTokens(d.prestigeTokens);
        if (d.criticalFails !== undefined) setCriticalFails(d.criticalFails);
        if (d.playerName) { setPlayerName(d.playerName); localStorage.setItem('cookieEmpirePlayerName', d.playerName); setShowNameInput(false); }
        if (d.upgrades && d.upgrades.length > 0) setUpgrades(d.upgrades);
        if (d.prestigeUpgrades && d.prestigeUpgrades.length > 0) setPrestigeUpgrades(d.prestigeUpgrades);
        if (d.achievements && d.achievements.length > 0) setAchievements(d.achievements);
        if (d.ownedCosmetics) setOwnedCosmetics(d.ownedCosmetics);
        if (d.equippedCosmetics) setEquippedCosmetics(d.equippedCosmetics);
        if (d.cosmeticGifts) setCosmeticGifts(d.cosmeticGifts);
        if (d.currentGameMode) setCurrentGameMode(d.currentGameMode);
        if (d.gameModes && d.gameModes.length > 0) setGameModes(d.gameModes);
        if (d.stats) setStats(d.stats);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─────────────────────────────────────────
  // AUTO-SAVE
  // ─────────────────────────────────────────
  useEffect(() => {
    if (!playerName) return;
    const interval = setInterval(async () => {
      setSaveStatus('saving');
      const result = await api.saveProgress({
        cookies, totalCookiesEarned, cookiesPerClick, cookiesPerSecond,
        totalClicks, level, xp, prestige, prestigeTokens,
        upgrades, prestigeUpgrades, achievements,
        ownedCosmetics, equippedCosmetics, cosmeticGifts,
        currentGameMode, gameModes, stats, criticalFails
      });
      setSaveStatus(result.success ? 'saved' : 'error');
    }, 10000);
    return () => clearInterval(interval);
  }, [playerName, cookies, totalCookiesEarned, cookiesPerClick, cookiesPerSecond, totalClicks, level, xp, prestige, prestigeTokens, upgrades, prestigeUpgrades, achievements, ownedCosmetics, equippedCosmetics, cosmeticGifts, currentGameMode, gameModes, stats, criticalFails, api]);

  // ─────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────
  const formatNumber = useCallback((num) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    if (num >= 1e18) return (num / 1e18).toFixed(2) + 'Qi';
    if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Q';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toLocaleString();
  }, []);

  const getLevelRequirement = useCallback((lvl) => Math.floor(1000 * Math.pow(1.8, lvl - 1)), []);

  const getPrestigeMultiplier = useCallback(() => {
    let mult = 1;
    prestigeUpgrades.forEach(pu => {
      if (pu.owned) {
        if (pu.effect === 'production_15') mult *= 1.15;
        if (pu.effect === 'production_40') mult *= 1.4;
        if (pu.effect === 'production_75') mult *= 1.75;
        if (pu.effect === 'production_150') mult *= 2.5;
        if (pu.effect === 'production_300') mult *= 4;
      }
    });
    upgrades.forEach(u => { if (u.type === 'efficiency' && u.owned > 0) mult *= (1 + u.bonus); });
    return mult;
  }, [prestigeUpgrades, upgrades]);

  const getGameModeMultiplier = useCallback(() => {
    const mode = gameModes.find(m => m.id === currentGameMode);
    if (!mode) return 1;
    if (mode.chaosMode) return chaosMultiplier;
    return mode.multiplier || 1;
  }, [currentGameMode, gameModes, chaosMultiplier]);

  const getRarityColor = useCallback((rarity) => {
    const map = { common: '#9ca3af', rare: '#60a5fa', epic: '#a78bfa', legendary: '#fbbf24', mythic: '#f472b6', owner: '#f97316', staff: '#3b82f6', creator: '#8b5cf6' };
    return map[rarity] || '#ffffff';
  }, []);

  const createParticle = useCallback((x, y, text, color = '#fbbf24') => {
    const id = Date.now() + Math.random();
    setParticles(p => [...p.slice(-20), { id, x, y, text, color }]);
    setTimeout(() => setParticles(p => p.filter(pt => pt.id !== id)), 1000);
  }, []);

  const createNotification = useCallback((message) => {
    const id = Date.now() + Math.random();
    setNotifications(n => [...n.slice(-5), { id, message }]);
    setTimeout(() => setNotifications(n => n.filter(nt => nt.id !== id)), 4000);
  }, []);

  const addModLog = useCallback((action, details) => {
    setModLogs(logs => [{ id: Date.now(), timestamp: new Date().toISOString(), moderator: playerName, action, details }, ...logs].slice(0, 100));
  }, [playerName]);

  // ─────────────────────────────────────────
  // CRIT FAIL CHANCE
  // ─────────────────────────────────────────
  useEffect(() => {
    const mode = gameModes.find(m => m.id === currentGameMode);
    if (mode?.noFail) { setCriticalFailChance(0); return; }
    let chance = Math.min(0.2, level * 0.0015);
    if (mode?.critFailMultiplier) chance *= mode.critFailMultiplier;
    const hasLuckMaster = prestigeUpgrades.find(pu => pu.id === 'p8' && pu.owned);
    if (hasLuckMaster) chance *= 0.5;
    upgrades.forEach(u => { if (u.type === 'luck' && u.owned > 0) chance *= (1 - u.reduction); });
    setCriticalFailChance(Math.max(0, chance));
  }, [level, prestigeUpgrades, upgrades, currentGameMode, gameModes]);

  // ─────────────────────────────────────────
  // CHAOS MODE
  // ─────────────────────────────────────────
  useEffect(() => {
    const mode = gameModes.find(m => m.id === currentGameMode);
    if (mode?.chaosMode) {
      const interval = setInterval(() => setChaosMultiplier(0.5 + Math.random() * 4.5), 5000);
      return () => clearInterval(interval);
    }
  }, [currentGameMode, gameModes]);

  // ─────────────────────────────────────────
  // AUTO-CPS
  // ─────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (cookiesPerSecond > 0) {
        const amount = (cookiesPerSecond / 10) * getPrestigeMultiplier() * getGameModeMultiplier();
        setCookies(c => c + amount);
        setTotalCookiesEarned(t => t + amount);
        const xpBoost = prestigeUpgrades.find(pu => pu.id === 'p9' && pu.owned);
        setXp(x => x + (amount / 30) * (xpBoost ? 1.5 : 1));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [cookiesPerSecond, getPrestigeMultiplier, getGameModeMultiplier, prestigeUpgrades]);

  // ─────────────────────────────────────────
  // LEVEL UP
  // ─────────────────────────────────────────
  useEffect(() => {
    const required = getLevelRequirement(level);
    if (xp >= required) {
      setXp(x => x - required);
      setLevel(lv => {
        const newLv = lv + 1;
        createNotification(`🎉 Level ${newLv}!`);
        const bonus = lv * 100;
        setCookies(c => c + bonus);
        setGameModes(modes => modes.map(mode => {
          if (mode.unlockRequirement?.level && newLv >= mode.unlockRequirement.level && !mode.unlocked) {
            createNotification(`🎮 ${mode.name} unlocked!`);
            return { ...mode, unlocked: true };
          }
          return mode;
        }));
        return newLv;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xp]);

  // ─────────────────────────────────────────
  // ACHIEVEMENTS
  // ─────────────────────────────────────────
  const checkAchievements = useCallback(() => {
    const cosmeticsCount = Object.values(ownedCosmetics).reduce((s, a) => s + a.length, 0);
    const checks = [
      totalClicks > 0, totalCookiesEarned >= 5000, totalCookiesEarned >= 500000,
      upgrades.some(u => u.owned > 0), level >= 15, level >= 35, level >= 75, level >= 150,
      cookiesPerSecond >= 5000, cookiesPerSecond >= 500000, prestige > 0, prestige >= 15,
      false, totalCookiesEarned >= 50000000, totalCookiesEarned >= 5000000000,
      criticalFails >= 25, totalClicks >= 10000, totalClicks >= 100000,
      cosmeticsCount >= 10, cosmeticsCount >= 25,
      gameModes.filter(m => m.unlocked && !m.ownerOnly).length >= gameModes.filter(m => !m.ownerOnly).length - 1,
    ];
    setAchievements(prev => {
      const next = [...prev];
      let changed = false;
      checks.forEach((cond, i) => {
        if (next[i] && !next[i].unlocked && cond) {
          next[i] = { ...next[i], unlocked: true };
          changed = true;
          const reward = next[i].reward;
          setCookies(c => c + reward);
          createNotification(`🏆 ${next[i].name}! +${formatNumber(reward)}`);
          setStats(s => ({ ...s, achievementsUnlocked: s.achievementsUnlocked + 1 }));
        }
      });
      return changed ? next : prev;
    });
  }, [totalCookiesEarned, totalClicks, level, cookiesPerSecond, upgrades, prestige, criticalFails, ownedCosmetics, gameModes, formatNumber, createNotification]);

  useEffect(() => { checkAchievements(); }, [checkAchievements]);

  // Speed demon
  useEffect(() => {
    const now = Date.now();
    clickTimeWindowRef.current = clickTimeWindowRef.current.filter(t => now - t < 10000);
    if (clickTimeWindowRef.current.length >= 150) {
      setAchievements(prev => {
        const idx = prev.findIndex(a => a.id === 'speed_demon');
        if (idx >= 0 && !prev[idx].unlocked) {
          const next = [...prev];
          next[idx] = { ...next[idx], unlocked: true };
          setCookies(c => c + 10000);
          createNotification('🏆 Speed Demon! +10,000');
          return next;
        }
        return prev;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalClicks]);

  // ─────────────────────────────────────────
  // CLICK HANDLER
  // ─────────────────────────────────────────
  const handleClick = useCallback((e) => {
    const clickTime = Date.now();
    const timeSinceLastClick = clickTime - lastClickTime;
    if (timeSinceLastClick > 0 && timeSinceLastClick < stats.fastestClick) {
      setStats(s => ({ ...s, fastestClick: timeSinceLastClick }));
    }
    if (Math.random() < criticalFailChance) {
      const lossAmount = Math.floor(cookies * 0.15);
      setCookies(c => Math.max(0, c - lossAmount));
      setCriticalFails(cf => cf + 1);
      createNotification(`💀 Critical fail! -${formatNumber(lossAmount)}`);
      createParticle(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 'FAIL!', '#ef4444');
      return;
    }
    const earnedAmount = cookiesPerClick * getPrestigeMultiplier() * getGameModeMultiplier();
    setCookies(c => c + earnedAmount);
    setTotalCookiesEarned(t => t + earnedAmount);
    const xpBoost = prestigeUpgrades.find(pu => pu.id === 'p9' && pu.owned);
    setXp(x => x + (earnedAmount / 15) * (xpBoost ? 1.5 : 1));
    setTotalClicks(tc => tc + 1);
    clickTimeWindowRef.current.push(Date.now());
    const now = Date.now();
    if (now - lastClickTime < 500) {
      setClickStreak(s => {
        const ns = s + 1;
        if (ns > stats.longestStreak) setStats(st => ({ ...st, longestStreak: ns }));
        if (ns > 30 && ns % 30 === 0) {
          const bonus = earnedAmount * 5;
          setCookies(c => c + bonus);
          setTotalCookiesEarned(t => t + bonus);
          createParticle(e.clientX || window.innerWidth / 2, (e.clientY || window.innerHeight / 2) + 40, `COMBO x${ns}!`, '#f97316');
        }
        return ns;
      });
    } else {
      setClickStreak(1);
    }
    setLastClickTime(now);
    createParticle(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, `+${formatNumber(earnedAmount)}`);
  }, [criticalFailChance, cookies, cookiesPerClick, getPrestigeMultiplier, getGameModeMultiplier, lastClickTime, formatNumber, prestigeUpgrades, stats, createNotification, createParticle]);

  // ─────────────────────────────────────────
  // BUY UPGRADE
  // ─────────────────────────────────────────
  const buyUpgrade = useCallback((upgrade) => {
    const costReduction = prestigeUpgrades.find(pu => pu.id === 'p10' && pu.owned);
    const finalCost = costReduction ? Math.floor(upgrade.cost * 0.8) : upgrade.cost;
    if (cookies < finalCost) return;
    if (upgrade.maxOwned && upgrade.owned >= upgrade.maxOwned) { createNotification('Already maxed!'); return; }
    setCookies(c => c - finalCost);
    setUpgrades(prev => prev.map(u => {
      if (u.id !== upgrade.id) return u;
      if (u.type === 'click') setCookiesPerClick(cpc => cpc + u.bonus);
      else if (u.type === 'click_mult') setCookiesPerClick(cpc => cpc * u.multiplier);
      else if (u.type === 'auto') setCookiesPerSecond(cps => cps + u.cps);
      return { ...u, owned: u.owned + 1, cost: Math.floor(u.cost * 1.3) };
    }));
    createNotification(`✓ ${upgrade.name}`);
  }, [cookies, createNotification, prestigeUpgrades]);

  const buyPrestigeUpgrade = useCallback((upgrade) => {
    if (prestigeTokens < upgrade.cost || upgrade.owned) return;
    setPrestigeTokens(pt => pt - upgrade.cost);
    setPrestigeUpgrades(prev => prev.map(pu => {
      if (pu.id !== upgrade.id) return pu;
      if (pu.effect === 'click_start_100') setCookiesPerClick(c => c + 100);
      if (pu.effect === 'cps_start_50') setCookiesPerSecond(cps => cps + 50);
      return { ...pu, owned: true };
    }));
    createNotification(`✓ ${upgrade.name}`);
  }, [prestigeTokens, createNotification]);

  const doPrestige = useCallback(() => {
    if (level < 30) { createNotification('⚠️ Reach level 30 to prestige'); return; }
    const tokensEarned = Math.floor(level / 8);
    if (!window.confirm(`Prestige and earn ${tokensEarned} tokens? This resets all progress!`)) return;
    let startClick = 1, startCPS = 0;
    prestigeUpgrades.forEach(pu => {
      if (pu.owned && pu.effect === 'click_start_100') startClick += 100;
      if (pu.owned && pu.effect === 'cps_start_50') startCPS += 50;
    });
    setCookies(0); setTotalCookiesEarned(0); setCookiesPerClick(startClick);
    setCookiesPerSecond(startCPS); setTotalClicks(0); setLevel(1); setXp(0);
    setPrestige(p => p + 1); setPrestigeTokens(pt => pt + tokensEarned); setCriticalFails(0);
    setStats(s => ({ ...s, totalPrestige: s.totalPrestige + 1 }));
    setGameModes(modes => modes.map(mode => {
      if (mode.unlockRequirement?.prestige && prestige + 1 >= mode.unlockRequirement.prestige && !mode.unlocked) {
        createNotification(`🎮 ${mode.name} unlocked!`);
        return { ...mode, unlocked: true };
      }
      return mode;
    }));
    setUpgrades(DEFAULT_UPGRADES.map(u => ({ ...u })));
    createNotification(`🌟 PRESTIGE ${prestige + 1}! +${tokensEarned} tokens`);
  }, [level, prestige, prestigeUpgrades, createNotification]);

  // ─────────────────────────────────────────
  // COSMETICS
  // ─────────────────────────────────────────
  const buyCosmetic = useCallback((type, cosmetic) => {
    const key = type + 's';
    if (cookies < cosmetic.cost || ownedCosmetics[key]?.includes(cosmetic.id)) return;
    setCookies(c => c - cosmetic.cost);
    setOwnedCosmetics(oc => ({ ...oc, [key]: [...(oc[key] || []), cosmetic.id] }));
    setStats(s => ({ ...s, cosmeticsUnlocked: s.cosmeticsUnlocked + 1 }));
    createNotification(`✓ ${cosmetic.name}`);
  }, [cookies, ownedCosmetics, createNotification]);

  const equipCosmetic = useCallback((type, id) => {
    setEquippedCosmetics(ec => ({ ...ec, [type]: id }));
    createNotification(`✓ Equipped!`);
  }, [createNotification]);

  // ─────────────────────────────────────────
  // LEADERBOARD
  // ─────────────────────────────────────────
  const updateLeaderboard = useCallback(async () => {
    setLeaderboardLoading(true);
    const result = await api.getLeaderboard();
    if (result.success) setLeaderboard(Array.isArray(result.data) ? result.data : []);
    setLeaderboardLoading(false);
  }, [api]);

  useEffect(() => { if (showLeaderboard) updateLeaderboard(); }, [showLeaderboard, updateLeaderboard]);

  // ─────────────────────────────────────────
  // OWNER: LOAD PLAYERS
  // ─────────────────────────────────────────
  const loadAllPlayers = useCallback(async () => {
    setPlayersLoading(true);
    const result = await api.getAllPlayers();
    if (result.success) setAllPlayers(Array.isArray(result.data) ? result.data : []);
    setPlayersLoading(false);
  }, [api]);

  useEffect(() => {
    if ((isOwner || isModerator) && (ownerPanelOpen || modPanelOpen)) loadAllPlayers();
  }, [isOwner, isModerator, ownerPanelOpen, modPanelOpen, loadAllPlayers]);

  // ─────────────────────────────────────────
  // OWNER COMMANDS
  // ─────────────────────────────────────────
  const ownerDeletePlayer = useCallback(async (targetId, name) => {
    if (!window.confirm(`DELETE ${name}? This CANNOT be undone!`)) return;
    const result = await api.deletePlayer(targetId);
    if (result.success) {
      createNotification(`✓ ${name} deleted`);
      addModLog('DELETE', `Deleted player ${name} (${targetId})`);
      setAllPlayers(p => p.filter(pl => pl.playerId !== targetId));
      setSelectedPlayer(null);
    } else createNotification(`✗ Failed: ${result.error}`);
  }, [api, createNotification, addModLog]);

  const ownerBanPlayer = useCallback(async (targetId, name) => {
    const reason = window.prompt(`Ban reason for ${name}:`);
    if (!reason) return;
    const durInput = window.prompt('Duration in minutes? (Leave blank for permanent)');
    const duration = durInput ? parseInt(durInput) : undefined;
    const result = await api.banPlayer(targetId, reason, duration);
    if (result.success) {
      createNotification(`✓ ${name} banned`);
      addModLog('BAN', `Banned ${name}: ${reason}`);
      loadAllPlayers();
    } else createNotification(`✗ Failed`);
  }, [api, createNotification, addModLog, loadAllPlayers]);

  const ownerKickPlayer = useCallback(async (targetId, name) => {
    const result = await api.updatePlayer(targetId, { kicked: true, kickedAt: Date.now() });
    if (result.success) {
      createNotification(`✓ ${name} kicked`);
      addModLog('KICK', `Kicked ${name}`);
    } else createNotification(`✗ Failed`);
  }, [api, createNotification, addModLog]);

  const ownerGiveCoins = useCallback(async (player) => {
    const amount = window.prompt(`Give how many cookies to ${player.playerName}?`);
    if (!amount || isNaN(amount)) return;
    const result = await api.updatePlayer(player.playerId, { cookies: (player.cookies || 0) + parseInt(amount) });
    if (result.success) {
      createNotification(`✓ +${formatNumber(parseInt(amount))} to ${player.playerName}`);
      addModLog('GIVE_COOKIES', `Gave ${formatNumber(parseInt(amount))} cookies to ${player.playerName}`);
      loadAllPlayers();
    } else createNotification(`✗ Failed`);
  }, [api, createNotification, addModLog, loadAllPlayers, formatNumber]);

  const ownerSetLevel = useCallback(async (player) => {
    const val = window.prompt(`Set level for ${player.playerName}? (current: ${player.level || 0})`);
    if (!val || isNaN(val)) return;
    const result = await api.updatePlayer(player.playerId, { level: parseInt(val) });
    if (result.success) { createNotification(`✓ Level set to ${val}`); addModLog('SET_LEVEL', `Set level to ${val} for ${player.playerName}`); loadAllPlayers(); }
    else createNotification(`✗ Failed`);
  }, [api, createNotification, addModLog, loadAllPlayers]);

  const ownerSetCPS = useCallback(async (player) => {
    const val = window.prompt(`Set CPS for ${player.playerName}? (current: ${formatNumber(player.cookiesPerSecond || 0)})`);
    if (!val || isNaN(val)) return;
    const result = await api.updatePlayer(player.playerId, { cookiesPerSecond: parseInt(val) });
    if (result.success) { createNotification(`✓ CPS set`); addModLog('SET_CPS', `Set CPS to ${val} for ${player.playerName}`); loadAllPlayers(); }
    else createNotification(`✗ Failed`);
  }, [api, createNotification, addModLog, loadAllPlayers, formatNumber]);

  const ownerSetCPC = useCallback(async (player) => {
    const val = window.prompt(`Set CPC for ${player.playerName}? (current: ${formatNumber(player.cookiesPerClick || 1)})`);
    if (!val || isNaN(val)) return;
    const result = await api.updatePlayer(player.playerId, { cookiesPerClick: parseInt(val) });
    if (result.success) { createNotification(`✓ CPC set`); addModLog('SET_CPC', `Set CPC to ${val} for ${player.playerName}`); loadAllPlayers(); }
    else createNotification(`✗ Failed`);
  }, [api, createNotification, addModLog, loadAllPlayers, formatNumber]);

  const ownerGiveTokens = useCallback(async (player) => {
    const val = window.prompt(`Give tokens to ${player.playerName}? (current: ${player.prestigeTokens || 0})`);
    if (!val || isNaN(val)) return;
    const result = await api.updatePlayer(player.playerId, { prestigeTokens: (player.prestigeTokens || 0) + parseInt(val) });
    if (result.success) { createNotification(`✓ +${val} tokens`); addModLog('GIVE_TOKENS', `Gave ${val} tokens to ${player.playerName}`); loadAllPlayers(); }
    else createNotification(`✗ Failed`);
  }, [api, createNotification, addModLog, loadAllPlayers]);

  const ownerGiveAllCosmetics = useCallback(async (player) => {
    if (!window.confirm(`Give ALL cosmetics to ${player.playerName}?`)) return;
    const allCosmetics = {
      cookies: COSMETICS.cookies.map(c => c.id),
      themes: COSMETICS.themes.map(t => t.id),
      effects: COSMETICS.effects.map(e => e.id),
      titles: COSMETICS.titles.map(t => t.id),
      badges: COSMETICS.badges.map(b => b.id)
    };
    const result = await api.updatePlayer(player.playerId, { ownedCosmetics: allCosmetics });
    if (result.success) { createNotification(`✓ All cosmetics given!`); addModLog('GIVE_ALL_COSMETICS', `Gave all cosmetics to ${player.playerName}`); loadAllPlayers(); }
    else createNotification(`✗ Failed`);
  }, [api, createNotification, addModLog, loadAllPlayers]);

  const ownerGiveSpecificCosmetic = useCallback(async (player, type) => {
    const items = (type === 'cookie' ? COSMETICS.cookies : type === 'theme' ? COSMETICS.themes : type === 'effect' ? COSMETICS.effects : type === 'title' ? COSMETICS.titles : COSMETICS.badges);
    const list = items.map((i, idx) => `${idx + 1}. ${i.name} (${i.id})`).join('\n');
    const input = window.prompt(`Give ${type} to ${player.playerName}:\n\n${list}\n\nEnter ID:`);
    if (!input) return;
    const item = items.find(i => i.id === input);
    if (!item) { createNotification(`✗ Invalid ID`); return; }
    const key = type + 's';
    const current = player.ownedCosmetics?.[key] || [];
    if (current.includes(item.id)) { createNotification(`Already owns ${item.name}`); return; }
    const result = await api.updatePlayer(player.playerId, { ownedCosmetics: { ...player.ownedCosmetics, [key]: [...current, item.id] } });
    if (result.success) { createNotification(`✓ Gave ${item.name}`); addModLog('GIVE_COSMETIC', `Gave ${item.name} to ${player.playerName}`); loadAllPlayers(); }
    else createNotification(`✗ Failed`);
  }, [api, createNotification, addModLog, loadAllPlayers]);

  const ownerMaxPlayer = useCallback(async (player) => {
    if (!window.confirm(`MAX OUT ${player.playerName}? This sets everything to godly levels!`)) return;
    const result = await api.updatePlayer(player.playerId, {
      cookies: 9007199254740991,
      cookiesPerClick: 999999999,
      cookiesPerSecond: 999999999,
      level: 999,
      prestige: 100,
      prestigeTokens: 99999,
      totalCookiesEarned: 9007199254740991,
      ownedCosmetics: {
        cookies: COSMETICS.cookies.map(c => c.id),
        themes: COSMETICS.themes.map(t => t.id),
        effects: COSMETICS.effects.map(e => e.id),
        titles: COSMETICS.titles.map(t => t.id),
        badges: COSMETICS.badges.map(b => b.id)
      }
    });
    if (result.success) { createNotification(`👑 ${player.playerName} MAXED!`); addModLog('MAX_PLAYER', `Maxed all stats for ${player.playerName}`); loadAllPlayers(); }
    else createNotification(`✗ Failed`);
  }, [api, createNotification, addModLog, loadAllPlayers]);

  const ownerResetEconomy = useCallback(async (player) => {
    if (!window.confirm(`Reset ${player.playerName}'s economy only?`)) return;
    const result = await api.updatePlayer(player.playerId, { cookies: 0, totalCookiesEarned: 0, cookiesPerClick: 1, cookiesPerSecond: 0 });
    if (result.success) { createNotification(`✓ Economy reset`); addModLog('RESET_ECONOMY', `Reset economy for ${player.playerName}`); loadAllPlayers(); }
    else createNotification(`✗ Failed`);
  }, [api, createNotification, addModLog, loadAllPlayers]);

  const ownerFullReset = useCallback(async (player) => {
    if (!window.confirm(`FULL RESET ${player.playerName}? Wipes EVERYTHING including upgrades!`)) return;
    const result = await api.updatePlayer(player.playerId, {
      cookies: 0, totalCookiesEarned: 0, cookiesPerClick: 1, cookiesPerSecond: 0,
      level: 1, prestige: 0, prestigeTokens: 0, totalClicks: 0, criticalFails: 0, xp: 0
    });
    if (result.success) { createNotification(`✓ Full reset done`); addModLog('FULL_RESET', `Full reset for ${player.playerName}`); loadAllPlayers(); }
    else createNotification(`✗ Failed`);
  }, [api, createNotification, addModLog, loadAllPlayers]);

  const ownerGodMode = useCallback(() => {
    setCookies(Number.MAX_SAFE_INTEGER);
    setLevel(999); setPrestige(999); setPrestigeTokens(99999);
    setCookiesPerSecond(999999999); setCookiesPerClick(999999999);
    setAchievements(ach => ach.map(a => ({ ...a, unlocked: true })));
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
  }, [createNotification, addModLog]);

  // ─────────────────────────────────────────
  // DERIVED
  // ─────────────────────────────────────────
  const getEquippedCookie = useCallback(() => {
    const all = [...COSMETICS.cookies, ...(isOwner ? OWNER_COSMETICS.cookies : []), ...(isModerator ? MOD_COSMETICS.cookies : [])];
    return all.find(c => c.id === equippedCosmetics.cookie) || COSMETICS.cookies[0];
  }, [equippedCosmetics.cookie, isOwner, isModerator]);

  const getEquippedTheme = useCallback(() => {
    const all = [...COSMETICS.themes, ...(isOwner ? OWNER_COSMETICS.themes : []), ...(isModerator ? MOD_COSMETICS.themes : [])];
    return all.find(t => t.id === equippedCosmetics.theme) || COSMETICS.themes[0];
  }, [equippedCosmetics.theme, isOwner, isModerator]);

  const getEquippedTitle = useCallback(() => COSMETICS.titles.find(t => t.id === equippedCosmetics.title) || COSMETICS.titles[0], [equippedCosmetics.title]);

  const equippedCookie = getEquippedCookie();
  const equippedTheme = getEquippedTheme();
  const equippedTitle = getEquippedTitle();
  const currentMode = gameModes.find(m => m.id === currentGameMode);
  const filteredPlayers = allPlayers.filter(p =>
    p.playerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.playerId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─────────────────────────────────────────
  // NAME INPUT SCREEN
  // ─────────────────────────────────────────
  if (showNameInput) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a', backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 60%)' }}>
        <div style={{ maxWidth: 480, width: '100%', padding: '0 16px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 72, marginBottom: 8 }}>🍪</div>
            <h1 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 8px 0', background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.04em', fontFamily: 'system-ui' }}>COOKIE EMPIRE</h1>
            <div style={{ color: '#06b6d4', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.2em', fontWeight: 600 }}>ULTIMATE EDITION V2.0</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 32 }}>
            <label style={{ display: 'block', color: '#9ca3af', marginBottom: 10, fontSize: 13, fontFamily: 'system-ui' }}>Choose your username</label>
            <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)} onKeyDown={e => e.key === 'Enter' && playerName && (localStorage.setItem('cookieEmpirePlayerName', playerName), setShowNameInput(false))}
              style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 16, fontFamily: 'system-ui', outline: 'none', boxSizing: 'border-box' }}
              placeholder="Enter username..." autoFocus maxLength={20} />
            <button onClick={() => { if (playerName) { localStorage.setItem('cookieEmpirePlayerName', playerName); setShowNameInput(false); } }} disabled={!playerName}
              style={{ width: '100%', marginTop: 16, background: playerName ? 'linear-gradient(135deg,#7c3aed,#06b6d4)' : '#1f2937', border: 'none', borderRadius: 10, padding: '14px', color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: 'system-ui', cursor: playerName ? 'pointer' : 'not-allowed' }}>
              Start Your Empire →
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: '#374151', fontFamily: 'monospace' }}>Created by Z3N0 • Ultimate Edition</div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // MAIN GAME UI
  // ─────────────────────────────────────────
  const accent = equippedTheme.accent;
  const secondary = equippedTheme.secondary;
  const bg = equippedTheme.bg;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, position: 'relative', overflowX: 'hidden' }}>
      {/* ANIMATIONS */}
      <style>{`
        @keyframes floatUp { to { transform: translateY(-100px); opacity: 0; } }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 20px ${accent}60; } 50% { box-shadow: 0 0 40px ${accent}99, 0 0 80px ${accent}40; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .btn-hover:hover { filter: brightness(1.15); transform: scale(1.03); }
        .card-hover:hover { border-color: ${accent}60 !important; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: ${accent}60; border-radius: 3px; }
      `}</style>

      {/* PARTICLES */}
      {particles.map(pt => (
        <div key={pt.id} style={{ position: 'fixed', left: pt.x, top: pt.y, color: pt.color, fontWeight: 800, fontSize: 18, pointerEvents: 'none', zIndex: 9999, animation: 'floatUp 1s ease-out forwards', textShadow: `0 0 10px ${pt.color}`, fontFamily: 'system-ui' }}>
          {pt.text}
        </div>
      ))}

      {/* NOTIFICATIONS */}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9000, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 280 }}>
        {notifications.map(n => (
          <div key={n.id} style={{ background: `${accent}ee`, border: `1px solid ${accent}`, borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#fff', animation: 'slideIn 0.3s ease-out', fontFamily: 'system-ui', backdropFilter: 'blur(10px)' }}>
            {n.message}
          </div>
        ))}
      </div>

      {/* TOP BAR */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)', borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: saveStatus === 'saved' ? '#10b981' : saveStatus === 'saving' ? '#f59e0b' : '#ef4444' }}>
              {saveStatus === 'saving' ? '💾 Saving…' : saveStatus === 'saved' ? '✓ Saved' : '✗ Error'}
            </span>
            {criticalFailChance > 0 && <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#ef4444' }}>💀 {(criticalFailChance * 100).toFixed(1)}% fail</span>}
            {currentMode?.id !== 'classic' && currentMode && (
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: accent, color: '#000', fontFamily: 'system-ui' }}>
                {currentMode.icon} {currentMode.name}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {!isOwner && !isModerator && (
              <button onClick={() => {
                const code = window.prompt('Staff code:');
                if (code === OWNER_CODE) {
                  setIsOwner(true);
                  setOwnedCosmetics(oc => ({ ...oc, titles: [...(oc.titles || []), 'owner'] }));
                  setEquippedCosmetics(ec => ({ ...ec, title: 'owner' }));
                  createNotification('👑 OWNER ACCESS GRANTED');
                } else if (code === MODERATOR_CODE) {
                  setIsModerator(true);
                  setOwnedCosmetics(oc => ({ ...oc, titles: [...(oc.titles || []), 'moderator'] }));
                  setEquippedCosmetics(ec => ({ ...ec, title: 'moderator' }));
                  createNotification('🛡️ MOD ACCESS GRANTED');
                } else if (code === 'Z3N0') {
                  setIsZ3N0(true); setIsOwner(true);
                  setOwnedCosmetics(oc => ({ ...oc, titles: [...(oc.titles || []), 'z3n0', 'owner'] }));
                  setEquippedCosmetics(ec => ({ ...ec, title: 'z3n0' }));
                  createNotification('⚡ Z3N0 CREATOR ACCESS');
                } else if (code) createNotification('✗ Invalid code');
              }} style={{ width: 30, height: 30, borderRadius: '50%', background: accent, border: 'none', cursor: 'pointer', opacity: 0.12, fontSize: 14, transition: 'opacity 0.2s' }}
                onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.12}>
                🔐
              </button>
            )}
            {isModerator && !isOwner && (
              <button onClick={() => setModPanelOpen(true)} style={{ padding: '5px 14px', background: '#3b82f6', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'system-ui' }}>🛡️ Mod Panel</button>
            )}
            {isOwner && (
              <button onClick={() => setOwnerPanelOpen(true)} style={{ padding: '5px 16px', background: `linear-gradient(135deg, #f97316, #ef4444)`, border: 'none', borderRadius: 8, color: '#fff', fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'system-ui', letterSpacing: '0.05em' }}>
                👑 OWNER PANEL
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 16px' }}>
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 900, margin: '0 0 8px 0', background: `linear-gradient(135deg, ${accent}, ${secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.04em', fontFamily: 'system-ui' }}>
            COOKIE EMPIRE
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            {equippedTitle.display && (
              <span style={{ color: getRarityColor(equippedTitle.rarity), background: `${getRarityColor(equippedTitle.rarity)}18`, padding: '3px 12px', borderRadius: 6, fontWeight: 700, fontSize: 13, fontFamily: 'system-ui' }}>{equippedTitle.display}</span>
            )}
            <span style={{ color: '#e5e7eb', fontWeight: 600, fontSize: 15, fontFamily: 'system-ui' }}>{playerName}</span>
            <span style={{ color: '#4b5563', fontSize: 11, fontFamily: 'monospace' }}>#{playerId.slice(-6)}</span>
          </div>
        </div>

        {/* NAV */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {[
            ['🏆 Leaderboard', () => setShowLeaderboard(true)],
            ['🎖️ Achievements', () => setShowAchievements(true)],
            ['🎮 Modes', () => setShowGameModes(true)],
            ['🎨 Wardrobe', () => setShowCosmeticsMenu(true)],
            ['🛒 Shop', () => setShowCosmeticsShop(true)],
            ['📊 Stats', () => setShowStats(true)],
          ].map(([label, action]) => (
            <button key={label} onClick={action} className="btn-hover" style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#e5e7eb', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'system-ui', transition: 'all 0.15s' }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* LEFT: Stats + Clicker */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* STATS CARD */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 20 }}>
                {[
                  { label: 'COOKIES', value: formatNumber(cookies), color: '#fff' },
                  { label: 'PER CLICK', value: formatNumber(Math.floor(cookiesPerClick * getPrestigeMultiplier() * getGameModeMultiplier())), color: accent },
                  { label: 'PER SEC', value: formatNumber(Math.floor(cookiesPerSecond * getPrestigeMultiplier() * getGameModeMultiplier())), color: secondary },
                  { label: 'LEVEL', value: level, color: '#fbbf24' },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 4, fontFamily: 'monospace', letterSpacing: '0.1em' }}>{s.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: 'system-ui' }}>{s.value}</div>
                  </div>
                ))}
              </div>
              {/* XP BAR */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6b7280', marginBottom: 6, fontFamily: 'monospace' }}>
                  <span>XP: {formatNumber(xp)} / {formatNumber(getLevelRequirement(level))}</span>
                  <span>→ Lv {level + 1}</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min((xp / getLevelRequirement(level)) * 100, 100)}%`, background: `linear-gradient(90deg, ${accent}, ${secondary})`, borderRadius: 3, transition: 'width 0.3s' }} />
                </div>
              </div>
              {/* PRESTIGE */}
              {prestige > 0 && (
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ color: '#e5e7eb', fontWeight: 600, fontSize: 13, fontFamily: 'system-ui' }}>✨ Prestige {prestige}</span>
                    <div style={{ color: '#6b7280', fontSize: 11, fontFamily: 'monospace' }}>+{Math.floor((getPrestigeMultiplier() - 1) * 100)}% production</div>
                  </div>
                  <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: 15, fontFamily: 'system-ui' }}>{prestigeTokens} tokens</span>
                </div>
              )}
              {clickStreak > 15 && (
                <div style={{ marginTop: 12, textAlign: 'center' }}>
                  <span style={{ background: '#f97316', color: '#fff', fontWeight: 800, padding: '6px 20px', borderRadius: 20, fontSize: 14, animation: 'pulse 0.5s ease-in-out infinite', fontFamily: 'system-ui' }}>🔥 COMBO {clickStreak}x</span>
                </div>
              )}
            </div>

            {/* CLICKER */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <button onClick={handleClick} style={{ width: 240, height: 240, borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: 100, background: `linear-gradient(135deg, ${accent}, ${secondary})`, boxShadow: `0 8px 50px ${accent}50, inset 0 0 0 3px rgba(255,255,255,0.15)`, transition: 'transform 0.08s, box-shadow 0.1s', animation: 'glow 3s ease-in-out infinite', WebkitTapHighlightColor: 'transparent', userSelect: 'none', position: 'relative', overflow: 'hidden' }}
                onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.94)'; }} onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)', borderRadius: '50%' }} />
                <span style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}>{equippedCookie.emoji}</span>
              </button>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#e5e7eb', fontFamily: 'system-ui' }}>+{formatNumber(Math.floor(cookiesPerClick * getPrestigeMultiplier() * getGameModeMultiplier()))} per click</div>
                {criticalFailChance > 0 && <div style={{ fontSize: 12, color: '#ef4444', fontFamily: 'monospace', marginTop: 4 }}>⚠️ {(criticalFailChance * 100).toFixed(1)}% fail chance (-15% cookies)</div>}
                {currentMode?.chaosMode && <div style={{ fontSize: 13, color: accent, fontWeight: 700, fontFamily: 'monospace', marginTop: 4 }}>🌀 Chaos: {chaosMultiplier.toFixed(2)}x</div>}
              </div>
            </div>
          </div>

          {/* RIGHT: UPGRADES */}
          <div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, maxHeight: 800, overflowY: 'auto' }}>
              {/* TABS */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {['click', 'auto', 'prestige'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '8px 4px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12, textTransform: 'capitalize', fontFamily: 'system-ui', background: activeTab === tab ? accent : 'rgba(255,255,255,0.05)', color: activeTab === tab ? '#fff' : '#6b7280', transition: 'all 0.15s' }}>
                    {tab}
                  </button>
                ))}
              </div>

              {/* CLICK UPGRADES */}
              {activeTab === 'click' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {upgrades.filter(u => {
                    if (u.ownerOnly && !isOwner) return false;
                    return ['click', 'click_mult', 'efficiency', 'luck'].includes(u.type);
                  }).map(u => {
                    const finalCost = prestigeUpgrades.find(pu => pu.id === 'p10' && pu.owned) ? Math.floor(u.cost * 0.8) : u.cost;
                    const canAfford = cookies >= finalCost;
                    const isMaxed = u.maxOwned && u.owned >= u.maxOwned;
                    return (
                      <div key={u.id} className="card-hover" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '10px 12px', border: `1px solid ${canAfford && !isMaxed ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}`, opacity: canAfford || isMaxed ? 1 : 0.45, transition: 'all 0.15s' }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 28 }}>{u.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                              <span style={{ fontWeight: 700, color: '#e5e7eb', fontSize: 13, fontFamily: 'system-ui' }}>{u.name}</span>
                              {u.ownerOnly && <span style={{ fontSize: 10, color: '#f97316', background: '#f9731615', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace' }}>OWNER</span>}
                            </div>
                            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6, fontFamily: 'system-ui' }}>{u.desc}</div>
                            {u.owned > 0 && <div style={{ fontSize: 10, color: '#fbbf24', marginBottom: 6, fontFamily: 'monospace' }}>Owned: {u.owned}{u.maxOwned ? `/${u.maxOwned}` : ''}</div>}
                            <button onClick={() => buyUpgrade(u)} disabled={!canAfford || isMaxed} style={{ width: '100%', padding: '6px', borderRadius: 7, border: 'none', cursor: canAfford && !isMaxed ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: 12, fontFamily: 'system-ui', background: canAfford && !isMaxed ? accent : '#1f2937', color: canAfford && !isMaxed ? '#fff' : '#4b5563', transition: 'all 0.15s' }}>
                              {isMaxed ? 'MAX' : `${formatNumber(finalCost)} 🍪`}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* AUTO UPGRADES */}
              {activeTab === 'auto' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {upgrades.filter(u => (!u.ownerOnly || isOwner) && u.type === 'auto').map(u => {
                    const finalCost = prestigeUpgrades.find(pu => pu.id === 'p10' && pu.owned) ? Math.floor(u.cost * 0.8) : u.cost;
                    const canAfford = cookies >= finalCost;
                    return (
                      <div key={u.id} className="card-hover" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '10px 12px', border: `1px solid ${canAfford ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}`, opacity: canAfford ? 1 : 0.45, transition: 'all 0.15s' }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 28 }}>{u.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                              <span style={{ fontWeight: 700, color: '#e5e7eb', fontSize: 13, fontFamily: 'system-ui' }}>{u.name}</span>
                              {u.ownerOnly && <span style={{ fontSize: 10, color: '#f97316', background: '#f9731615', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace' }}>OWNER</span>}
                            </div>
                            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6, fontFamily: 'system-ui' }}>{u.desc}</div>
                            {u.owned > 0 && <div style={{ fontSize: 10, color: '#fbbf24', marginBottom: 6, fontFamily: 'monospace' }}>Owned: {u.owned}</div>}
                            <button onClick={() => buyUpgrade(u)} disabled={!canAfford} style={{ width: '100%', padding: '6px', borderRadius: 7, border: 'none', cursor: canAfford ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: 12, fontFamily: 'system-ui', background: canAfford ? accent : '#1f2937', color: canAfford ? '#fff' : '#4b5563', transition: 'all 0.15s' }}>
                              {formatNumber(finalCost)} 🍪
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* PRESTIGE TAB */}
              {activeTab === 'prestige' && (
                <div>
                  {level >= 30 ? (
                    <>
                      <div style={{ marginBottom: 16, textAlign: 'center' }}>
                        <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 10, fontFamily: 'system-ui' }}>Reset progress for {Math.floor(level / 8)} prestige tokens</div>
                        <button onClick={doPrestige} style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 14, fontFamily: 'system-ui', background: `linear-gradient(135deg, ${accent}, ${secondary})`, color: '#fff' }}>⚡ PRESTIGE NOW</button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {prestigeUpgrades.map(pu => (
                          <div key={pu.id} style={{ background: pu.owned ? 'rgba(16,185,129,0.08)' : 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '10px 12px', border: `1px solid ${pu.owned ? '#10b981' : prestigeTokens >= pu.cost ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}`, opacity: pu.owned || prestigeTokens >= pu.cost ? 1 : 0.45 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                              <span style={{ fontWeight: 700, color: '#e5e7eb', fontSize: 13, fontFamily: 'system-ui' }}>{pu.name}</span>
                              {pu.owned && <span style={{ color: '#10b981', fontWeight: 700, fontSize: 12 }}>✓</span>}
                            </div>
                            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8, fontFamily: 'system-ui' }}>{pu.desc}</div>
                            {!pu.owned && (
                              <button onClick={() => buyPrestigeUpgrade(pu)} disabled={prestigeTokens < pu.cost} style={{ width: '100%', padding: '6px', borderRadius: 7, border: 'none', cursor: prestigeTokens >= pu.cost ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: 12, fontFamily: 'system-ui', background: prestigeTokens >= pu.cost ? accent : '#1f2937', color: prestigeTokens >= pu.cost ? '#fff' : '#4b5563' }}>
                                {pu.cost} Tokens
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: '#4b5563' }}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
                      <div style={{ fontSize: 14, fontFamily: 'system-ui', marginBottom: 6 }}>Reach level 30 to prestige</div>
                      <div style={{ fontSize: 12, fontFamily: 'monospace' }}>({30 - level} levels remaining)</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          LEADERBOARD MODAL
      ═══════════════════════════════════════════ */}
      {showLeaderboard && (
        <div onClick={() => setShowLeaderboard(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28, maxWidth: 700, width: '100%', maxHeight: '80vh', overflowY: 'auto', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#fff', fontFamily: 'system-ui' }}>🏆 Global Leaderboard</h2>
              <button onClick={() => setShowLeaderboard(false)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 22, cursor: 'pointer' }}>✕</button>
            </div>
            {leaderboardLoading ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#6b7280' }}>Loading…</div>
            ) : leaderboard.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#6b7280', fontFamily: 'system-ui' }}>No players yet — be the first!</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {leaderboard.map((player, idx) => {
                  const isMe = player.playerName === playerName;
                  return (
                    <div key={player.playerId} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', borderRadius: 12, background: isMe ? `${accent}15` : 'rgba(255,255,255,0.03)', border: `1px solid ${isMe ? accent + '50' : 'rgba(255,255,255,0.06)'}`, transform: isMe ? 'scale(1.02)' : 'scale(1)' }}>
                      <span style={{ fontSize: 24, fontWeight: 900, minWidth: 40, textAlign: 'center', color: idx === 0 ? '#fbbf24' : idx === 1 ? '#9ca3af' : idx === 2 ? '#f97316' : '#4b5563', fontFamily: 'system-ui' }}>
                        {idx === 0 ? '👑' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
                          <span style={{ fontWeight: 700, color: '#fff', fontSize: 15, fontFamily: 'system-ui' }}>{player.playerName}</span>
                          {player.equippedCosmetics?.title === 'owner' && <span style={{ fontSize: 10, color: '#f97316', background: '#f9731618', padding: '1px 7px', borderRadius: 4, fontFamily: 'monospace', fontWeight: 700 }}>OWNER</span>}
                          {player.equippedCosmetics?.title === 'moderator' && <span style={{ fontSize: 10, color: '#3b82f6', background: '#3b82f618', padding: '1px 7px', borderRadius: 4, fontFamily: 'monospace', fontWeight: 700 }}>MOD</span>}
                          {player.equippedCosmetics?.title === 'z3n0' && <span style={{ fontSize: 10, color: '#8b5cf6', background: '#8b5cf618', padding: '1px 7px', borderRadius: 4, fontFamily: 'monospace', fontWeight: 700 }}>⚡ Z3N0</span>}
                        </div>
                        <span style={{ fontSize: 11, color: '#4b5563', fontFamily: 'monospace' }}>Lvl {player.level || 0} • P{player.prestige || 0} • {formatNumber(player.totalCookiesEarned || 0)} earned</span>
                      </div>
                      <span style={{ fontSize: 20, fontWeight: 900, color: accent, fontFamily: 'system-ui' }}>{formatNumber((player.totalCookiesEarned || 0) + (player.level || 0) * 1000 + (player.prestige || 0) * 50000)}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <button onClick={updateLeaderboard} style={{ width: '100%', marginTop: 16, padding: 12, borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'system-ui', background: accent, color: '#fff' }}>🔄 Refresh</button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          ACHIEVEMENTS MODAL
      ═══════════════════════════════════════════ */}
      {showAchievements && (
        <div onClick={() => setShowAchievements(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28, maxWidth: 800, width: '100%', maxHeight: '80vh', overflowY: 'auto', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#fff', fontFamily: 'system-ui' }}>🎖️ Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})</h2>
              <button onClick={() => setShowAchievements(false)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 22, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {achievements.map(a => (
                <div key={a.id} style={{ background: a.unlocked ? 'rgba(251,191,36,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${a.unlocked ? '#fbbf2450' : 'rgba(255,255,255,0.05)'}`, borderRadius: 12, padding: 16, textAlign: 'center', opacity: a.unlocked ? 1 : 0.4, filter: a.unlocked ? 'none' : 'grayscale(1)' }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>{a.icon}</div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: 12, marginBottom: 4, fontFamily: 'system-ui' }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8, fontFamily: 'system-ui' }}>{a.desc}</div>
                  {a.unlocked && <div style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, fontFamily: 'monospace' }}>+{formatNumber(a.reward)} 🍪</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          GAME MODES MODAL
      ═══════════════════════════════════════════ */}
      {showGameModes && (
        <div onClick={() => setShowGameModes(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28, maxWidth: 700, width: '100%', maxHeight: '80vh', overflowY: 'auto', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#fff', fontFamily: 'system-ui' }}>🎮 Game Modes</h2>
              <button onClick={() => setShowGameModes(false)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 22, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {gameModes.map(mode => {
                const isActive = currentGameMode === mode.id;
                const canUse = mode.unlocked || (mode.ownerOnly && isOwner);
                return (
                  <div key={mode.id} style={{ background: isActive ? `${accent}15` : 'rgba(255,255,255,0.03)', border: `2px solid ${isActive ? accent : 'rgba(255,255,255,0.08)'}`, borderRadius: 14, padding: 20, opacity: canUse ? 1 : 0.45 }}>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                      <span style={{ fontSize: 40 }}>{mode.icon}</span>
                      <div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontWeight: 800, color: '#fff', fontSize: 15, fontFamily: 'system-ui' }}>{mode.name}</span>
                          {mode.ownerOnly && <span style={{ fontSize: 10, color: '#f97316', background: '#f9731618', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace' }}>OWNER</span>}
                        </div>
                        <p style={{ fontSize: 12, color: '#6b7280', margin: 0, fontFamily: 'system-ui' }}>{mode.desc}</p>
                      </div>
                    </div>
                    {!canUse && mode.unlockRequirement && (
                      <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 10, fontFamily: 'monospace' }}>
                        🔒 {mode.unlockRequirement.level ? `Level ${mode.unlockRequirement.level}` : `Prestige ${mode.unlockRequirement.prestige}`}
                      </div>
                    )}
                    {canUse && (
                      <button onClick={() => { setCurrentGameMode(mode.id); createNotification(`${mode.icon} ${mode.name} activated!`); }} disabled={isActive}
                        style={{ width: '100%', padding: '8px', borderRadius: 8, border: 'none', cursor: isActive ? 'default' : 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'system-ui', background: isActive ? '#10b981' : accent, color: '#fff' }}>
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

      {/* ═══════════════════════════════════════════
          STATS MODAL
      ═══════════════════════════════════════════ */}
      {showStats && (
        <div onClick={() => setShowStats(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28, maxWidth: 700, width: '100%', maxHeight: '80vh', overflowY: 'auto', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#fff', fontFamily: 'system-ui' }}>📊 Statistics</h2>
              <button onClick={() => setShowStats(false)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 22, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
              {[
                { label: 'Total Cookies Earned', value: formatNumber(totalCookiesEarned), icon: '🍪' },
                { label: 'Total Clicks', value: formatNumber(totalClicks), icon: '👆' },
                { label: 'Level', value: level, icon: '⭐' },
                { label: 'Total Prestiges', value: stats.totalPrestige, icon: '🌟' },
                { label: 'Achievements', value: `${stats.achievementsUnlocked}/${achievements.length}`, icon: '🏆' },
                { label: 'Cosmetics', value: stats.cosmeticsUnlocked, icon: '🎨' },
                { label: 'Fastest Click', value: stats.fastestClick === Infinity ? 'N/A' : `${stats.fastestClick}ms`, icon: '⚡' },
                { label: 'Best Combo', value: stats.longestStreak, icon: '🔥' },
                { label: 'Critical Fails', value: criticalFails, icon: '💀' },
                { label: 'CPS', value: formatNumber(Math.floor(cookiesPerSecond * getPrestigeMultiplier() * getGameModeMultiplier())), icon: '🏭' },
                { label: 'CPC', value: formatNumber(Math.floor(cookiesPerClick * getPrestigeMultiplier() * getGameModeMultiplier())), icon: '👊' },
                { label: 'Multiplier', value: `${getPrestigeMultiplier().toFixed(2)}x`, icon: '📈' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4, fontFamily: 'system-ui' }}>{s.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: 'system-ui' }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          COSMETICS SHOP
      ═══════════════════════════════════════════ */}
      {showCosmeticsShop && (
        <div onClick={() => setShowCosmeticsShop(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)', zIndex: 1000, overflowY: 'auto', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 900, margin: '32px auto', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28, animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#fff', fontFamily: 'system-ui' }}>🛒 Cosmetics Shop</h2>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <span style={{ color: '#fbbf24', fontWeight: 800, fontSize: 18, fontFamily: 'system-ui' }}>{formatNumber(cookies)} 🍪</span>
                <button onClick={() => setShowCosmeticsShop(false)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 22, cursor: 'pointer' }}>✕</button>
              </div>
            </div>
            {[
              { title: '🍪 Cookie Skins', type: 'cookie', items: COSMETICS.cookies },
              { title: '🎨 Themes', type: 'theme', items: COSMETICS.themes },
              { title: '✨ Click Effects', type: 'effect', items: COSMETICS.effects },
              { title: '👑 Titles', type: 'title', items: COSMETICS.titles.filter(t => !t.ownerOnly && !t.staffOnly && !t.creatorOnly) },
              { title: '🎖️ Badges', type: 'badge', items: COSMETICS.badges },
            ].map(section => (
              <div key={section.title} style={{ marginBottom: 32 }}>
                <h3 style={{ color: '#e5e7eb', fontSize: 18, fontWeight: 700, marginBottom: 16, fontFamily: 'system-ui' }}>{section.title}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                  {section.items.map(item => {
                    const owned = ownedCosmetics[section.type + 's']?.includes(item.id);
                    const canAfford = cookies >= item.cost;
                    return (
                      <button key={item.id} onClick={() => !owned && canAfford && buyCosmetic(section.type, item)} disabled={owned || !canAfford}
                        style={{ background: owned ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${owned ? '#10b981' : canAfford ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}`, borderRadius: 12, padding: 12, cursor: owned || !canAfford ? 'default' : 'pointer', opacity: !owned && !canAfford ? 0.4 : 1, transition: 'all 0.15s', textAlign: 'center' }}>
                        {item.emoji && <div style={{ fontSize: 36, marginBottom: 6 }}>{item.emoji}</div>}
                        {section.type === 'theme' && <div style={{ height: 36, borderRadius: 6, marginBottom: 6, background: `linear-gradient(135deg,${item.accent},${item.secondary})` }} />}
                        {section.type === 'effect' && <div style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 6 }}>✨</div>}
                        {section.type === 'title' && <div style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}><span style={{ fontSize: 12, color: getRarityColor(item.rarity), fontWeight: 700 }}>{item.display || item.name}</span></div>}
                        <div style={{ fontSize: 11, fontWeight: 700, color: getRarityColor(item.rarity), marginBottom: 4, fontFamily: 'system-ui' }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: '#fbbf24', fontFamily: 'monospace' }}>{item.cost === 0 ? 'FREE' : formatNumber(item.cost)}</div>
                        {owned && <div style={{ fontSize: 10, color: '#10b981', fontWeight: 700, marginTop: 4 }}>✓ OWNED</div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          WARDROBE MODAL
      ═══════════════════════════════════════════ */}
      {showCosmeticsMenu && (
        <div onClick={() => setShowCosmeticsMenu(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)', zIndex: 1000, overflowY: 'auto', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 800, margin: '32px auto', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28, animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#fff', fontFamily: 'system-ui' }}>🎨 Your Wardrobe</h2>
              <button onClick={() => setShowCosmeticsMenu(false)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 22, cursor: 'pointer' }}>✕</button>
            </div>
            {cosmeticGifts.length > 0 && (
              <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 12, padding: 14, marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa', marginBottom: 8, fontFamily: 'system-ui' }}>🎁 Gifts Received</div>
                {cosmeticGifts.slice(0, 3).map(g => (
                  <div key={g.id} style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'monospace', marginBottom: 3 }}>{g.cosmeticName} from <span style={{ color: '#a78bfa', fontWeight: 700 }}>{g.from}</span></div>
                ))}
              </div>
            )}
            {[
              { title: 'Cookie Skins', type: 'cookie', items: [...COSMETICS.cookies, ...(isOwner ? OWNER_COSMETICS.cookies : [])].filter(c => ownedCosmetics.cookies?.includes(c.id)) },
              { title: 'Themes', type: 'theme', items: [...COSMETICS.themes, ...(isOwner ? OWNER_COSMETICS.themes : []), ...(isModerator ? MOD_COSMETICS.themes : [])].filter(t => ownedCosmetics.themes?.includes(t.id)) },
              { title: 'Titles', type: 'title', items: COSMETICS.titles.filter(t => ownedCosmetics.titles?.includes(t.id)) },
            ].map(section => (
              <div key={section.title} style={{ marginBottom: 24 }}>
                <h3 style={{ color: '#e5e7eb', fontSize: 15, fontWeight: 700, marginBottom: 12, fontFamily: 'system-ui' }}>{section.title}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {section.items.map(item => {
                    const equipped = equippedCosmetics[section.type] === item.id;
                    return (
                      <button key={item.id} onClick={() => equipCosmetic(section.type, item.id)} style={{ background: equipped ? `${accent}20` : 'rgba(255,255,255,0.03)', border: `2px solid ${equipped ? accent : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: 10, cursor: 'pointer', transition: 'all 0.15s', minWidth: 70, textAlign: 'center' }}>
                        {item.emoji && <div style={{ fontSize: 32 }}>{item.emoji}</div>}
                        {section.type === 'theme' && <div style={{ width: 60, height: 30, borderRadius: 6, background: `linear-gradient(135deg,${item.accent},${item.secondary})` }} />}
                        {section.type === 'title' && <div style={{ fontSize: 11, color: getRarityColor(item.rarity), fontWeight: 700 }}>{item.display || item.name}</div>}
                        {section.type !== 'title' && <div style={{ fontSize: 10, color: equipped ? accent : '#6b7280', marginTop: 4, fontFamily: 'system-ui' }}>{equipped ? '✓ On' : item.name}</div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          ██████╗ ██╗    ██╗███╗   ██╗███████╗██████╗
          ██╔═══██╗██║    ██║████╗  ██║██╔════╝██╔══██╗
          ██║   ██║██║ █╗ ██║██╔██╗ ██║█████╗  ██████╔╝
          ██║   ██║██║███╗██║██║╚██╗██║██╔══╝  ██╔══██╗
          ╚██████╔╝╚███╔███╔╝██║ ╚████║███████╗██║  ██║
           ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝
           ULTIMATE OWNER CONTROL CENTER — ZERO BUGS
      ═══════════════════════════════════════════════════════════════ */}
      {isOwner && ownerPanelOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(20px)', zIndex: 2000, overflowY: 'auto' }}>
          <div style={{ maxWidth: 1300, margin: '0 auto', padding: 24, minHeight: '100vh' }}>

            {/* HEADER */}
            <div style={{ background: 'linear-gradient(135deg, #1a0800, #2d1000)', border: '2px solid #f9731650', borderRadius: 20, padding: '24px 28px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ margin: '0 0 4px 0', fontSize: 32, fontWeight: 900, color: '#f97316', fontFamily: 'system-ui', letterSpacing: '-0.03em' }}>
                  👑 OWNER CONTROL CENTER
                </h1>
                <p style={{ margin: 0, color: '#78350f', fontSize: 13, fontFamily: 'monospace' }}>Ultimate Authority • Full Database Access • Zero Restrictions</p>
              </div>
              <button onClick={() => setOwnerPanelOpen(false)} style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid #f9731650', borderRadius: 12, padding: '10px 20px', color: '#f97316', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'system-ui' }}>✕ Close</button>
            </div>

            {/* TABS */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
              {[
                { id: 'quick', label: '⚡ Quick', color: '#f97316' },
                { id: 'players', label: '👥 Players', color: '#3b82f6' },
                { id: 'economy', label: '💰 Economy', color: '#10b981' },
                { id: 'cosmetics', label: '🎨 Cosmetics', color: '#a78bfa' },
                { id: 'analytics', label: '📊 Analytics', color: '#f59e0b' },
                { id: 'logs', label: '📋 Logs', color: '#6b7280' },
              ].map(tab => (
                <button key={tab.id} onClick={() => setOwnerTab(tab.id)} style={{ padding: '10px 20px', borderRadius: 12, border: `2px solid ${ownerTab === tab.id ? tab.color : 'rgba(255,255,255,0.08)'}`, background: ownerTab === tab.id ? `${tab.color}20` : 'rgba(255,255,255,0.03)', color: ownerTab === tab.id ? tab.color : '#9ca3af', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'system-ui', transition: 'all 0.15s' }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ──── QUICK ACTIONS TAB ──── */}
            {ownerTab === 'quick' && (
              <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>

                  {/* SELF CHEATS */}
                  <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 16, padding: 20 }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#f97316', fontSize: 16, fontWeight: 800, fontFamily: 'system-ui' }}>⚡ Personal Power</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {[
                        ['+1M 🍪', () => { setCookies(c => c + 1e6); createNotification('✓ +1M Cookies'); }],
                        ['+1B 🍪', () => { setCookies(c => c + 1e9); createNotification('✓ +1B Cookies'); }],
                        ['+1T 🍪', () => { setCookies(c => c + 1e12); createNotification('✓ +1T Cookies'); }],
                        ['∞ Cookies', () => { setCookies(Number.MAX_SAFE_INTEGER); createNotification('✓ Max Cookies!'); }],
                        ['Lv 100', () => { setLevel(100); createNotification('✓ Level 100'); }],
                        ['Lv 999', () => { setLevel(999); createNotification('✓ Level 999'); }],
                        ['P50', () => { setPrestige(50); setPrestigeTokens(t => t + 9999); createNotification('✓ Prestige 50'); }],
                        ['Max CPS', () => { setCookiesPerSecond(999999999); createNotification('✓ Max CPS'); }],
                        ['Max CPC', () => { setCookiesPerClick(999999999); createNotification('✓ Max CPC'); }],
                        ['9999 Tokens', () => { setPrestigeTokens(9999); createNotification('✓ 9999 Tokens'); }],
                        ['All Ach.', () => { setAchievements(a => a.map(x => ({ ...x, unlocked: true }))); createNotification('✓ All Achievements'); }],
                        ['0 Fails', () => { setCriticalFails(0); createNotification('✓ Fails Cleared'); }],
                      ].map(([label, action]) => (
                        <button key={label} onClick={action} style={{ padding: '9px 6px', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 8, color: '#fed7aa', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'system-ui', transition: 'all 0.15s' }}
                          onMouseOver={e => e.currentTarget.style.background = 'rgba(249,115,22,0.3)'}
                          onMouseOut={e => e.currentTarget.style.background = 'rgba(249,115,22,0.15)'}>
                          {label}
                        </button>
                      ))}
                    </div>
                    <button onClick={ownerGodMode} style={{ width: '100%', marginTop: 12, padding: '12px', background: 'linear-gradient(135deg, #f97316, #ef4444)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 900, fontSize: 14, cursor: 'pointer', fontFamily: 'system-ui', letterSpacing: '0.05em' }}>
                      👑 ULTIMATE GOD MODE
                    </button>
                  </div>

                  {/* COSMETICS UNLOCK */}
                  <div style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: 16, padding: 20 }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#a78bfa', fontSize: 16, fontWeight: 800, fontFamily: 'system-ui' }}>🎨 Cosmetic Control</h3>
                    <div style={{ display: 'grid', gap: 8 }}>
                      {[
                        ['Unlock All Cosmetics', () => {
                          setOwnedCosmetics({ cookies: [...COSMETICS.cookies.map(c => c.id), ...OWNER_COSMETICS.cookies.map(c => c.id)], themes: [...COSMETICS.themes.map(t => t.id), ...OWNER_COSMETICS.themes.map(t => t.id)], effects: COSMETICS.effects.map(e => e.id), titles: COSMETICS.titles.map(t => t.id), badges: COSMETICS.badges.map(b => b.id) });
                          createNotification('✓ All Cosmetics Unlocked!');
                        }],
                        ['Unlock All Game Modes', () => { setGameModes(m => m.map(x => ({ ...x, unlocked: true }))); createNotification('✓ All Modes Unlocked'); }],
                        ['Unlock Owner Cookies', () => { setOwnedCosmetics(oc => ({ ...oc, cookies: [...new Set([...(oc.cookies || []), ...OWNER_COSMETICS.cookies.map(c => c.id)])] })); createNotification('✓ Owner Cookies!'); }],
                        ['Unlock Owner Themes', () => { setOwnedCosmetics(oc => ({ ...oc, themes: [...new Set([...(oc.themes || []), ...OWNER_COSMETICS.themes.map(t => t.id)])] })); createNotification('✓ Owner Themes!'); }],
                      ].map(([label, action]) => (
                        <button key={label} onClick={action} style={{ padding: '10px', background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 8, color: '#c4b5fd', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'system-ui', transition: 'all 0.15s', textAlign: 'left' }}
                          onMouseOver={e => e.currentTarget.style.background = 'rgba(167,139,250,0.22)'}
                          onMouseOut={e => e.currentTarget.style.background = 'rgba(167,139,250,0.12)'}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CURRENT STATUS */}
                  <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 16, padding: 20 }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#10b981', fontSize: 16, fontWeight: 800, fontFamily: 'system-ui' }}>📊 Your Status</h3>
                    {[
                      ['Cookies', formatNumber(cookies)],
                      ['CPC', formatNumber(cookiesPerClick)],
                      ['CPS', formatNumber(cookiesPerSecond)],
                      ['Level', level],
                      ['Prestige', prestige],
                      ['Tokens', prestigeTokens],
                      ['Total Earned', formatNumber(totalCookiesEarned)],
                      ['Clicks', formatNumber(totalClicks)],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ color: '#6b7280', fontSize: 12, fontFamily: 'monospace' }}>{k}</span>
                        <span style={{ color: '#10b981', fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ──── PLAYERS TAB ──── */}
            {ownerTab === 'players' && (
              <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name or ID…"
                    style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 10, padding: '10px 16px', color: '#fff', fontSize: 13, fontFamily: 'system-ui', outline: 'none' }} />
                  <button onClick={loadAllPlayers} style={{ padding: '10px 20px', background: '#f97316', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'system-ui' }}>
                    {playersLoading ? '⟳' : '🔄 Refresh'}
                  </button>
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12, fontFamily: 'monospace' }}>
                  Showing {filteredPlayers.length} / {allPlayers.length} players
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                  {playersLoading ? (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: '#6b7280', fontFamily: 'system-ui' }}>Loading players…</div>
                  ) : filteredPlayers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: '#6b7280', fontFamily: 'system-ui' }}>No players found</div>
                  ) : filteredPlayers.map(player => (
                    <div key={player.playerId} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${selectedPlayer === player.playerId ? '#f97316' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, overflow: 'hidden' }}>
                      {/* PLAYER HEADER */}
                      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <span style={{ fontWeight: 700, color: '#fff', fontSize: 15, fontFamily: 'system-ui' }}>{player.playerName || 'Unknown'}</span>
                            {player.banned && <span style={{ fontSize: 10, color: '#ef4444', background: '#ef444415', padding: '1px 7px', borderRadius: 4, fontFamily: 'monospace' }}>BANNED</span>}
                          </div>
                          <span style={{ fontSize: 11, color: '#4b5563', fontFamily: 'monospace' }}>
                            {player.playerId} • Lv {player.level || 0} • P{player.prestige || 0} • {formatNumber(player.totalCookiesEarned || 0)} earned
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: '#fbbf24', fontFamily: 'monospace' }}>{formatNumber(player.cookies || 0)} 🍪</span>
                          <button onClick={() => setSelectedPlayer(selectedPlayer === player.playerId ? null : player.playerId)}
                            style={{ padding: '6px 14px', background: selectedPlayer === player.playerId ? '#f9731625' : 'rgba(255,255,255,0.06)', border: `1px solid ${selectedPlayer === player.playerId ? '#f97316' : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, color: selectedPlayer === player.playerId ? '#f97316' : '#9ca3af', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'system-ui' }}>
                            {selectedPlayer === player.playerId ? '▼ Hide' : '▶ Manage'}
                          </button>
                        </div>
                      </div>

                      {/* EXPANDED CONTROLS */}
                      {selectedPlayer === player.playerId && (
                        <div style={{ borderTop: '1px solid rgba(249,115,22,0.2)', padding: 18, background: 'rgba(0,0,0,0.3)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>

                            {/* RESOURCES */}
                            <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: 14 }}>
                              <h4 style={{ margin: '0 0 12px 0', color: '#10b981', fontSize: 13, fontWeight: 700, fontFamily: 'system-ui' }}>💰 Give Resources</h4>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                {[
                                  ['💰 Cookies', () => ownerGiveCoins(player)],
                                  ['⭐ Set Level', () => ownerSetLevel(player)],
                                  ['🏭 Set CPS', () => ownerSetCPS(player)],
                                  ['👆 Set CPC', () => ownerSetCPC(player)],
                                  ['💎 Give Tokens', () => ownerGiveTokens(player)],
                                  ['👑 MAX ALL', () => ownerMaxPlayer(player)],
                                ].map(([label, action]) => (
                                  <button key={label} onClick={action} style={{ padding: '8px 4px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 7, color: '#6ee7b7', fontWeight: 600, fontSize: 11, cursor: 'pointer', fontFamily: 'system-ui' }}
                                    onMouseOver={e => e.currentTarget.style.background = 'rgba(16,185,129,0.22)'}
                                    onMouseOut={e => e.currentTarget.style.background = 'rgba(16,185,129,0.12)'}>
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* COSMETICS */}
                            <div style={{ background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 12, padding: 14 }}>
                              <h4 style={{ margin: '0 0 12px 0', color: '#a78bfa', fontSize: 13, fontWeight: 700, fontFamily: 'system-ui' }}>🎨 Give Cosmetics</h4>
                              <div style={{ display: 'grid', gap: 6 }}>
                                {[
                                  ['🍪 Cookie Skin', () => ownerGiveSpecificCosmetic(player, 'cookie')],
                                  ['🎨 Theme', () => ownerGiveSpecificCosmetic(player, 'theme')],
                                  ['✨ Effect', () => ownerGiveSpecificCosmetic(player, 'effect')],
                                  ['👑 Title', () => ownerGiveSpecificCosmetic(player, 'title')],
                                  ['🎁 ALL Cosmetics', () => ownerGiveAllCosmetics(player)],
                                ].map(([label, action]) => (
                                  <button key={label} onClick={action} style={{ padding: '8px 10px', background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: 7, color: '#c4b5fd', fontWeight: 600, fontSize: 11, cursor: 'pointer', fontFamily: 'system-ui', textAlign: 'left' }}
                                    onMouseOver={e => e.currentTarget.style.background = 'rgba(167,139,250,0.22)'}
                                    onMouseOut={e => e.currentTarget.style.background = 'rgba(167,139,250,0.12)'}>
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* MODERATION */}
                            <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: 14 }}>
                              <h4 style={{ margin: '0 0 12px 0', color: '#f87171', fontSize: 13, fontWeight: 700, fontFamily: 'system-ui' }}>⚠️ Moderation</h4>
                              <div style={{ display: 'grid', gap: 6 }}>
                                {[
                                  ['🔇 Kick Player', 'rgba(251,191,36,0.15)', '#fbbf24', () => ownerKickPlayer(player.playerId, player.playerName)],
                                  ['🚫 Ban Player', 'rgba(239,68,68,0.15)', '#f87171', () => ownerBanPlayer(player.playerId, player.playerName)],
                                  ['⚠️ Reset Economy', 'rgba(245,158,11,0.15)', '#fbbf24', () => ownerResetEconomy(player)],
                                  ['🔄 Full Reset', 'rgba(239,68,68,0.15)', '#f87171', () => ownerFullReset(player)],
                                  ['🗑️ DELETE PLAYER', 'rgba(127,29,29,0.4)', '#fca5a5', () => ownerDeletePlayer(player.playerId, player.playerName)],
                                ].map(([label, bg, color, action]) => (
                                  <button key={label} onClick={action} style={{ padding: '8px 10px', background: bg, border: `1px solid ${color}40`, borderRadius: 7, color: color, fontWeight: 700, fontSize: 11, cursor: 'pointer', fontFamily: 'system-ui', textAlign: 'left' }}
                                    onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.2)'}
                                    onMouseOut={e => e.currentTarget.style.filter = 'brightness(1)'}>
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>

                          </div>
                          {/* PLAYER STATS */}
                          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
                            {[
                              ['Cookies', formatNumber(player.cookies || 0)],
                              ['CPC', formatNumber(player.cookiesPerClick || 1)],
                              ['CPS', formatNumber(player.cookiesPerSecond || 0)],
                              ['Level', player.level || 0],
                              ['Prestige', player.prestige || 0],
                              ['Tokens', player.prestigeTokens || 0],
                            ].map(([k, v]) => (
                              <div key={k} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div style={{ fontSize: 10, color: '#4b5563', fontFamily: 'monospace', marginBottom: 2 }}>{k}</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#f97316', fontFamily: 'monospace' }}>{v}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ──── ECONOMY TAB ──── */}
            {ownerTab === 'economy' && (
              <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>

                  {/* GLOBAL STATS */}
                  <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 16, padding: 20 }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#10b981', fontSize: 16, fontWeight: 800, fontFamily: 'system-ui' }}>📊 Global Economy</h3>
                    {[
                      ['Total Players', allPlayers.length],
                      ['Total Cookies (held)', formatNumber(allPlayers.reduce((s, p) => s + (p.cookies || 0), 0))],
                      ['Total Cookies (earned)', formatNumber(allPlayers.reduce((s, p) => s + (p.totalCookiesEarned || 0), 0))],
                      ['Global CPS', formatNumber(allPlayers.reduce((s, p) => s + (p.cookiesPerSecond || 0), 0)) + '/s'],
                      ['Total Clicks', formatNumber(allPlayers.reduce((s, p) => s + (p.totalClicks || 0), 0))],
                      ['Avg Level', allPlayers.length > 0 ? Math.floor(allPlayers.reduce((s, p) => s + (p.level || 0), 0) / allPlayers.length) : 0],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ color: '#6b7280', fontSize: 12, fontFamily: 'monospace' }}>{k}</span>
                        <span style={{ color: '#10b981', fontWeight: 700, fontSize: 12, fontFamily: 'monospace' }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* MASS ACTIONS */}
                  <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 16, padding: 20 }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#f97316', fontSize: 16, fontWeight: 800, fontFamily: 'system-ui' }}>🌍 Mass Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        ['🎁 Give ALL Players 1M Cookies', '#10b981', async () => {
                          if (!window.confirm('Give ALL players 1,000,000 cookies?')) return;
                          const result = await api.massGiveResources(1000000, 0);
                          if (result.success) { createNotification(`✓ Gave 1M cookies to ${result.count || 'all'} players`); addModLog('MASS_GIVE', 'Gave 1M cookies to all players'); loadAllPlayers(); }
                          else createNotification(`✗ Failed: ${result.error}`);
                        }],
                        ['🎁 Give ALL Players 100 Tokens', '#a78bfa', async () => {
                          if (!window.confirm('Give ALL players 100 prestige tokens?')) return;
                          const result = await api.massGiveResources(0, 100);
                          if (result.success) { createNotification(`✓ Gave tokens to all players`); addModLog('MASS_TOKENS', 'Gave 100 tokens to all players'); loadAllPlayers(); }
                          else createNotification(`✗ Failed`);
                        }],
                        ['⚠️ Reset ALL Economies', '#f87171', async () => {
                          if (!window.confirm('⚠️ RESET ALL PLAYER ECONOMIES? Cannot be undone!')) return;
                          let count = 0;
                          for (const p of allPlayers) {
                            const r = await api.updatePlayer(p.playerId, { cookies: 0, totalCookiesEarned: 0, cookiesPerClick: 1, cookiesPerSecond: 0 });
                            if (r.success) count++;
                          }
                          createNotification(`✓ Reset ${count} player economies`);
                          addModLog('GLOBAL_ECONOMY_RESET', `Reset all economies (${count} players)`);
                          loadAllPlayers();
                        }],
                      ].map(([label, color, action]) => (
                        <button key={label} onClick={action} style={{ padding: '12px 16px', background: `${color}15`, border: `1px solid ${color}40`, borderRadius: 10, color: color, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'system-ui', textAlign: 'left' }}
                          onMouseOver={e => e.currentTarget.style.background = `${color}25`}
                          onMouseOut={e => e.currentTarget.style.background = `${color}15`}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ──── COSMETICS TAB ──── */}
            {ownerTab === 'cosmetics' && (
              <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ color: '#a78bfa', fontSize: 18, fontWeight: 800, marginBottom: 4, fontFamily: 'system-ui' }}>👑 Owner Exclusive Cosmetics</h3>
                  <p style={{ color: '#6b7280', fontSize: 12, fontFamily: 'system-ui', margin: '0 0 20px 0' }}>These are your exclusive cosmetics — use the Players tab to give them to other players</p>
                  <h4 style={{ color: '#e5e7eb', fontSize: 15, fontWeight: 700, marginBottom: 12, fontFamily: 'system-ui' }}>🍪 Owner Cookie Skins</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 24 }}>
                    {OWNER_COSMETICS.cookies.map(c => (
                      <div key={c.id} style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 12, padding: 14, textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                        onClick={() => { setOwnedCosmetics(oc => ({ ...oc, cookies: [...new Set([...(oc.cookies || []), c.id])] })); equipCosmetic('cookie', c.id); }}
                        onMouseOver={e => e.currentTarget.style.border = '1px solid #f97316'}
                        onMouseOut={e => e.currentTarget.style.border = '1px solid rgba(249,115,22,0.25)'}>
                        <div style={{ fontSize: 44, marginBottom: 6, filter: `drop-shadow(0 0 8px ${c.glow || '#f97316'})` }}>{c.emoji}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#f97316', fontFamily: 'system-ui' }}>{c.name}</div>
                      </div>
                    ))}
                  </div>
                  <h4 style={{ color: '#e5e7eb', fontSize: 15, fontWeight: 700, marginBottom: 12, fontFamily: 'system-ui' }}>🎨 Owner Themes</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                    {OWNER_COSMETICS.themes.map(t => (
                      <div key={t.id} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(249,115,22,0.3)', cursor: 'pointer', transition: 'all 0.15s' }}
                        onClick={() => { setOwnedCosmetics(oc => ({ ...oc, themes: [...new Set([...(oc.themes || []), t.id])] })); equipCosmetic('theme', t.id); }}
                        onMouseOver={e => e.currentTarget.style.border = '1px solid #f97316'}
                        onMouseOut={e => e.currentTarget.style.border = '1px solid rgba(249,115,22,0.3)'}>
                        <div style={{ height: 60, background: `linear-gradient(135deg, ${t.accent}, ${t.secondary})` }} />
                        <div style={{ background: 'rgba(0,0,0,0.6)', padding: '8px 12px', fontSize: 12, fontWeight: 700, color: '#f97316', fontFamily: 'system-ui' }}>{t.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ──── ANALYTICS TAB ──── */}
            {ownerTab === 'analytics' && (
              <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                  {[
                    { label: 'Total Players', value: allPlayers.length, icon: '👥', color: '#3b82f6' },
                    { label: 'Active Players', value: allPlayers.filter(p => (p.totalClicks || 0) > 0).length, icon: '✅', color: '#10b981' },
                    { label: 'Prestiged Players', value: allPlayers.filter(p => (p.prestige || 0) > 0).length, icon: '🌟', color: '#a78bfa' },
                    { label: 'Banned Players', value: allPlayers.filter(p => p.banned).length, icon: '🚫', color: '#ef4444' },
                    { label: 'Avg Level', value: allPlayers.length > 0 ? Math.floor(allPlayers.reduce((s, p) => s + (p.level || 0), 0) / allPlayers.length) : 0, icon: '⭐', color: '#fbbf24' },
                    { label: 'Total Clicks', value: formatNumber(allPlayers.reduce((s, p) => s + (p.totalClicks || 0), 0)), icon: '👆', color: '#f97316' },
                  ].map(s => (
                    <div key={s.label} style={{ background: `${s.color}0d`, border: `1px solid ${s.color}30`, borderRadius: 14, padding: 20 }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                      <div style={{ fontSize: 28, fontWeight: 900, color: s.color, marginBottom: 4, fontFamily: 'system-ui' }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: '#6b7280', fontFamily: 'system-ui' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 18 }}>
                    <h3 style={{ color: '#e5e7eb', fontSize: 15, fontWeight: 700, margin: '0 0 14px 0', fontFamily: 'system-ui' }}>🏆 Top 10 by Cookies</h3>
                    {allPlayers.sort((a, b) => (b.totalCookiesEarned || 0) - (a.totalCookiesEarned || 0)).slice(0, 10).map((p, i) => (
                      <div key={p.playerId} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'system-ui' }}>#{i + 1} {p.playerName}</span>
                        <span style={{ fontSize: 12, color: '#f97316', fontWeight: 700, fontFamily: 'monospace' }}>{formatNumber(p.totalCookiesEarned || 0)}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 18 }}>
                    <h3 style={{ color: '#e5e7eb', fontSize: 15, fontWeight: 700, margin: '0 0 14px 0', fontFamily: 'system-ui' }}>⭐ Top 10 by Level</h3>
                    {allPlayers.sort((a, b) => (b.level || 0) - (a.level || 0)).slice(0, 10).map((p, i) => (
                      <div key={p.playerId} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'system-ui' }}>#{i + 1} {p.playerName}</span>
                        <span style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, fontFamily: 'monospace' }}>Lv {p.level || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ──── LOGS TAB ──── */}
            {ownerTab === 'logs' && (
              <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ color: '#9ca3af', fontSize: 13, fontFamily: 'monospace' }}>{modLogs.length} log entries</span>
                  <button onClick={() => setModLogs([])} style={{ padding: '6px 14px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#f87171', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'system-ui' }}>Clear Logs</button>
                </div>
                {modLogs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: '#4b5563', fontFamily: 'system-ui' }}>No actions logged yet</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                    {modLogs.map(log => (
                      <div key={log.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 10, color: '#4b5563', fontFamily: 'monospace', whiteSpace: 'nowrap', marginTop: 2 }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#f97316', fontFamily: 'monospace', marginRight: 8 }}>{log.action}</span>
                          <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'monospace' }}>{log.details}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          MODERATOR PANEL
      ═══════════════════════════════════════════ */}
      {isModerator && !isOwner && modPanelOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)', zIndex: 2000, overflowY: 'auto' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
            <div style={{ background: 'rgba(59,130,246,0.06)', border: '2px solid #3b82f650', borderRadius: 20, padding: '24px 28px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: '#3b82f6', fontFamily: 'system-ui' }}>🛡️ MODERATOR PANEL</h1>
              <button onClick={() => setModPanelOpen(false)} style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid #3b82f650', borderRadius: 12, padding: '10px 20px', color: '#3b82f6', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'system-ui' }}>✕ Close</button>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[{ id: 'players', label: '👥 Players' }, { id: 'logs', label: '📋 Logs' }].map(tab => (
                <button key={tab.id} onClick={() => setModTab(tab.id)} style={{ padding: '9px 20px', borderRadius: 10, border: `1px solid ${modTab === tab.id ? '#3b82f6' : 'rgba(255,255,255,0.08)'}`, background: modTab === tab.id ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)', color: modTab === tab.id ? '#3b82f6' : '#9ca3af', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'system-ui' }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {modTab === 'players' && (
              <div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search players…"
                    style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 10, padding: '10px 16px', color: '#fff', fontSize: 13, fontFamily: 'system-ui', outline: 'none' }} />
                  <button onClick={loadAllPlayers} style={{ padding: '10px 20px', background: '#3b82f6', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'system-ui' }}>🔄</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {filteredPlayers.map(player => (
                    <div key={player.playerId} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, fontFamily: 'system-ui', marginBottom: 2 }}>{player.playerName}</div>
                        <span style={{ fontSize: 11, color: '#4b5563', fontFamily: 'monospace' }}>{player.playerId} • Lv {player.level || 0}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {[
                          ['⚠️ Warn', '#f59e0b', async () => {
                            const reason = window.prompt('Warning reason:');
                            if (!reason) return;
                            await api.updatePlayer(player.playerId, { warnings: (player.warnings || 0) + 1 });
                            createNotification(`✓ Warned ${player.playerName}`);
                            addModLog('WARN', `Warned ${player.playerName}: ${reason}`);
                          }],
                          ['🔇 Mute', '#3b82f6', async () => {
                            const mins = window.prompt('Mute duration (minutes):');
                            if (!mins || isNaN(mins)) return;
                            await api.updatePlayer(player.playerId, { muted: true, muteExpires: Date.now() + parseInt(mins) * 60000 });
                            createNotification(`✓ Muted ${player.playerName}`);
                            addModLog('MUTE', `Muted ${player.playerName} for ${mins}m`);
                          }],
                          ['🔄 Reset', '#ef4444', async () => {
                            if (!window.confirm(`Reset ${player.playerName}'s progress?`)) return;
                            await api.updatePlayer(player.playerId, { cookies: 0, totalCookiesEarned: 0, cookiesPerClick: 1, cookiesPerSecond: 0, level: 1, prestige: 0 });
                            createNotification(`✓ Reset ${player.playerName}`);
                            addModLog('RESET', `Reset progress for ${player.playerName}`);
                            loadAllPlayers();
                          }],
                        ].map(([label, color, action]) => (
                          <button key={label} onClick={action} style={{ padding: '6px 12px', background: `${color}18`, border: `1px solid ${color}40`, borderRadius: 7, color: color, fontWeight: 700, fontSize: 11, cursor: 'pointer', fontFamily: 'system-ui' }}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {modTab === 'logs' && (
              <div>
                {modLogs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: '#4b5563', fontFamily: 'system-ui' }}>No logs yet</div>
                ) : modLogs.map(log => (
                  <div key={log.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 14px', marginBottom: 6, display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 10, color: '#4b5563', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', fontFamily: 'monospace', marginRight: 8 }}>{log.action}</span>
                    <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'monospace' }}>{log.details}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ textAlign: 'center', padding: '24px', fontSize: 11, color: '#1f2937', fontFamily: 'monospace' }}>
        Created by Z3N0 • Cookie Empire Ultimate Edition V2.0
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<UltimateCookieEmpire />);
