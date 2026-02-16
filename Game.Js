const { useState, useEffect, useRef } = React;

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
  const [secretCode, setSecretCode] = useState('');
  const OWNER_CODE = 'EMPIRE2025'; // The secret owner code
  
  // Player identity
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [playerId] = useState(() => 'player_' + Math.random().toString(36).substr(2, 9));
  
  // Leaderboard
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  // Achievements
  const [achievements, setAchievements] = useState([
    { id: 'first_click', name: 'First Cookie', desc: 'Click your first cookie', unlocked: false, icon: '🍪' },
    { id: 'hundred_cookies', name: 'Cookie Collector', desc: 'Earn 100 cookies', unlocked: false, icon: '💰' },
    { id: 'thousand_cookies', name: 'Cookie Hoarder', desc: 'Earn 1,000 cookies', unlocked: false, icon: '💎' },
    { id: 'first_upgrade', name: 'Investor', desc: 'Buy your first upgrade', unlocked: false, icon: '📈' },
    { id: 'level_5', name: 'Rising Star', desc: 'Reach level 5', unlocked: false, icon: '⭐' },
    { id: 'level_10', name: 'Cookie Master', desc: 'Reach level 10', unlocked: false, icon: '👑' },
    { id: 'hundred_cps', name: 'Automation King', desc: '100 cookies per second', unlocked: false, icon: '⚡' },
    { id: 'first_prestige', name: 'Ascended', desc: 'Prestige for the first time', unlocked: false, icon: '🌟' },
    { id: 'speed_demon', name: 'Speed Demon', desc: '100 clicks in 10 seconds', unlocked: false, icon: '🚀' },
    { id: 'millionaire', name: 'Millionaire', desc: 'Earn 1,000,000 cookies', unlocked: false, icon: '💸' },
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
    
    { id: 10, name: 'Cookie Oven', desc: '+1 cookie/sec', cost: 50, owned: 0, type: 'auto', cps: 1, icon: '🔥', tier: 1 },
    { id: 11, name: 'Grandma Baker', desc: '+5 cookies/sec', cost: 200, owned: 0, type: 'auto', cps: 5, icon: '👵', tier: 1 },
    { id: 12, name: 'Cookie Factory', desc: '+15 cookies/sec', cost: 800, owned: 0, type: 'auto', cps: 15, icon: '🏭', tier: 2 },
    { id: 13, name: 'Cookie Farm', desc: '+50 cookies/sec', cost: 4000, owned: 0, type: 'auto', cps: 50, icon: '🌾', tier: 2 },
    { id: 14, name: 'Cookie Mine', desc: '+150 cookies/sec', cost: 20000, owned: 0, type: 'auto', cps: 150, icon: '⛏️', tier: 3 },
    { id: 15, name: 'Cookie Wizard', desc: '+500 cookies/sec', cost: 100000, owned: 0, type: 'auto', cps: 500, icon: '🧙', tier: 3 },
    { id: 16, name: 'Cookie Portal', desc: '+2000 cookies/sec', cost: 500000, owned: 0, type: 'auto', cps: 2000, icon: '🌀', tier: 4 },
    { id: 17, name: 'Cookie Dimension', desc: '+10000 cookies/sec', cost: 5000000, owned: 0, type: 'auto', cps: 10000, icon: '🌌', tier: 4 },
  ]);
  
  // Prestige upgrades
  const [prestigeUpgrades, setPrestigeUpgrades] = useState([
    { id: 'p1', name: 'Cookie Blessing', desc: 'Start with 2x click power', cost: 1, owned: false, effect: 'click_start_2x' },
    { id: 'p2', name: 'Auto Starter', desc: 'Start with 10 CPS', cost: 2, owned: false, effect: 'cps_start_10' },
    { id: 'p3', name: 'Golden Touch', desc: '+10% all production', cost: 3, owned: false, effect: 'production_10' },
    { id: 'p4', name: 'Divine Fortune', desc: '+25% all production', cost: 5, owned: false, effect: 'production_25' },
    { id: 'p5', name: 'Cosmic Power', desc: '+50% all production', cost: 10, owned: false, effect: 'production_50' },
  ]);
  
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
      setCookies(c => c + level * 100);
      createNotification(`+${level * 100} bonus cookies!`);
    }
  }, [xp, level]);
  
  // Check achievements
  useEffect(() => {
    checkAchievements();
  }, [totalCookiesEarned, totalClicks, level, cookiesPerSecond, upgrades, prestige]);
  
  const checkAchievements = () => {
    const newAchievements = [...achievements];
    let changed = false;
    
    if (!newAchievements[0].unlocked && totalClicks > 0) {
      newAchievements[0].unlocked = true;
      changed = true;
      createNotification('🏆 Achievement: First Cookie!');
    }
    if (!newAchievements[1].unlocked && totalCookiesEarned >= 100) {
      newAchievements[1].unlocked = true;
      changed = true;
      createNotification('🏆 Achievement: Cookie Collector!');
    }
    if (!newAchievements[2].unlocked && totalCookiesEarned >= 1000) {
      newAchievements[2].unlocked = true;
      changed = true;
      createNotification('🏆 Achievement: Cookie Hoarder!');
    }
    if (!newAchievements[3].unlocked && upgrades.some(u => u.owned > 0)) {
      newAchievements[3].unlocked = true;
      changed = true;
      createNotification('🏆 Achievement: Investor!');
    }
    if (!newAchievements[4].unlocked && level >= 5) {
      newAchievements[4].unlocked = true;
      changed = true;
      createNotification('🏆 Achievement: Rising Star!');
    }
    if (!newAchievements[5].unlocked && level >= 10) {
      newAchievements[5].unlocked = true;
      changed = true;
      createNotification('🏆 Achievement: Cookie Master!');
    }
    if (!newAchievements[6].unlocked && cookiesPerSecond >= 100) {
      newAchievements[6].unlocked = true;
      changed = true;
      createNotification('🏆 Achievement: Automation King!');
    }
    if (!newAchievements[7].unlocked && prestige > 0) {
      newAchievements[7].unlocked = true;
      changed = true;
      createNotification('🏆 Achievement: Ascended!');
    }
    if (!newAchievements[9].unlocked && totalCookiesEarned >= 1000000) {
      newAchievements[9].unlocked = true;
      changed = true;
      createNotification('🏆 Achievement: Millionaire!');
    }
    
    if (changed) setAchievements(newAchievements);
  };
  
  // Click tracking for speed demon achievement
  useEffect(() => {
    const now = Date.now();
    clickTimeWindowRef.current = clickTimeWindowRef.current.filter(t => now - t < 10000);
    
    if (clickTimeWindowRef.current.length >= 100 && !achievements[8].unlocked) {
      const newAch = [...achievements];
      newAch[8].unlocked = true;
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
    createParticle(x, y, `+${Math.floor(earnedAmount)}`);
    
    // Bonus for streak
    if (clickStreak > 10 && clickStreak % 10 === 0) {
      const bonus = earnedAmount * 2;
      setCookies(c => c + bonus);
      setTotalCookiesEarned(t => t + bonus);
      createParticle(x, y + 30, `🔥 STREAK x${clickStreak}!`, '#ff6b00');
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
          // Apply immediate effects
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
      // Reset everything except prestige stats
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
        { id: 10, name: 'Cookie Oven', desc: '+1 cookie/sec', cost: 50, owned: 0, type: 'auto', cps: 1, icon: '🔥', tier: 1 },
        { id: 11, name: 'Grandma Baker', desc: '+5 cookies/sec', cost: 200, owned: 0, type: 'auto', cps: 5, icon: '👵', tier: 1 },
        { id: 12, name: 'Cookie Factory', desc: '+15 cookies/sec', cost: 800, owned: 0, type: 'auto', cps: 15, icon: '🏭', tier: 2 },
        { id: 13, name: 'Cookie Farm', desc: '+50 cookies/sec', cost: 4000, owned: 0, type: 'auto', cps: 50, icon: '🌾', tier: 2 },
        { id: 14, name: 'Cookie Mine', desc: '+150 cookies/sec', cost: 20000, owned: 0, type: 'auto', cps: 150, icon: '⛏️', tier: 3 },
        { id: 15, name: 'Cookie Wizard', desc: '+500 cookies/sec', cost: 100000, owned: 0, type: 'auto', cps: 500, icon: '🧙', tier: 3 },
        { id: 16, name: 'Cookie Portal', desc: '+2000 cookies/sec', cost: 500000, owned: 0, type: 'auto', cps: 2000, icon: '🌀', tier: 4 },
        { id: 17, name: 'Cookie Dimension', desc: '+10000 cookies/sec', cost: 5000000, owned: 0, type: 'auto', cps: 10000, icon: '🌌', tier: 4 },
      ]);
      
      createNotification(`🌟 PRESTIGE ${prestige + 1}! +${tokensEarned} tokens!`);
      updateLeaderboard();
    }
  };
  
  // Leaderboard simulation (normally would use backend)
  const updateLeaderboard = () => {
    const currentPlayer = {
      name: playerName || 'Anonymous',
      id: playerId,
      cookies: Math.floor(totalCookiesEarned),
      level: level,
      prestige: prestige,
      score: Math.floor(totalCookiesEarned + (level * 1000) + (prestige * 50000))
    };
    
    // Simulate other players
    const fakeLeaders = [
      { name: 'CookieMaster99', id: 'fake1', cookies: 15000000, level: 42, prestige: 8, score: 550000 },
      { name: 'GrandmaBaker', id: 'fake2', cookies: 12000000, level: 38, prestige: 7, score: 480000 },
      { name: 'TheChosenOne', id: 'fake3', cookies: 9000000, level: 35, prestige: 6, score: 420000 },
      { name: 'ClickLegend', id: 'fake4', cookies: 7500000, level: 30, prestige: 5, score: 380000 },
      { name: 'CookieQueen', id: 'fake5', cookies: 6000000, level: 28, prestige: 5, score: 320000 },
    ];
    
    const allPlayers = [...fakeLeaders, currentPlayer];
    allPlayers.sort((a, b) => b.score - a.score);
    setLeaderboard(allPlayers.slice(0, 10));
  };
  
  useEffect(() => {
    if (playerName) {
      updateLeaderboard();
    }
  }, [totalCookiesEarned, level, prestige, playerName]);
  
  // OWNER DASHBOARD FUNCTIONS
  const checkOwnerCode = () => {
    if (secretCode === OWNER_CODE) {
      setIsOwner(true);
      setOwnerPanelOpen(true);
      createNotification('👑 OWNER ACCESS GRANTED');
    } else {
      createNotification('❌ Invalid owner code');
    }
    setSecretCode('');
  };
  
  const ownerSetCookies = (amount) => {
    setCookies(amount);
    createNotification(`🔧 Set cookies to ${amount}`);
  };
  
  const ownerAddCookies = (amount) => {
    setCookies(c => c + amount);
    createNotification(`🔧 Added ${amount} cookies`);
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
    createNotification(`🔧 Set CPS to ${cps}`);
  };
  
  const ownerSetCPC = (cpc) => {
    setCookiesPerClick(cpc);
    createNotification(`🔧 Set CPC to ${cpc}`);
  };
  
  const ownerUnlockAllAchievements = () => {
    setAchievements(achievements.map(a => ({ ...a, unlocked: true })));
    createNotification('🔧 All achievements unlocked');
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
    ownerSetCookies(999999999);
    ownerSetLevel(999);
    ownerSetPrestige(99);
    ownerSetPrestigeTokens(999);
    ownerSetCPS(1000000);
    ownerSetCPC(1000000);
    ownerUnlockAllAchievements();
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
        { id: 10, name: 'Cookie Oven', desc: '+1 cookie/sec', cost: 50, owned: 0, type: 'auto', cps: 1, icon: '🔥', tier: 1 },
        { id: 11, name: 'Grandma Baker', desc: '+5 cookies/sec', cost: 200, owned: 0, type: 'auto', cps: 5, icon: '👵', tier: 1 },
        { id: 12, name: 'Cookie Factory', desc: '+15 cookies/sec', cost: 800, owned: 0, type: 'auto', cps: 15, icon: '🏭', tier: 2 },
        { id: 13, name: 'Cookie Farm', desc: '+50 cookies/sec', cost: 4000, owned: 0, type: 'auto', cps: 50, icon: '🌾', tier: 2 },
        { id: 14, name: 'Cookie Mine', desc: '+150 cookies/sec', cost: 20000, owned: 0, type: 'auto', cps: 150, icon: '⛏️', tier: 3 },
        { id: 15, name: 'Cookie Wizard', desc: '+500 cookies/sec', cost: 100000, owned: 0, type: 'auto', cps: 500, icon: '🧙', tier: 3 },
        { id: 16, name: 'Cookie Portal', desc: '+2000 cookies/sec', cost: 500000, owned: 0, type: 'auto', cps: 2000, icon: '🌀', tier: 4 },
        { id: 17, name: 'Cookie Dimension', desc: '+10000 cookies/sec', cost: 5000000, owned: 0, type: 'auto', cps: 10000, icon: '🌌', tier: 4 },
      ]);
      setPrestigeUpgrades(prestigeUpgrades.map(pu => ({ ...pu, owned: false })));
      createNotification('🔧 Game fully reset');
    }
  };
  
  if (showNameInput) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
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
            <p className="text-cyan-300 text-xl" style={{ fontFamily: 'Courier New, monospace' }}>
              NEXT-GEN CLICKER
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
  
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
      <div className="fixed inset-0" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 50% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)
        `,
        animation: 'pulse 10s ease-in-out infinite'
      }} />
      
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
            className="bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-3 rounded-lg shadow-2xl border border-cyan-400/50 animate-slideInRight"
            style={{ animation: 'slideInRight 0.3s ease-out' }}
          >
            {notif.message}
          </div>
        ))}
      </div>
      
      {/* Owner access button (hidden until activated) */}
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
          className="fixed bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center opacity-20 hover:opacity-100 transition-all z-40"
        >
          <Crown className="w-6 h-6" />
        </button>
      )}
      
      {/* Owner dashboard */}
      {isOwner && ownerPanelOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-2xl border-2 border-yellow-500/50 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-4xl font-black text-yellow-400 flex items-center gap-3">
                  <Crown className="w-10 h-10" />
                  OWNER DASHBOARD
                </h2>
                <button
                  onClick={() => setOwnerPanelOpen(false)}
                  className="text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-black/50 rounded-lg p-4 border border-yellow-500/30">
                  <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    COOKIE CONTROLS
                  </h3>
                  <div className="space-y-2">
                    <button onClick={() => ownerAddCookies(1000)} className="w-full bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded text-sm font-bold transition-all">
                      +1,000 Cookies
                    </button>
                    <button onClick={() => ownerAddCookies(100000)} className="w-full bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded text-sm font-bold transition-all">
                      +100,000 Cookies
                    </button>
                    <button onClick={() => ownerAddCookies(10000000)} className="w-full bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded text-sm font-bold transition-all">
                      +10M Cookies
                    </button>
                    <button onClick={() => ownerMultiplyCookies(2)} className="w-full bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded text-sm font-bold transition-all">
                      2x Cookies
                    </button>
                    <button onClick={() => ownerMultiplyCookies(10)} className="w-full bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded text-sm font-bold transition-all">
                      10x Cookies
                    </button>
                    <button onClick={() => ownerSetCookies(0)} className="w-full bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-sm font-bold transition-all">
                      Reset Cookies to 0
                    </button>
                  </div>
                </div>
                
                <div className="bg-black/50 rounded-lg p-4 border border-yellow-500/30">
                  <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    PRODUCTION CONTROLS
                  </h3>
                  <div className="space-y-2">
                    <button onClick={() => ownerSetCPS(100)} className="w-full bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded text-sm font-bold transition-all">
                      Set 100 CPS
                    </button>
                    <button onClick={() => ownerSetCPS(10000)} className="w-full bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded text-sm font-bold transition-all">
                      Set 10,000 CPS
                    </button>
                    <button onClick={() => ownerSetCPS(1000000)} className="w-full bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded text-sm font-bold transition-all">
                      Set 1M CPS
                    </button>
                    <button onClick={() => ownerSetCPC(1000)} className="w-full bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-sm font-bold transition-all">
                      Set 1,000 CPC
                    </button>
                    <button onClick={() => ownerSetCPC(100000)} className="w-full bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-sm font-bold transition-all">
                      Set 100,000 CPC
                    </button>
                  </div>
                </div>
                
                <div className="bg-black/50 rounded-lg p-4 border border-yellow-500/30">
                  <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    LEVEL & PRESTIGE
                  </h3>
                  <div className="space-y-2">
                    <button onClick={() => ownerSetLevel(10)} className="w-full bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm font-bold transition-all">
                      Set Level 10
                    </button>
                    <button onClick={() => ownerSetLevel(50)} className="w-full bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm font-bold transition-all">
                      Set Level 50
                    </button>
                    <button onClick={() => ownerSetLevel(999)} className="w-full bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm font-bold transition-all">
                      Set Level 999
                    </button>
                    <button onClick={() => ownerSetPrestige(10)} className="w-full bg-pink-600 hover:bg-pink-500 px-4 py-2 rounded text-sm font-bold transition-all">
                      Set Prestige 10
                    </button>
                    <button onClick={() => ownerSetPrestigeTokens(100)} className="w-full bg-pink-600 hover:bg-pink-500 px-4 py-2 rounded text-sm font-bold transition-all">
                      +100 Prestige Tokens
                    </button>
                  </div>
                </div>
                
                <div className="bg-black/50 rounded-lg p-4 border border-yellow-500/30">
                  <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    POWER COMMANDS
                  </h3>
                  <div className="space-y-2">
                    <button onClick={ownerUnlockAllAchievements} className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-bold transition-all">
                      Unlock All Achievements
                    </button>
                    <button onClick={ownerMaxAllUpgrades} className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-bold transition-all">
                      Max All Upgrades (100)
                    </button>
                    <button onClick={ownerGodMode} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-4 py-2 rounded text-sm font-bold transition-all shadow-lg">
                      👑 GOD MODE 👑
                    </button>
                    <button onClick={ownerResetGame} className="w-full bg-red-700 hover:bg-red-600 px-4 py-2 rounded text-sm font-bold transition-all">
                      ⚠️ FULL RESET
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/50 rounded-lg p-4 border border-yellow-500/30">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  CURRENT STATS
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-yellow-400/70">Cookies:</div>
                    <div className="font-bold">{Math.floor(cookies).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-yellow-400/70">CPS:</div>
                    <div className="font-bold">{cookiesPerSecond.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-yellow-400/70">CPC:</div>
                    <div className="font-bold">{cookiesPerClick.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-yellow-400/70">Level:</div>
                    <div className="font-bold">{level}</div>
                  </div>
                  <div>
                    <div className="text-yellow-400/70">Prestige:</div>
                    <div className="font-bold">{prestige}</div>
                  </div>
                  <div>
                    <div className="text-yellow-400/70">P. Tokens:</div>
                    <div className="font-bold">{prestigeTokens}</div>
                  </div>
                  <div>
                    <div className="text-yellow-400/70">Total Earned:</div>
                    <div className="font-bold">{Math.floor(totalCookiesEarned).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-yellow-400/70">Total Clicks:</div>
                    <div className="font-bold">{totalClicks.toLocaleString()}</div>
                  </div>
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
            Welcome, <span className="text-pink-400 font-bold">{playerName}</span>
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-purple-900/60 to-cyan-900/60 rounded-2xl border-2 border-cyan-500/50 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
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
              
              <div className="space-y-3">
                {leaderboard.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                      player.id === playerId
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
                      <div className="font-bold text-lg text-white">{player.name}</div>
                      <div className="text-sm text-cyan-300">
                        {player.cookies.toLocaleString()} cookies • Level {player.level} • Prestige {player.prestige}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-pink-400">
                        {player.score.toLocaleString()}
                      </div>
                      <div className="text-xs text-cyan-400">SCORE</div>
                    </div>
                  </div>
                ))}
              </div>
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
                  <div className="text-2xl font-black text-white">{Math.floor(cookies).toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-cyan-400 mb-1">PER CLICK</div>
                  <div className="text-2xl font-black text-pink-400">{cookiesPerClick.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-cyan-400 mb-1">PER SECOND</div>
                  <div className="text-2xl font-black text-purple-400">{cookiesPerSecond.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-cyan-400 mb-1">LEVEL</div>
                  <div className="text-2xl font-black text-yellow-400">{level}</div>
                </div>
              </div>
              
              {/* XP Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-cyan-400 mb-1">
                  <span>XP: {Math.floor(xp)} / {getLevelRequirement(level)}</span>
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
                <span className="relative z-10">🍪</span>
              </button>
              <div className="mt-6 text-2xl font-bold text-cyan-300">
                TAP TO EARN {cookiesPerClick.toLocaleString()} COOKIES
              </div>
            </div>
            
            {/* Achievements */}
            <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-2xl border-2 border-cyan-500/30 p-6 shadow-2xl">
              <h2 className="text-3xl font-black mb-4 flex items-center gap-3 text-cyan-400">
                <Trophy className="w-8 h-8" />
                ACHIEVEMENTS
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
              <h2 className="text-3xl font-black mb-4 flex items-center gap-3 text-pink-400 sticky top-0 bg-gradient-to-br from-purple-900/80 to-cyan-900/80 backdrop-blur-xl -mx-6 -mt-6 px-6 pt-6 pb-4 z-10 border-b-2 border-pink-500/30">
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
                          {upgrade.cost.toLocaleString()} 🍪
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
