const { useState, useEffect, useRef, useCallback, useMemo } = React;

// API Configuration
const API_URL = 'https://clicker-game-production.up.railway.app/api';

// Lucide React icons
const Zap = () => <span>⚡</span>;
const Trophy = () => <span>🏆</span>;
const Crown = () => <span>👑</span>;
const Settings = () => <span>⚙️</span>;
const Lock = () => <span>🔒</span>;
const Unlock = () => <span>🔓</span>;
const Star = () => <span>⭐</span>;
const TrendingUp = () => <span>📈</span>;
const Award = () => <span>🎖️</span>;
const Shield = () => <span>🛡️</span>;
const Sparkles = () => <span>✨</span>;
const Flame = () => <span>🔥</span>;
const Target = () => <span>🎯</span>;
const Users = () => <span>👥</span>;
const ChevronRight = () => <span>▶</span>;
const RefreshCw = () => <span>🔄</span>;
const Eye = () => <span>👁️</span>;
const EyeOff = () => <span>🙈</span>;
const Code = () => <span>💻</span>;
const Database = () => <span>💾</span>;
const DollarSign = () => <span>💰</span>;
const Percent = () => <span>%</span>;
const X = () => <span>✖️</span>;
const Gift = () => <span>🎁</span>;
const Palette = () => <span>🎨</span>;
const Save = () => <span>💾</span>;
const Upload = () => <span>📤</span>;
const Download = () => <span>📥</span>;
const Skull = () => <span>💀</span>;
const Lightning = () => <span>⚡</span>;

