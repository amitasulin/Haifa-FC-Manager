'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getEvents, getPlayers, calculateStats } from '@/lib/storage';
import { Event, Player } from '@/types';
import { format, isAfter, parseISO } from 'date-fns';
import { he } from 'date-fns/locale';
import Logo from '@/components/Logo';
import { initializeSampleData } from '@/lib/initData';

export default function Dashboard() {
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // אתחול נתונים לדוגמה אם אין נתונים
    initializeSampleData();
    
    const allEvents = getEvents();
    const now = new Date();
    
    const upcoming = allEvents
      .filter(e => {
        const eventDate = parseISO(`${e.date}T${e.time}`);
        return isAfter(eventDate, now);
      })
      .sort((a, b) => {
        const dateA = parseISO(`${a.date}T${a.time}`);
        const dateB = parseISO(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });

    setNextEvent(upcoming[0] || null);
    setPlayers(getPlayers());
    setStats(calculateStats());
    setEvents(allEvents);
  }, []);

  const topScorer = stats
    .sort((a, b) => b.goals - a.goals)
    .find(s => s.goals > 0);
  
  const topScorerPlayer = topScorer 
    ? players.find(p => p.id === topScorer.playerId)
    : null;

  const avgAttendance = stats.length > 0
    ? Math.round(stats.reduce((sum, s) => sum + s.attendancePercentage, 0) / stats.length)
    : 0;

  const totalGames = events.filter(e => e.type === 'משחק').length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Logo and Club Info */}
      <div className="bg-gradient-to-r from-haifa-green to-haifa-dark-green text-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Logo size={120} />
            <div>
              <h1 className="text-4xl font-bold mb-2">מכבי חיפה</h1>
              <p className="text-xl opacity-90">מועדון הכדורגל מכבי חיפה</p>
              <p className="text-sm opacity-75 mt-2">
                נוסד: 1913 | 15 אליפויות | 6 גביעי מדינה | 5 גביעי טוטו | 5 אלוף האלופים | 3 השתתפות בליגת האלופות
              </p>
            </div>
          </div>
          <div className="text-right md:text-left">
            <p className="text-lg font-semibold mb-1">אצטדיון סמי עופר</p>
            <p className="text-sm opacity-90">חיפה, ישראל</p>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-8 text-haifa-green">דשבורד ראשי</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Next Event Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-haifa-green">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">האירוע הבא</h3>
          {nextEvent ? (
            <div>
              <p className="text-2xl font-bold text-haifa-green mb-2">
                {nextEvent.type}
              </p>
              <p className="text-gray-700 mb-1">
                📅 {format(parseISO(`${nextEvent.date}T${nextEvent.time}`), 'dd/MM/yyyy', { locale: he })}
              </p>
              <p className="text-gray-700 mb-1">🕐 {nextEvent.time}</p>
              <p className="text-gray-700">📍 {nextEvent.location}</p>
            </div>
          ) : (
            <p className="text-gray-500">אין אירועים קרובים</p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-haifa-green">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">סטטיסטיקות מהירות</h3>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">מספר שחקנים:</span> {players.length}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">מספר משחקים:</span> {totalGames}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">אחוז נוכחות ממוצע:</span> {avgAttendance}%
            </p>
          </div>
        </div>

        {/* Top Scorer */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-haifa-green">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">מלך השערים</h3>
          {topScorerPlayer && topScorer ? (
            <div>
              <p className="text-2xl font-bold text-haifa-green mb-2">
                {topScorerPlayer.name}
              </p>
              <p className="text-gray-700">
                {topScorer.goals} שערים
              </p>
            </div>
          ) : (
            <p className="text-gray-500">אין נתונים</p>
          )}
        </div>
      </div>

      {/* Standout Players */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">שחקנים בולטים</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-haifa-green mb-2">נוכחות גבוהה</h4>
            <div className="space-y-2">
              {stats
                .sort((a, b) => b.attendancePercentage - a.attendancePercentage)
                .slice(0, 3)
                .map(stat => {
                  const player = players.find(p => p.id === stat.playerId);
                  return player ? (
                    <div key={stat.playerId} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>{player.name}</span>
                      <span className="font-semibold">{stat.attendancePercentage}%</span>
                    </div>
                  ) : null;
                })}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-haifa-green mb-2">מלך השערים</h4>
            <div className="space-y-2">
              {stats
                .sort((a, b) => b.goals - a.goals)
                .slice(0, 3)
                .map(stat => {
                  const player = players.find(p => p.id === stat.playerId);
                  return player && stat.goals > 0 ? (
                    <div key={stat.playerId} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>{player.name}</span>
                      <span className="font-semibold">{stat.goals} שערים</span>
                    </div>
                  ) : null;
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Club Information */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-semibold mb-4 text-haifa-green">מידע על הקבוצה</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">היסטוריה</h4>
            <p className="text-gray-700 mb-4">
              מועדון הכדורגל מכבי חיפה נוסד בשנת 1913 והוא אחד המועדונים הוותיקים והמצליחים בישראל. 
              הקבוצה זכתה ב-15 אליפויות ליגה, 6 גביעי מדינה, 5 גביעי טוטו, 5 תוארי אלוף האלופים והשתתפה 3 פעמים בליגת האלופות.
            </p>
            <h4 className="font-semibold text-gray-800 mb-2">אצטדיון</h4>
            <p className="text-gray-700">
              אצטדיון סמי עופר, חיפה - תכולה: 30,780 מקומות ישיבה
            </p>
            <h4 className="font-semibold text-gray-800 mb-2 mt-4">אתר רשמי</h4>
            <p className="text-gray-700">
              <a href="https://www.mhaifafc.com/" target="_blank" rel="noopener noreferrer" className="text-haifa-green hover:underline">
                www.mhaifafc.com
              </a>
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">הישגים בולטים</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>15 אליפויות ליגת העל</li>
              <li>6 גביעי מדינה</li>
              <li>5 גביעי טוטו</li>
              <li>5 תוארי אלוף האלופים</li>
              <li>3 השתתפות בליגת האלופות</li>
              <li>השתתפות בליגה האירופית</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/players"
          className="px-6 py-3 bg-haifa-green text-white rounded-lg hover:bg-haifa-dark-green transition-colors"
        >
          ניהול שחקנים
        </Link>
        <Link
          href="/schedule"
          className="px-6 py-3 bg-haifa-green text-white rounded-lg hover:bg-haifa-dark-green transition-colors"
        >
          לוח אימונים ומשחקים
        </Link>
      </div>
    </div>
  );
}

