import { Player, Event, PlayerStats } from '@/types';

const STORAGE_KEYS = {
  PLAYERS: 'haifa_fc_players',
  EVENTS: 'haifa_fc_events',
  STATS: 'haifa_fc_stats',
} as const;

// Players
export const getPlayers = (): Player[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.PLAYERS);
  return data ? JSON.parse(data) : [];
};

export const savePlayers = (players: Player[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
};

export const addPlayer = (player: Player): void => {
  const players = getPlayers();
  players.push(player);
  savePlayers(players);
};

export const updatePlayer = (id: string, updates: Partial<Player>): void => {
  const players = getPlayers();
  const index = players.findIndex(p => p.id === id);
  if (index !== -1) {
    players[index] = { ...players[index], ...updates };
    savePlayers(players);
  }
};

export const deletePlayer = (id: string): void => {
  const players = getPlayers();
  savePlayers(players.filter(p => p.id !== id));
};

// Events
export const getEvents = (): Event[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
  return data ? JSON.parse(data) : [];
};

export const saveEvents = (events: Event[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
};

export const addEvent = (event: Event): void => {
  const events = getEvents();
  events.push(event);
  saveEvents(events);
};

export const updateEvent = (id: string, updates: Partial<Event>): void => {
  const events = getEvents();
  const index = events.findIndex(e => e.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...updates };
    saveEvents(events);
  }
};

export const deleteEvent = (id: string): void => {
  const events = getEvents();
  saveEvents(events.filter(e => e.id !== id));
};

// Stats
export const getPlayerStats = (): PlayerStats[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.STATS);
  return data ? JSON.parse(data) : [];
};

export const savePlayerStats = (stats: PlayerStats[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
};

export const calculateStats = (): PlayerStats[] => {
  const players = getPlayers();
  const events = getEvents();
  const games = events.filter(e => e.type === 'משחק');
  
  return players.map(player => {
    const playerGames = games.filter(g => g.attendance?.[player.id]);
    const totalEvents = events.filter(e => e.attendance?.[player.id]);
    const totalPossibleEvents = events.length;
    
    let goals = 0;
    let yellowCards = 0;
    let redCards = 0;
    
    // In a real app, you'd store these separately, but for now we'll calculate from events
    // For simplicity, we'll use a separate stats storage
    
    const existingStats = getPlayerStats();
    const existing = existingStats.find(s => s.playerId === player.id);
    
    return {
      playerId: player.id,
      gamesPlayed: playerGames.length,
      goals: existing?.goals || 0,
      yellowCards: existing?.yellowCards || 0,
      redCards: existing?.redCards || 0,
      attendancePercentage: totalPossibleEvents > 0 
        ? Math.round((totalEvents.length / totalPossibleEvents) * 100) 
        : 0,
    };
  });
};

