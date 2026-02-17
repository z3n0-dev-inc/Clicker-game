const { useState, useEffect, useRef, useCallback, useMemo } = React;

// API Configuration
const API_URL = 'https://clicker-game-production.up.railway.app/api';
const OWNER_CODE = 'EMPIRE2025';

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
  ],
  effects: [
    { id: 'none', name: 'No Effect', rarity: 'common', cost: 0 },
    { id: 'sparkles', name: 'Sparkle Trail', rarity: 'rare', cost: 1000000 },
    { id: 'flames', name: 'Flame Aura', rarity: 'epic', cost: 5000000 },
    { id: 'lightning', name: 'Lightning Strikes', rarity: 'legendary', cost: 25000000 },
    { id: 'rainbow', name: 'Rainbow Pulse', rarity: 'legendary', cost: 40000000 },
    { id: 'galaxy', name: 'Galaxy Swirl', rarity: 'legendary', cost: 100000000 },
  ],
  titles: [
    { id: 'none', name: 'No Title', display: '', rarity: 'common', cost: 0 },
    { id: 'baker', name: 'Master Baker', display: '🍞 Master Baker', rarity: 'rare', cost: 250000 },
    { id: 'legend', name: 'Cookie Legend', display: '⚡ Cookie Legend', rarity: 'epic', cost: 7500000 },
    { id: 'emperor', name: 'Cookie Emperor', display: '👑 Cookie Emperor', rarity: 'legendary', cost: 75000000 },
    { id: 'god', name: 'Cookie God', display: '✨ Cookie God', rarity: 'legendary', cost: 500000000 },
    { id: 'owner', name: 'Game Owner', display: '⚡ OWNER', rarity: 'owner', cost: 0, ownerOnly: true },
  ]
};