// Available cosmetics (HARDER TO GET)
const COSMETICS = {
  cookies: [
    { id: 'default', name: 'Classic Cookie', emoji: '🍪', rarity: 'common', cost: 0 },
    { id: 'golden', name: 'Golden Cookie', emoji: '🥇', rarity: 'rare', cost: 50000 },
    { id: 'rainbow', name: 'Rainbow Cookie', emoji: '🌈', rarity: 'epic', cost: 500000 },
    { id: 'diamond', name: 'Diamond Cookie', emoji: '💎', rarity: 'legendary', cost: 5000000 },
    { id: 'fire', name: 'Fire Cookie', emoji: '🔥', rarity: 'epic', cost: 1000000 },
    { id: 'ice', name: 'Ice Cookie', emoji: '❄️', rarity: 'epic', cost: 1000000 },
    { id: 'cosmic', name: 'Cosmic Cookie', emoji: '🌌', rarity: 'legendary', cost: 10000000 },
    { id: 'heart', name: 'Heart Cookie', emoji: '❤️', rarity: 'rare', cost: 100000 },
    { id: 'star', name: 'Star Cookie', emoji: '⭐', rarity: 'rare', cost: 75000 },
    { id: 'skull', name: 'Skull Cookie', emoji: '💀', rarity: 'epic', cost: 2000000 },
    { id: 'alien', name: 'Alien Cookie', emoji: '👽', rarity: 'legendary', cost: 15000000 },
    { id: 'robot', name: 'Robot Cookie', emoji: '🤖', rarity: 'legendary', cost: 20000000 },
  ],
  themes: [
    { id: 'default', name: 'Cyber Purple', gradient: 'from-purple-900/20 via-black to-cyan-900/20', rarity: 'common', cost: 0 },
    { id: 'crimson', name: 'Crimson Flame', gradient: 'from-red-900/20 via-black to-orange-900/20', rarity: 'rare', cost: 250000 },
    { id: 'emerald', name: 'Emerald Dream', gradient: 'from-green-900/20 via-black to-teal-900/20', rarity: 'rare', cost: 250000 },
    { id: 'royal', name: 'Royal Gold', gradient: 'from-yellow-900/20 via-black to-amber-900/20', rarity: 'epic', cost: 1500000 },
    { id: 'ocean', name: 'Deep Ocean', gradient: 'from-blue-900/20 via-black to-cyan-900/20', rarity: 'epic', cost: 1500000 },
    { id: 'sunset', name: 'Sunset Blaze', gradient: 'from-orange-900/20 via-pink-900/20 to-purple-900/20', rarity: 'legendary', cost: 8000000 },
    { id: 'matrix', name: 'Matrix Code', gradient: 'from-green-500/10 via-black to-green-900/10', rarity: 'legendary', cost: 12000000 },
    { id: 'void', name: 'Void Space', gradient: 'from-black via-purple-950/20 to-black', rarity: 'legendary', cost: 25000000 },
  ],
  effects: [
    { id: 'none', name: 'No Effect', rarity: 'common', cost: 0 },
    { id: 'sparkles', name: 'Sparkle Trail', rarity: 'rare', cost: 500000 },
    { id: 'flames', name: 'Flame Aura', rarity: 'epic', cost: 2500000 },
    { id: 'lightning', name: 'Lightning Strikes', rarity: 'legendary', cost: 10000000 },
    { id: 'rainbow', name: 'Rainbow Pulse', rarity: 'legendary', cost: 15000000 },
  ],
  titles: [
    { id: 'none', name: 'No Title', display: '', rarity: 'common', cost: 0 },
    { id: 'baker', name: 'Master Baker', display: '🍞 Master Baker', rarity: 'rare', cost: 100000 },
    { id: 'legend', name: 'Cookie Legend', display: '⚡ Cookie Legend', rarity: 'epic', cost: 3000000 },
    { id: 'emperor', name: 'Cookie Emperor', display: '👑 Cookie Emperor', rarity: 'legendary', cost: 25000000 },
    { id: 'god', name: 'Cookie God', display: '✨ Cookie God', rarity: 'legendary', cost: 100000000 },
  ]
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
  
  // NEW: Difficulty modifiers
  const [difficulty, setDifficulty] = useState(1);
  const [criticalFailChance, setCriticalFailChance] = useState(0);
  
  // Owner dashboard state
  const [isOwner, setIsOwner] = useState(false);
  const [ownerPanelOpen, setOwnerPanelOpen] = useState(false);
  const [ownerTab, setOwnerTab] = useState('stats');
  const OWNER_CODE = 'EMPIRE2025';
  
  // Player identity - FIXED: Username persistence
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
  
  // Cosmetics state
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
  const [showCosmeticsMenu, setShowCosmeticsMenu] = useState(false);
  const [showCosmeticsShop, setShowCosmeticsShop] = useState(false);
  
  // Leaderboard
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  
  // Owner cosmetics management
  const [targetUsername, setTargetUsername] = useState('');
  const [selectedCosmetic, setSelectedCosmetic] = useState(null);
  const [allPlayers, setAllPlayers] = useState([]);
  
  // Auto-save state
  const [lastSaved, setLastSaved] = useState(Date.now());
  const [saveStatus, setSaveStatus] = useState('saved');
  
  // Achievements - MUCH HARDER
  const [achievements, setAchievements] = useState([
    { id: 'first_click', name: 'First Cookie', desc: 'Click your first cookie', unlocked: false, icon: '🍪', reward: 10 },
    { id: 'hundred_cookies', name: 'Cookie Collector', desc: 'Earn 1,000 cookies', unlocked: false, icon: '💰', reward: 100 },
    { id: 'thousand_cookies', name: 'Cookie Hoarder', desc: 'Earn 100,000 cookies', unlocked: false, icon: '💎', reward: 1000 },
    { id: 'first_upgrade', name: 'Investor', desc: 'Buy your first upgrade', unlocked: false, icon: '📈', reward: 50 },
    { id: 'level_5', name: 'Rising Star', desc: 'Reach level 10', unlocked: false, icon: '⭐', reward: 500 },
    { id: 'level_10', name: 'Cookie Master', desc: 'Reach level 25', unlocked: false, icon: '👑', reward: 2500 },
    { id: 'level_25', name: 'Cookie Overlord', desc: 'Reach level 50', unlocked: false, icon: '🔥', reward: 10000 },
    { id: 'level_50', name: 'Cookie Deity', desc: 'Reach level 100', unlocked: false, icon: '✨', reward: 50000 },
    { id: 'hundred_cps', name: 'Automation King', desc: '1,000 cookies per second', unlocked: false, icon: '⚡', reward: 5000 },
    { id: 'thousand_cps', name: 'Production Master', desc: '100,000 cookies per second', unlocked: false, icon: '🏭', reward: 50000 },
    { id: 'first_prestige', name: 'Ascended', desc: 'Prestige for the first time', unlocked: false, icon: '🌟', reward: 10000 },
    { id: 'prestige_5', name: 'Transcendent', desc: 'Reach prestige 10', unlocked: false, icon: '💫', reward: 100000 },
    { id: 'speed_demon', name: 'Speed Demon', desc: '100 clicks in 10 seconds', unlocked: false, icon: '🚀', reward: 5000 },
    { id: 'millionaire', name: 'Millionaire', desc: 'Earn 10,000,000 cookies', unlocked: false, icon: '💸', reward: 100000 },
    { id: 'billionaire', name: 'Billionaire', desc: 'Earn 1,000,000,000 cookies', unlocked: false, icon: '🏦', reward: 10000000 },
    { id: 'survivor', name: 'Survivor', desc: 'Survive 10 critical failures', unlocked: false, icon: '💀', reward: 50000 },
  ]);
  
  const [clickStreak, setClickStreak] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const clickTimeWindowRef = useRef([]);
  const [criticalFails, setCriticalFails] = useState(0);
  
  // Particle effects
  const [particles, setParticles] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Upgrades - MASSIVELY HARDER (100x cost increases)
  const [upgrades, setUpgrades] = useState([
    { id: 1, name: 'Cursed Spatula', desc: 'x2 cookies per click', cost: 50, owned: 0, type: 'click', multiplier: 2, icon: '🥄', tier: 1 },
    { id: 2, name: 'Magic Mixer', desc: 'x3 cookies per click', cost: 500, owned: 0, type: 'click', multiplier: 3, icon: '🎯', tier: 1 },
    { id: 3, name: 'Quantum Clicker', desc: 'x5 cookies per click', cost: 5000, owned: 0, type: 'click', multiplier: 5, icon: '⚛️', tier: 2 },
    { id: 4, name: 'God Hand', desc: 'x10 cookies per click', cost: 250000, owned: 0, type: 'click', multiplier: 10, icon: '✋', tier: 3 },
    { id: 5, name: 'Reality Warper', desc: 'x25 cookies per click', cost: 10000000, owned: 0, type: 'click', multiplier: 25, icon: '🌀', tier: 4 },
    
    { id: 10, name: 'Cookie Oven', desc: '+1 cookie/sec', cost: 200, owned: 0, type: 'auto', cps: 1, icon: '🔥', tier: 1 },
    { id: 11, name: 'Grandma Baker', desc: '+5 cookies/sec', cost: 1000, owned: 0, type: 'auto', cps: 5, icon: '👵', tier: 1 },
    { id: 12, name: 'Cookie Factory', desc: '+15 cookies/sec', cost: 5000, owned: 0, type: 'auto', cps: 15, icon: '🏭', tier: 2 },
    { id: 13, name: 'Cookie Farm', desc: '+50 cookies/sec', cost: 25000, owned: 0, type: 'auto', cps: 50, icon: '🌾', tier: 2 },
    { id: 14, name: 'Cookie Mine', desc: '+150 cookies/sec', cost: 150000, owned: 0, type: 'auto', cps: 150, icon: '⛏️', tier: 3 },
    { id: 15, name: 'Cookie Wizard', desc: '+500 cookies/sec', cost: 1000000, owned: 0, type: 'auto', cps: 500, icon: '🧙', tier: 3 },
    { id: 16, name: 'Cookie Portal', desc: '+2000 cookies/sec', cost: 10000000, owned: 0, type: 'auto', cps: 2000, icon: '🌀', tier: 4 },
    { id: 17, name: 'Cookie Dimension', desc: '+10000 cookies/sec', cost: 100000000, owned: 0, type: 'auto', cps: 10000, icon: '🌌', tier: 4 },
    { id: 18, name: 'Cookie Universe', desc: '+50000 cookies/sec', cost: 1000000000, owned: 0, type: 'auto', cps: 50000, icon: '🪐', tier: 5 },
    { id: 19, name: 'Cookie Multiverse', desc: '+250000 cookies/sec', cost: 10000000000, owned: 0, type: 'auto', cps: 250000, icon: '♾️', tier: 5 },
  ]);
  
  // Prestige upgrades - HARDER
  const [prestigeUpgrades, setPrestigeUpgrades] = useState([
    { id: 'p1', name: 'Cookie Blessing', desc: 'Start with 2x click power', cost: 3, owned: false, effect: 'click_start_2x' },
    { id: 'p2', name: 'Auto Starter', desc: 'Start with 10 CPS', cost: 5, owned: false, effect: 'cps_start_10' },
    { id: 'p3', name: 'Golden Touch', desc: '+10% all production', cost: 10, owned: false, effect: 'production_10' },
    { id: 'p4', name: 'Divine Fortune', desc: '+25% all production', cost: 20, owned: false, effect: 'production_25' },
    { id: 'p5', name: 'Cosmic Power', desc: '+50% all production', cost: 40, owned: false, effect: 'production_50' },
    { id: 'p6', name: 'Ultimate Force', desc: '+100% all production', cost: 80, owned: false, effect: 'production_100' },
    { id: 'p7', name: 'Reality Bender', desc: '+200% all production', cost: 150, owned: false, effect: 'production_200' },
    { id: 'p8', name: 'Luck Master', desc: 'Reduce critical fail chance', cost: 100, owned: false, effect: 'reduce_crit_fail' },
  ]);
  
  // Backend API functions - OPTIMIZED
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
        return await response.json();
      } catch (error) {
        console.error('Leaderboard fetch failed:', error);
        return { success: false, data: [] };
      }
    },
    
    giveCosmetic: async (username, cosmeticType, cosmeticId) => {
      try {
        const response = await fetch(`${API_URL}/owner/give-cosmetic`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ownerCode: OWNER_CODE,
            username,
            cosmeticType,
            cosmeticId
          })
        });
        return await response.json();
      } catch (error) {
        console.error('Give cosmetic failed:', error);
        return { success: false, error: error.message };
      }
    },
    
    getAllPlayers: async () => {
      try {
        const response = await fetch(`${API_URL}/owner/players`, {
          headers: { 'X-Owner-Code': OWNER_CODE }
        });
        return await response.json();
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
  }), [playerId, playerName, OWNER_CODE]);
  
  // Load progress on mount
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
        
        // Save username to localStorage
        if (data.playerName) {
          setPlayerName(data.playerName);
          localStorage.setItem('cookieEmpirePlayerName', data.playerName);
          setShowNameInput(false);
        }
        
        setUpgrades(data.upgrades || upgrades);
        setPrestigeUpgrades(data.prestigeUpgrades || prestigeUpgrades);
        setAchievements(data.achievements || achievements);
        setOwnedCosmetics(data.ownedCosmetics || ownedCosmetics);
        setEquippedCosmetics(data.equippedCosmetics || equippedCosmetics);
        setCriticalFails(data.criticalFails || 0);
      }
    };
    loadData();
  }, [api]);
  
  // Auto-save every 30 seconds - FIXED
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
      
      if (result.success) {
        setSaveStatus('saved');
        setLastSaved(Date.now());
      } else {
        setSaveStatus('error');
      }
    }, 30000);
    
    return () => clearInterval(saveInterval);
  }, [playerName, cookies, totalCookiesEarned, cookiesPerClick, cookiesPerSecond, totalClicks, level, xp, prestige, prestigeTokens, upgrades, prestigeUpgrades, achievements, ownedCosmetics, equippedCosmetics, criticalFails, api]);
  
  // Level requirements - MUCH HARDER (exponential scaling)
  const getLevelRequirement = useCallback((lvl) => {
    return Math.floor(500 * Math.pow(2, lvl - 1));
  }, []);
  
  // Calculate prestige bonus
  const getPrestigeMultiplier = useCallback(() => {
    let mult = 1;
    prestigeUpgrades.forEach(pu => {
      if (pu.owned) {
        if (pu.effect === 'production_10') mult *= 1.1;
        if (pu.effect === 'production_25') mult *= 1.25;
        if (pu.effect === 'production_50') mult *= 1.5;
        if (pu.effect === 'production_100') mult *= 2;
        if (pu.effect === 'production_200') mult *= 3;
      }
    });
    return mult;
  }, [prestigeUpgrades]);
  
  // NEW: Calculate critical fail chance
  useEffect(() => {
    let chance = Math.min(0.15, level * 0.001); // Max 15% chance
    const hasLuckMaster = prestigeUpgrades.find(pu => pu.id === 'p8' && pu.owned);
    if (hasLuckMaster) chance *= 0.5;
    setCriticalFailChance(chance);
  }, [level, prestigeUpgrades]);
  
  // Auto-generate cookies
  useEffect(() => {
    const interval = setInterval(() => {
      if (cookiesPerSecond > 0) {
        const amount = (cookiesPerSecond / 10) * getPrestigeMultiplier();
        setCookies(c => c + amount);
        setTotalCookiesEarned(t => t + amount);
        setXp(x => x + amount / 20); // Slower XP gain
      }
    }, 100);
    return () => clearInterval(interval);
  }, [cookiesPerSecond, getPrestigeMultiplier]);
  
  // Level up logic
  useEffect(() => {
    const required = getLevelRequirement(level);
    if (xp >= required) {
      setXp(xp - required);
      setLevel(level + 1);
      createNotification(`🎉 LEVEL UP! You're now level ${level + 1}!`);
      
      // Smaller level rewards
      const bonus = level * 50;
      setCookies(c => c + bonus);
      createNotification(`+${bonus} bonus cookies!`);
    }
  }, [xp, level, getLevelRequirement]);
  
  // Check achievements
  const checkAchievements = useCallback(() => {
    const newAchievements = [...achievements];
    let changed = false;
    
    const checks = [
      { index: 0, condition: totalClicks > 0 },
      { index: 1, condition: totalCookiesEarned >= 1000 },
      { index: 2, condition: totalCookiesEarned >= 100000 },
      { index: 3, condition: upgrades.some(u => u.owned > 0) },
      { index: 4, condition: level >= 10 },
      { index: 5, condition: level >= 25 },
      { index: 6, condition: level >= 50 },
      { index: 7, condition: level >= 100 },
      { index: 8, condition: cookiesPerSecond >= 1000 },
      { index: 9, condition: cookiesPerSecond >= 100000 },
      { index: 10, condition: prestige > 0 },
      { index: 11, condition: prestige >= 10 },
      { index: 13, condition: totalCookiesEarned >= 10000000 },
      { index: 14, condition: totalCookiesEarned >= 1000000000 },
      { index: 15, condition: criticalFails >= 10 },
    ];
    
    checks.forEach(({ index, condition }) => {
      if (!newAchievements[index].unlocked && condition) {
        newAchievements[index].unlocked = true;
        changed = true;
        const reward = newAchievements[index].reward;
        setCookies(c => c + reward);
        createNotification(`🏆 Achievement: ${newAchievements[index].name}! +${formatNumber(reward)} cookies!`);
      }
    });
    
    if (changed) setAchievements(newAchievements);
  }, [achievements, totalCookiesEarned, totalClicks, level, cookiesPerSecond, upgrades, prestige, criticalFails]);
  
  useEffect(() => {
    checkAchievements();
  }, [checkAchievements]);
  
  // Click tracking for speed demon achievement
  useEffect(() => {
    const now = Date.now();
    clickTimeWindowRef.current = clickTimeWindowRef.current.filter(t => now - t < 10000);
    
    if (clickTimeWindowRef.current.length >= 100 && !achievements[12].unlocked) {
      const newAch = [...achievements];
      newAch[12].unlocked = true;
      setAchievements(newAch);
      setCookies(c => c + 5000);
      createNotification('🏆 Achievement: Speed Demon! +5,000 cookies!');
    }
  }, [totalClicks, achievements]);
  
  // Handle click - WITH CRITICAL FAILURES
  const handleClick = useCallback((e) => {
    // NEW: Critical fail mechanic
    if (Math.random() < criticalFailChance) {
      const lossAmount = Math.floor(cookies * 0.1); // Lose 10% of cookies
      setCookies(c => Math.max(0, c - lossAmount));
      setCriticalFails(cf => cf + 1);
      createNotification(`💀 CRITICAL FAIL! Lost ${formatNumber(lossAmount)} cookies!`);
      createParticle(window.innerWidth / 2, window.innerHeight / 2, '💀 FAIL!', '#ff0000');
      return;
    }
    
    const earnedAmount = cookiesPerClick * getPrestigeMultiplier();
    setCookies(c => c + earnedAmount);
    setTotalCookiesEarned(t => t + earnedAmount);
    setXp(x => x + earnedAmount / 10); // Slower XP gain
    setTotalClicks(tc => tc + 1);
    
    clickTimeWindowRef.current.push(Date.now());
    
    // Streak logic
    const now = Date.now();
    if (now - lastClickTime < 500) {
      setClickStreak(cs => cs + 1);
    } else {
      setClickStreak(1);
    }
    setLastClickTime(now);
    
    // Particle effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);
    createParticle(x, y, `+${formatNumber(earnedAmount)}`);
    
    // Bonus for streak (harder to maintain)
    if (clickStreak > 20 && clickStreak % 20 === 0) {
      const bonus = earnedAmount * 3;
      setCookies(c => c + bonus);
      setTotalCookiesEarned(t => t + bonus);
      createParticle(x, y + 30, `🔥 MEGA STREAK x${clickStreak}!`, '#ff6b00');
    }
    
    // Create visual effect based on equipped effect
    if (equippedCosmetics.effect === 'sparkles') {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          createParticle(x + (Math.random() - 0.5) * 50, y + (Math.random() - 0.5) * 50, '✨', '#FFD700');
        }, i * 100);
      }
    }
  }, [criticalFailChance, cookies, cookiesPerClick, getPrestigeMultiplier, lastClickTime, clickStreak, equippedCosmetics.effect]);
  
  const createParticle = useCallback((x, y, text, color = '#ffd700') => {
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
    }, 3000);
  }, []);
  
  const formatNumber = useCallback((num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toLocaleString();
  }, []);
  
  const buyUpgrade = useCallback((upgrade) => {
    if (cookies >= upgrade.cost) {
      setCookies(c => c - upgrade.cost);
      
      const updatedUpgrades = upgrades.map(u => {
        if (u.id === upgrade.id) {
          const newOwned = u.owned + 1;
          const newCost = Math.floor(u.cost * 1.25); // Steeper cost scaling
          
          if (u.type === 'click') {
            setCookiesPerClick(cpc => cpc * u.multiplier);
          } else if (u.type === 'auto') {
            setCookiesPerSecond(cps => cps + u.cps);
          }
          
          return { ...u, owned: newOwned, cost: newCost };
        }
        return u;
      });
      
      setUpgrades(updatedUpgrades);
      createNotification(`Purchased ${upgrade.name}!`);
    }
  }, [cookies, upgrades, createNotification]);
  
  const buyPrestigeUpgrade = useCallback((upgrade) => {
    if (prestigeTokens >= upgrade.cost && !upgrade.owned) {
      setPrestigeTokens(pt => pt - upgrade.cost);
      
      const updated = prestigeUpgrades.map(pu => {
        if (pu.id === upgrade.id) {
          if (pu.effect === 'click_start_2x') {
            setCookiesPerClick(c => c * 2);
          }
          if (pu.effect === 'cps_start_10') {
            setCookiesPerSecond(cps => cps + 10);
          }
          return { ...pu, owned: true };
        }
        return pu;
      });
      
      setPrestigeUpgrades(updated);
      createNotification(`Unlocked ${upgrade.name}!`);
    }
  }, [prestigeTokens, prestigeUpgrades, createNotification]);
  
  // Prestige - MUCH HARDER
  const doPrestige = useCallback(() => {
    if (level < 25) {
      createNotification('⚠️ Reach level 25 to prestige!');
      return;
    }
    
    const tokensEarned = Math.floor(level / 10); // Fewer tokens
    
    if (confirm(`Prestige and earn ${tokensEarned} tokens? This will reset ALL progress!`)) {
      let startClick = 1;
      let startCPS = 0;
      
      prestigeUpgrades.forEach(pu => {
        if (pu.owned && pu.effect === 'click_start_2x') startClick *= 2;
        if (pu.owned && pu.effect === 'cps_start_10') startCPS += 10;
      });
      
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
      
      // Reset upgrades
      setUpgrades([
        { id: 1, name: 'Cursed Spatula', desc: 'x2 cookies per click', cost: 50, owned: 0, type: 'click', multiplier: 2, icon: '🥄', tier: 1 },
        { id: 2, name: 'Magic Mixer', desc: 'x3 cookies per click', cost: 500, owned: 0, type: 'click', multiplier: 3, icon: '🎯', tier: 1 },
        { id: 3, name: 'Quantum Clicker', desc: 'x5 cookies per click', cost: 5000, owned: 0, type: 'click', multiplier: 5, icon: '⚛️', tier: 2 },
        { id: 4, name: 'God Hand', desc: 'x10 cookies per click', cost: 250000, owned: 0, type: 'click', multiplier: 10, icon: '✋', tier: 3 },
        { id: 5, name: 'Reality Warper', desc: 'x25 cookies per click', cost: 10000000, owned: 0, type: 'click', multiplier: 25, icon: '🌀', tier: 4 },
        { id: 10, name: 'Cookie Oven', desc: '+1 cookie/sec', cost: 200, owned: 0, type: 'auto', cps: 1, icon: '🔥', tier: 1 },
        { id: 11, name: 'Grandma Baker', desc: '+5 cookies/sec', cost: 1000, owned: 0, type: 'auto', cps: 5, icon: '👵', tier: 1 },
        { id: 12, name: 'Cookie Factory', desc: '+15 cookies/sec', cost: 5000, owned: 0, type: 'auto', cps: 15, icon: '🏭', tier: 2 },
        { id: 13, name: 'Cookie Farm', desc: '+50 cookies/sec', cost: 25000, owned: 0, type: 'auto', cps: 50, icon: '🌾', tier: 2 },
        { id: 14, name: 'Cookie Mine', desc: '+150 cookies/sec', cost: 150000, owned: 0, type: 'auto', cps: 150, icon: '⛏️', tier: 3 },
        { id: 15, name: 'Cookie Wizard', desc: '+500 cookies/sec', cost: 1000000, owned: 0, type: 'auto', cps: 500, icon: '🧙', tier: 3 },
        { id: 16, name: 'Cookie Portal', desc: '+2000 cookies/sec', cost: 10000000, owned: 0, type: 'auto', cps: 2000, icon: '🌀', tier: 4 },
        { id: 17, name: 'Cookie Dimension', desc: '+10000 cookies/sec', cost: 100000000, owned: 0, type: 'auto', cps: 10000, icon: '🌌', tier: 4 },
        { id: 18, name: 'Cookie Universe', desc: '+50000 cookies/sec', cost: 1000000000, owned: 0, type: 'auto', cps: 50000, icon: '🪐', tier: 5 },
        { id: 19, name: 'Cookie Multiverse', desc: '+250000 cookies/sec', cost: 10000000000, owned: 0, type: 'auto', cps: 250000, icon: '♾️', tier: 5 },
      ]);
      
      createNotification(`🌟 PRESTIGE ${prestige + 1}! +${tokensEarned} tokens!`);
      updateLeaderboard();
    }
  }, [level, prestige, prestigeUpgrades, createNotification]);
  
  const updateLeaderboard = useCallback(async () => {
    setLeaderboardLoading(true);
    const result = await api.getLeaderboard();
    if (result.success) {
      setLeaderboard(result.data);
    }
    setLeaderboardLoading(false);
  }, [api]);
  
  useEffect(() => {
    if (showLeaderboard) {
      updateLeaderboard();
    }
  }, [showLeaderboard, updateLeaderboard]);
  
  // NEW: Buy cosmetic with cookies
  const buyCosmetic = useCallback((type, cosmetic) => {
    if (cookies >= cosmetic.cost && !ownedCosmetics[type + 's'].includes(cosmetic.id)) {
      setCookies(c => c - cosmetic.cost);
      setOwnedCosmetics(oc => ({
        ...oc,
        [type + 's']: [...oc[type + 's'], cosmetic.id]
      }));
      createNotification(`🎨 Purchased ${cosmetic.name}!`);
    }
  }, [cookies, ownedCosmetics, createNotification]);
  
  // Cosmetics functions
  const equipCosmetic = useCallback((type, id) => {
    setEquippedCosmetics(ec => ({ ...ec, [type]: id }));
    createNotification(`Equipped ${COSMETICS[type + 's'].find(c => c.id === id).name}!`);
  }, [createNotification]);
  
  const getRarityColor = useCallback((rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-white';
    }
  }, []);
  
  const getRarityBorder = useCallback((rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-500/50';
      case 'rare': return 'border-blue-500/50';
      case 'epic': return 'border-purple-500/50';
      case 'legendary': return 'border-yellow-500/50';
      default: return 'border-gray-500/50';
    }
  }, []);
  
  // Owner functions
  const ownerGiveCosmetic = useCallback(async () => {
    if (!targetUsername || !selectedCosmetic) {
      createNotification('❌ Select username and cosmetic');
      return;
    }
    
    const result = await api.giveCosmetic(targetUsername, selectedCosmetic.type, selectedCosmetic.id);
    if (result.success) {
      createNotification(`✅ Gave ${selectedCosmetic.name} to ${targetUsername}`);
      setTargetUsername('');
      setSelectedCosmetic(null);
    } else {
      createNotification(`❌ Failed: ${result.error || 'Unknown error'}`);
    }
  }, [targetUsername, selectedCosmetic, api, createNotification]);
  
  const loadAllPlayers = useCallback(async () => {
    const result = await api.getAllPlayers();
    if (result.success) {
      setAllPlayers(result.data);
    }
  }, [api]);
  
  useEffect(() => {
    if (isOwner && ownerTab === 'players') {
      loadAllPlayers();
    }
  }, [isOwner, ownerTab, loadAllPlayers]);
  
  // OWNER DASHBOARD FUNCTIONS
  const ownerSetCookies = useCallback((amount) => {
    setCookies(amount);
    createNotification(`🔧 Set cookies to ${formatNumber(amount)}`);
  }, [formatNumber, createNotification]);
  
  const ownerAddCookies = useCallback((amount) => {
    setCookies(c => c + amount);
    createNotification(`🔧 Added ${formatNumber(amount)} cookies`);
  }, [formatNumber, createNotification]);
  
  const ownerSetLevel = useCallback((lvl) => {
    setLevel(lvl);
    createNotification(`🔧 Set level to ${lvl}`);
  }, [createNotification]);
  
  const ownerSetPrestige = useCallback((p) => {
    setPrestige(p);
    createNotification(`🔧 Set prestige to ${p}`);
  }, [createNotification]);
  
  const ownerSetPrestigeTokens = useCallback((tokens) => {
    setPrestigeTokens(tokens);
    createNotification(`🔧 Set prestige tokens to ${tokens}`);
  }, [createNotification]);
  
  const ownerMultiplyCookies = useCallback((mult) => {
    setCookies(c => Math.floor(c * mult));
    createNotification(`🔧 Multiplied cookies by ${mult}x`);
  }, [createNotification]);
  
  const ownerSetCPS = useCallback((cps) => {
    setCookiesPerSecond(cps);
    createNotification(`🔧 Set CPS to ${formatNumber(cps)}`);
  }, [formatNumber, createNotification]);
  
  const ownerSetCPC = useCallback((cpc) => {
    setCookiesPerClick(cpc);
    createNotification(`🔧 Set CPC to ${formatNumber(cpc)}`);
  }, [formatNumber, createNotification]);
  
  const ownerUnlockAllAchievements = useCallback(() => {
    setAchievements(ach => ach.map(a => ({ ...a, unlocked: true })));
    createNotification('🔧 All achievements unlocked');
  }, [createNotification]);
  
  const ownerUnlockAllCosmetics = useCallback(() => {
    setOwnedCosmetics({
      cookies: COSMETICS.cookies.map(c => c.id),
      themes: COSMETICS.themes.map(t => t.id),
      effects: COSMETICS.effects.map(e => e.id),
      titles: COSMETICS.titles.map(t => t.id)
    });
    createNotification('🔧 All cosmetics unlocked');
  }, [createNotification]);
  
  const ownerMaxAllUpgrades = useCallback(() => {
    const maxed = upgrades.map(u => ({ ...u, owned: 100 }));
    setUpgrades(maxed);
    
    let totalCPC = 1;
    let totalCPS = 0;
    maxed.forEach(u => {
      if (u.type === 'click') totalCPC *= Math.pow(u.multiplier, u.owned);
      if (u.type === 'auto') totalCPS += u.cps * u.owned;
    });
    
    setCookiesPerClick(totalCPC);
    setCookiesPerSecond(totalCPS);
    createNotification('🔧 All upgrades maxed to 100');
  }, [upgrades, createNotification]);
  
  const ownerGodMode = useCallback(() => {
    ownerSetCookies(999999999999);
    ownerSetLevel(999);
    ownerSetPrestige(99);
    ownerSetPrestigeTokens(9999);
    ownerSetCPS(10000000);
    ownerSetCPC(10000000);
    ownerUnlockAllAchievements();
    ownerUnlockAllCosmetics();
    createNotification('👑 GOD MODE ACTIVATED');
  }, [ownerSetCookies, ownerSetLevel, ownerSetPrestige, ownerSetPrestigeTokens, ownerSetCPS, ownerSetCPC, ownerUnlockAllAchievements, ownerUnlockAllCosmetics, createNotification]);
  
  const ownerResetGame = useCallback(() => {
    if (confirm('Reset ENTIRE game? This cannot be undone!')) {
      setCookies(0);
      setTotalCookiesEarned(0);
      setCookiesPerClick(1);
      setCookiesPerSecond(0);
      setTotalClicks(0);
      setLevel(1);
      setXp(0);
      setPrestige(0);
      setPrestigeTokens(0);
      setCriticalFails(0);
      setAchievements(ach => ach.map(a => ({ ...a, unlocked: false })));
      setUpgrades([
        { id: 1, name: 'Cursed Spatula', desc: 'x2 cookies per click', cost: 50, owned: 0, type: 'click', multiplier: 2, icon: '🥄', tier: 1 },
        { id: 2, name: 'Magic Mixer', desc: 'x3 cookies per click', cost: 500, owned: 0, type: 'click', multiplier: 3, icon: '🎯', tier: 1 },
        { id: 3, name: 'Quantum Clicker', desc: 'x5 cookies per click', cost: 5000, owned: 0, type: 'click', multiplier: 5, icon: '⚛️', tier: 2 },
        { id: 4, name: 'God Hand', desc: 'x10 cookies per click', cost: 250000, owned: 0, type: 'click', multiplier: 10, icon: '✋', tier: 3 },
        { id: 5, name: 'Reality Warper', desc: 'x25 cookies per click', cost: 10000000, owned: 0, type: 'click', multiplier: 25, icon: '🌀', tier: 4 },
        { id: 10, name: 'Cookie Oven', desc: '+1 cookie/sec', cost: 200, owned: 0, type: 'auto', cps: 1, icon: '🔥', tier: 1 },
        { id: 11, name: 'Grandma Baker', desc: '+5 cookies/sec', cost: 1000, owned: 0, type: 'auto', cps: 5, icon: '👵', tier: 1 },
        { id: 12, name: 'Cookie Factory', desc: '+15 cookies/sec', cost: 5000, owned: 0, type: 'auto', cps: 15, icon: '🏭', tier: 2 },
        { id: 13, name: 'Cookie Farm', desc: '+50 cookies/sec', cost: 25000, owned: 0, type: 'auto', cps: 50, icon: '🌾', tier: 2 },
        { id: 14, name: 'Cookie Mine', desc: '+150 cookies/sec', cost: 150000, owned: 0, type: 'auto', cps: 150, icon: '⛏️', tier: 3 },
        { id: 15, name: 'Cookie Wizard', desc: '+500 cookies/sec', cost: 1000000, owned: 0, type: 'auto', cps: 500, icon: '🧙', tier: 3 },
        { id: 16, name: 'Cookie Portal', desc: '+2000 cookies/sec', cost: 10000000, owned: 0, type: 'auto', cps: 2000, icon: '🌀', tier: 4 },
        { id: 17, name: 'Cookie Dimension', desc: '+10000 cookies/sec', cost: 100000000, owned: 0, type: 'auto', cps: 10000, icon: '🌌', tier: 4 },
        { id: 18, name: 'Cookie Universe', desc: '+50000 cookies/sec', cost: 1000000000, owned: 0, type: 'auto', cps: 50000, icon: '🪐', tier: 5 },
        { id: 19, name: 'Cookie Multiverse', desc: '+250000 cookies/sec', cost: 10000000000, owned: 0, type: 'auto', cps: 250000, icon: '♾️', tier: 5 },
      ]);
      setPrestigeUpgrades(pu => pu.map(p => ({ ...p, owned: false })));
      setOwnedCosmetics({
        cookies: ['default'],
        themes: ['default'],
        effects: ['none'],
        titles: ['none']
      });
      setEquippedCosmetics({
        cookie: 'default',
        theme: 'default',
        effect: 'none',
        title: 'none'
      });
      createNotification('🔧 Game fully reset');
    }
  }, [createNotification]);
  
  // Get current equipped cosmetics
  const getEquippedCookie = useCallback(() => {
    return COSMETICS.cookies.find(c => c.id === equippedCosmetics.cookie) || COSMETICS.cookies[0];
  }, [equippedCosmetics.cookie]);
  
  const getEquippedTheme = useCallback(() => {
    return COSMETICS.themes.find(t => t.id === equippedCosmetics.theme) || COSMETICS.themes[0];
  }, [equippedCosmetics.theme]);
  
  const getEquippedTitle = useCallback(() => {
    return COSMETICS.titles.find(t => t.id === equippedCosmetics.title) || COSMETICS.titles[0];
  }, [equippedCosmetics.title]);
  
  // Save username to localStorage when START button is clicked
  const handleStartEmpire = useCallback(() => {
    if (playerName) {
      localStorage.setItem('cookieEmpirePlayerName', playerName);
      setShowNameInput(false);
    }
  }, [playerName]);
  
  // Name input screen
  if (showNameInput) {
    const equippedTheme = getEquippedTheme();
    
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${equippedTheme.gradient}`} />
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)
          `
        }} />
        
        <div className="relative z-10 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 animate-pulse" 
                style={{ fontFamily: 'Impact, sans-serif' }}>
              COOKIE EMPIRE
            </h1>
            <p className="text-cyan-300 text-xl font-bold" style={{ fontFamily: 'Courier New, monospace' }}>
              HARDCORE EDITION
            </p>
            <p className="text-cyan-400 text-sm mt-2">
              100x Harder • Critical Fails • Epic Rewards
            </p>
            <p className="text-red-400 text-xs mt-2">
              ⚠️ WARNING: This game is EXTREMELY difficult!
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-2xl border-2 border-cyan-500/30 p-8 shadow-2xl">
            <label className="block text-cyan-300 mb-4 text-lg font-semibold">
              ENTER YOUR NAME:
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && playerName && handleStartEmpire()}
              className="w-full bg-black/50 border-2 border-cyan-500/50 rounded-lg px-4 py-3 text-white text-xl focus:outline-none focus:border-cyan-400 transition-all"
              placeholder="Enter username"
              autoFocus
              maxLength={20}
            />
            <button
              onClick={handleStartEmpire}
              disabled={!playerName}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg text-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
            >
              START HARDCORE MODE
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const equippedCookie = getEquippedCookie();
  const equippedTheme = getEquippedTheme();
  const equippedTitle = getEquippedTitle();
  
  // Main game render
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background */}
      <div className={`fixed inset-0 bg-gradient-to-br ${equippedTheme.gradient}`} />
      <div className="fixed inset-0" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 50% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)
        `,
        animation: 'pulse 10s ease-in-out infinite'
      }} />
      
      {/* Save status indicator */}
      <div className="fixed top-4 left-4 z-40 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg border border-cyan-500/30">
        <Save className="w-4 h-4" />
        <span className="text-xs text-cyan-300">
          {saveStatus === 'saving' && '💾 Saving...'}
          {saveStatus === 'saved' && '✅ Saved'}
          {saveStatus === 'error' && '❌ Save Error'}
        </span>
      </div>
      
      {/* NEW: Critical fail warning */}
      {criticalFailChance > 0 && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-red-900/60 backdrop-blur-md px-4 py-2 rounded-lg border border-red-500/30">
          <span className="text-xs text-red-300 flex items-center gap-2">
            <Skull className="w-4 h-4" />
            CRITICAL FAIL CHANCE: {(criticalFailChance * 100).toFixed(1)}%
          </span>
        </div>
      )}
      
      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-50 font-black text-2xl"
          style={{
            left: particle.x,
            top: particle.y,
            color: particle.color,
            textShadow: `0 0 10px ${particle.color}`,
            animation: 'floatUp 1s ease-out forwards'
          }}
        >
          {particle.text}
        </div>
      ))}
      
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-3 rounded-lg shadow-2xl border border-cyan-400/50 animate-slideInRight backdrop-blur-md"
            style={{ animation: 'slideInRight 0.3s ease-out' }}
          >
            {notif.message}
          </div>
        ))}
      </div>
      
      {/* Owner access button */}
      {!isOwner && (
        <button
          onClick={() => {
            const code = prompt('Enter owner code:');
            if (code === OWNER_CODE) {
              setIsOwner(true);
              setOwnerPanelOpen(true);
              createNotification('👑 OWNER ACCESS GRANTED');
            } else if (code) {
              createNotification('❌ Invalid owner code');
            }
          }}
          className="fixed bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center opacity-20 hover:opacity-100 transition-all z-40 shadow-lg"
        >
          <Crown className="w-6 h-6" />
        </button>
      )}
      
      {/* Main game content */}
      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-5xl md:text-6xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400"
              style={{ fontFamily: 'Impact, sans-serif', textShadow: '0 0 30px rgba(168, 85, 247, 0.5)' }}>
            COOKIE EMPIRE
          </h1>
          <div className="text-cyan-300 text-lg" style={{ fontFamily: 'Courier New, monospace' }}>
            {equippedTitle.display && <span className="mr-2">{equippedTitle.display}</span>}
            <span className="text-pink-400 font-bold">{playerName}</span>
          </div>
          <div className="text-red-400 text-sm mt-1">
            💀 HARDCORE MODE • {criticalFails} Critical Fails
          </div>
        </div>
        
        {/* Top navigation */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg border border-pink-500/50"
          >
            <Trophy className="w-5 h-5" />
            LEADERBOARD
          </button>
          
          <button
            onClick={() => setShowCosmeticsMenu(true)}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg border border-purple-500/50"
          >
            <Palette className="w-5 h-5" />
            WARDROBE
          </button>
          
          <button
            onClick={() => setShowCosmeticsShop(true)}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg border border-cyan-500/50"
          >
            <DollarSign className="w-5 h-5" />
            SHOP
          </button>
          
          {isOwner && (
            <button
              onClick={() => setOwnerPanelOpen(true)}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg border border-yellow-500/50"
            >
              <Crown className="w-5 h-5" />
              OWNER
            </button>
          )}
        </div>
        
        {/* COSMETICS SHOP MODAL - NEW */}
        {showCosmeticsShop && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-cyan-900/60 to-blue-900/60 rounded-2xl border-2 border-cyan-500/50 p-6 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-4xl font-black text-cyan-400 flex items-center gap-3">
                    <DollarSign className="w-10 h-10" />
                    COSMETICS SHOP
                  </h2>
                  <button
                    onClick={() => setShowCosmeticsShop(false)}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>
                
                <div className="mb-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    Your Cookies: {formatNumber(cookies)} 🍪
                  </div>
                </div>
                
                {/* Cookie skins for sale */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-3">COOKIE SKINS</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {COSMETICS.cookies.map(cookie => {
                      const owned = ownedCosmetics.cookies.includes(cookie.id);
                      const canAfford = cookies >= cookie.cost;
                      return (
                        <button
                          key={cookie.id}
                          onClick={() => !owned && canAfford && buyCosmetic('cookie', cookie)}
                          disabled={owned || !canAfford}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            owned
                              ? 'bg-green-900/40 border-green-500 cursor-not-allowed'
                              : canAfford
                              ? `bg-black/40 ${getRarityBorder(cookie.rarity)} hover:scale-105 cursor-pointer`
                              : 'bg-black/20 border-gray-700 opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <div className="text-5xl mb-2">{cookie.emoji}</div>
                          <div className={`text-sm font-bold ${getRarityColor(cookie.rarity)}`}>
                            {cookie.name}
                          </div>
                          <div className="text-xs text-yellow-400 mt-1">
                            {cookie.cost === 0 ? 'FREE' : formatNumber(cookie.cost) + ' 🍪'}
                          </div>
                          {owned && <div className="text-xs text-green-400 mt-1">✓ OWNED</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Themes for sale */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-3">THEMES</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {COSMETICS.themes.map(theme => {
                      const owned = ownedCosmetics.themes.includes(theme.id);
                      const canAfford = cookies >= theme.cost;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => !owned && canAfford && buyCosmetic('theme', theme)}
                          disabled={owned || !canAfford}
                          className={`p-4 rounded-lg border-2 transition-all overflow-hidden relative ${
                            owned
                              ? 'border-green-500 cursor-not-allowed'
                              : canAfford
                              ? `${getRarityBorder(theme.rarity)} hover:scale-105 cursor-pointer`
                              : 'border-gray-700 opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />
                          <div className="relative z-10">
                            <div className={`text-sm font-bold ${getRarityColor(theme.rarity)} mb-1`}>
                              {theme.name}
                            </div>
                            <div className="text-xs text-yellow-400 mt-1">
                              {theme.cost === 0 ? 'FREE' : formatNumber(theme.cost) + ' 🍪'}
                            </div>
                            {owned && <div className="text-xs text-green-400 mt-1">✓ OWNED</div>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Effects for sale */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-3">EFFECTS</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {COSMETICS.effects.map(effect => {
                      const owned = ownedCosmetics.effects.includes(effect.id);
                      const canAfford = cookies >= effect.cost;
                      return (
                        <button
                          key={effect.id}
                          onClick={() => !owned && canAfford && buyCosmetic('effect', effect)}
                          disabled={owned || !canAfford}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            owned
                              ? 'bg-green-900/40 border-green-500 cursor-not-allowed'
                              : canAfford
                              ? `bg-black/40 ${getRarityBorder(effect.rarity)} hover:scale-105 cursor-pointer`
                              : 'bg-black/20 border-gray-700 opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <div className={`text-sm font-bold ${getRarityColor(effect.rarity)} mb-1`}>
                            {effect.name}
                          </div>
                          <div className="text-xs text-yellow-400 mt-1">
                            {effect.cost === 0 ? 'FREE' : formatNumber(effect.cost) + ' 🍪'}
                          </div>
                          {owned && <div className="text-xs text-green-400 mt-1">✓ OWNED</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Titles for sale */}
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-3">TITLES</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {COSMETICS.titles.map(title => {
                      const owned = ownedCosmetics.titles.includes(title.id);
                      const canAfford = cookies >= title.cost;
                      return (
                        <button
                          key={title.id}
                          onClick={() => !owned && canAfford && buyCosmetic('title', title)}
                          disabled={owned || !canAfford}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            owned
                              ? 'bg-green-900/40 border-green-500 cursor-not-allowed'
                              : canAfford
                              ? `bg-black/40 ${getRarityBorder(title.rarity)} hover:scale-105 cursor-pointer`
                              : 'bg-black/20 border-gray-700 opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <div className={`font-bold text-lg ${getRarityColor(title.rarity)} mb-1`}>
                            {title.display || title.name}
                          </div>
                          <div className="text-xs text-yellow-400 mt-1">
                            {title.cost === 0 ? 'FREE' : formatNumber(title.cost) + ' 🍪'}
                          </div>
                          {owned && <div className="text-xs text-green-400 mt-1">✓ OWNED</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* WARDROBE MODAL */}
        {showCosmeticsMenu && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 rounded-2xl border-2 border-pink-500/50 p-6 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-4xl font-black text-pink-400 flex items-center gap-3">
                    <Palette className="w-10 h-10" />
                    WARDROBE
                  </h2>
                  <button
                    onClick={() => setShowCosmeticsMenu(false)}
                    className="text-pink-400 hover:text-pink-300 transition-colors"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>
                
                {/* Cookie skins */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-3">COOKIE SKINS</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {COSMETICS.cookies.map(cookie => {
                      const owned = ownedCosmetics.cookies.includes(cookie.id);
                      const equipped = equippedCosmetics.cookie === cookie.id;
                      return (
                        <button
                          key={cookie.id}
                          onClick={() => owned && equipCosmetic('cookie', cookie.id)}
                          disabled={!owned}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            equipped
                              ? 'bg-gradient-to-br from-pink-600/40 to-purple-600/40 border-pink-500 scale-105'
                              : owned
                              ? `bg-black/40 ${getRarityBorder(cookie.rarity)} hover:scale-105`
                              : 'bg-black/20 border-gray-700 opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <div className="text-5xl mb-2">{cookie.emoji}</div>
                          <div className={`text-sm font-bold ${getRarityColor(cookie.rarity)}`}>
                            {cookie.name}
                          </div>
                          {!owned && <div className="text-xs text-gray-500 mt-1">🔒 Locked</div>}
                          {equipped && <div className="text-xs text-pink-400 mt-1">✓ Equipped</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Themes */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-3">THEMES</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {COSMETICS.themes.map(theme => {
                      const owned = ownedCosmetics.themes.includes(theme.id);
                      const equipped = equippedCosmetics.theme === theme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => owned && equipCosmetic('theme', theme.id)}
                          disabled={!owned}
                          className={`p-4 rounded-lg border-2 transition-all overflow-hidden relative ${
                            equipped
                              ? 'border-pink-500 scale-105'
                              : owned
                              ? `${getRarityBorder(theme.rarity)} hover:scale-105`
                              : 'border-gray-700 opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />
                          <div className="relative z-10">
                            <div className={`text-sm font-bold ${getRarityColor(theme.rarity)}`}>
                              {theme.name}
                            </div>
                            {!owned && <div className="text-xs text-gray-500 mt-1">🔒 Locked</div>}
                            {equipped && <div className="text-xs text-pink-400 mt-1">✓ Equipped</div>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Effects */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-3">EFFECTS</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {COSMETICS.effects.map(effect => {
                      const owned = ownedCosmetics.effects.includes(effect.id);
                      const equipped = equippedCosmetics.effect === effect.id;
                      return (
                        <button
                          key={effect.id}
                          onClick={() => owned && equipCosmetic('effect', effect.id)}
                          disabled={!owned}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            equipped
                              ? 'bg-gradient-to-br from-pink-600/40 to-purple-600/40 border-pink-500 scale-105'
                              : owned
                              ? `bg-black/40 ${getRarityBorder(effect.rarity)} hover:scale-105`
                              : 'bg-black/20 border-gray-700 opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <div className={`text-sm font-bold ${getRarityColor(effect.rarity)}`}>
                            {effect.name}
                          </div>
                          {!owned && <div className="text-xs text-gray-500 mt-1">🔒 Locked</div>}
                          {equipped && <div className="text-xs text-pink-400 mt-1">✓ Equipped</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Titles */}
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-3">TITLES</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {COSMETICS.titles.map(title => {
                      const owned = ownedCosmetics.titles.includes(title.id);
                      const equipped = equippedCosmetics.title === title.id;
                      return (
                        <button
                          key={title.id}
                          onClick={() => owned && equipCosmetic('title', title.id)}
                          disabled={!owned}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            equipped
                              ? 'bg-gradient-to-br from-pink-600/40 to-purple-600/40 border-pink-500 scale-105'
                              : owned
                              ? `bg-black/40 ${getRarityBorder(title.rarity)} hover:scale-105`
                              : 'bg-black/20 border-gray-700 opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <div className={`font-bold text-lg ${getRarityColor(title.rarity)} mb-1`}>
                            {title.display || title.name}
                          </div>
                          <div className="text-xs text-gray-400">{title.name}</div>
                          {!owned && <div className="text-xs text-gray-500 mt-1">🔒 Locked</div>}
                          {equipped && <div className="text-xs text-pink-400 mt-1">✓ Equipped</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* LEADERBOARD MODAL */}
        {showLeaderboard && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-purple-900/70 to-cyan-900/70 rounded-2xl border-2 border-cyan-500/50 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto backdrop-blur-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-4xl font-black text-cyan-400 flex items-center gap-3">
                  <Trophy className="w-10 h-10" />
                  GLOBAL LEADERBOARD
                </h2>
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
              
              {leaderboardLoading ? (
                <div className="text-center py-20">
                  <RefreshCw className="w-12 h-12 inline-block animate-spin text-cyan-400 mb-4" />
                  <div className="text-cyan-300">Loading leaderboard...</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.length === 0 ? (
                    <div className="text-center py-20 text-cyan-300">
                      No players yet. Be the first survivor!
                    </div>
                  ) : (
                    leaderboard.map((player, index) => (
                      <div
                        key={player.playerId}
                        className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                          player.playerName === playerName
                            ? 'bg-gradient-to-r from-pink-600/40 to-purple-600/40 border-pink-500/50 shadow-lg'
                            : 'bg-black/40 border-cyan-500/30 hover:border-cyan-400/50'
                        }`}
                      >
                        <div className={`text-3xl font-black w-12 text-center ${
                          index === 0 ? 'text-yellow-400' :
                          index === 1 ? 'text-gray-300' :
                          index === 2 ? 'text-orange-400' :
                          'text-cyan-400'
                        }`}>
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-lg text-white">{player.playerName}</div>
                          <div className="text-sm text-cyan-300">
                            {formatNumber(player.totalCookiesEarned)} cookies • Level {player.level} • Prestige {player.prestige}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-pink-400">
                            {formatNumber(player.totalCookiesEarned + (player.level * 1000) + (player.prestige * 50000))}
                          </div>
                          <div className="text-xs text-cyan-400">SCORE</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              
              <button
                onClick={updateLeaderboard}
                className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                REFRESH
              </button>
            </div>
          </div>
        )}
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - Stats and Cookie */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats panel */}
            <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-2xl border-2 border-cyan-500/30 p-6 shadow-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-sm text-cyan-400 mb-1">COOKIES</div>
                  <div className="text-2xl font-black text-white">{formatNumber(cookies)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-cyan-400 mb-1">PER CLICK</div>
                  <div className="text-2xl font-black text-pink-400">{formatNumber(cookiesPerClick)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-cyan-400 mb-1">PER SECOND</div>
                  <div className="text-2xl font-black text-purple-400">{formatNumber(cookiesPerSecond)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-cyan-400 mb-1">LEVEL</div>
                  <div className="text-2xl font-black text-yellow-400">{level}</div>
                </div>
              </div>
              
              {/* XP Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-cyan-400 mb-1">
                  <span>XP: {formatNumber(xp)} / {formatNumber(getLevelRequirement(level))}</span>
                  <span>Next Level: {level + 1}</span>
                </div>
                <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-cyan-500/50">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300"
                    style={{ width: `${Math.min((xp / getLevelRequirement(level)) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              {/* Prestige info */}
              {prestige > 0 && (
                <div className="mt-4 flex items-center justify-between bg-black/30 rounded-lg p-3 border border-pink-500/30">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-400" />
                    <span className="text-pink-400 font-bold">Prestige {prestige}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold">{prestigeTokens} tokens</div>
                    <div className="text-xs text-cyan-300">+{Math.floor(getPrestigeMultiplier() * 100 - 100)}% production</div>
                  </div>
                </div>
              )}
              
              {/* Click streak */}
              {clickStreak > 10 && (
                <div className="mt-3 text-center">
                  <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-lg border border-red-400/50 animate-pulse">
                    <Flame className="inline w-5 h-5 mr-2" />
                    <span className="font-black text-lg">STREAK: {clickStreak}x</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Cookie clicker */}
            <div className="text-center">
              <button
                onClick={handleClick}
                className="w-64 h-64 md:w-80 md:h-80 text-9xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full shadow-2xl active:scale-95 transition-all select-none mx-auto relative overflow-hidden border-4 border-yellow-300/50"
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.5))',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <span className="relative z-10">{equippedCookie.emoji}</span>
              </button>
              <div className="mt-6 text-2xl font-bold text-cyan-300">
                TAP TO EARN {formatNumber(cookiesPerClick * getPrestigeMultiplier())} COOKIES
              </div>
              <div className="mt-2 text-sm text-red-400">
                ⚠️ {(criticalFailChance * 100).toFixed(1)}% chance to lose 10% of cookies!
              </div>
            </div>
            
            {/* Achievements */}
            <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-2xl border-2 border-cyan-500/30 p-6 shadow-2xl">
              <h2 className="text-3xl font-black mb-4 flex items-center gap-3 text-cyan-400">
                <Trophy className="w-8 h-8" />
                ACHIEVEMENTS ({achievements.filter(a => a.unlocked).length}/{achievements.length})
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {achievements.map(ach => (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-lg border transition-all ${
                      ach.unlocked
                        ? 'bg-gradient-to-br from-yellow-600/40 to-orange-600/40 border-yellow-500/50 shadow-lg'
                        : 'bg-black/40 border-gray-700/50 opacity-50'
                    }`}
                    title={`${ach.desc} - Reward: ${formatNumber(ach.reward)} cookies`}
                  >
                    <div className="text-4xl text-center mb-2">{ach.icon}</div>
                    <div className="text-xs text-center font-bold text-white">{ach.name}</div>
                    {ach.unlocked && (
                      <div className="text-xs text-center text-yellow-400 mt-1">
                        +{formatNumber(ach.reward)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right column - Upgrades */}
          <div className="space-y-6">
            {/* Regular upgrades */}
            <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-2xl border-2 border-cyan-500/30 p-6 shadow-2xl max-h-[600px] overflow-y-auto">
              <h2 className="text-3xl font-black mb-4 flex items-center gap-3 text-pink-400 sticky top-0 bg-gradient-to-br from-purple-900/90 to-cyan-900/90 backdrop-blur-xl -mx-6 -mt-6 px-6 pt-6 pb-4 z-10 border-b-2 border-pink-500/30 rounded-t-2xl">
                <Zap className="w-8 h-8" />
                UPGRADES
              </h2>
              <div className="space-y-3">
                {upgrades.map(upgrade => (
                  <div
                    key={upgrade.id}
                    className={`bg-black/40 border rounded-lg p-4 transition-all ${
                      cookies >= upgrade.cost
                        ? 'border-cyan-500/50 hover:border-cyan-400 hover:bg-black/60'
                        : 'border-gray-700/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-4xl">{upgrade.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white mb-1">{upgrade.name}</div>
                        <div className="text-xs text-cyan-300 mb-2">{upgrade.desc}</div>
                        {upgrade.owned > 0 && (
                          <div className="text-xs text-yellow-400 mb-2">
                            Owned: {upgrade.owned}
                          </div>
                        )}
                        <button
                          onClick={() => buyUpgrade(upgrade)}
                          disabled={cookies < upgrade.cost}
                          className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-all transform hover:scale-105 disabled:scale-100 text-sm disabled:opacity-50"
                        >
                          {formatNumber(upgrade.cost)} 🍪
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Prestige section */}
            <div className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 backdrop-blur-xl rounded-2xl border-2 border-pink-500/30 p-6 shadow-2xl">
              <h2 className="text-3xl font-black mb-4 flex items-center gap-3 text-pink-400">
                <Sparkles className="w-8 h-8" />
                PRESTIGE
              </h2>
              
              {level >= 25 ? (
                <>
                  <div className="mb-4 text-center">
                    <div className="text-sm text-cyan-300 mb-2">
                      Reset progress for {Math.floor(level / 10)} prestige tokens
                    </div>
                    <button
                      onClick={doPrestige}
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black py-3 px-6 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg border border-pink-400/50"
                    >
                      PRESTIGE NOW
                    </button>
                  </div>
                  
                  {prestigeUpgrades.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm text-cyan-400 font-bold mb-2">
                        PRESTIGE UPGRADES:
                      </div>
                      {prestigeUpgrades.map(pu => (
                        <div
                          key={pu.id}
                          className={`bg-black/40 border rounded-lg p-3 ${
                            pu.owned
                              ? 'border-green-500/50 bg-green-900/20'
                              : prestigeTokens >= pu.cost
                              ? 'border-pink-500/50 hover:border-pink-400'
                              : 'border-gray-700/50 opacity-60'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-bold text-white text-sm">{pu.name}</div>
                              <div className="text-xs text-cyan-300">{pu.desc}</div>
                            </div>
                            {pu.owned && (
                              <div className="bg-green-600 rounded-full px-2 py-1 text-xs font-bold">
                                OWNED
                              </div>
                            )}
                          </div>
                          {!pu.owned && (
                            <button
                              onClick={() => buyPrestigeUpgrade(pu)}
                              disabled={prestigeTokens < pu.cost}
                              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold py-2 px-3 rounded transition-all text-xs disabled:opacity-50"
                            >
                              {pu.cost} Tokens
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-cyan-300">
                  <Lock className="w-16 h-16 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Reach level 25 to unlock prestige</p>
                  <p className="text-xs opacity-70 mt-1">({25 - level} levels to go)</p>
                  <p className="text-xs text-red-400 mt-2">⚠️ HARDCORE MODE: Level 25 required!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes floatUp {
          to {
            transform: translateY(-100px);
            opacity: 0;
          }
        }
        
        @keyframes slideInRight {
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
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}

// Render the game
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<UltimateCookieEmpire />);
