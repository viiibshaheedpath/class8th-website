'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

// Color Palettes
const PALETTES = [
  [['#a855f7', '#ec4899'], ['#22d3ee', '#3b82f6'], ['#34d399', '#14b8a6'], ['#f59e0b', '#f97316'], ['#ec4899', '#d946ef'], ['#60a5fa', '#818cf8'], ['#8b5cf6', '#6366f1'], ['#fb7185', '#fb923c'], ['#2dd4bf', '#38bdf8']],
  [['#f472b6', '#fb7185'], ['#fb923c', '#f59e0b'], ['#f59e0b', '#fbbf24'], ['#ef4444', '#f97316'], ['#ec4899', '#f43f5e'], ['#fb7185', '#f59e0b'], ['#f43f5e', '#fb7185'], ['#f97316', '#fbbf24'], ['#fbbf24', '#fb923c']],
  [['#38bdf8', '#22d3ee'], ['#22d3ee', '#0ea5e9'], ['#34d399', '#22d3ee'], ['#0ea5e9', '#6366f1'], ['#2dd4bf', '#14b8a6'], ['#60a5fa', '#38bdf8'], ['#818cf8', '#22d3ee'], ['#22d3ee', '#34d399'], ['#0ea5e9', '#2dd4bf']]
];
const PAL_NAMES = ['Aurora', 'Sunset', 'Ocean'];

