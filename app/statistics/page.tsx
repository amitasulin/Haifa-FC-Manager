"use client";

import { useEffect, useState } from "react";
import {
  getPlayers,
  getEvents,
  calculateStats,
  getPlayerStats,
  savePlayerStats,
} from "@/lib/storage";
import { Player, PlayerStats } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { initializeSampleData } from "@/lib/initData";

export default function StatisticsPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [editingStats, setEditingStats] = useState<{
    playerId: string;
    stat: keyof PlayerStats;
  } | null>(null);
  const [tempValue, setTempValue] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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
    const mergedStats = calculatedStats.map((calc) => {
      const saved = savedStats.find((s) => s.playerId === calc.playerId);
      return {
        ...calc,
        goals: saved?.goals || calc.goals,
        yellowCards: saved?.yellowCards || calc.yellowCards,
        redCards: saved?.redCards || calc.redCards,
      };
    });

    setStats(mergedStats);
  };

  const updateStat = (
    playerId: string,
    stat: keyof PlayerStats,
    value: number
  ) => {
    const currentStats = getPlayerStats();
    const existingIndex = currentStats.findIndex(
      (s) => s.playerId === playerId
    );

    const baseStats = calculateStats();
    const baseStat = baseStats.find((s) => s.playerId === playerId);

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

  const handleStatClick = (
    playerId: string,
    stat: keyof PlayerStats,
    currentValue: number
  ) => {
    setEditingStats({ playerId, stat });
    setTempValue(currentValue);
  };

  const handleStatSubmit = () => {
    if (editingStats) {
      updateStat(editingStats.playerId, editingStats.stat, tempValue);
    }
  };

  // Helper function to shorten names for charts - use first name or initials
  const shortenName = (name: string, maxLength: number = 15) => {
    if (name.length <= maxLength) return name;
    // Try to split by space and use first name + first letter of last name
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return parts[0] + " " + parts[1].charAt(0) + ".";
    }
    return name.substring(0, maxLength - 3) + "...";
  };

  // Chart data
  const goalsData = stats
    .filter((s) => s.goals > 0)
    .map((stat) => {
      const player = players.find((p) => p.id === stat.playerId);
      return {
        name: shortenName(player?.name || "לא ידוע", 15),
        fullName: player?.name || "לא ידוע",
        goals: stat.goals,
      };
    })
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 10);

  const attendanceData = stats
    .map((stat) => {
      const player = players.find((p) => p.id === stat.playerId);
      return {
        name: shortenName(player?.name || "לא ידוע", 15),
        fullName: player?.name || "לא ידוע",
        attendance: stat.attendancePercentage,
      };
    })
    .sort((a, b) => b.attendance - a.attendance)
    .slice(0, 10);

  const cardsData = stats
    .filter((s) => s.yellowCards > 0 || s.redCards > 0)
    .map((stat) => {
      const player = players.find((p) => p.id === stat.playerId);
      return {
        name: shortenName(player?.name || "לא ידוע", 15),
        fullName: player?.name || "לא ידוע",
        yellow: stat.yellowCards,
        red: stat.redCards,
      };
    })
    .slice(0, 10);

  const gamesPlayedData = stats
    .map((stat) => {
      const player = players.find((p) => p.id === stat.playerId);
      return {
        name: shortenName(player?.name || "לא ידוע", 15),
        fullName: player?.name || "לא ידוע",
        games: stat.gamesPlayed,
      };
    })
    .sort((a, b) => b.games - a.games)
    .slice(0, 10);

  const positionDistribution = players.reduce((acc, player) => {
    acc[player.position] = (acc[player.position] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const positionData = Object.entries(positionDistribution).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const COLORS = ["#00A651", "#008040", "#4CAF50", "#81C784"];

  // Team stats
  const topScorer = stats
    .sort((a, b) => b.goals - a.goals)
    .find((s) => s.goals > 0);

  const topScorerPlayer = topScorer
    ? players.find((p) => p.id === topScorer.playerId)
    : null;

  const avgAttendance =
    stats.length > 0
      ? Math.round(
          stats.reduce((sum, s) => sum + s.attendancePercentage, 0) /
            stats.length
        )
      : 0;

  const allEvents = isMounted ? getEvents() : [];
  const totalGames = allEvents.filter((e) => e.type === "משחק").length;
  const totalTraining = allEvents.filter((e) => e.type === "אימון").length;

  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-4 md:py-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 md:mb-8 text-haifa-green">
          סטטיסטיקות
        </h2>
        <div className="text-center py-8 text-gray-500">טוען...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 md:mb-8 text-haifa-green">
        סטטיסטיקות
      </h2>

      {/* Team Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-l-4 border-haifa-green">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
            מלך השערים
          </h3>
          <p className="text-xl sm:text-2xl font-bold text-haifa-green break-words">
            {topScorerPlayer ? topScorerPlayer.name : "אין נתונים"}
          </p>
          {topScorer && (
            <p className="text-sm sm:text-base text-gray-600">
              {topScorer.goals} שערים
            </p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-l-4 border-haifa-green">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
            אחוז נוכחות ממוצע
          </h3>
          <p className="text-xl sm:text-2xl font-bold text-haifa-green">
            {avgAttendance}%
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-l-4 border-haifa-green">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
            מספר משחקים
          </h3>
          <p className="text-xl sm:text-2xl font-bold text-haifa-green">
            {totalGames}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-l-4 border-haifa-green">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
            מספר אימונים
          </h3>
          <p className="text-xl sm:text-2xl font-bold text-haifa-green">
            {totalTraining}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Goals Chart */}
        {goalsData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 overflow-x-auto">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              מלכי השערים
            </h3>
            <ResponsiveContainer
              width="100%"
              height={500}
              className="min-w-[300px]"
            >
              <BarChart
                data={goalsData}
                margin={{ top: 5, right: 10, left: 0, bottom: 180 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={180}
                  interval={0}
                  tick={{ fontSize: 11, fill: "#333" }}
                  tickMargin={15}
                  tickFormatter={(value) => value}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: any, name: string, props: any) => [
                    value,
                    props.payload.fullName || name,
                  ]}
                  labelFormatter={(label) => `שחקן: ${label}`}
                />
                <Legend />
                <Bar dataKey="goals" fill="#00A651" name="שערים" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Attendance Chart */}
        {attendanceData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 overflow-x-auto">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              אחוזי נוכחות
            </h3>
            <ResponsiveContainer
              width="100%"
              height={500}
              className="min-w-[300px]"
            >
              <BarChart
                data={attendanceData}
                margin={{ top: 5, right: 10, left: 0, bottom: 180 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={180}
                  interval={0}
                  tick={{ fontSize: 11, fill: "#333" }}
                  tickMargin={15}
                  tickFormatter={(value) => value}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attendance" fill="#008040" name="אחוז נוכחות" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Games Played Chart */}
        {gamesPlayedData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 overflow-x-auto">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              מספר משחקים
            </h3>
            <ResponsiveContainer
              width="100%"
              height={500}
              className="min-w-[300px]"
            >
              <BarChart
                data={gamesPlayedData}
                margin={{ top: 5, right: 10, left: 0, bottom: 180 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={180}
                  interval={0}
                  tick={{ fontSize: 11, fill: "#333" }}
                  tickMargin={15}
                  tickFormatter={(value) => value}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="games" fill="#00A651" name="מספר משחקים" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Cards Chart */}
        {cardsData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 overflow-x-auto">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              כרטיסים
            </h3>
            <ResponsiveContainer
              width="100%"
              height={500}
              className="min-w-[300px]"
            >
              <BarChart
                data={cardsData}
                margin={{ top: 5, right: 10, left: 0, bottom: 180 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={180}
                  interval={0}
                  tick={{ fontSize: 11, fill: "#333" }}
                  tickMargin={15}
                  tickFormatter={(value) => value}
                />
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
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 overflow-x-auto">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              התפלגות תפקידים
            </h3>
            <ResponsiveContainer
              width="100%"
              height={300}
              className="min-w-[300px]"
            >
              <PieChart margin={{ top: 10, right: 10, bottom: 60, left: 10 }}>
                <Pie
                  data={positionData}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {positionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} שחקנים`} />
                <Legend
                  verticalAlign="bottom"
                  height={50}
                  formatter={(value) => value}
                  wrapperStyle={{ fontSize: "14px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Detailed Player Stats Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <h3 className="text-lg sm:text-xl font-semibold p-4 sm:p-6 text-gray-800 border-b">
          סטטיסטיקות מפורטות לפי שחקן
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-haifa-green text-white">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base">
                  שם
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base">
                  מספר משחקים
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base">
                  שערים
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base">
                  כרטיסים צהובים
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base">
                  כרטיסים אדומים
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base">
                  אחוז נוכחות
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 sm:px-6 py-6 sm:py-8 text-center text-gray-500 text-sm sm:text-base"
                  >
                    אין נתונים. הוסף שחקנים ואירועים להתחיל.
                  </td>
                </tr>
              ) : (
                stats.map((stat) => {
                  const player = players.find((p) => p.id === stat.playerId);
                  if (!player) return null;

                  const isEditing = editingStats?.playerId === stat.playerId;

                  return (
                    <tr
                      key={stat.playerId}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base">
                        {player.name}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base">
                        {stat.gamesPlayed}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        {isEditing && editingStats?.stat === "goals" ? (
                          <div className="flex gap-1 sm:gap-2">
                            <input
                              type="number"
                              min="0"
                              value={tempValue}
                              onChange={(e) =>
                                setTempValue(parseInt(e.target.value) || 0)
                              }
                              className="w-16 sm:w-20 px-1 sm:px-2 py-1 border rounded text-sm"
                              autoFocus
                            />
                            <button
                              onClick={handleStatSubmit}
                              className="px-1.5 sm:px-2 py-1 bg-green-500 text-white rounded text-xs sm:text-sm"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingStats(null)}
                              className="px-1.5 sm:px-2 py-1 bg-red-500 text-white rounded text-xs sm:text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span
                            className="cursor-pointer hover:text-haifa-green text-sm sm:text-base"
                            onClick={() =>
                              handleStatClick(
                                stat.playerId,
                                "goals",
                                stat.goals
                              )
                            }
                          >
                            {stat.goals}
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        {isEditing && editingStats?.stat === "yellowCards" ? (
                          <div className="flex gap-1 sm:gap-2">
                            <input
                              type="number"
                              min="0"
                              value={tempValue}
                              onChange={(e) =>
                                setTempValue(parseInt(e.target.value) || 0)
                              }
                              className="w-16 sm:w-20 px-1 sm:px-2 py-1 border rounded text-sm"
                              autoFocus
                            />
                            <button
                              onClick={handleStatSubmit}
                              className="px-1.5 sm:px-2 py-1 bg-green-500 text-white rounded text-xs sm:text-sm"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingStats(null)}
                              className="px-1.5 sm:px-2 py-1 bg-red-500 text-white rounded text-xs sm:text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span
                            className="cursor-pointer hover:text-haifa-green text-sm sm:text-base"
                            onClick={() =>
                              handleStatClick(
                                stat.playerId,
                                "yellowCards",
                                stat.yellowCards
                              )
                            }
                          >
                            {stat.yellowCards}
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        {isEditing && editingStats?.stat === "redCards" ? (
                          <div className="flex gap-1 sm:gap-2">
                            <input
                              type="number"
                              min="0"
                              value={tempValue}
                              onChange={(e) =>
                                setTempValue(parseInt(e.target.value) || 0)
                              }
                              className="w-16 sm:w-20 px-1 sm:px-2 py-1 border rounded text-sm"
                              autoFocus
                            />
                            <button
                              onClick={handleStatSubmit}
                              className="px-1.5 sm:px-2 py-1 bg-green-500 text-white rounded text-xs sm:text-sm"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingStats(null)}
                              className="px-1.5 sm:px-2 py-1 bg-red-500 text-white rounded text-xs sm:text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span
                            className="cursor-pointer hover:text-haifa-green text-sm sm:text-base"
                            onClick={() =>
                              handleStatClick(
                                stat.playerId,
                                "redCards",
                                stat.redCards
                              )
                            }
                          >
                            {stat.redCards}
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base">
                        {stat.attendancePercentage}%
                      </td>
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
