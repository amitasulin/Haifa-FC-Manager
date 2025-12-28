export type PlayerPosition = 'שוער' | 'הגנה' | 'קישור' | 'התקפה';

export interface Player {
  id: string;
  name: string;
  jerseyNumber: number;
  position: PlayerPosition;
  age: number;
  isInjured: boolean;
  imageUrl?: string; // URL לתמונת השחקן
  nationality?: string; // לאום
  height?: number; // גובה בס"מ
  weight?: number; // משקל בק"ג
  dateOfBirth?: string; // תאריך לידה
  contractUntil?: string; // חוזה עד
}

export type EventType = 'אימון' | 'משחק';

export interface Event {
  id: string;
  date: string; // ISO date string
  time: string; // HH:mm format
  location: string;
  type: EventType;
  attendance?: Record<string, boolean>; // playerId -> present/absent
}

export interface PlayerStats {
  playerId: string;
  gamesPlayed: number;
  goals: number;
  yellowCards: number;
  redCards: number;
  attendancePercentage: number;
}

export interface TeamStats {
  topScorer: {
    playerId: string;
    playerName: string;
    goals: number;
  } | null;
  averageAttendance: number;
  totalGames: number;
}

