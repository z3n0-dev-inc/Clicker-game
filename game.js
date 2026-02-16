const { useState, useEffect, useRef } = React;

// API Configuration - Replace with your actual backend URL
const API_URL = 'https://your-backend-url.com/api'; // CHANGE THIS!

// Lucide React icons as simple components
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

// Available cosmetics
const COSMETICS = {
  cookies: [
    { id: 'default', name: 'Classic Cookie', emoji: '🍪', rarity: 'common' },
    { id: 'golden', name: 'Golden Cookie', emoji: '🥇', rarity: 'rare' },
    { id: 'rainbow', name: 'Rainbow Cookie', emoji: '🌈', rarity: 'epic' },
    { id: 'diamond', name: 'Diamond Cookie', emoji: '💎', rarity: 'legendary' },
    { id: 'fire', name: 'Fire Cookie', emoji: '🔥', rarity: 'epic' },
    { id: 'ice', name: 'Ice Cookie', emoji: '❄️', rarity: 'epic' },
    { id: 'cosmic', name: 'Cosmic Cookie', emoji: '🌌', rarity: 'legendary' },
    { id: 'heart', name: 'Heart Cookie', emoji: '❤️', rarity: 'rare' },
    { id: 'star', name: 'Star Cookie', emoji: '⭐', rarity: 'rare' },
    { id: 'skull', name: 'Skull Cookie', emoji: '💀', rarity: 'epic' },
    { id: 'alien', name: 'Alien Cookie', emoji: '👽', rarity: 'legendary' },
    { id: 'robot', name: 'Robot Cookie', emoji: '🤖', rarity: 'legendary' },
  ],
  themes: [
    { id: 'default', name: 'Cyber Purple', gradient: 'from-purple-900/20 via-black to-cyan-900/20', rarity: 'common' },
    { id: 'crimson', name: 'Crimson Flame', gradient: 'from-red-900/20 via-black to-orange-900/20', rarity: 'rare' },
    { id: 'emerald', name: 'Emerald Dream', gradient: 'from-green-900/20 via-black to-teal-900/20', rarity: 'rare' },
    { id: 'royal', name: 'Royal Gold', gradient: 'from-yellow-900/20 via-black to-amber-900/20', rarity: 'epic' },
    { id: 'ocean', name: 'Deep Ocean', gradient: 'from-blue-900/20 via-black to-cyan-900/20', rarity: 'epic' },
    { id: 'sunset', name: 'Sunset Blaze', gradient: 'from-orange-900/20 via-pink-900/20 to-purple-900/20', rarity: 'legendary' },
    { id: 'matrix', name: 'Matrix Code', gradient: 'from-green-500/10 via-black to-green-900/10', rarity: 'legendary' },
    { id: 'void', name: 'Void Space', gradient: 'from-black via-purple-950/20 to-black', rarity: 'legendary' },
  ],
  effects: [
    { id: 'none', name: 'No Effect', rarity: 'common' },
    { id: 'sparkles', name: 'Sparkle Trail', rarity: 'rare' },
    { id: 'flames', name: 'Flame Aura', rarity: 'epic' },
    { id: 'lightning', name: 'Lightning Strikes', rarity: 'legendary' },
    { id: 'rainbow', name: 'Rainbow Pulse', rarity: 'legendary' },
  ],
  titles: [
    { id: 'none', name: 'No Title', display: '', rarity: 'common' },
    { id: 'baker', name: 'Master Baker', display: '🍞 Master Baker', rarity: 'rare' },
    { id: 'legend', name: 'Cookie Legend', display: '⚡ Cookie Legend', rarity: 'epic' },
    { id: 'emperor', name: 'Cookie Emperor', display: '👑 Cookie Emperor', rarity: 'legendary' },
    { id: 'god', name: 'Cookie God', display: '✨ Cookie God', rarity: 'legendary' },
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
  
  // Owner dashboard state
  const [isOwner, setIsOwner] = useState(false);
  const [ownerPanelOpen, setOwnerPanelOpen] = useState(false);
  const [ownerTab, setOwnerTab] = useState('stats'); // stats, cosmetics, players, advanced
  const OWNER_CODE = 'EMPIRE2025';
  
  // Player identity
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
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
  const [saveStatus, setSaveStatus] = useState('saved'); // saved, saving, error
  
  // Achievements
  const [achievements, setAchievements] = useState([
    { id: 'first_click', name: 'First Cookie', desc: 'Click your first cookie', unlocked: false, icon: '🍪' },
    { id: 'hundred_cookies', name: 'Cookie Collector', desc: 'Earn 100 cookies', unlocked: false, icon: '💰' },
    { id: 'thousand_cookies', name: 'Cookie Hoarder', desc: 'Earn 1,000 cookies', unlocked: false, icon: '💎' },
    { id: 'first_upgrade', name: 'Investor', desc: 'Buy your first upgrade', unlocked: false, icon: '📈' },
    { id: 'level_5', name: 'Rising Star', desc: 'Reach level 5', unlocked: false, icon: '⭐' },
    { id: 'level_10', name: 'Cookie Master', desc: 'Reach level 10', unlocked: false, icon: '👑' },
    { id: 'level_25', name: 'Cookie Overlord', desc: 'Reach level 25', unlocked: false, icon: '🔥' },
    { id: 'level_50', name: 'Cookie Deity', desc: 'Reach level 50', unlocked: false, icon: '✨' },
    { id: 'hundred_cps', name: 'Automation King', desc: '100 cookies per second', unlocked: false, icon: '⚡' },
    { id: 'thousand_cps', name: 'Production Master', desc: '1,000 cookies per second', unlocked: false, icon: '🏭' },
    { id: 'first_prestige', name: 'Ascended', desc: 'Prestige for the first time', unlocked: false, icon: '🌟' },
    { id: 'prestige_5', name: 'Transcendent', desc: 'Reach prestige 5', unlocked: false, icon: '💫' },
    { id: 'speed_demon', name: 'Speed Demon', desc: '100 clicks in 10 seconds', unlocked: false, icon: '🚀' },
    { id: 'millionaire', name: 'Millionaire', desc: 'Earn 1,000,000 cookies', unlocked: false, icon: '💸' },
    { id: 'billionaire', name: 'Billionaire', desc: 'Earn 1,000,000,000 cookies', unlocked: false, icon: '🏦' },
  ]);
  
  const [clickStreak, setClickStreak] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const clickTimeWindowRef = useRef([]);
  
  // Particle effects
  const [particles, setParticles] = useState([]);
  
  // Upgrades with more variety
  const [upgrades, setUpgrades] = useState([
    { id: 1, name: 'Cursed Spatula', desc: 'x2 cookies per click', cost: 15, owned: 0, type: 'click', multiplier: 2, icon: '🥄', tier: 1 },
    { id: 2, name: 'Magic Mixer', desc: 'x3 cookies per click', cost: 100, owned: 0, type: 'click', multiplier: 3, icon: '🎯', tier: 1 },
    { id: 3, name: 'Quantum Clicker', desc: 'x5 cookies per click', cost: 1000, owned: 0, type: 'click', multiplier: 5, icon: '⚛️', tier: 2 },
    { id: 4, name: 'God Hand', desc: 'x10 cookies per click', cost: 50000, owned: 0, type: 'click', multiplier: 10, icon: '✋', tier: 3 },
    { id: 5, name: 'Reality Warper', desc: 'x25 cookies per click', cost: 500000, owned: 0, type: 'click', multiplier: 25, icon: '🌀', tier: 4 },
    
    { id: 10, name: 'Cookie Oven', desc: '+1 cookie/sec', cost: 50, owned: 0, type: 'auto', cps: 1, icon: '🔥', tier: 1 },
    { id: 11, name: 'Grandma Baker', desc: '+5 cookies/sec', cost: 200, owned: 0, type: 'auto', cps: 5, icon: '👵', tier: 1 },
    { id: 12, name: 'Cookie Factory', desc: '+15 cookies/sec', cost: 800, owned: 0, type: 'auto', cps: 15, icon: '🏭', tier: 2 },
    { id: 13, name: 'Cookie Farm', desc: '+50 cookies/sec', cost: 4000, owned: 0, type: 'auto', cps: 50, icon: '🌾', tier: 2 },
    { id: 14, name: 'Cookie Mine', desc: '+150 cookies/sec', cost: 20000, owned: 0, type: 'auto', cps: 150, icon: '⛏️', tier: 3 },
    { id: 15, name: 'Cookie Wizard', desc: '+500 cookies/sec', cost: 100000, owned: 0, type: 'auto', cps: 500, icon: '🧙', tier: 3 },
    { id: 16, name: 'Cookie Portal', desc: '+2000 cookies/sec', cost: 500000, owned: 0, type: 'auto', cps: 2000, icon: '🌀', tier: 4 },
    { id: 17, name: 'Cookie Dimension', desc: '+10000 cookies/sec', cost: 5000000, owned: 0, type: 'auto', cps: 10000, icon: '🌌', tier: 4 },
    { id: 18, name: 'Cookie Universe', desc: '+50000 cookies/sec', cost: 50000000, owned: 0, type: 'auto', cps: 50000, icon: '🪐', tier: 5 },
    { id: 19, name: 'Cookie Multiverse', desc: '+250000 cookies/sec', cost: 500000000, owned: 0, type: 'auto', cps: 250000, icon: '♾️', tier: 5 },
  ]);
  
  // Prestige upgrades
  const [prestigeUpgrades, setPrestigeUpgrades] = useState([
    { id: 'p1', name: 'Cookie Blessing', desc: 'Start with 2x click power', cost: 1, owned: false, effect: 'click_start_2x' },
    { id: 'p2', name: 'Auto Starter', desc: 'Start with 10 CPS', cost: 2, owned: false, effect: 'cps_start_10' },
    { id: 'p3', name: 'Golden Touch', desc: '+10% all production', cost: 3, owned: false, effect: 'production_10' },
    { id: 'p4', name: 'Divine Fortune', desc: '+25% all production', cost: 5, owned: false, effect: 'production_25' },
    { id: 'p5', name: 'Cosmic Power', desc: '+50% all production', cost: 10, owned: false, effect: 'production_50' },
    { id: 'p6', name: 'Ultimate Force', desc: '+100% all production', cost: 20, owned: false, effect: 'production_100' },
    { id: 'p7', name: 'Reality Bender', desc: '+200% all production', cost: 50, owned: false, effect: 'production_200' },
  ]);
  
  // Backend API functions
  const api = {
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
        return await response.json();
      } catch (error) {
        console.error('Save failed:', error);
        return { success: false, error };
      }
    },
    
    loadProgress: async () => {
      try {
        const response = await fetch(`${API_URL}/load/${playerId}`);
        return await response.json();
      } catch (error) {
        console.error('Load failed:', error);
        return { success: false, error };
      }
    },
    
    getLeaderboard: async () => {
      try {
        const response = await fetch(`${API_URL}/leaderboard`);
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
        return { success: false, error };
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
        return { success: false, error };
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
        return { success: false, error };
      }
    }
  };
  
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
        setPlayerName(data.playerName || '');
        if (data.playerName) setShowNameInput(false);
        setUpgrades(data.upgrades || upgrades);
        setPrestigeUpgrades(data.prestigeUpgrades || prestigeUpgrades);
        setAchievements(data.achievements || achievements);
        setOwnedCosmetics(data.ownedCosmetics || ownedCosmetics);
        setEquippedCosmetics(data.equippedCosmetics || equippedCosmetics);
      }
    };
    loadData();
  }, []);
  
  // Auto-save every 30 seconds
  useEffect(() => {
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
        equippedCosmetics
      });
      
      if (result.success) {
        setSaveStatus('saved');
        setLastSaved(Date.now());
      } else {
        setSaveStatus('error');
      }
    }, 30000);
    
    return () => clearInterval(saveInterval);
  }, [cookies, totalCookiesEarned, cookiesPerClick, cookiesPerSecond, totalClicks, level, xp, prestige, prestigeTokens, upgrades, prestigeUpgrades, achievements, ownedCosmetics, equippedCosmetics]);
  
  // Level requirements
  const getLevelRequirement = (lvl) => Math.floor(100 * Math.pow(1.5, lvl - 1));
  
  // Calculate prestige bonus
  const getPrestigeMultiplier = () => {
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
  };
  
  // Auto-generate cookies
  useEffect(() => {
    const interval = setInterval(() => {
      if (cookiesPerSecond > 0) {
        const amount = (cookiesPerSecond / 10) * getPrestigeMultiplier();
        setCookies(c => c + amount);
        setTotalCookiesEarned(t => t + amount);
        setXp(x => x + amount / 10);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [cookiesPerSecond]);
  
  // Level up logic
  useEffect(() => {
    const required = getLevelRequirement(level);
    if (xp >= required) {
      setXp(xp - required);
      setLevel(level + 1);
      createNotification(`🎉 LEVEL UP! You're now level ${level + 1}!`);
      
      // Level rewards
      const bonus = level * 100;
      setCookies(c => c + bonus);
      createNotification(`+${bonus} bonus cookies!`);
    }
  }, [xp, level]);
  
  // Check achievements
  useEffect(() => {
    checkAchievements();
  }, [totalCookiesEarned, totalClicks, level, cookiesPerSecond, upgrades, prestige]);
  
  const checkAchievements = () => {
    const newAchievements = [...achievements];
    let changed = false;
    
    const checks = [
      { index: 0, condition: totalClicks > 0 },
      { index: 1, condition: totalCookiesEarned >= 100 },
      { index: 2, condition: totalCookiesEarned >= 1000 },
      { index: 3, condition: upgrades.some(u => u.owned > 0) },
      { index: 4, condition: level >= 5 },
      { index: 5, condition: level >= 10 },
      { index: 6, condition: level >= 25 },
      { index: 7, condition: level >= 50 },
      { index: 8, condition: cookiesPerSecond >= 100 },
      { index: 9, condition: cookiesPerSecond >= 1000 },
      { index: 10, condition: prestige > 0 },
      { index: 11, condition: prestige >= 5 },
      { index: 13, condition: totalCookiesEarned >= 1000000 },
      { index: 14, condition: totalCookiesEarned >= 1000000000 },
    ];
    
    checks.forEach(({ index, condition }) => {
      if (!newAchievements[index].unlocked && condition) {
        newAchievements[index].unlocked = true;
        changed = true;
        createNotification(`🏆 Achievement: ${newAchievements[index].name}!`);
      }
    });
    
    if (changed) setAchievements(newAchievements);
  };
  
  // Click tracking for speed demon achievement
  useEffect(() => {
    const now = Date.now();
    clickTimeWindowRef.current = clickTimeWindowRef.current.filter(t => now - t < 10000);
    
    if (clickTimeWindowRef.current.length >= 100 && !achievements[12].unlocked) {
      const newAch = [...achievements];
      newAch[12].unlocked = true;
      setAchievements(newAch);
      createNotification('🏆 Achievement: Speed Demon!');
    }
  }, [totalClicks]);
  
  const handleClick = (e) => {
    const earnedAmount = cookiesPerClick * getPrestigeMultiplier();
    setCookies(cookies + earnedAmount);
    setTotalCookiesEarned(totalCookiesEarned + earnedAmount);
    setXp(xp + earnedAmount / 5);
    setTotalClicks(totalClicks + 1);
    
    clickTimeWindowRef.current.push(Date.now());
    
    // Streak logic
    const now = Date.now();
    if (now - lastClickTime < 500) {
      setClickStreak(clickStreak + 1);
    } else {
      setClickStreak(1);
    }
    setLastClickTime(now);
    
    // Particle effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);
    createParticle(x, y, `+${formatNumber(earnedAmount)}`);
    
    // Bonus for streak
    if (clickStreak > 10 && clickStreak % 10 === 0) {
      const bonus = earnedAmount * 2;
      setCookies(c => c + bonus);
      setTotalCookiesEarned(t => t + bonus);
      createParticle(x, y + 30, `🔥 STREAK x${clickStreak}!`, '#ff6b00');
    }
    
    // Create visual effect based on equipped effect
    if (equippedCosmetics.effect === 'sparkles') {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          createParticle(x + (Math.random() - 0.5) * 50, y + (Math.random() - 0.5) * 50, '✨', '#FFD700');
        }, i * 100);
      }
    }
  };
  
  const createParticle = (x, y, text, color = '#ffd700') => {
    const id = Date.now() + Math.random();
    setParticles(p => [...p, { id, x, y, text, color }]);
    setTimeout(() => {
      setParticles(p => p.filter(particle => particle.id !== id));
    }, 1000);
  };
  
  const [notifications, setNotifications] = useState([]);
  
  const createNotification = (message) => {
    const id = Date.now() + Math.random();
    setNotifications(n => [...n, { id, message }]);
    setTimeout(() => {
      setNotifications(n => n.filter(notif => notif.id !== id));
    }, 3000);
  };
  
  const formatNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toLocaleString();
  };
  
  const buyUpgrade = (upgrade) => {
    if (cookies >= upgrade.cost) {
      setCookies(cookies - upgrade.cost);
      
      const updatedUpgrades = upgrades.map(u => {
        if (u.id === upgrade.id) {
          const newOwned = u.owned + 1;
          const newCost = Math.floor(u.cost * 1.15);
          
          if (u.type === 'click') {
            setCookiesPerClick(cookiesPerClick * u.multiplier);
          } else if (u.type === 'auto') {
            setCookiesPerSecond(cookiesPerSecond + u.cps);
          }
          
          return { ...u, owned: newOwned, cost: newCost };
        }
        return u;
      });
      
      setUpgrades(updatedUpgrades);
      createNotification(`Purchased ${upgrade.name}!`);
    }
  };
  
  const buyPrestigeUpgrade = (upgrade) => {
    if (prestigeTokens >= upgrade.cost && !upgrade.owned) {
      setPrestigeTokens(prestigeTokens - upgrade.cost);
      
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
  };
  
  const doPrestige = () => {
    if (level < 10) {
      createNotification('⚠️ Reach level 10 to prestige!');
      return;
    }
    
    const tokensEarned = Math.floor(level / 5);
    
    if (confirm(`Prestige and earn ${tokensEarned} tokens? This will reset your progress!`)) {
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
      setPrestige(prestige + 1);
      setPrestigeTokens(prestigeTokens + tokensEarned);
      
      setUpgrades([
        { id: 1, name: 'Cursed Spatula', desc: 'x2 cookies per click', cost: 15, owned: 0, type: 'click', multiplier: 2, icon: '🥄', tier: 1 },
        { id: 2, name: 'Magic Mixer', desc: 'x3 cookies per click', cost: 100, owned: 0, type: 'click', multiplier: 3, icon: '🎯', tier: 1 },
        { id: 3, name: 'Quantum Clicker', desc: 'x5 cookies per click', cost: 1000, owned: 0, type: 'click', multiplier: 5, icon: '⚛️', tier: 2 },
        { id: 4, name: 'God Hand', desc: 'x10 cookies per click', cost: 50000, owned: 0, type: 'click', multiplier: 10, icon: '✋', tier: 3 },
        { id: 5, name: 'Reality Warper', desc: 'x25 cookies per click', cost: 500000, owned: 0, type: 'click', multiplier: 25, icon: '🌀', tier: 4 },
        { id: 10, name: 'Cookie Oven', desc: '+1 cookie/sec', cost: 50, owned: 0, type: 'auto', cps: 1, icon: '🔥', tier: 1 },
        { id: 11, name: 'Grandma Baker', desc: '+5 cookies/sec', cost: 200, owned: 0, type: 'auto', cps: 5, icon: '👵', tier: 1 },
        { id: 12, name: 'Cookie Factory', desc: '+15 cookies/sec', cost: 800, owned: 0, type: 'auto', cps: 15, icon: '🏭', tier: 2 },
        { id: 13, name: 'Cookie Farm', desc: '+50 cookies/sec', cost: 4000, owned: 0, type: 'auto', cps: 50, icon: '🌾', tier: 2 },
        { id: 14, name: 'Cookie Mine', desc: '+150 cookies/sec', cost: 20000, owned: 0, type: 'auto', cps: 150, icon: '⛏️', tier: 3 },
        { id: 15, name: 'Cookie Wizard', desc: '+500 cookies/sec', cost: 100000, owned: 0, type: 'auto', cps: 500, icon: '🧙', tier: 3 },
        { id: 16, name: 'Cookie Portal', desc: '+2000 cookies/sec', cost: 500000, owned: 0, type: 'auto', cps: 2000, icon: '🌀', tier: 4 },
        { id: 17, name: 'Cookie Dimension', desc: '+10000 cookies/sec', cost: 5000000, owned: 0, type: 'auto', cps: 10000, icon: '🌌', tier: 4 },
        { id: 18, name: 'Cookie Universe', desc: '+50000 cookies/sec', cost: 50000000, owned: 0, type: 'auto', cps: 50000, icon: '🪐', tier: 5 },
        { id: 19, name: 'Cookie Multiverse', desc: '+250000 cookies/sec', cost: 500000000, owned: 0, type: 'auto', cps: 250000, icon: '♾️', tier: 5 },
      ]);
      
      createNotification(`🌟 PRESTIGE ${prestige + 1}! +${tokensEarned} tokens!`);
      updateLeaderboard();
    }
  };
  
  const updateLeaderboard = async () => {
    setLeaderboardLoading(true);
    const result = await api.getLeaderboard();
    if (result.success) {
      setLeaderboard(result.data);
    }
    setLeaderboardLoading(false);
  };
  
  useEffect(() => {
    if (showLeaderboard) {
      updateLeaderboard();
    }
  }, [showLeaderboard]);
  
  // Cosmetics functions
  const equipCosmetic = (type, id) => {
    setEquippedCosmetics({ ...equippedCosmetics, [type]: id });
    createNotification(`Equipped ${COSMETICS[type + 's'].find(c => c.id === id).name}!`);
  };
  
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-white';
    }
  };
  
  const getRarityBorder = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-500/50';
      case 'rare': return 'border-blue-500/50';
      case 'epic': return 'border-purple-500/50';
      case 'legendary': return 'border-yellow-500/50';
      default: return 'border-gray-500/50';
    }
  };
  
  // Owner functions
  const ownerGiveCosmetic = async () => {
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
      createNotification('❌ Failed to give cosmetic');
    }
  };
  
  const loadAllPlayers = async () => {
    const result = await api.getAllPlayers();
    if (result.success) {
      setAllPlayers(result.data);
    }
  };
  
  useEffect(() => {
    if (isOwner && ownerTab === 'players') {
      loadAllPlayers();
    }
  }, [isOwner, ownerTab]);
  
  // OWNER DASHBOARD FUNCTIONS
  const ownerSetCookies = (amount) => {
    setCookies(amount);
    createNotification(`🔧 Set cookies to ${formatNumber(amount)}`);
  };
  
  const ownerAddCookies = (amount) => {
    setCookies(c => c + amount);
    createNotification(`🔧 Added ${formatNumber(amount)} cookies`);
  };
  
  const ownerSetLevel = (lvl) => {
    setLevel(lvl);
    createNotification(`🔧 Set level to ${lvl}`);
  };
  
  const ownerSetPrestige = (p) => {
    setPrestige(p);
    createNotification(`🔧 Set prestige to ${p}`);
  };
  
  const ownerSetPrestigeTokens = (tokens) => {
    setPrestigeTokens(tokens);
    createNotification(`🔧 Set prestige tokens to ${tokens}`);
  };
  
  const ownerMultiplyCookies = (mult) => {
    setCookies(c => Math.floor(c * mult));
    createNotification(`🔧 Multiplied cookies by ${mult}x`);
  };
  
  const ownerSetCPS = (cps) => {
    setCookiesPerSecond(cps);
    createNotification(`🔧 Set CPS to ${formatNumber(cps)}`);
  };
  
  const ownerSetCPC = (cpc) => {
    setCookiesPerClick(cpc);
    createNotification(`🔧 Set CPC to ${formatNumber(cpc)}`);
  };
  
  const ownerUnlockAllAchievements = () => {
    setAchievements(achievements.map(a => ({ ...a, unlocked: true })));
    createNotification('🔧 All achievements unlocked');
  };
  
  const ownerUnlockAllCosmetics = () => {
    setOwnedCosmetics({
      cookies: COSMETICS.cookies.map(c => c.id),
      themes: COSMETICS.themes.map(t => t.id),
      effects: COSMETICS.effects.map(e => e.id),
      titles: COSMETICS.titles.map(t => t.id)
    });
    createNotification('🔧 All cosmetics unlocked');
  };
  
  const ownerMaxAllUpgrades = () => {
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
  };
  
  const ownerGodMode = () => {
    ownerSetCookies(999999999999);
    ownerSetLevel(999);
    ownerSetPrestige(99);
    ownerSetPrestigeTokens(9999);
    ownerSetCPS(10000000);
    ownerSetCPC(10000000);
    ownerUnlockAllAchievements();
    ownerUnlockAllCosmetics();
    createNotification('👑 GOD MODE ACTIVATED');
  };
  
  const ownerResetGame = () => {
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
      setAchievements(achievements.map(a => ({ ...a, unlocked: false })));
      setUpgrades([
        { id: 1, name: 'Cursed Spatula', desc: 'x2 cookies per click', cost: 15, owned: 0, type: 'click', multiplier: 2, icon: '🥄', tier: 1 },
        { id: 2, name: 'Magic Mixer', desc: 'x3 cookies per click', cost: 100, owned: 0, type: 'click', multiplier: 3, icon: '🎯', tier: 1 },
        { id: 3, name: 'Quantum Clicker', desc: 'x5 cookies per click', cost: 1000, owned: 0, type: 'click', multiplier: 5, icon: '⚛️', tier: 2 },
        { id: 4, name: 'God Hand', desc: 'x10 cookies per click', cost: 50000, owned: 0, type: 'click', multiplier: 10, icon: '✋', tier: 3 },
        { id: 5, name: 'Reality Warper', desc: 'x25 cookies per click', cost: 500000, owned: 0, type: 'click', multiplier: 25, icon: '🌀', tier: 4 },
        { id: 10, name: 'Cookie Oven', desc: '+1 cookie/sec', cost: 50, owned: 0, type: 'auto', cps: 1, icon: '🔥', tier: 1 },
        { id: 11, name: 'Grandma Baker', desc: '+5 cookies/sec', cost: 200, owned: 0, type: 'auto', cps: 5, icon: '👵', tier: 1 },
        { id: 12, name: 'Cookie Factory', desc: '+15 cookies/sec', cost: 800, owned: 0, type: 'auto', cps: 15, icon: '🏭', tier: 2 },
        { id: 13, name: 'Cookie Farm', desc: '+50 cookies/sec', cost: 4000, owned: 0, type: 'auto', cps: 50, icon: '🌾', tier: 2 },
        { id: 14, name: 'Cookie Mine', desc: '+150 cookies/sec', cost: 20000, owned: 0, type: 'auto', cps: 150, icon: '⛏️', tier: 3 },
        { id: 15, name: 'Cookie Wizard', desc: '+500 cookies/sec', cost: 100000, owned: 0, type: 'auto', cps: 500, icon: '🧙', tier: 3 },
        { id: 16, name: 'Cookie Portal', desc: '+2000 cookies/sec', cost: 500000, owned: 0, type: 'auto', cps: 2000, icon: '🌀', tier: 4 },
        { id: 17, name: 'Cookie Dimension', desc: '+10000 cookies/sec', cost: 5000000, owned: 0, type: 'auto', cps: 10000, icon: '🌌', tier: 4 },
        { id: 18, name: 'Cookie Universe', desc: '+50000 cookies/sec', cost: 50000000, owned: 0, type: 'auto', cps: 50000, icon: '🪐', tier: 5 },
        { id: 19, name: 'Cookie Multiverse', desc: '+250000 cookies/sec', cost: 500000000, owned: 0, type: 'auto', cps: 250000, icon: '♾️', tier: 5 },
      ]);
      setPrestigeUpgrades(prestigeUpgrades.map(pu => ({ ...pu, owned: false })));
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
  };
  
  // Get current equipped cosmetics
  const getEquippedCookie = () => COSMETICS.cookies.find(c => c.id === equippedCosmetics.cookie) || COSMETICS.cookies[0];
  const getEquippedTheme = () => COSMETICS.themes.find(t => t.id === equippedCosmetics.theme) || COSMETICS.themes[0];
  const getEquippedTitle = () => COSMETICS.titles.find(t => t.id === equippedCosmetics.title) || COSMETICS.titles[0];
  
  if (showNameInput) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${getEquippedTheme().gradient}`} />
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
              ULTIMATE EDITION
            </p>
            <p className="text-cyan-400 text-sm mt-2">
              With Backend • Real Leaderboard • Cosmetics
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
              onKeyPress={(e) => e.key === 'Enter' && playerName && setShowNameInput(false)}
              className="w-full bg-black/50 border-2 border-cyan-500/50 rounded-lg px-4 py-3 text-white text-xl focus:outline-none focus:border-cyan-400 transition-all"
              placeholder="Anonymous"
              autoFocus
              maxLength={20}
            />
            <button
              onClick={() => playerName && setShowNameInput(false)}
              disabled={!playerName}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg text-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
            >
              START EMPIRE
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const equippedCookie = getEquippedCookie();
  const equippedTheme = getEquippedTheme();
  const equippedTitle = getEquippedTitle();
  
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background with equipped theme */}
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
      <div className="fixed top-4 right-4 z-50 space-y-2">
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
      
      {/* Owner dashboard */}
      {isOwner && ownerPanelOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 overflow-y-auto p-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-yellow-900/60 to-orange-900/60 rounded-2xl border-2 border-yellow-500/50 p-6 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-4xl font-black text-yellow-400 flex items-center gap-3">
                  <Crown className="w-10 h-10" />
                  OWNER COMMAND CENTER
                </h2>
                <button
                  onClick={() => setOwnerPanelOpen(false)}
                  className="text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
              
              {/* Owner tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {['stats', 'cosmetics', 'players', 'advanced'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setOwnerTab(tab)}
                    className={`px-6 py-3 rounded-lg font-bold transition-all capitalize ${
                      ownerTab === tab
                        ? 'bg-yellow-600 text-white'
                        : 'bg-black/40 text-yellow-400 hover:bg-black/60'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              {/* Stats tab */}
              {ownerTab === 'stats' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-black/50 rounded-lg p-4 border border-yellow-500/30 col-span-3">
                    <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      CURRENT PLAYER STATS
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                      <div>
                        <div className="text-yellow-400/70">Cookies:</div>
                        <div className="font-bold text-lg">{formatNumber(cookies)}</div>
                      </div>
                      <div>
                        <div className="text-yellow-400/70">CPS:</div>
                        <div className="font-bold text-lg">{formatNumber(cookiesPerSecond)}</div>
                      </div>
                      <div>
                        <div className="text-yellow-400/70">CPC:</div>
                        <div className="font-bold text-lg">{formatNumber(cookiesPerClick)}</div>
                      </div>
                      <div>
                        <div className="text-yellow-400/70">Level:</div>
                        <div className="font-bold text-lg">{level}</div>
                      </div>
                      <div>
                        <div className="text-yellow-400/70">Prestige:</div>
                        <div className="font-bold text-lg">{prestige}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/50 rounded-lg p-4 border border-yellow-500/30">
                    <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      COOKIE CONTROLS
                    </h3>
                    <div className="space-y-2">
                      <button onClick={() => ownerAddCookies(1000000)} className="w-full bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded text-sm font-bold transition-all">
                        +1M Cookies
                      </button>
                      <button onClick={() => ownerAddCookies(1000000000)} className="w-full bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded text-sm font-bold transition-all">
                        +1B Cookies
                      </button>
                      <button onClick={() => ownerMultiplyCookies(10)} className="w-full bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded text-sm font-bold transition-all">
                        10x Cookies
                      </button>
                      <button onClick={() => ownerMultiplyCookies(1000)} className="w-full bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded text-sm font-bold transition-all">
                        1000x Cookies
                      </button>
                      <button onClick={() => ownerSetCookies(0)} className="w-full bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-sm font-bold transition-all">
                        Reset to 0
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-black/50 rounded-lg p-4 border border-yellow-500/30">
                    <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      PRODUCTION
                    </h3>
                    <div className="space-y-2">
                      <button onClick={() => ownerSetCPS(1000000)} className="w-full bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded text-sm font-bold transition-all">
                        1M CPS
                      </button>
                      <button onClick={() => ownerSetCPS(1000000000)} className="w-full bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded text-sm font-bold transition-all">
                        1B CPS
                      </button>
                      <button onClick={() => ownerSetCPC(1000000)} className="w-full bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-sm font-bold transition-all">
                        1M CPC
                      </button>
                      <button onClick={() => ownerSetCPC(1000000000)} className="w-full bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-sm font-bold transition-all">
                        1B CPC
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-black/50 rounded-lg p-4 border border-yellow-500/30">
                    <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      POWER COMMANDS
                    </h3>
                    <div className="space-y-2">
                      <button onClick={() => ownerSetLevel(100)} className="w-full bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm font-bold transition-all">
                        Set Level 100
                      </button>
                      <button onClick={() => ownerSetPrestigeTokens(1000)} className="w-full bg-pink-600 hover:bg-pink-500 px-4 py-2 rounded text-sm font-bold transition-all">
                        +1000 P. Tokens
                      </button>
                      <button onClick={ownerUnlockAllAchievements} className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-bold transition-all">
                        All Achievements
                      </button>
                      <button onClick={ownerUnlockAllCosmetics} className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-bold transition-all">
                        All Cosmetics
                      </button>
                      <button onClick={ownerMaxAllUpgrades} className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-bold transition-all">
                        Max All Upgrades
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-black/50 rounded-lg p-4 border border-red-500/50 col-span-3">
                    <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      EXTREME COMMANDS
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <button onClick={ownerGodMode} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-4 py-3 rounded font-bold transition-all shadow-lg">
                        👑 ACTIVATE GOD MODE 👑
                      </button>
                      <button onClick={ownerResetGame} className="bg-red-700 hover:bg-red-600 px-4 py-3 rounded font-bold transition-all">
                        ⚠️ FULL RESET (DANGER)
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Cosmetics tab */}
              {ownerTab === 'cosmetics' && (
                <div className="space-y-4">
                  <div className="bg-black/50 rounded-lg p-6 border border-yellow-500/30">
                    <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2 text-xl">
                      <Gift className="w-6 h-6" />
                      GIVE COSMETICS TO PLAYERS
                    </h3>
                    
                    <div className="mb-4">
                      <label className="block text-yellow-400 mb-2 font-semibold">Target Username:</label>
                      <input
                        type="text"
                        value={targetUsername}
                        onChange={(e) => setTargetUsername(e.target.value)}
                        className="w-full bg-black/50 border-2 border-yellow-500/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400"
                        placeholder="Enter player username"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {Object.keys(COSMETICS).map(type => (
                        <div key={type} className="bg-black/30 rounded-lg p-4 border border-yellow-500/20">
                          <h4 className="text-yellow-300 font-bold mb-3 capitalize">{type}</h4>
                          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                            {COSMETICS[type].map(item => (
                              <button
                                key={item.id}
                                onClick={() => setSelectedCosmetic({ ...item, type: type.slice(0, -1) })}
                                className={`p-3 rounded-lg border transition-all text-left ${
                                  selectedCosmetic?.id === item.id && selectedCosmetic?.type === type.slice(0, -1)
                                    ? 'bg-yellow-600 border-yellow-400'
                                    : 'bg-black/40 border-yellow-500/30 hover:border-yellow-400/50'
                                }`}
                              >
                                <div className="text-2xl mb-1">{item.emoji || item.display || '🎨'}</div>
                                <div className={`text-xs font-bold ${getRarityColor(item.rarity)}`}>
                                  {item.name}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedCosmetic && (
                      <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-500/50 mb-4">
                        <p className="text-yellow-300">
                          Selected: <span className="font-bold">{selectedCosmetic.name}</span> ({selectedCosmetic.type})
                        </p>
                      </div>
                    )}
                    
                    <button
                      onClick={ownerGiveCosmetic}
                      disabled={!targetUsername || !selectedCosmetic}
                      className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 rounded-lg transition-all disabled:cursor-not-allowed"
                    >
                      🎁 GIVE COSMETIC
                    </button>
                  </div>
                </div>
              )}
              
              {/* Players tab */}
              {ownerTab === 'players' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-yellow-400 font-bold text-xl flex items-center gap-2">
                      <Users className="w-6 h-6" />
                      ALL PLAYERS ({allPlayers.length})
                    </h3>
                    <button
                      onClick={loadAllPlayers}
                      className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded font-bold transition-all flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      REFRESH
                    </button>
                  </div>
                  
                  <div className="bg-black/50 rounded-lg border border-yellow-500/30 max-h-[600px] overflow-y-auto">
                    {allPlayers.map((player, index) => (
                      <div
                        key={player.playerId}
                        className="p-4 border-b border-yellow-500/20 hover:bg-yellow-900/20 transition-all"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-bold text-lg text-white">{player.playerName}</div>
                            <div className="text-xs text-yellow-400/70">ID: {player.playerId}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-cyan-300">Level {player.level}</div>
                            <div className="text-xs text-purple-300">Prestige {player.prestige}</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                          <div>
                            <span className="text-yellow-400/70">Cookies:</span>
                            <div className="font-bold">{formatNumber(player.cookies)}</div>
                          </div>
                          <div>
                            <span className="text-yellow-400/70">Total:</span>
                            <div className="font-bold">{formatNumber(player.totalCookiesEarned)}</div>
                          </div>
                          <div>
                            <span className="text-yellow-400/70">Clicks:</span>
                            <div className="font-bold">{player.totalClicks?.toLocaleString()}</div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              const amount = prompt('Enter cookie amount to add:');
                              if (amount) {
                                await api.updatePlayer(player.playerId, {
                                  cookies: player.cookies + parseInt(amount)
                                });
                                loadAllPlayers();
                              }
                            }}
                            className="flex-1 bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-xs font-bold transition-all"
                          >
                            Add Cookies
                          </button>
                          <button
                            onClick={async () => {
                              const level = prompt('Set level:');
                              if (level) {
                                await api.updatePlayer(player.playerId, { level: parseInt(level) });
                                loadAllPlayers();
                              }
                            }}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-xs font-bold transition-all"
                          >
                            Set Level
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete ${player.playerName}?`)) {
                                await api.deletePlayer(player.playerId);
                                loadAllPlayers();
                              }
                            }}
                            className="flex-1 bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-xs font-bold transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Advanced tab */}
              {ownerTab === 'advanced' && (
                <div className="space-y-4">
                  <div className="bg-black/50 rounded-lg p-6 border border-yellow-500/30">
                    <h3 className="text-yellow-400 font-bold mb-4 text-xl flex items-center gap-2">
                      <Code className="w-6 h-6" />
                      ADVANCED COMMANDS
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-yellow-400 mb-2 font-semibold">Custom Cookie Amount:</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            id="custom-cookies"
                            className="flex-1 bg-black/50 border-2 border-yellow-500/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400"
                            placeholder="Enter amount"
                          />
                          <button
                            onClick={() => {
                              const val = document.getElementById('custom-cookies').value;
                              if (val) ownerSetCookies(parseInt(val));
                            }}
                            className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded font-bold transition-all"
                          >
                            SET
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-yellow-400 mb-2 font-semibold">Custom CPS:</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            id="custom-cps"
                            className="flex-1 bg-black/50 border-2 border-yellow-500/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400"
                            placeholder="Enter CPS"
                          />
                          <button
                            onClick={() => {
                              const val = document.getElementById('custom-cps').value;
                              if (val) ownerSetCPS(parseInt(val));
                            }}
                            className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded font-bold transition-all"
                          >
                            SET
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-yellow-400 mb-2 font-semibold">Custom CPC:</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            id="custom-cpc"
                            className="flex-1 bg-black/50 border-2 border-yellow-500/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400"
                            placeholder="Enter CPC"
                          />
                          <button
                            onClick={() => {
                              const val = document.getElementById('custom-cpc').value;
                              if (val) ownerSetCPC(parseInt(val));
                            }}
                            className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded font-bold transition-all"
                          >
                            SET
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-yellow-400 mb-2 font-semibold">Custom Level:</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            id="custom-level"
                            className="flex-1 bg-black/50 border-2 border-yellow-500/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400"
                            placeholder="Enter level"
                          />
                          <button
                            onClick={() => {
                              const val = document.getElementById('custom-level').value;
                              if (val) ownerSetLevel(parseInt(val));
                            }}
                            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-bold transition-all"
                          >
                            SET
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
                      <h4 className="text-red-400 font-bold mb-3">DANGER ZONE</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            if (confirm('Wipe ALL player data from database?')) {
                              // This would call backend endpoint to wipe all data
                              createNotification('⚠️ This requires backend implementation');
                            }
                          }}
                          className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded font-bold transition-all"
                        >
                          WIPE ALL PLAYER DATA
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Reset leaderboard?')) {
                              setLeaderboard([]);
                              createNotification('🔧 Leaderboard cleared (client-side)');
                            }
                          }}
                          className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded font-bold transition-all"
                        >
                          RESET LEADERBOARD
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Cosmetics menu */}
      {showCosmeticsMenu && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 rounded-2xl border-2 border-pink-500/50 p-6 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-4xl font-black text-pink-400 flex items-center gap-3">
                  <Palette className="w-10 h-10" />
                  COSMETICS
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
      
      {/* Main game content */}
      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-6xl md:text-7xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400"
              style={{ fontFamily: 'Impact, sans-serif', textShadow: '0 0 30px rgba(168, 85, 247, 0.5)' }}>
            COOKIE EMPIRE
          </h1>
          <div className="text-cyan-300 text-lg" style={{ fontFamily: 'Courier New, monospace' }}>
            {equippedTitle.display && <span className="mr-2">{equippedTitle.display}</span>}
            <span className="text-pink-400 font-bold">{playerName}</span>
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
            COSMETICS
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
        
        {/* Leaderboard modal */}
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
                      No players yet. Be the first!
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
              {clickStreak > 5 && (
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
            </div>
            
            {/* Achievements */}
            <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-2xl border-2 border-cyan-500/30 p-6 shadow-2xl">
              <h2 className="text-3xl font-black mb-4 flex items-center gap-3 text-cyan-400">
                <Trophy className="w-8 h-8" />
                ACHIEVEMENTS ({achievements.filter(a => a.unlocked).length}/{achievements.length})
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {achievements.map(ach => (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-lg border transition-all ${
                      ach.unlocked
                        ? 'bg-gradient-to-br from-yellow-600/40 to-orange-600/40 border-yellow-500/50 shadow-lg'
                        : 'bg-black/40 border-gray-700/50 opacity-50'
                    }`}
                    title={ach.desc}
                  >
                    <div className="text-4xl text-center mb-2">{ach.icon}</div>
                    <div className="text-xs text-center font-bold text-white">{ach.name}</div>
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
              
              {level >= 10 ? (
                <>
                  <div className="mb-4 text-center">
                    <div className="text-sm text-cyan-300 mb-2">
                      Reset progress for {Math.floor(level / 5)} prestige tokens
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
                  <p className="text-sm">Reach level 10 to unlock prestige</p>
                  <p className="text-xs opacity-70 mt-1">({10 - level} levels to go)</p>
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