// Data Sets
const HABIT_DATA: Record<string, { labels: string[]; vals: number[] }> = {
  Day: { labels: ['6a', '9a', '12p', '3p', '6p', '9p'], vals: [10, 35, 20, 45, 60, 30] },
  Week: { labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'], vals: [80, 120, 95, 140, 110, 165, 70] },
  Month: { labels: ['W1', 'W2', 'W3', 'W4'], vals: [420, 560, 610, 720] }
};

const PROG_DATA: Record<string, { labels: string[]; vals: number[] }> = {
  Week: { labels: ['Math', 'Sci', 'Eng', 'Hist', 'Art', 'CS'], vals: [120, 90, 70, 40, 55, 80] },
  Month: { labels: ['Math', 'Sci', 'Eng', 'Hist', 'Art', 'CS'], vals: [480, 420, 300, 210, 260, 360] }
};

const INITIAL_SKILLS = [
  { name: 'Mathematics', icon: 'calc', defaultHours: 360, slot: 0 },
  { name: 'Science', icon: 'flask', defaultHours: 320, slot: 1 },
  { name: 'Reading', icon: 'book', defaultHours: 440, slot: 3 },
  { name: 'Writing', icon: 'pen', defaultHours: 275, slot: 4 },
  { name: 'Focus', icon: 'target', defaultHours: 200, slot: 8 }
];

const ACHIEVEMENTS = [
  { name: '7-Day Streak', sub: 'Stayed consistent', icon: 'flame', done: true, slot: 3 },
  { name: 'First 10 Hours', sub: 'Logged this week', icon: 'clock', done: true, slot: 1 },
  { name: 'Quiz Master', sub: '3 quizzes left', icon: 'trophy', done: false, slot: 4 }
];

const BOOSTS = [
  { id: 'focus', name: 'Focus', icon: 'bolt', slot: 0 },
  { id: 'energy', name: 'Energy', icon: 'battery', slot: 3 },
  { id: 'calm', name: 'Calm', icon: 'leaf', slot: 1 },
  { id: 'memory', name: 'Memory', icon: 'brain', slot: 4 }
];

const INITIAL_MARKET = [
  { id: 0, name: 'Extra Break', sub: '10 min of rest', cost: 30, icon: 'heart', slot: 4 },
  { id: 1, name: 'Pick the Music', sub: 'Choose study playlist', cost: 45, icon: 'music', slot: 0 },
  { id: 2, name: 'Skip a Chore', sub: 'One time pass', cost: 80, icon: 'star', slot: 3 },
  { id: 3, name: 'Movie Night', sub: 'Weekend reward', cost: 120, icon: 'film', slot: 1 }
];

interface ReflectionLog {
  id: string;
  subject: string;
  minutes: number;
  reflection: string;
  date: string;
}

export default function HabitsPage() {
  const { user } = useAuth();
  const rawName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';
  const firstName = rawName.split(' ')[0];
  const avatarLetter = (firstName.charAt(0) || 'S').toUpperCase();

  // Background Video State
  const [videoSrc, setVideoSrc] = useState('/1.mp4');
  const [isDragOver, setIsDragOver] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Gamification State
  const [curPal, setCurPal] = useState(0);
  const [xp, setXp] = useState(40);
  const [level, setLevel] = useState(12);
  const [points, setPoints] = useState(240);
  const [goal, setGoal] = useState(50);
  const [targetHours, setTargetHours] = useState(3);

  // Hours per subject state: 5 hours dedicated = 1% skill increase!
  const [subjectHours, setSubjectHours] = useState<Record<string, number>>({
    Mathematics: 360,
    Science: 320,
    Reading: 440,
    Writing: 275,
    Focus: 200
  });

  const [ownedMarket, setOwnedMarket] = useState<boolean[]>([false, false, false, false]);

  // Non-binary Continuous Liquid Fill levels for Study Boost Vials (0% - 100%)
  const [boostFills, setBoostFills] = useState<Record<string, number>>({
    focus: 90,
    energy: 75,
    calm: 60,
    memory: 85
  });

  const [habitSeg, setHabitSeg] = useState<'Day' | 'Week' | 'Month'>('Day');
  const [progSeg, setProgSeg] = useState<'Week' | 'Month'>('Week');
  const [searchQuery, setSearchQuery] = useState('');

  // Reflection Logs State
  const [reflectionLogs, setReflectionLogs] = useState<ReflectionLog[]>([
    {
      id: 'log-1',
      subject: 'Mathematics',
      minutes: 45,
      reflection: 'Solved Rational Numbers practice questions. Understood negative fraction rules clearly.',
      date: 'Yesterday'
    },
    {
      id: 'log-2',
      subject: 'Science',
      minutes: 30,
      reflection: 'Reviewed Chemical Reaction rules & force diagrams. Need to revise friction types.',
      date: '2 days ago'
    }
  ]);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logSubject, setLogSubject] = useState('Mathematics');
  const [logMinutes, setLogMinutes] = useState(30);
  const [logReflection, setLogReflection] = useState('');

  // Pomodoro Timer State
  const [pomoMode, setPomoMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [pomoTimeLeft, setPomoTimeLeft] = useState(1500); // 25 mins in seconds
  const [pomoIsRunning, setPomoIsRunning] = useState(false);
  const [pomoSubject, setPomoSubject] = useState('Mathematics');
  const [pomoSessionsToday, setPomoSessionsToday] = useState(4);
  const [pomoStudyMinutesToday, setPomoStudyMinutesToday] = useState(100); // 1h 40m

  const [toastMsg, setToastMsg] = useState('');
  const [toastWarn, setToastWarn] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  const needXp = 80 + (level - 1) * 25;

  // Helper: Skill percentage calculation: 5 hours dedicated = 1% skill
  const getSkillPct = (hours: number) => Math.min(100, Math.floor(hours / 5));

  // Audio chime player for Pomodoro completion
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  // Load state from Supabase / LocalStorage
  useEffect(() => {
    async function loadData() {
      // 1. Try LocalStorage
      try {
        const saved = localStorage.getItem('c8-quest');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.xp !== undefined) setXp(parsed.xp);
          if (parsed.level !== undefined) setLevel(parsed.level);
          if (parsed.points !== undefined) setPoints(parsed.points);
          if (parsed.goal !== undefined) setGoal(parsed.goal);
          if (parsed.owned && Array.isArray(parsed.owned)) setOwnedMarket(parsed.owned);
        }

        const savedSubHours = localStorage.getItem('c8-subject-hours');
        if (savedSubHours) {
          setSubjectHours(JSON.parse(savedSubHours));
        }

        const savedBoostFills = localStorage.getItem('c8-boost-fills');
        if (savedBoostFills) {
          setBoostFills(JSON.parse(savedBoostFills));
        }

        const savedPomo = localStorage.getItem('c8-pomodoro-stats');
        if (savedPomo) {
          const parsedP = JSON.parse(savedPomo);
          if (parsedP.sessions !== undefined) setPomoSessionsToday(parsedP.sessions);
          if (parsedP.minutes !== undefined) setPomoStudyMinutesToday(parsedP.minutes);
        }

        const savedLogs = localStorage.getItem('c8-habit-logs');
        if (savedLogs) {
          setReflectionLogs(JSON.parse(savedLogs));
        }
      } catch (e) {
        console.error(e);
      }

      // 2. Try Supabase if connected
      if (user?.id) {
        try {
          const { data: progress } = await supabase
            .from('habit_progress')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (progress) {
            setLevel(progress.level ?? 12);
            setXp(progress.xp ?? 40);
            setPoints(progress.points ?? 240);
            setGoal(progress.goal ?? 50);
            setTargetHours(progress.target_hours ?? 3);
            if (progress.owned_market) setOwnedMarket(progress.owned_market);
            if (progress.subject_hours) setSubjectHours(progress.subject_hours);
            if (progress.boost_fills) setBoostFills(progress.boost_fills);
          }

          const { data: logs } = await supabase
            .from('habit_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (logs && logs.length > 0) {
            const formatted: ReflectionLog[] = logs.map((l) => ({
              id: l.id,
              subject: l.subject || 'General',
              minutes: l.minutes_logged || 30,
              reflection: l.reflection_note || 'No notes written.',
              date: new Date(l.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            }));
            setReflectionLogs(formatted);
          }
        } catch (err) {
          console.warn('Supabase fetch habit error fallback to local:', err);
        }
      }
    }

    loadData();
  }, [user]);

  const saveState = async (
    newXp = xp,
    newLvl = level,
    newPts = points,
    newGoal = goal,
    newOwned = ownedMarket,
    newSubHours = subjectHours,
    newBoostFills = boostFills,
    newPomoSessions = pomoSessionsToday,
    newPomoMinutes = pomoStudyMinutesToday
  ) => {
    // LocalStorage Sync
    try {
      localStorage.setItem('c8-quest', JSON.stringify({ xp: newXp, level: newLvl, points: newPts, goal: newGoal, owned: newOwned }));
      localStorage.setItem('c8-subject-hours', JSON.stringify(newSubHours));
      localStorage.setItem('c8-boost-fills', JSON.stringify(newBoostFills));
      localStorage.setItem('c8-pomodoro-stats', JSON.stringify({ sessions: newPomoSessions, minutes: newPomoMinutes }));
    } catch (e) {
      console.error(e);
    }

    // Supabase Sync
    if (user?.id) {
      try {
        await supabase.from('habit_progress').upsert({
          user_id: user.id,
          level: newLvl,
          xp: newXp,
          points: newPts,
          goal: newGoal,
          target_hours: targetHours,
          owned_market: newOwned,
          subject_hours: newSubHours,
          boost_fills: newBoostFills,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Supabase upsert habit_progress notice:', err);
      }
    }
  };

  // Pomodoro Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (pomoIsRunning && pomoTimeLeft > 0) {
      interval = setInterval(() => {
        setPomoTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (pomoIsRunning && pomoTimeLeft === 0) {
      setPomoIsRunning(false);
      playChime();

      if (pomoMode === 'focus') {
        const sessionMins = 25;
        const newSessions = pomoSessionsToday + 1;
        const newMinutes = pomoStudyMinutesToday + sessionMins;
        const addedHours = sessionMins / 60; // 0.417 hrs

        const updatedHours = {
          ...subjectHours,
          [pomoSubject]: Number(((subjectHours[pomoSubject] || 0) + addedHours).toFixed(2))
        };

        // Refill vials +15% continuous liquid fill
        const updatedFills = { ...boostFills };
        Object.keys(updatedFills).forEach((k) => {
          updatedFills[k] = Math.min(100, (updatedFills[k] || 0) + 15);
        });

        const newPts = points + 15;
        setPomoSessionsToday(newSessions);
        setPomoStudyMinutesToday(newMinutes);
        setSubjectHours(updatedHours);
        setBoostFills(updatedFills);
        setPoints(newPts);
        addXp(25);

        saveState(xp + 25, level, newPts, goal, ownedMarket, updatedHours, updatedFills, newSessions, newMinutes);
        showToast(`🎉 Focus Pomodoro Completed! +1 Session, +25m to ${pomoSubject}! +25 XP · +15% Boost Fill`);
      } else {
        showToast(`☕ Break completed! Ready to focus again?`);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomoIsRunning, pomoTimeLeft, pomoMode, pomoSessionsToday, pomoStudyMinutesToday, pomoSubject, subjectHours, boostFills, points, xp, level, goal, ownedMarket]);

  // Pomodoro Mode Switcher
  const handlePomoModeChange = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setPomoMode(mode);
    setPomoIsRunning(false);
    if (mode === 'focus') setPomoTimeLeft(1500); // 25 mins
    else if (mode === 'shortBreak') setPomoTimeLeft(300); // 5 mins
    else if (mode === 'longBreak') setPomoTimeLeft(900); // 15 mins
  };

  // RESET ALL HABIT DATA
  const handleResetAllData = async () => {
    const defaultHours = {
      Mathematics: 0,
      Science: 0,
      Reading: 0,
      Writing: 0,
      Focus: 0
    };
    const defaultFills = {
      focus: 100,
      energy: 100,
      calm: 100,
      memory: 100
    };

    setXp(0);
    setLevel(1);
    setPoints(0);
    setGoal(0);
    setTargetHours(3);
    setSubjectHours(defaultHours);
    setBoostFills(defaultFills);
    setOwnedMarket([false, false, false, false]);
    setReflectionLogs([]);
    setPomoSessionsToday(0);
    setPomoStudyMinutesToday(0);
    setPomoTimeLeft(1500);
    setPomoIsRunning(false);

    try {
      localStorage.removeItem('c8-quest');
      localStorage.removeItem('c8-habit-logs');
      localStorage.removeItem('c8-subject-hours');
      localStorage.removeItem('c8-boost-fills');
      localStorage.removeItem('c8-pomodoro-stats');
    } catch (e) {
      console.error(e);
    }

    if (user?.id) {
      try {
        await supabase.from('habit_progress').upsert({
          user_id: user.id,
          level: 1,
          xp: 0,
          points: 0,
          goal: 0,
          target_hours: 3,
          owned_market: [false, false, false, false],
          subject_hours: defaultHours,
          boost_fills: defaultFills,
          updated_at: new Date().toISOString()
        });

        await supabase.from('habit_logs').delete().eq('user_id', user.id);
      } catch (err) {
        console.warn('Supabase reset error:', err);
      }
    }

    setShowResetConfirm(false);
    showToast('🔄 All habit data, skill hours, and logs have been reset to 0!');
  };

  // Add dedicated study hours to a subject
  const handleLogSubjectHours = (subjName: string, additionalHours: number) => {
    const curHrs = subjectHours[subjName] || 0;
    const newHrs = Number((curHrs + additionalHours).toFixed(2));
    const newSubHours = { ...subjectHours, [subjName]: newHrs };
    setSubjectHours(newSubHours);

    const oldSkillPct = getSkillPct(curHrs);
    const newSkillPct = getSkillPct(newHrs);

    addXp(10 * additionalHours);
    saveState(xp, level, points, goal, ownedMarket, newSubHours, boostFills);

    if (newSkillPct > oldSkillPct) {
      showToast(`⚡ Skill UP! ${subjName} is now ${newSkillPct}% (+1% per 5 hrs)!`);
    } else {
      showToast(`⏱ Logged +${additionalHours}h for ${subjName}. Total: ${newHrs}h (${newSkillPct}%)`);
    }
  };

  // Non-binary Study Boost Handler (continuous liquid drain/use)
  const handleUseBoostVial = (boostId: string, boostName: string) => {
    const curLevel = boostFills[boostId] ?? 80;
    if (curLevel < 15) {
      showToast(`🧪 ${boostName} vial is low (${curLevel}%)! Complete Pomodoro sessions to refill!`, true);
      return;
    }

    const newLevel = Math.max(0, curLevel - 20);
    const updatedFills = { ...boostFills, [boostId]: newLevel };
    setBoostFills(updatedFills);
    addXp(5);
    saveState(xp, level, points, goal, ownedMarket, subjectHours, updatedFills);
    showToast(`🧪 Activated ${boostName} Boost! Fill level: ${newLevel}%  ·  +5 XP`);
  };

  // Refill all vials
  const handleRefillVials = () => {
    const refilled = { focus: 100, energy: 100, calm: 100, memory: 100 };
    setBoostFills(refilled);
    saveState(xp, level, points, goal, ownedMarket, subjectHours, refilled);
    showToast('✨ Refilled all Study Boost vials to 100% full!');
  };

  // Cursor glow effect
  useEffect(() => {
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let targetX = cx;
    let targetY = cy;

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener('pointermove', handlePointerMove);

    let animId: number;
    const loop = () => {
      cx += (targetX - cx) * 0.12;
      cy += (targetY - cy) * 0.12;
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.transform = `translate(${cx - 170}px, ${cy - 170}px)`;
      }
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Video Drag & Drop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.relatedTarget === null) setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      showToast('📹 Background video updated!');
    }
  };

  const showToast = (msg: string, warn = false) => {
    setToastMsg(msg);
    setToastWarn(warn);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMsg('');
    }, 2800);
  };

  const addXp = (amount: number) => {
    let newXp = xp + amount;
    let newLvl = level;
    let currentNeed = 80 + (newLvl - 1) * 25;
    let leveled = false;

    while (newXp >= currentNeed) {
      newXp -= currentNeed;
      newLvl += 1;
      currentNeed = 80 + (newLvl - 1) * 25;
      leveled = true;
    }

    setXp(newXp);
    setLevel(newLvl);
    saveState(newXp, newLvl, points, goal, ownedMarket, subjectHours, boostFills);

    if (leveled) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 1600);
      showToast(`⬆️ Level up! You are now level ${newLvl}`);
    }
  };

  const handleSaveReflection = async () => {
    if (!logReflection.trim()) {
      showToast('Please enter a brief reflection note!', true);
      return;
    }

    const minsLogged = Number(logMinutes);
    const hoursLogged = Number((minsLogged / 60).toFixed(2));

    const newLog: ReflectionLog = {
      id: `log-${Date.now()}`,
      subject: logSubject,
      minutes: minsLogged,
      reflection: logReflection.trim(),
      date: 'Just now'
    };

    const updatedLogs = [newLog, ...reflectionLogs];
    setReflectionLogs(updatedLogs);

    // Update subject hours & skill
    const curHrs = subjectHours[logSubject] || 0;
    const newHrs = Number((curHrs + hoursLogged).toFixed(2));
    const newSubHours = { ...subjectHours, [logSubject]: newHrs };
    setSubjectHours(newSubHours);

    // Save to LocalStorage
    try {
      localStorage.setItem('c8-habit-logs', JSON.stringify(updatedLogs));
    } catch (e) {
      console.error(e);
    }

    // Save to Supabase
    if (user?.id) {
      try {
        await supabase.from('habit_logs').insert({
          user_id: user.id,
          minutes_logged: minsLogged,
          subject: logSubject,
          activity_type: 'Focus Study',
          reflection_note: logReflection.trim()
        });
      } catch (err) {
        console.warn('Supabase insert habit_logs notice:', err);
      }
    }

    // Goal & XP rewards
    const newGoal = Math.min(100, goal + 12);
    const newPts = points + 10;
    setGoal(newGoal);
    setPoints(newPts);
    addXp(20);
    saveState(xp, level, newPts, newGoal, ownedMarket, newSubHours, boostFills);

    setIsLogModalOpen(false);
    setLogReflection('');
    showToast(`📝 Saved reflection log! +${hoursLogged}h to ${logSubject}  ·  +20 XP`);
  };

  const handleBuyMarket = (itemIdx: number) => {
    const item = INITIAL_MARKET[itemIdx];
    if (ownedMarket[itemIdx]) return;
    if (points < item.cost) {
      showToast(`Not enough points for ${item.name}`, true);
      return;
    }
    const newPts = points - item.cost;
    const newOwned = [...ownedMarket];
    newOwned[itemIdx] = true;
    setPoints(newPts);
    setOwnedMarket(newOwned);
    saveState(xp, level, newPts, goal, newOwned, subjectHours, boostFills);
    showToast(`🎉 Redeemed: ${item.name}  (−${item.cost} pts)`);
  };

  const handleCyclePalette = () => {
    const nextPal = (curPal + 1) % PALETTES.length;
    setCurPal(nextPal);
    showToast(`Theme · ${PAL_NAMES[nextPal]}`);
  };

  // Helper calculation for today minutes & Pomodoro hours
  const totalTargetMinutes = targetHours * 60;
  const todayStudiedMinutes = Math.round((totalTargetMinutes * goal) / 100) + pomoStudyMinutesToday;
  const formattedTodayStudied =
    todayStudiedMinutes < 60
      ? `${todayStudiedMinutes}m`
      : `${Math.floor(todayStudiedMinutes / 60)}h ${todayStudiedMinutes % 60}m`;

  // Format Pomodoro Time
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getSlotStyle = (slotIdx: number) => {
    const p = PALETTES[curPal][slotIdx] || PALETTES[curPal][0];
    const hexRgba = (hex: string, a: number) => {
      const n = parseInt(hex.slice(1), 16);
      return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
    };
    return {
      '--accent': p[0],
      '--accent2': p[1],
      '--accent-soft': hexRgba(p[0], 0.15),
      '--accent-glow': hexRgba(p[0], 0.5)
    } as React.CSSProperties;
  };

  // SVG Helper
  const renderIcon = (name: string, sw = 2) => {
    switch (name) {
      case 'calc':
        return <path d="M5 3h14v18H5z M8 7h2 M14 7h2 M8 11h2 M14 11h2 M8 15h2 M14 15h2" />;
      case 'flask':
        return <path d="M9 3h6 M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" />;
      case 'book':
        return <><path d="M4 5a2 2 0 0 1 2-2h6v18H6a2 2 0 0 1-2-2z" /><path d="M20 5a2 2 0 0 0-2-2h-6v18h6a2 2 0 0 0 2-2z" /></>;
      case 'pen':
        return <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>;
      case 'target':
        return <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" fill="currentColor" /></>;
      case 'flame':
        return <path d="M12 2c1 3-1 4-2 6-1 2 0 4 2 4 1 0 2-1 2-3 2 2 3 4 3 6a5 5 0 0 1-10 0c0-3 2-5 3-7 1-2 2-4 2-6z" />;
      case 'clock':
        return <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>;
      case 'trophy':
        return <><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0z" /><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" /></>;
      case 'bolt':
        return <path d="M13 2L3 14h7l-1 8 10-12h-7z" />;
      case 'battery':
        return <><rect x="2" y="7" width="16" height="10" rx="2" /><path d="M22 10v4" /><path d="M6 10v4" /></>;
      case 'leaf':
        return <><path d="M11 20A7 7 0 0 1 4 13c0-5 7-9 16-9 0 9-4 16-9 16z" /><path d="M4 20c4-4 7-6 12-7" /></>;
      case 'brain':
        return <><path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-1 5 3 3 0 0 0 1 5 3 3 0 0 0 3 3 2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" /><path d="M15 3a3 3 0 0 1 3 3 3 3 0 0 1-1 5 3 3 0 0 1-3 3 2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /></>;
      case 'heart':
        return <path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />;
      case 'music':
        return <><path d="M9 18V5l10-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></>;
      case 'star':
        return <path d="M12 3l2.5 6 6.5.5-5 4.2 1.6 6.3L12 17l-5.6 3 1.6-6.3-5-4.2 6.5-.5z" />;
      case 'film':
        return <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" /></>;
      default:
        return null;
    }
  };

  const ringCircumference = 2 * Math.PI * 58;
  const ringOffset = ringCircumference * (1 - goal / 100);

  // Pomodoro progress ring calculations
  const totalPomoDuration = pomoMode === 'focus' ? 1500 : pomoMode === 'shortBreak' ? 300 : 900;
  const pomoProgressPct = (totalPomoDuration - pomoTimeLeft) / totalPomoDuration;
  const pomoRingOffset = ringCircumference * (1 - pomoProgressPct);

  return (
    <DashboardLayout title="Daily Habit & Skill Tracker">
      <div
        className="habit-root"
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* ============ BACKGROUND VIDEO ============ */}
        <div className="bg">
          <video
            ref={videoRef}
            className="bg-video"
            autoPlay
            muted
            loop
            playsInline
            src={videoSrc}
            onError={() => {
              if (videoSrc !== '/1.mp4') setVideoSrc('/1.mp4');
            }}
          />
          <div className="bg-tint" />
        </div>

        {/* DRAG-DROP VEIL */}
        <div className={`dragveil ${isDragOver ? 'show' : ''}`}>
          <div style={{ textAlign: 'center', color: '#fff', fontWeight: 700, fontSize: 'clamp(18px,3vw,26px)' }}>
            Drop your classroom video to preview
            <small style={{ display: 'block', fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>
              It will loop muted in the background
            </small>
          </div>
        </div>

        <div className="cursor-glow" ref={cursorGlowRef} aria-hidden="true" />

        {/* MAIN COMPACT CONTAINER */}
        <main className="wrap">
          {/* TOP HEADER CONTROLS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div className="hello">
              <div>
                <h1 className="display" style={{ margin: 0, fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 700 }}>
                  Hello, <span>{firstName}</span> <span className="wave">👋</span>
                </h1>
                <p style={{ margin: '3px 0 0 0', color: '#b6b2cc', fontSize: 12.5 }}>
                  Your quest board is live — keep the streak burning.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(168,85,247,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>📝</span> Log Study &amp; Reflect
              </button>

              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
                title="Reset all habit, skill & study data"
              >
                <span>🔄</span> Reset Data
              </button>

              <label className="nav-search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4-4" />
                </svg>
                <input
                  type="search"
                  placeholder="Search rewards…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </label>

              <button
                className="icon-btn"
                onClick={handleCyclePalette}
                type="button"
                title="Switch colour theme"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
                </svg>
              </button>

              <span className="today display">
                <span className="dot" /> Today · <b>{formattedTodayStudied}</b> studied
              </span>
            </div>
          </div>

          {/* ROW 1 */}
          <div className="row r1">
            {/* Student Quest / Leveling System */}
            <section className="card hoverable" style={getSlotStyle(0)}>
              <div className="card-head">
                <div className="card-title big display">
                  STUDENT QUEST<small>Leveling System</small>
                </div>
              </div>
              <div className="pf-top">
                <div className="avatar display">
                  <span>{avatarLetter}</span>
                  <span className="lvl">LV {level}</span>
                </div>
                <div className="pf-stats">
                  <div className="pf-stat">
                    <span className="ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3l2.5 6 6.5.5-5 4.2 1.6 6.3L12 17l-5.6 3 1.6-6.3-5-4.2 6.5-.5z" />
                      </svg>
                    </span>
                    <div className="meta"><b className="display">{level}</b><span>Level</span></div>
                  </div>

                  <div className="pf-stat">
                    <span className="ic">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2c1 3-1 4-2 6-1 2 0 4 2 4 1 0 2-1 2-3 2 2 3 4 3 6a5 5 0 0 1-10 0c0-3 2-5 3-7 1-2 2-4 2-6z" />
                      </svg>
                    </span>
                    <div className="meta"><b className="display">12</b><span>Day streak</span></div>
                  </div>

                  <div className="pf-stat">
                    <span className="ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                    </span>
                    <div className="meta">
                      <b className="display">{((Object.values(subjectHours).reduce((a, b) => a + b, 0))).toFixed(0)}h</b>
                      <span>Focus time</span>
                    </div>
                  </div>

                  <div className="pf-stat">
                    <span className="ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 8v8M9 11h4a1.5 1.5 0 0 1 0 3H9" />
                      </svg>
                    </span>
                    <div className="meta"><b className="display">{points}</b><span>Points</span></div>
                  </div>
                </div>
              </div>

              <div className="pf-name">
                <span>{rawName}</span> <span>· Scholar rank</span>
              </div>
              <div className="xp-row">
                <span>XP</span><span><b>{xp}</b> / <b>{needXp}</b></span>
              </div>
              <div className="xp-track">
                <div className="xp-fill" style={{ width: `${Math.min(100, (xp / needXp) * 100)}%` }} />
              </div>
            </section>

            {/* Habit Tracker Chart */}
            <section className="card hoverable" style={getSlotStyle(1)}>
              <div className="card-head">
                <div className="card-title">Habit Tracker</div>
                <div className="seg">
                  <span
                    className="seg-pill"
                    style={{
                      width: '58px',
                      transform: `translateX(${habitSeg === 'Day' ? 0 : habitSeg === 'Week' ? 62 : 124}px)`
                    }}
                  />
                  {(['Day', 'Week', 'Month'] as const).map((k) => (
                    <button
                      key={k}
                      className={`seg-btn ${habitSeg === k ? 'active' : ''}`}
                      type="button"
                      onClick={() => setHabitSeg(k)}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div className="chart-total">
                <span className="num display">
                  {HABIT_DATA[habitSeg].vals.reduce((a, b) => a + b, 0) + pomoStudyMinutesToday}m
                </span>
                <span className="lbl">studied</span>
              </div>

              <div className="chart">
                <div className="grid-lines">
                  {[0, 1, 2, 3].map((g) => (
                    <i key={g} style={{ bottom: `${(g / 3) * 100}%` }} />
                  ))}
                </div>
                <div className="bars">
                  {HABIT_DATA[habitSeg].vals.map((val, idx) => {
                    const max = Math.max(...HABIT_DATA[habitSeg].vals) || 1;
                    const peak = idx === HABIT_DATA[habitSeg].vals.indexOf(max);
                    const pct = Math.max(8, (val / max) * 100);
                    return (
                      <div key={idx} className={`barwrap ${peak ? 'peak' : ''}`}>
                        <div className="bar" style={{ height: `${pct}%` }} />
                        <span className="xl">{HABIT_DATA[habitSeg].labels[idx]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="slider-row">
                <div className="top">
                  <span>Daily target</span>
                  <span><b>{targetHours}</b> h / day</span>
                </div>
                <input
                  className="rng"
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={targetHours}
                  onChange={(e) => setTargetHours(Number(e.target.value))}
                />
              </div>
            </section>
          </div>

          {/* POMODORO TIMER & DAILY STUDY TRACKER (NEW CARD) */}
          <div className="row" style={{ gridTemplateColumns: '1fr', marginBottom: 14 }}>
            <section className="card hoverable" style={getSlotStyle(3)}>
              <div className="card-head">
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🍅</span> Pomodoro Study Timer &amp; Daily Tracker
                </div>
                <div className="seg">
                  {(['focus', 'shortBreak', 'longBreak'] as const).map((m) => (
                    <button
                      key={m}
                      className={`seg-btn ${pomoMode === m ? 'active' : ''}`}
                      type="button"
                      onClick={() => handlePomoModeChange(m)}
                    >
                      {m === 'focus' ? 'Focus (25m)' : m === 'shortBreak' ? 'Short Break (5m)' : 'Long Break (15m)'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'center' }}>
                {/* Clock & Ring */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div className="ring" style={{ width: '150px', height: '150px', position: 'relative' }}>
                    <svg viewBox="0 0 140 140">
                      <circle className="track" cx="70" cy="70" r="58" />
                      <circle
                        className="ring-fg"
                        cx="70"
                        cy="70"
                        r="58"
                        style={{
                          strokeDasharray: ringCircumference,
                          strokeDashoffset: pomoRingOffset,
                          stroke: pomoMode === 'focus' ? '#a855f7' : pomoMode === 'shortBreak' ? '#34d399' : '#38bdf8'
                        }}
                      />
                    </svg>
                    <div className="ring-center">
                      <span className="pct display" style={{ fontSize: '30px', letterSpacing: '1px' }}>
                        {formatTime(pomoTimeLeft)}
                      </span>
                      <span className="xp" style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                        {pomoIsRunning ? '⚡ Running' : '⏸ Paused'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setPomoIsRunning(!pomoIsRunning)}
                      style={{
                        background: pomoIsRunning ? 'rgba(239, 68, 68, 0.2)' : 'linear-gradient(135deg, #a855f7, #6366f1)',
                        border: pomoIsRunning ? '1px solid #ef4444' : 'none',
                        color: '#fff',
                        borderRadius: '10px',
                        padding: '8px 20px',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      {pomoIsRunning ? '⏸ Pause' : '▶ Start Session'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePomoModeChange(pomoMode)}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        borderRadius: '10px',
                        padding: '8px 14px',
                        fontWeight: 600,
                        fontSize: '12.5px',
                        cursor: 'pointer'
                      }}
                    >
                      🔄 Reset
                    </button>
                  </div>
                </div>

                {/* Session Settings & Daily Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#b6b2cc', marginBottom: '6px', fontWeight: 600 }}>
                      Select Subject to Study
                    </label>
                    <select
                      value={pomoSubject}
                      onChange={(e) => setPomoSubject(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.14)',
                        color: '#fff',
                        borderRadius: '10px',
                        padding: '9px 12px',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    >
                      {INITIAL_SKILLS.map((sk) => (
                        <option key={sk.name} value={sk.name} style={{ background: '#181524' }}>
                          {sk.name} ({getSkillPct(subjectHours[sk.name] || 0)}% Skill)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Daily Stats Counter */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        padding: '12px',
                        textAlign: 'center'
                      }}
                    >
                      <span style={{ fontSize: '10.5px', color: '#857fa0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                        Sessions Completed Today
                      </span>
                      <div className="display" style={{ fontSize: '24px', fontWeight: 700, color: '#a855f7', marginTop: '4px' }}>
                        {pomoSessionsToday} <small style={{ fontSize: '12px', color: '#b6b2cc' }}>sessions</small>
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        padding: '12px',
                        textAlign: 'center'
                      }}
                    >
                      <span style={{ fontSize: '10.5px', color: '#857fa0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                        Daily Study Given
                      </span>
                      <div className="display" style={{ fontSize: '24px', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>
                        {(pomoStudyMinutesToday / 60).toFixed(1)} <small style={{ fontSize: '12px', color: '#b6b2cc' }}>hrs</small>
                      </div>
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: '11.5px', color: '#857fa0', lineHeight: 1.4 }}>
                    💡 Completing focus sessions automatically updates your dedicated subject hours and increases your skill level (1% per 5 hrs)!
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* ROW 2 */}
          <div className="row r2">
            {/* Skill Tracker based on Hours Spent */}
            <section className="card hoverable" style={getSlotStyle(2)}>
              <div className="card-head">
                <div className="card-title">Skill Tracker</div>
                <span style={{ fontSize: '10.5px', color: 'var(--accent)', fontWeight: 700 }}>
                  5 hrs = +1% Skill
                </span>
              </div>

              {/* Explicit Rule Banner */}
              <div
                style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  color: '#e9d5ff',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>💡</span>
                <span>
                  <b>Skill Formula:</b> For every <b>5 hours</b> dedicated to a subject, skill level increases by <b>1%</b>.
                </span>
              </div>

              <div>
                {INITIAL_SKILLS.map((sk) => {
                  const hrs = subjectHours[sk.name] || 0;
                  const pct = getSkillPct(hrs);
                  return (
                    <div key={sk.name} className="skill" style={getSlotStyle(sk.slot)}>
                      <span className="skill-ic">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {renderIcon(sk.icon)}
                        </svg>
                      </span>
                      <div className="skill-body">
                        <div className="nm">
                          <span>{sk.name} <small style={{ color: '#857fa0', fontWeight: 400, marginLeft: 6 }}>({hrs.toFixed(1)} hrs dedicated)</small></span>
                          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{pct}%</span>
                        </div>
                        <div className="skill-bar">
                          <i style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <button
                        className="skill-plus"
                        type="button"
                        onClick={() => handleLogSubjectHours(sk.name, 1)}
                        title={`Add +1h to ${sk.name} (+1% skill per 5h)`}
                        style={{ fontSize: '11px', fontWeight: 700, width: 'auto', padding: '0 8px' }}
                      >
                        +1h
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Progress & Success */}
            <section className="card hoverable" style={getSlotStyle(3)}>
              <div className="card-head">
                <div className="card-title">Progress &amp; Success</div>
                <div className="seg">
                  <span
                    className="seg-pill"
                    style={{
                      width: '62px',
                      transform: `translateX(${progSeg === 'Week' ? 0 : 66}px)`
                    }}
                  />
                  {(['Week', 'Month'] as const).map((k) => (
                    <button
                      key={k}
                      className={`seg-btn ${progSeg === k ? 'active' : ''}`}
                      type="button"
                      onClick={() => setProgSeg(k)}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div className="stat-strip">
                <div className="stat"><span className="num display">12</span><span className="lbl"><b>Streak</b>days</span></div>
                <div className="stat"><span className="num display">6</span><span className="lbl"><b>Subjects</b>active</span></div>
                <div className="stat"><span className="num display">{((Object.values(subjectHours).reduce((a, b) => a + b, 0))).toFixed(0)}h</span><span className="lbl"><b>Total</b>Hours</span></div>
                <div className="stat"><span className="num display">{pomoSessionsToday}</span><span className="lbl"><b>Pomo</b>Sessions</span></div>
                <div className="stat"><span className="num display">92%</span><span className="lbl"><b>Accuracy</b>%</span></div>
              </div>

              <div className="chart">
                <div className="grid-lines">
                  {[0, 1, 2, 3].map((g) => (
                    <i key={g} style={{ bottom: `${(g / 3) * 100}%` }} />
                  ))}
                </div>
                <div className="bars">
                  {PROG_DATA[progSeg].vals.map((val, idx) => {
                    const max = Math.max(...PROG_DATA[progSeg].vals) || 1;
                    const peak = idx === PROG_DATA[progSeg].vals.indexOf(max);
                    const pct = Math.max(8, (val / max) * 100);
                    return (
                      <div key={idx} className={`barwrap ${peak ? 'peak' : ''}`}>
                        <div className="bar" style={{ height: `${pct}%` }} />
                        <span className="xl">{PROG_DATA[progSeg].labels[idx]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* ROW 3 */}
          <div className="row r3">
            {/* Goal Completion */}
            <section className="card hoverable" style={getSlotStyle(4)}>
              <div className="card-head">
                <div className="card-title">Goal Completion</div>
              </div>
              <div className="ring-wrap">
                <div className="ring">
                  <svg viewBox="0 0 140 140">
                    <circle className="track" cx="70" cy="70" r="58" />
                    <circle
                      className="ring-fg"
                      cx="70"
                      cy="70"
                      r="58"
                      style={{
                        strokeDasharray: ringCircumference,
                        strokeDashoffset: ringOffset
                      }}
                    />
                  </svg>
                  <div className="ring-center">
                    <span className="xp">GOAL</span>
                    <span className="pct display">{goal}%</span>
                    <span className="sub">today</span>
                  </div>
                </div>
                <button className="goal-btn" type="button" onClick={() => setIsLogModalOpen(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Log Study &amp; Reflect
                </button>
              </div>
            </section>

            {/* Achievements */}
            <section className="card hoverable" style={getSlotStyle(5)}>
              <div className="card-head">
                <div className="card-title">Achievements</div>
              </div>
              <div>
                {ACHIEVEMENTS.map((a) => (
                  <div key={a.name} className={`ach ${a.done ? '' : 'locked'}`} style={getSlotStyle(a.slot)}>
                    <span className="ach-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {renderIcon(a.icon)}
                      </svg>
                    </span>
                    <div className="ach-body">
                      <b>{a.name}</b>
                      <span>{a.sub}</span>
                    </div>
                    <span className={`tag ${a.done ? 'done' : 'soon'}`}>
                      {a.done ? 'Done' : 'Soon'}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Rank Badge */}
            <section className="card hoverable badge-card" style={getSlotStyle(6)}>
              <div className="badge-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div className="rank display">
                Scholar II<span>Top 8% this term</span>
              </div>
            </section>
          </div>

          {/* ROW 4: REFLECTION JOURNAL & IMPROVEMENT LOGS */}
          <div className="row" style={{ gridTemplateColumns: '1fr' }}>
            <section className="card hoverable" style={getSlotStyle(0)}>
              <div className="card-head">
                <div className="card-title">📖 Student Reflection &amp; Progress Journal</div>
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(true)}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  + Add Reflection
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', marginTop: '10px' }}>
                {reflectionLogs.length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#857fa0', margin: 0 }}>No reflections logged yet. Click "+ Add Reflection" to start your study journal.</p>
                ) : (
                  reflectionLogs.map((log) => (
                    <div
                      key={log.id}
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>
                          {log.subject}
                        </span>
                        <span style={{ fontSize: '10.5px', color: '#857fa0' }}>
                          ⏱ {log.minutes} mins • {log.date}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#f6f4fc', lineHeight: 1.5 }}>
                        "{log.reflection}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* ROW 5 */}
          <div className="row r4">
            {/* Study Boost Vials with Continuous (Non-Binary) Liquid Level */}
            <section className="card hoverable" style={getSlotStyle(7)}>
              <div className="card-head">
                <div className="card-title">Study Boosts (Continuous Fill)</div>
                <button
                  type="button"
                  onClick={handleRefillVials}
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                >
                  ⚡ Refill Vials
                </button>
              </div>
              <div className="vials">
                {BOOSTS.map((b) => {
                  const fillLevel = boostFills[b.id] ?? 80;
                  return (
                    <div
                      key={b.id}
                      className="vial-col"
                      style={getSlotStyle(b.slot)}
                      onClick={() => handleUseBoostVial(b.id, b.name)}
                    >
                      <div className="vial" style={{ position: 'relative' }}>
                        {/* Wavy liquid surface line */}
                        <div
                          className="liquid"
                          style={{
                            height: `${fillLevel}%`,
                            transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: 'linear-gradient(180deg, var(--accent2), var(--accent))'
                          }}
                        />
                        <div className="ic">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {renderIcon(b.icon)}
                          </svg>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <span className="nm">{b.name}</span>
                        <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 700 }}>
                          {fillLevel}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Reward Marketplace */}
            <section className="card hoverable" style={getSlotStyle(8)}>
              <div className="card-head">
                <div className="card-title">Reward Marketplace</div>
                <span className="card-title" style={{ letterSpacing: '1px', color: 'var(--faint)' }}>
                  {ownedMarket.filter((x) => !x).length} left
                </span>
              </div>
              <div>
                {INITIAL_MARKET.filter(
                  (m) => !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((m) => {
                  const isOwned = ownedMarket[m.id];
                  return (
                    <div key={m.id} className={`mkt-row ${isOwned ? 'owned' : ''}`} style={getSlotStyle(m.slot)}>
                      <span className="mkt-ic">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {renderIcon(m.icon)}
                        </svg>
                      </span>
                      <div className="mkt-body">
                        <b>{m.name}</b>
                        <span>{m.sub}</span>
                      </div>
                      <span className="mkt-cost">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                          {renderIcon('star', 0)}
                        </svg>
                        <span>{m.cost}</span>
                      </span>
                      <button
                        className="mkt-buy"
                        type="button"
                        onClick={() => handleBuyMarket(m.id)}
                        aria-label={`Redeem ${m.name}`}
                      >
                        {isOwned ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                            <path d="M5 12l4 4 10-10" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                            <circle cx="9" cy="20" r="1.4" fill="currentColor" />
                            <circle cx="18" cy="20" r="1.4" fill="currentColor" />
                            <path d="M2 3h3l2.4 12.4a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L21 7H6" />
                          </svg>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </main>

        {/* RESET CONFIRMATION MODAL */}
        {showResetConfirm && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              background: 'rgba(5, 5, 12, 0.8)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '420px',
                background: '#181524',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '32px' }}>🔄</div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>
                Reset All Habit &amp; Skill Data?
              </h3>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#b6b2cc', lineHeight: 1.5 }}>
                This will reset your level, XP, subject study hours, reflection logs, and Pomodoro session counts back to 0. This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '10px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetAllData}
                  style={{
                    flex: 1,
                    background: '#ef4444',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '10px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Yes, Reset Everything
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LOG STUDY & REFLECTION MODAL */}
        {isLogModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              background: 'rgba(5, 5, 12, 0.75)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '480px',
                background: '#181524',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>
                  📝 Log Study &amp; Reflect
                </h3>
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#857fa0', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#b6b2cc', marginBottom: '6px', fontWeight: 600 }}>
                  Subject
                </label>
                <select
                  value={logSubject}
                  onChange={(e) => setLogSubject(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  <option value="Mathematics" style={{ background: '#181524' }}>Mathematics</option>
                  <option value="Science" style={{ background: '#181524' }}>Science</option>
                  <option value="Reading" style={{ background: '#181524' }}>Reading</option>
                  <option value="Writing" style={{ background: '#181524' }}>Writing</option>
                  <option value="Focus" style={{ background: '#181524' }}>Focus</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#b6b2cc', marginBottom: '6px', fontWeight: 600 }}>
                  Study Duration (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={logMinutes}
                  onChange={(e) => setLogMinutes(Number(e.target.value))}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#b6b2cc', marginBottom: '6px', fontWeight: 600 }}>
                  Self Reflection Note (What did you learn? What to improve?)
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Completed Chapter 4 exercises. I need to practice friction formulas again tomorrow..."
                  value={logReflection}
                  onChange={(e) => setLogReflection(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '10px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveReflection}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '10px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Save &amp; Earn XP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOAST NOTIFICATION */}
        <div className={`toast ${toastWarn ? 'warn' : ''} ${toastMsg ? 'show' : ''}`}>
          <span className="tk" />
          <span>{toastMsg}</span>
        </div>

        {/* LEVEL UP BURST ANIMATION */}
        {showLevelUp && (
          <div className="lvlup show">
            <div className="ring2" />
            <div className="txt display">LEVEL UP!</div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .habit-root {
          position: relative;
          color: #f6f4fc;
          min-height: 85vh;
          border-radius: var(--radius-lg);
          overflow: hidden;
          padding: 18px;
        }

        /* ============ BACKGROUND VIDEO ============ */
        .bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          border-radius: var(--radius-lg);
        }
        .bg-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .bg-tint {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(120% 90% at 50% 120%, rgba(10,8,20,.72), transparent 60%),
            linear-gradient(180deg, rgba(10,8,20,.60) 0%, rgba(10,8,20,.35) 45%, rgba(10,8,20,.75) 100%),
            linear-gradient(90deg, rgba(10,8,20,.55), transparent 55%);
        }

        .dragveil {
          position: absolute; inset: 0; z-index: 30; display: none;
          align-items: center; justify-content: center;
          background: rgba(7,7,12,.65); backdrop-filter: blur(4px);
          border: 3px dashed rgba(168,85,247,.7); margin: 14px; border-radius: 20px;
          pointer-events: none;
        }
        .dragveil.show { display: flex; }

        .cursor-glow {
          position: fixed;
          left: 0;
          top: 0;
          width: 320px;
          height: 320px;
          z-index: 1;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle, rgba(168,85,247,.15), rgba(168,85,247,0) 65%);
          transform: translate(-50%,-50%);
          mix-blend-mode: screen;
        }

        /* COMPACT WRAPPER LAYOUT */
        .wrap {
          position: relative;
          z-index: 2;
          max-width: 980px;
          margin: 0 auto;
          padding: 8px 12px;
        }

        .hello h1 .wave {
          display: inline-block;
          transform-origin: 70% 70%;
          animation: wave 2.6s ease-in-out infinite;
        }
        @keyframes wave {
          0%, 60%, 100% { transform: rotate(0); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
        }

        .today {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(30,26,44,.72);
          border: 1px solid rgba(255,255,255,.12);
          backdrop-filter: blur(12px);
          font-size: 12px;
          color: #b6b2cc;
        }
        .today b { color: #f6f4fc; }
        .today .dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #34d399; box-shadow: 0 0 10px #34d399;
        }

        .nav-search {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 11px;
          border-radius: 10px;
          min-width: 180px;
          background: rgba(30,26,44,.72);
          border: 1px solid rgba(255,255,255,.12);
          backdrop-filter: blur(12px);
          transition: .25s ease;
        }
        .nav-search input {
          background: none; border: 0; outline: none;
          color: #fff; font-size: 12.5px; flex: 1;
        }

        .icon-btn {
          width: 34px; height: 34px; border-radius: 10px;
          cursor: pointer; display: grid; place-items: center;
          background: rgba(30,26,44,.72); border: 1px solid rgba(255,255,255,.12);
          backdrop-filter: blur(12px);
          color: #b6b2cc; transition: transform .18s, color .2s;
        }
        .icon-btn:hover { transform: translateY(-2px); color: #fff; background: rgba(255,255,255,.15); }
        .icon-btn svg { width: 16px; height: 16px; }

        .row { display: grid; gap: 14px; margin-bottom: 14px; }
        .r1 { grid-template-columns: 1.4fr 1fr; }
        .r2 { grid-template-columns: 1fr 1.5fr; }
        .r3 { grid-template-columns: 1fr 1fr .82fr; }
        .r4 { grid-template-columns: 1fr 1.6fr; }

        /* SLEEK COMPACT TRANSPARENT GLASS CARDS */
        .card {
          position: relative;
          overflow: hidden;
          border-radius: 18px;
          background: linear-gradient(160deg, rgba(26,22,38,.76), rgba(36,30,52,.70));
          border: 1px solid rgba(255,255,255,.12);
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
          padding: 14px 18px;
          box-shadow: 0 16px 45px -24px rgba(0,0,0,.9), inset 0 1px 0 rgba(255,255,255,.04);
          transition: transform .2s, box-shadow .5s, border-color .5s;
        }
        .card::before {
          content: ""; position: absolute; left: 0; right: 0; top: 0; height: 3px;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          opacity: .9;
        }

        .card-head {
          display: flex; align-items: center; justify-content: space-between;
          gap: 8px; margin-bottom: 12px; position: relative;
        }
        .card-title {
          font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
          color: #b6b2cc; font-weight: 700;
        }
        .card-title.big {
          font-size: clamp(18px, 2.5vw, 24px); letter-spacing: -.5px;
          text-transform: none; color: #fff; line-height: 1.05;
        }
        .card-title.big small {
          display: block; font-size: 12px; letter-spacing: 2px;
          text-transform: uppercase; color: var(--accent); font-weight: 700; margin-top: 3px;
        }

        .seg {
          position: relative; display: inline-flex; padding: 3px;
          border-radius: 9px; background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.1);
        }
        .seg-pill {
          position: absolute; top: 3px; left: 0; height: calc(100% - 6px);
          border-radius: 7px; background: linear-gradient(135deg, var(--accent), var(--accent2));
          transition: transform .35s, width .35s; z-index: 0;
        }
        .seg-btn {
          position: relative; z-index: 1; border: 0; background: none;
          cursor: pointer; padding: 4px 10px; border-radius: 7px;
          font-size: 11px; font-weight: 700; color: #b6b2cc; transition: color .25s;
        }
        .seg-btn.active { color: #fff; background: rgba(255,255,255,0.12); }

        .pf-top { display: flex; gap: 14px; align-items: center; }
        .avatar {
          position: relative; width: 78px; height: 78px; border-radius: 50%; flex: 0 0 auto;
          display: grid; place-items: center; font-size: 28px; font-weight: 700; color: #fff;
          background: radial-gradient(circle at 35% 30%, var(--accent2), var(--accent));
          box-shadow: 0 0 0 3px rgba(255,255,255,.08);
        }
        .avatar .lvl {
          position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%);
          background: #0c0a14; border: 1px solid rgba(255,255,255,.17); color: var(--accent);
          font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 999px;
        }

        .pf-stats { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
        .pf-stat { display: flex; align-items: center; gap: 8px; }
        .pf-stat .ic {
          width: 26px; height: 26px; border-radius: 999px; display: grid; place-items: center;
          background: var(--accent-soft); color: var(--accent); flex: 0 0 auto;
        }
        .pf-stat .ic svg { width: 13px; height: 13px; }
        .pf-stat .meta b { font-size: 14px; font-weight: 700; display: block; }
        .pf-stat .meta span { font-size: 10.5px; color: #857fa0; }

        .pf-name { margin: 12px 0 3px; font-weight: 700; font-size: 13.5px; }
        .pf-name span { color: #857fa0; font-weight: 500; font-size: 11.5px; }

        .xp-row { display: flex; justify-content: space-between; font-size: 10.5px; color: #857fa0; margin: 10px 0 5px; }
        .xp-track { height: 8px; border-radius: 999px; background: rgba(255,255,255,.07); overflow: hidden; }
        .xp-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--accent), var(--accent2)); transition: width .8s; }

        .chart-total { display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px; }
        .chart-total .num { font-size: clamp(22px, 3vw, 30px); font-weight: 700; letter-spacing: -1px; }
        .chart-total .lbl { font-size: 10.5px; letter-spacing: 1.2px; text-transform: uppercase; color: #857fa0; }

        .chart { position: relative; height: 135px; margin-top: 6px; }
        .grid-lines { position: absolute; inset: 0 0 20px 0; }
        .grid-lines i { position: absolute; left: 0; right: 0; border-top: 1px dashed rgba(255,255,255,.07); }

        .bars { position: absolute; inset: 0 0 20px 0; display: flex; align-items: flex-end; gap: clamp(4px, 1.4vw, 12px); }
        .barwrap { flex: 1; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; position: relative; }
        .bar { width: 100%; max-width: 24px; border-radius: 999px 999px 4px 4px; background: var(--accent); transition: height .6s; }
        .barwrap .xl { position: absolute; bottom: -18px; font-size: 10px; color: #857fa0; }
        .barwrap.peak .xl { color: var(--accent); font-weight: 700; }

        .slider-row { margin-top: 20px; }
        .slider-row .top { display: flex; justify-content: space-between; font-size: 10.5px; color: #857fa0; margin-bottom: 6px; }
        .slider-row .top b { color: var(--accent); }
        input[type=range].rng { -webkit-appearance: none; appearance: none; width: 100%; height: 5px; border-radius: 999px; background: rgba(255,255,255,.1); outline: none; cursor: pointer; }
        input[type=range].rng::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--accent); cursor: pointer; }

        .stat-strip { display: flex; flex-wrap: wrap; gap: 4px 18px; margin-bottom: 6px; }
        .stat { display: flex; align-items: baseline; gap: 6px; }
        .stat .num { font-size: 18px; font-weight: 700; }
        .stat .lbl { font-size: 10px; color: #857fa0; line-height: 1.1; }
        .stat .lbl b { display: block; color: #b6b2cc; }

        .skill { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-radius: 10px; }
        .skill + .skill { border-top: 1px solid rgba(255,255,255,.05); }
        .skill-ic { width: 30px; height: 30px; border-radius: 9px; display: grid; place-items: center; background: var(--accent-soft); color: var(--accent); flex: 0 0 auto; }
        .skill-ic svg { width: 15px; height: 15px; }
        .skill-body { flex: 1; }
        .skill-body .nm { display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; margin-bottom: 5px; }
        .skill-body .nm span { color: var(--accent); font-weight: 700; }
        .skill-bar { height: 5px; border-radius: 999px; background: rgba(255,255,255,.08); overflow: hidden; }
        .skill-bar i { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--accent), var(--accent2)); transition: width .8s; }
        .skill-plus { border-radius: 7px; flex: 0 0 auto; display: grid; place-items: center; cursor: pointer; background: var(--accent-soft); color: var(--accent); border: 1px solid transparent; transition: transform .15s; }
        .skill-plus:hover { transform: scale(1.08); background: var(--accent); color: #fff; }

        .ring-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .ring { position: relative; width: 140px; height: 140px; }
        .ring svg { transform: rotate(-90deg); width: 100%; height: 100%; }
        .ring .track { fill: none; stroke: rgba(255,255,255,.08); stroke-width: 12; }
        .ring-fg { fill: none; stroke: var(--accent); stroke-width: 12; stroke-linecap: round; transition: stroke-dashoffset 1s; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-center .xp { font-size: 11px; letter-spacing: 2px; color: var(--accent); font-weight: 700; }
        .ring-center .pct { font-size: 28px; font-weight: 700; }

        .goal-btn {
          width: 100%; border: 0; cursor: pointer; padding: 10px; border-radius: 11px;
          font-weight: 700; font-size: 12.5px; color: #fff;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: transform .16s;
        }
        .goal-btn:hover { transform: translateY(-2px); }

        .ach { display: flex; align-items: center; gap: 10px; padding: 9px 0; }
        .ach + .ach { border-top: 1px solid rgba(255,255,255,.05); }
        .ach-ic { width: 32px; height: 32px; border-radius: 9px; display: grid; place-items: center; background: var(--accent-soft); color: var(--accent); flex: 0 0 auto; }
        .ach.locked .ach-ic { opacity: .5; }
        .ach-body { flex: 1; }
        .ach-body b { font-size: 12.5px; font-weight: 600; display: block; }
        .ach-body span { font-size: 10.5px; color: #857fa0; }
        .ach .tag { font-size: 9.5px; font-weight: 700; padding: 3px 8px; border-radius: 999px; }
        .ach .tag.done { background: rgba(52,211,153,.14); color: #34d399; }
        .ach .tag.soon { background: rgba(255,255,255,.07); color: #b6b2cc; }

        .badge-card { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 10px; }
        .badge-ic { width: 72px; height: 72px; border-radius: 20px; display: grid; place-items: center; color: var(--accent); background: radial-gradient(circle at 50% 35%, var(--accent-soft), transparent 70%); border: 1px solid rgba(255,255,255,.1); }
        .badge-card .rank { font-size: 14px; font-weight: 700; }
        .badge-card .rank span { display: block; font-size: 10.5px; color: #857fa0; text-transform: uppercase; margin-top: 2px; }

        /* CONTINUOUS NON-BINARY STUDY BOOST GLASS VIALS */
        .vials { display: flex; justify-content: space-between; gap: 8px; }
        .vial-col { display: flex; flex-direction: column; align-items: center; gap: 7px; cursor: pointer; flex: 1; }
        .vial {
          width: 38px; height: 52px; border-radius: 0 0 12px 12px;
          border: 2px solid rgba(255,255,255,.25); position: relative; overflow: hidden;
          background: rgba(255,255,255,.04); box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
        }
        .vial .liquid {
          position: absolute; left: 0; right: 0; bottom: 0;
          border-radius: 0 0 10px 10px;
        }
        .vial .ic { position: absolute; inset: 0; display: grid; place-items: center; color: #fff; z-index: 2; }
        .vial-col .nm { font-size: 10.5px; color: #b6b2cc; font-weight: 600; }

        .mkt-row { display: flex; align-items: center; gap: 10px; padding: 9px; border-radius: 12px; }
        .mkt-row + .mkt-row { margin-top: 5px; }
        .mkt-ic { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: var(--accent-soft); color: var(--accent); flex: 0 0 auto; }
        .mkt-body { flex: 1; }
        .mkt-body b { font-size: 12.5px; font-weight: 600; display: block; }
        .mkt-body span { font-size: 10.5px; color: #857fa0; }
        .mkt-cost { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; color: var(--accent); }
        .mkt-buy { width: 30px; height: 30px; border-radius: 999px; border: 1px solid rgba(255,255,255,.17); background: rgba(255,255,255,.06); color: #fff; display: grid; place-items: center; cursor: pointer; }
        .mkt-buy:hover { background: var(--accent); }
        .mkt-row.owned { opacity: .6; }

        .toast {
          position: fixed; left: 50%; bottom: 24px; transform: translate(-50%,30px);
          z-index: 60; display: flex; align-items: center; gap: 10px; padding: 10px 16px;
          border-radius: 12px; background: rgba(18,16,28,.95); border: 1px solid rgba(255,255,255,.17);
          color: #fff; font-size: 12.5px; font-weight: 600; opacity: 0; pointer-events: none;
          transition: opacity .3s, transform .35s;
        }
        .toast.show { opacity: 1; transform: translate(-50%,0); }
        .toast .tk { width: 8px; height: 8px; border-radius: 50%; background: #34d399; box-shadow: 0 0 10px #34d399; }
        .toast.warn .tk { background: #fb7185; box-shadow: 0 0 10px #fb7185; }

        .lvlup {
          position: fixed; inset: 0; z-index: 55; display: grid; place-items: center;
          pointer-events: none; opacity: 0;
        }
        .lvlup.show { animation: lvlpop 1.5s ease; }
        .lvlup .ring2 { width: 110px; height: 110px; border-radius: 50%; border: 3px solid #a855f7; box-shadow: 0 0 40px #a855f7; }
        .lvlup .txt { position: absolute; font-weight: 700; font-size: 26px; letter-spacing: 1px; text-shadow: 0 0 24px #a855f7; }
        @keyframes lvlpop {
          0% { opacity: 0; transform: scale(.6); }
          18% { opacity: 1; }
          100% { opacity: 0; transform: scale(1.5); }
        }

        @media (max-width: 1024px) {
          .r1, .r2, .r3, .r4 { grid-template-columns: 1fr 1fr; }
          .r3 > :last-child { grid-column: 1 / -1; }
        }
        @media (max-width: 680px) {
          .r1, .r2, .r3, .r4 { grid-template-columns: 1fr; }
          .nav-search { display: none; }
        }
      `}</style>
    </DashboardLayout>
  );
}