const OWNER_COSMETICS = {
  cookies: [
    { id: 'admin', name: 'Admin Cookie', emoji: '⚡', rarity: 'owner' },
    { id: 'dev', name: 'Developer Cookie', emoji: '💻', rarity: 'owner' },
    { id: 'master', name: 'Master Cookie', emoji: '🎯', rarity: 'owner' },
    { id: 'infinity', name: 'Infinity Cookie', emoji: '♾️', rarity: 'owner' },
  ],
  themes: [
    { id: 'admin', name: 'Admin Panel', bg: '#0a0505', accent: '#fbbf24', secondary: '#f59e0b', rarity: 'owner' },
    { id: 'dev', name: 'Developer Mode', bg: '#050a05', accent: '#10b981', secondary: '#14b8a6', rarity: 'owner' },
    { id: 'owner', name: 'Owner Exclusive', bg: '#050505', accent: '#f97316', secondary: '#fb923c', rarity: 'owner' },
  ],
};

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
  
  // Difficulty
  const [criticalFailChance, setCriticalFailChance] = useState(0);
  const [criticalFails, setCriticalFails] = useState(0);
  
  // Owner state
  const [isOwner, setIsOwner] = useState(false);
  const [ownerPanelOpen, setOwnerPanelOpen] = useState(false);
  const [ownerTab, setOwnerTab] = useState('quick');
  
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
  
  // Cosmetics
  const [ownedCosmetics, setOwnedCosmetics] = useState({
    cookies: ['default'],
    themes: ['default'],
    effects: ['none'],
    titles: ['none']
  });
  const [equippedCosmetics, setEquippedCosmetics] = useState({
    cookie: 'default',
    theme: 'default',
    effect: 'none',
    title: 'none'
  });
  
  // UI state
  const [showCosmeticsMenu, setShowCosmeticsMenu] = useState(false);
  const [showCosmeticsShop, setShowCosmeticsShop] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
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
  
  // Owner management
  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [ownerSearchQuery, setOwnerSearchQuery] = useState('');
  
  // ACHIEVEMENTS
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
  ]);
  
  // UPGRADES
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
        setCriticalFails(data.criticalFails || 0);
      }
    };
    loadData();
  }, [api]);
  
  // Auto-save
  useEffect(() => {
    if (!playerName) return;
    
    const saveInterval = setInterval(async () => {
      setSaveStatus('saving');
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
        criticalFails
      });
      
      setSaveStatus(result.success ? 'saved' : 'error');
    }, 30000);
    
    return () => clearInterval(saveInterval);
  }, [playerName, cookies, totalCookiesEarned, cookiesPerClick, cookiesPerSecond, totalClicks, level, xp, prestige, prestigeTokens, upgrades, prestigeUpgrades, achievements, ownedCosmetics, equippedCosmetics, criticalFails, api]);
  
  // Helper functions
  const formatNumber = useCallback((num) => {
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
  
  // Calculate critical fail chance
  useEffect(() => {
    let chance = Math.min(0.2, level * 0.0015);
    
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
  }, [level, prestigeUpgrades, upgrades]);
  
  // Auto-generate cookies
  useEffect(() => {
    const interval = setInterval(() => {
      if (cookiesPerSecond > 0) {
        const amount = (cookiesPerSecond / 10) * getPrestigeMultiplier();
        setCookies(c => c + amount);
        setTotalCookiesEarned(t => t + amount);
        
        const xpBoost = prestigeUpgrades && prestigeUpgrades.find(pu => pu.id === 'p9' && pu.owned);
        const xpMult = xpBoost ? 1.5 : 1;
        setXp(x => x + (amount / 30) * xpMult);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [cookiesPerSecond, getPrestigeMultiplier, prestigeUpgrades]);
  
  // Level up
  useEffect(() => {
    const required = getLevelRequirement(level);
    if (xp >= required) {
      setXp(xp - required);
      setLevel(level + 1);
      createNotification(`Level ${level + 1} reached!`);
      
      const bonus = level * 100;
      setCookies(c => c + bonus);
      createNotification(`+${formatNumber(bonus)} bonus cookies`);
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
  
  // Check achievements
  const checkAchievements = useCallback(() => {
    if (!achievements || achievements.length === 0) return;
    
    const newAchievements = [...achievements];
    let changed = false;
    
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
    ];
    
    checks.forEach(({ index, condition }) => {
      if (newAchievements[index] && !newAchievements[index].unlocked && condition) {
        newAchievements[index].unlocked = true;
        changed = true;
        const reward = newAchievements[index].reward;
        setCookies(c => c + reward);
        createNotification(`🏆 ${newAchievements[index].name}! +${formatNumber(reward)}`);
      }
    });
    
    if (changed) setAchievements(newAchievements);
  }, [achievements, totalCookiesEarned, totalClicks, level, cookiesPerSecond, upgrades, prestige, criticalFails, formatNumber, createNotification]);
  
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
    }
  }, [totalClicks, achievements, createNotification]);
  
  // Handle click
  const handleClick = useCallback((e) => {
    if (Math.random() < criticalFailChance) {
      const lossAmount = Math.floor(cookies * 0.15);
      setCookies(c => Math.max(0, c - lossAmount));
      setCriticalFails(cf => cf + 1);
      createNotification(`💀 Critical fail! -${formatNumber(lossAmount)}`);
      createParticle(window.innerWidth / 2, window.innerHeight / 2, 'FAIL!', '#ef4444');
      return;
    }
    
    const earnedAmount = cookiesPerClick * getPrestigeMultiplier();
    setCookies(c => c + earnedAmount);
    setTotalCookiesEarned(t => t + earnedAmount);
    
    const xpBoost = prestigeUpgrades && prestigeUpgrades.find(pu => pu.id === 'p9' && pu.owned);
    const xpMult = xpBoost ? 1.5 : 1;
    setXp(x => x + (earnedAmount / 15) * xpMult);
    setTotalClicks(tc => tc + 1);
    
    clickTimeWindowRef.current.push(Date.now());
    
    const now = Date.now();
    if (now - lastClickTime < 500) {
      setClickStreak(cs => cs + 1);
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
      createParticle(x, y + 40, `STREAK x${clickStreak}!`, '#f97316');
    }
  }, [criticalFailChance, cookies, cookiesPerClick, getPrestigeMultiplier, lastClickTime, clickStreak, formatNumber, prestigeUpgrades, createNotification, createParticle]);
  
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
      createNotification(`✓ ${cosmetic.name}`);
    }
  }, [cookies, ownedCosmetics, createNotification]);
  
  const equipCosmetic = useCallback((type, id) => {
    setEquippedCosmetics(ec => ({ ...ec, [type]: id }));
    const item = [...COSMETICS[type + 's'], ...(isOwner ? OWNER_COSMETICS[type + 's'] || [] : [])].find(c => c.id === id);
    createNotification(`✓ Equipped ${item?.name || 'item'}`);
  }, [createNotification, isOwner]);
  
  const getRarityColor = useCallback((rarity) => {
    switch (rarity) {
      case 'common': return '#9ca3af';
      case 'rare': return '#60a5fa';
      case 'epic': return '#a78bfa';
      case 'legendary': return '#fbbf24';
      case 'owner': return '#f97316';
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
  
  // Owner functions
  const loadAllPlayers = useCallback(async () => {
    const result = await api.getAllPlayers();
    if (result.success && Array.isArray(result.data)) {
      setAllPlayers(result.data);
    }
  }, [api]);
  
  useEffect(() => {
    if (isOwner && ownerPanelOpen) {
      loadAllPlayers();
    }
  }, [isOwner, ownerPanelOpen, loadAllPlayers]);
  
  // OWNER COMMANDS
  const ownerDeletePlayer = useCallback(async (targetPlayerId) => {
    if (confirm(`Delete player ${targetPlayerId}? This cannot be undone!`)) {
      const result = await api.deletePlayer(targetPlayerId);
      if (result.success) {
        createNotification(`✓ Player deleted`);
        loadAllPlayers();
      } else {
        createNotification(`✗ Failed to delete player`);
      }
    }
  }, [api, createNotification, loadAllPlayers]);
  
  const ownerResetPlayerEconomy = useCallback(async (targetPlayerId) => {
    if (confirm(`Reset economy for player ${targetPlayerId}?`)) {
      const result = await api.updatePlayer(targetPlayerId, {
        cookies: 0,
        totalCookiesEarned: 0,
        cookiesPerClick: 1,
        cookiesPerSecond: 0
      });
      if (result.success) {
        createNotification(`✓ Economy reset`);
        loadAllPlayers();
      } else {
        createNotification(`✗ Failed to reset`);
      }
    }
  }, [api, createNotification, loadAllPlayers]);
  
  const ownerGiveCosmetic = useCallback(async (targetPlayerId, cosmeticType, cosmeticId) => {
    const result = await api.updatePlayer(targetPlayerId, {
      [`ownedCosmetics.${cosmeticType}s`]: cosmeticId
    });
    if (result.success) {
      createNotification(`✓ Cosmetic given`);
    } else {
      createNotification(`✗ Failed`);
    }
  }, [api, createNotification]);
  
  const ownerGodMode = useCallback(() => {
    setCookies(999999999999999);
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
      titles: COSMETICS.titles.map(t => t.id)
    });
    createNotification('👑 GOD MODE');
  }, [createNotification, achievements]);
  
  // Get equipped items
  const getEquippedCookie = useCallback(() => {
    const allCookies = isOwner ? [...COSMETICS.cookies, ...OWNER_COSMETICS.cookies] : COSMETICS.cookies;
    return allCookies.find(c => c.id === equippedCosmetics.cookie) || COSMETICS.cookies[0];
  }, [equippedCosmetics.cookie, isOwner]);
  
  const getEquippedTheme = useCallback(() => {
    const allThemes = isOwner ? [...COSMETICS.themes, ...OWNER_COSMETICS.themes] : COSMETICS.themes;
    return allThemes.find(t => t.id === equippedCosmetics.theme) || COSMETICS.themes[0];
  }, [equippedCosmetics.theme, isOwner]);
  
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
              ULTIMATE EDITION
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
              Start Game
            </button>
          </div>
          
          <div className="text-center mt-6 text-xs text-gray-500">
            Made by Z3N0
          </div>
        </div>
      </div>
    );
  }
  
  const filteredPlayers = allPlayers.filter(p => 
    p.playerName?.toLowerCase().includes(ownerSearchQuery.toLowerCase()) ||
    p.playerId?.toLowerCase().includes(ownerSearchQuery.toLowerCase())
  );
  
  // Main game UI
  return (
    <div className="min-h-screen" style={{ backgroundColor: equippedTheme.bg }}>
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
            className="px-4 py-3 rounded-lg shadow-lg text-sm font-medium"
            style={{ 
              backgroundColor: equippedTheme.accent,
              animation: 'slideIn 0.3s ease-out',
              fontFamily: 'system-ui'
            }}
          >
            {notif.message}
          </div>
        ))}
      </div>
      
      {/* Save indicator */}
      <div className="fixed top-4 left-4 z-40 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-gray-400" style={{ fontFamily: 'monospace' }}>
        {saveStatus === 'saving' && '💾 Saving'}
        {saveStatus === 'saved' && '✓ Saved'}
        {saveStatus === 'error' && '✗ Error'}
      </div>
      
      {/* Critical fail warning */}
      {criticalFailChance > 0 && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-red-900/60 backdrop-blur-sm px-4 py-2 rounded-lg text-xs text-red-200" style={{ fontFamily: 'monospace' }}>
          💀 {(criticalFailChance * 100).toFixed(1)}% fail
        </div>
      )}
      
      {/* Owner access */}
      {!isOwner && (
        <button
          onClick={() => {
            const code = prompt('Owner code:');
            if (code === OWNER_CODE) {
              setIsOwner(true);
              setOwnerPanelOpen(true);
              setOwnedCosmetics(oc => ({
                ...oc,
                titles: [...oc.titles, 'owner']
              }));
              setEquippedCosmetics(ec => ({ ...ec, title: 'owner' }));
              createNotification('👑 OWNER ACCESS');
            } else if (code) {
              createNotification('✗ Invalid code');
            }
          }}
          className="fixed bottom-4 left-4 w-10 h-10 rounded-full flex items-center justify-center opacity-10 hover:opacity-100 transition-opacity z-40"
          style={{ backgroundColor: equippedTheme.accent }}
        >
          <span className="text-lg">👑</span>
        </button>
      )}
      
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-black mb-2" style={{ 
            background: `linear-gradient(135deg, ${equippedTheme.accent} 0%, ${equippedTheme.secondary} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'system-ui',
            letterSpacing: '-0.05em'
          }}>
            COOKIE EMPIRE
          </h1>
          <div className="flex items-center justify-center gap-3 text-sm">
            {equippedTitle.display && (
              <span className="font-bold" style={{ 
                color: getRarityColor(equippedTitle.rarity),
                fontFamily: 'system-ui'
              }}>
                {equippedTitle.display}
              </span>
            )}
            <span className="text-gray-400" style={{ fontFamily: 'system-ui' }}>
              {playerName}
            </span>
          </div>
          {isOwner && (
            <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ 
              backgroundColor: '#f97316',
              color: '#000',
              fontFamily: 'system-ui'
            }}>
              ⚡ OWNER
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setShowLeaderboard(true)}
            className="px-4 py-2 rounded-lg font-medium text-sm transition-all hover:scale-105"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontFamily: 'system-ui'
            }}
          >
            🏆 Leaderboard
          </button>
          
          <button
            onClick={() => setShowAchievements(true)}
            className="px-4 py-2 rounded-lg font-medium text-sm transition-all hover:scale-105"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontFamily: 'system-ui'
            }}
          >
            🎖️ Achievements
          </button>
          
          <button
            onClick={() => setShowCosmeticsMenu(true)}
            className="px-4 py-2 rounded-lg font-medium text-sm transition-all hover:scale-105"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontFamily: 'system-ui'
            }}
          >
            🎨 Wardrobe
          </button>
          
          <button
            onClick={() => setShowCosmeticsShop(true)}
            className="px-4 py-2 rounded-lg font-medium text-sm transition-all hover:scale-105"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontFamily: 'system-ui'
            }}
          >
            🛒 Shop
          </button>
          
          {isOwner && (
            <button
              onClick={() => setOwnerPanelOpen(true)}
              className="px-4 py-2 rounded-lg font-medium text-sm transition-all hover:scale-105"
              style={{ 
                backgroundColor: '#f97316',
                color: '#000',
                fontFamily: 'system-ui'
              }}
            >
              👑 Owner
            </button>
          )}
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left */}
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
                    {formatNumber(cookiesPerClick)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'monospace' }}>PER SECOND</div>
                  <div className="text-2xl font-bold" style={{ 
                    color: equippedTheme.secondary,
                    fontFamily: 'system-ui'
                  }}>
                    {formatNumber(cookiesPerSecond)}
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
              <div>
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
                <div className="mt-4 bg-black/30 rounded-lg p-3 border border-gray-700/50">
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
                    🔥 STREAK: {clickStreak}x
                  </div>
                </div>
              )}
            </div>
            
            {/* Clicker */}
            <div className="text-center">
              <button
                onClick={handleClick}
                className="w-64 h-64 md:w-80 md:h-80 text-9xl rounded-full active:scale-95 transition-all select-none mx-auto relative overflow-hidden"
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  background: `linear-gradient(135deg, ${equippedTheme.accent} 0%, ${equippedTheme.secondary} 100%)`,
                  boxShadow: `0 10px 40px ${equippedTheme.accent}40`,
                  border: '4px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%)' }} />
                <span className="relative z-10">{equippedCookie.emoji}</span>
              </button>
              <div className="mt-6 text-xl font-bold text-gray-300" style={{ fontFamily: 'system-ui' }}>
                Tap for {formatNumber(cookiesPerClick * getPrestigeMultiplier())} cookies
              </div>
              {criticalFailChance > 0 && (
                <div className="mt-2 text-sm text-red-400" style={{ fontFamily: 'monospace' }}>
                  ⚠️ {(criticalFailChance * 100).toFixed(1)}% fail (-15%)
                </div>
              )}
            </div>
          </div>
          
          {/* Right */}
          <div>
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 max-h-[800px] overflow-y-auto">
              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('click')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'click' ? 'text-white' : 'text-gray-400'
                  }`}
                  style={{ 
                    backgroundColor: activeTab === 'click' ? equippedTheme.accent : 'transparent',
                    fontFamily: 'system-ui'
                  }}
                >
                  Click
                </button>
                <button
                  onClick={() => setActiveTab('auto')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'auto' ? 'text-white' : 'text-gray-400'
                  }`}
                  style={{ 
                    backgroundColor: activeTab === 'auto' ? equippedTheme.accent : 'transparent',
                    fontFamily: 'system-ui'
                  }}
                >
                  Auto
                </button>
                <button
                  onClick={() => setActiveTab('prestige')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'prestige' ? 'text-white' : 'text-gray-400'
                  }`}
                  style={{ 
                    backgroundColor: activeTab === 'prestige' ? equippedTheme.accent : 'transparent',
                    fontFamily: 'system-ui'
                  }}
                >
                  Prestige
                </button>
              </div>
              
              {/* Click upgrades */}
              {activeTab === 'click' && (
                <div className="space-y-2">
                  {upgrades && upgrades.filter(u => u.type === 'click' || u.type === 'click_mult' || u.type === 'efficiency' || u.type === 'luck').map(upgrade => {
                    const costReduction = prestigeUpgrades && prestigeUpgrades.find(pu => pu.id === 'p10' && pu.owned);
                    const finalCost = costReduction ? Math.floor(upgrade.cost * 0.8) : upgrade.cost;
                    const canAfford = cookies >= finalCost;
                    const isMaxed = upgrade.maxOwned && upgrade.owned >= upgrade.maxOwned;
                    
                    return (
                      <div
                        key={upgrade.id}
                        className={`bg-black/30 rounded-lg p-3 border transition-colors ${
                          canAfford && !isMaxed ? 'border-gray-600 hover:border-gray-500' : 'border-gray-800 opacity-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{upgrade.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white text-sm mb-1" style={{ fontFamily: 'system-ui' }}>
                              {upgrade.name}
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
                              className="w-full py-2 rounded-lg font-medium text-xs transition-colors disabled:cursor-not-allowed"
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
                  {upgrades && upgrades.filter(u => u.type === 'auto').map(upgrade => {
                    const costReduction = prestigeUpgrades && prestigeUpgrades.find(pu => pu.id === 'p10' && pu.owned);
                    const finalCost = costReduction ? Math.floor(upgrade.cost * 0.8) : upgrade.cost;
                    const canAfford = cookies >= finalCost;
                    
                    return (
                      <div
                        key={upgrade.id}
                        className={`bg-black/30 rounded-lg p-3 border transition-colors ${
                          canAfford ? 'border-gray-600 hover:border-gray-500' : 'border-gray-800 opacity-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{upgrade.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white text-sm mb-1" style={{ fontFamily: 'system-ui' }}>
                              {upgrade.name}
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
                              className="w-full py-2 rounded-lg font-medium text-xs transition-colors disabled:cursor-not-allowed"
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
                          className="w-full py-3 rounded-lg font-bold transition-colors"
                          style={{
                            backgroundColor: equippedTheme.accent,
                            color: '#fff',
                            fontFamily: 'system-ui'
                          }}
                        >
                          PRESTIGE
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {prestigeUpgrades && prestigeUpgrades.map(pu => (
                          <div
                            key={pu.id}
                            className={`bg-black/30 rounded-lg p-3 border ${
                              pu.owned ? 'border-green-600' : prestigeTokens >= pu.cost ? 'border-gray-600 hover:border-gray-500' : 'border-gray-800 opacity-50'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
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
                                className="w-full py-2 rounded-lg font-medium text-xs transition-colors disabled:cursor-not-allowed"
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
                        ({30 - level} levels)
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* MODALS */}
      
      {/* Leaderboard */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowLeaderboard(false)}>
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'system-ui' }}>
                🏆 Leaderboard
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
                  leaderboard.map((player, index) => (
                    <div
                      key={player.playerId}
                      className={`flex items-center gap-4 p-3 rounded-lg ${
                        player.playerName === playerName ? 'bg-purple-900/40 border border-purple-500/50' : 'bg-black/30'
                      }`}
                    >
                      <div className={`text-2xl font-black w-10 text-center ${
                        index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-gray-500'
                      }`} style={{ fontFamily: 'system-ui' }}>
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white" style={{ fontFamily: 'system-ui' }}>
                          {player.playerName}
                        </div>
                        <div className="text-xs text-gray-400" style={{ fontFamily: 'monospace' }}>
                          {formatNumber(player.totalCookiesEarned || 0)} • Lvl {player.level || 0} • P{player.prestige || 0}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-400" style={{ fontFamily: 'system-ui' }}>
                          {formatNumber((player.totalCookiesEarned || 0) + ((player.level || 0) * 1000) + ((player.prestige || 0) * 50000))}
                        </div>
                        <div className="text-xs text-gray-400">score</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            
            <button
              onClick={updateLeaderboard}
              className="w-full mt-4 py-2 rounded-lg font-medium text-sm"
              style={{
                backgroundColor: equippedTheme.accent,
                color: '#fff',
                fontFamily: 'system-ui'
              }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      )}
      
      {/* Achievements */}
      {showAchievements && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAchievements(false)}>
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'system-ui' }}>
                🎖️ Achievements ({achievements ? achievements.filter(a => a.unlocked).length : 0}/{achievements ? achievements.length : 0})
              </h2>
              <button
                onClick={() => setShowAchievements(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {achievements && achievements.map(ach => (
                <div
                  key={ach.id}
                  className={`p-4 rounded-lg border text-center ${
                    ach.unlocked ? 'bg-yellow-900/20 border-yellow-500/50' : 'bg-black/30 border-gray-700 opacity-40'
                  }`}
                >
                  <div className="text-4xl mb-2">{ach.icon}</div>
                  <div className="text-xs font-semibold text-white mb-1" style={{ fontFamily: 'system-ui' }}>
                    {ach.name}
                  </div>
                  <div className="text-xs text-gray-400" style={{ fontFamily: 'system-ui' }}>
                    {ach.desc}
                  </div>
                  {ach.unlocked && (
                    <div className="text-xs text-yellow-400 mt-1" style={{ fontFamily: 'monospace' }}>
                      +{formatNumber(ach.reward)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Cosmetics Shop - abbreviated for space */}
      {showCosmeticsShop && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto p-4" onClick={() => setShowCosmeticsShop(false)}>
          <div className="max-w-5xl mx-auto my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'system-ui' }}>
                  🛒 Shop
                </h2>
                <button onClick={() => setShowCosmeticsShop(false)} className="text-gray-400 hover:text-white text-2xl">
                  ✕
                </button>
              </div>
              
              <div className="mb-6 text-center">
                <div className="text-xl font-bold text-yellow-400" style={{ fontFamily: 'system-ui' }}>
                  {formatNumber(cookies)} 🍪
                </div>
              </div>
              
              {/* Cookie skins */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'system-ui' }}>
                  Cookie Skins
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
                        className={`p-3 rounded-lg border transition-all ${
                          owned ? 'bg-green-900/40 border-green-500' : canAfford ? 'bg-black/30 border-gray-600 hover:border-gray-500' : 'bg-black/20 border-gray-800 opacity-40'
                        }`}
                      >
                        <div className="text-4xl mb-2">{cookie.emoji}</div>
                        <div className="text-xs font-semibold mb-1" style={{ color: getRarityColor(cookie.rarity), fontFamily: 'system-ui' }}>
                          {cookie.name}
                        </div>
                        <div className="text-xs text-yellow-400" style={{ fontFamily: 'monospace' }}>
                          {cookie.cost === 0 ? 'FREE' : formatNumber(cookie.cost)}
                        </div>
                        {owned && <div className="text-xs text-green-400 mt-1">✓</div>}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Similar sections for themes, effects, titles... */}
            </div>
          </div>
        </div>
      )}
      
      {/* Wardrobe - abbreviated */}
      {showCosmeticsMenu && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto p-4" onClick={() => setShowCosmeticsMenu(false)}>
          <div className="max-w-5xl mx-auto my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'system-ui' }}>
                  🎨 Wardrobe
                </h2>
                <button onClick={() => setShowCosmeticsMenu(false)} className="text-gray-400 hover:text-white text-2xl">
                  ✕
                </button>
              </div>
              {/* Similar content as shop but for equipped items */}
            </div>
          </div>
        </div>
      )}
      
      {/* OWNER PANEL - MASSIVELY ENHANCED */}
      {isOwner && ownerPanelOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto p-4" onClick={() => setOwnerPanelOpen(false)}>
          <div className="max-w-6xl mx-auto my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-900 rounded-xl border border-orange-500 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-orange-400" style={{ fontFamily: 'system-ui' }}>
                  👑 OWNER DASHBOARD
                </h2>
                <button onClick={() => setOwnerPanelOpen(false)} className="text-gray-400 hover:text-white text-2xl">
                  ✕
                </button>
              </div>
              
              {/* Owner tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setOwnerTab('quick')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    ownerTab === 'quick' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                  style={{ fontFamily: 'system-ui' }}
                >
                  Quick Actions
                </button>
                <button
                  onClick={() => setOwnerTab('players')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    ownerTab === 'players' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                  style={{ fontFamily: 'system-ui' }}
                >
                  Player Management
                </button>
                <button
                  onClick={() => setOwnerTab('stats')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    ownerTab === 'stats' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                  style={{ fontFamily: 'system-ui' }}
                >
                  Stats & Analytics
                </button>
              </div>
              
              {/* Quick actions */}
              {ownerTab === 'quick' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => setCookies(c => c + 1000000)}
                      className="bg-orange-600 hover:bg-orange-500 px-4 py-3 rounded-lg font-medium text-sm transition-colors"
                      style={{ fontFamily: 'system-ui' }}
                    >
                      +1M Cookies
                    </button>
                    <button
                      onClick={() => setCookies(c => c + 1000000000)}
                      className="bg-orange-600 hover:bg-orange-500 px-4 py-3 rounded-lg font-medium text-sm transition-colors"
                      style={{ fontFamily: 'system-ui' }}
                    >
                      +1B Cookies
                    </button>
                    <button
                      onClick={() => setLevel(100)}
                      className="bg-orange-600 hover:bg-orange-500 px-4 py-3 rounded-lg font-medium text-sm transition-colors"
                      style={{ fontFamily: 'system-ui' }}
                    >
                      Level 100
                    </button>
                    <button
                      onClick={() => setPrestige(50)}
                      className="bg-orange-600 hover:bg-orange-500 px-4 py-3 rounded-lg font-medium text-sm transition-colors"
                      style={{ fontFamily: 'system-ui' }}
                    >
                      Prestige 50
                    </button>
                    <button
                      onClick={() => setPrestigeTokens(9999)}
                      className="bg-orange-600 hover:bg-orange-500 px-4 py-3 rounded-lg font-medium text-sm transition-colors"
                      style={{ fontFamily: 'system-ui' }}
                    >
                      9999 Tokens
                    </button>
                    <button
                      onClick={() => setCookiesPerSecond(999999999)}
                      className="bg-orange-600 hover:bg-orange-500 px-4 py-3 rounded-lg font-medium text-sm transition-colors"
                      style={{ fontFamily: 'system-ui' }}
                    >
                      Max CPS
                    </button>
                    <button
                      onClick={() => setCookiesPerClick(999999999)}
                      className="bg-orange-600 hover:bg-orange-500 px-4 py-3 rounded-lg font-medium text-sm transition-colors"
                      style={{ fontFamily: 'system-ui' }}
                    >
                      Max CPC
                    </button>
                    <button
                      onClick={() => {
                        if (achievements) {
                          setAchievements(ach => ach.map(a => ({ ...a, unlocked: true })));
                        }
                        createNotification('✓ All achievements');
                      }}
                      className="bg-orange-600 hover:bg-orange-500 px-4 py-3 rounded-lg font-medium text-sm transition-colors"
                      style={{ fontFamily: 'system-ui' }}
                    >
                      All Achievements
                    </button>
                    <button
                      onClick={ownerGodMode}
                      className="bg-yellow-600 hover:bg-yellow-500 px-4 py-3 rounded-lg font-bold text-sm transition-colors"
                      style={{ fontFamily: 'system-ui' }}
                    >
                      👑 GOD MODE
                    </button>
                  </div>
                  
                  {/* Current stats */}
                  <div className="bg-black/30 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'system-ui' }}>
                      Your Stats
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm" style={{ fontFamily: 'monospace' }}>
                      <div>
                        <div className="text-gray-400">Cookies</div>
                        <div className="text-white font-bold">{formatNumber(cookies)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">CPC</div>
                        <div className="text-white font-bold">{formatNumber(cookiesPerClick)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">CPS</div>
                        <div className="text-white font-bold">{formatNumber(cookiesPerSecond)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Level</div>
                        <div className="text-white font-bold">{level}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Prestige</div>
                        <div className="text-white font-bold">{prestige}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Tokens</div>
                        <div className="text-white font-bold">{prestigeTokens}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Total</div>
                        <div className="text-white font-bold">{formatNumber(totalCookiesEarned)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Clicks</div>
                        <div className="text-white font-bold">{formatNumber(totalClicks)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Player management */}
              {ownerTab === 'players' && (
                <div className="space-y-4">
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={ownerSearchQuery}
                      onChange={(e) => setOwnerSearchQuery(e.target.value)}
                      placeholder="Search players..."
                      className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                      style={{ fontFamily: 'system-ui' }}
                    />
                    <button
                      onClick={loadAllPlayers}
                      className="bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-lg font-medium text-sm"
                      style={{ fontFamily: 'system-ui' }}
                    >
                      🔄 Refresh
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredPlayers.map(player => (
                      <div key={player.playerId} className="bg-black/30 rounded-lg p-4 border border-gray-700">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-bold text-white" style={{ fontFamily: 'system-ui' }}>
                              {player.playerName || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-400" style={{ fontFamily: 'monospace' }}>
                              ID: {player.playerId}
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedPlayer(player.playerId === selectedPlayer ? null : player.playerId)}
                            className="text-orange-400 hover:text-orange-300 text-sm"
                          >
                            {selectedPlayer === player.playerId ? '▼' : '▶'}
                          </button>
                        </div>
                        
                        {selectedPlayer === player.playerId && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-xs" style={{ fontFamily: 'monospace' }}>
                              <div>
                                <span className="text-gray-400">Cookies:</span>
                                <span className="text-white ml-2">{formatNumber(player.cookies || 0)}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Level:</span>
                                <span className="text-white ml-2">{player.level || 0}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Prestige:</span>
                                <span className="text-white ml-2">{player.prestige || 0}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Total:</span>
                                <span className="text-white ml-2">{formatNumber(player.totalCookiesEarned || 0)}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => ownerResetPlayerEconomy(player.playerId)}
                                className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded-lg font-medium text-xs"
                                style={{ fontFamily: 'system-ui' }}
                              >
                                Reset Economy
                              </button>
                              <button
                                onClick={() => ownerDeletePlayer(player.playerId)}
                                className="bg-red-800 hover:bg-red-700 px-3 py-2 rounded-lg font-medium text-xs"
                                style={{ fontFamily: 'system-ui' }}
                              >
                                Delete Player
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Stats */}
              {ownerTab === 'stats' && (
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'system-ui' }}>
                      Global Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm" style={{ fontFamily: 'monospace' }}>
                      <div>
                        <div className="text-gray-400">Total Players</div>
                        <div className="text-2xl font-bold text-white">{allPlayers.length}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Active Players</div>
                        <div className="text-2xl font-bold text-white">
                          {allPlayers.filter(p => (p.totalClicks || 0) > 0).length}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400">Total Cookies</div>
                        <div className="text-2xl font-bold text-white">
                          {formatNumber(allPlayers.reduce((sum, p) => sum + (p.totalCookiesEarned || 0), 0))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/30 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'system-ui' }}>
                      Top Players
                    </h3>
                    <div className="space-y-2">
                      {allPlayers
                        .sort((a, b) => (b.totalCookiesEarned || 0) - (a.totalCookiesEarned || 0))
                        .slice(0, 5)
                        .map((player, idx) => (
                          <div key={player.playerId} className="flex justify-between items-center text-sm">
                            <span className="text-gray-400" style={{ fontFamily: 'system-ui' }}>
                              #{idx + 1} {player.playerName || 'Unknown'}
                            </span>
                            <span className="text-white font-bold" style={{ fontFamily: 'monospace' }}>
                              {formatNumber(player.totalCookiesEarned || 0)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Made by Z3N0 */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-600" style={{ fontFamily: 'monospace' }}>
        Made by Z3N0
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
      `}</style>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<UltimateCookieEmpire />);
