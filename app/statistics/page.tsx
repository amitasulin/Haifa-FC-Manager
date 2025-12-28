'use client';

import { useEffect, useState } from 'react';
import { getPlayers, getEvents, calculateStats, getPlayerStats, savePlayerStats } from '@/lib/storage';
import { Player, PlayerStats } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { initializeSampleData } from '@/lib/initData';

export default function StatisticsPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [editingStats, setEditingStats] = useState<{ playerId: string; stat: keyof PlayerStats } | null>(null);
  const [tempValue, setTempValue] = useState<number>(0);

  useEffect(() => {
    initializeSampleData();
    loadData();
  }, []);

  const loadData = () => {
    const allPlayers = getPlayers();
    const allEvents = getEvents();
    setPlayers(allPlayers);
    
    // Calculate base stats from attendance
    const calculatedStats = calculateStats();
    
    // Merge with saved stats (goals, cards)
    const savedStats = getPlayerStats();
    const mergedStats = calculatedStats.map(calc => {
      const saved = savedStats.find(s => s.playerId === calc.playerId);
      return {
        ...calc,
        goals: saved?.goals || calc.goals,
        yellowCards: saved?.yellowCards || calc.yellowCards,
        redCards: saved?.redCards || calc.redCards,
      };
    });
    
    setStats(mergedStats);
  };

  const updateStat = (playerId: string, stat: keyof PlayerStats, value: number) => {
    const currentStats = getPlayerStats();
    const existingIndex = currentStats.findIndex(s => s.playerId === playerId);
    
    const baseStats = calculateStats();
    const baseStat = baseStats.find(s => s.playerId === playerId);
    
    if (existingIndex !== -1) {
      currentStats[existingIndex] = {
        ...currentStats[existingIndex],
        [stat]: value,
      };
    } else if (baseStat) {
      currentStats.push({
        ...baseStat,
        [stat]: value,
      });
    }
    
    savePlayerStats(currentStats);
    loadData();
    setEditingStats(null);
  };

  const handleStatClick = (playerId: string, stat: keyof PlayerStats, currentValue: number) => {
    setEditingStats({ playerId, stat });
    setTempValue(currentValue);
  };

  const handleStatSubmit = () => {
    if (editingStats) {
      updateStat(editingStats.playerId, editingStats.stat, tempValue);
    }
  };

  // Chart data
  const goalsData = stats
    .filter(s => s.goals > 0)
    .map(stat => {
      const player = players.find(p => p.id === stat.playerId);
      return {
        name: player?.name || 'לא ידוע',
        goals: stat.goals,
      };
    })
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 10);

  const attendanceData = stats
    .map(stat => {
      const player = players.find(p => p.id === stat.playerId);
      return {
        name: player?.name || 'לא ידוע',
        attendance: stat.attendancePercentage,
      };
    })
    .sort((a, b) => b.attendance - a.attendance)
    .slice(0, 10);

  const cardsData = stats
    .filter(s => s.yellowCards > 0 || s.redCards > 0)
    .map(stat => {
      const player = players.find(p => p.id === stat.playerId);
      return {
        name: player?.name || 'לא ידוע',
        yellow: stat.yellowCards,
        red: stat.redCards,
      };
    })
    .slice(0, 10);

  const positionDistribution = players.reduce((acc, player) => {
    acc[player.position] = (acc[player.position] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const positionData = Object.entries(positionDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#00A651', '#008040', '#4CAF50', '#81C784'];

  // Team stats
  const topScorer = stats
    .sort((a, b) => b.goals - a.goals)
    .find(s => s.goals > 0);
  
  const topScorerPlayer = topScorer 
    ? players.find(p => p.id === topScorer.playerId)
    : null;

  const avgAttendance = stats.length > 0
    ? Math.round(stats.reduce((sum, s) => sum + s.attendancePercentage, 0) / stats.length)
    : 0;

  const allEvents = getEvents();
  const totalGames = allEvents.filter(e => e.type === 'משחק').length;
  const totalTraining = allEvents.filter(e => e.type === 'אימון').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-haifa-green">סטטיסטיקות</h2>

      {/* Team Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-haifa-green">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">מלך השערים</h3>
          <p className="text-2xl font-bold text-haifa-green">
            {topScorerPlayer ? topScorerPlayer.name : 'אין נתונים'}
          </p>
          {topScorer && <p className="text-gray-600">{topScorer.goals} שערים</p>}
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-haifa-green">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">אחוז נוכחות ממוצע</h3>
          <p className="text-2xl font-bold text-haifa-green">{avgAttendance}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-haifa-green">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">מספר משחקים</h3>
          <p className="text-2xl font-bold text-haifa-green">{totalGames}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-haifa-green">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">מספר אימונים</h3>
          <p className="text-2xl font-bold text-haifa-green">{totalTraining}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Goals Chart */}
        {goalsData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">מלכי השערים</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={goalsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="goals" fill="#00A651" name="שערים" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Attendance Chart */}
        {attendanceData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">אחוזי נוכחות</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attendance" fill="#008040" name="אחוז נוכחות" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Cards Chart */}
        {cardsData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">כרטיסים</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cardsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="yellow" fill="#FFC107" name="צהובים" />
                <Bar dataKey="red" fill="#F44336" name="אדומים" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Position Distribution */}
        {positionData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">התפלגות תפקידים</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={positionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {positionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Detailed Player Stats Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <h3 className="text-xl font-semibold p-6 text-gray-800 border-b">סטטיסטיקות מפורטות לפי שחקן</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-haifa-green text-white">
              <tr>
                <th className="px-6 py-4 text-right">שם</th>
                <th className="px-6 py-4 text-right">מספר משחקים</th>
                <th className="px-6 py-4 text-right">שערים</th>
                <th className="px-6 py-4 text-right">כרטיסים צהובים</th>
                <th className="px-6 py-4 text-right">כרטיסים אדומים</th>
                <th className="px-6 py-4 text-right">אחוז נוכחות</th>
              </tr>
            </thead>
            <tbody>
              {stats.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    אין נתונים. הוסף שחקנים ואירועים להתחיל.
                  </td>
                </tr>
              ) : (
                stats.map((stat) => {
                  const player = players.find(p => p.id === stat.playerId);
                  if (!player) return null;
                  
                  const isEditing = editingStats?.playerId === stat.playerId;
                  
                  return (
                    <tr key={stat.playerId} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold">{player.name}</td>
                      <td className="px-6 py-4">{stat.gamesPlayed}</td>
                      <td className="px-6 py-4">
                        {isEditing && editingStats?.stat === 'goals' ? (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="0"
                              value={tempValue}
                              onChange={(e) => setTempValue(parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border rounded"
                              autoFocus
                            />
                            <button
                              onClick={handleStatSubmit}
                              className="px-2 py-1 bg-green-500 text-white rounded text-sm"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingStats(null)}
                              className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span
                            className="cursor-pointer hover:text-haifa-green"
                            onClick={() => handleStatClick(stat.playerId, 'goals', stat.goals)}
                          >
                            {stat.goals}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing && editingStats?.stat === 'yellowCards' ? (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="0"
                              value={tempValue}
                              onChange={(e) => setTempValue(parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border rounded"
                              autoFocus
                            />
                            <button
                              onClick={handleStatSubmit}
                              className="px-2 py-1 bg-green-500 text-white rounded text-sm"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingStats(null)}
                              className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span
                            className="cursor-pointer hover:text-haifa-green"
                            onClick={() => handleStatClick(stat.playerId, 'yellowCards', stat.yellowCards)}
                          >
                            {stat.yellowCards}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing && editingStats?.stat === 'redCards' ? (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="0"
                              value={tempValue}
                              onChange={(e) => setTempValue(parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border rounded"
                              autoFocus
                            />
                            <button
                              onClick={handleStatSubmit}
                              className="px-2 py-1 bg-green-500 text-white rounded text-sm"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingStats(null)}
                              className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span
                            className="cursor-pointer hover:text-haifa-green"
                            onClick={() => handleStatClick(stat.playerId, 'redCards', stat.redCards)}
                          >
                            {stat.redCards}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">{stat.attendancePercentage}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

