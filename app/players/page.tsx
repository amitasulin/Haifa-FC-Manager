"use client";

import { useEffect, useState } from "react";
import {
  getPlayers,
  addPlayer,
  updatePlayer,
  deletePlayer,
} from "@/lib/storage";
import { Player, PlayerPosition } from "@/types";
import { initializeSampleData } from "@/lib/initData";
import ResetDataButton from "@/components/ResetDataButton";
import PlayerImage from "@/components/PlayerImage";

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "age" | "jersey">("name");
  const [formData, setFormData] = useState({
    name: "",
    jerseyNumber: "",
    position: "הגנה" as PlayerPosition,
    age: "",
    isInjured: false,
    imageUrl: "",
    nationality: "",
    height: "",
    weight: "",
    dateOfBirth: "",
    contractUntil: "",
  });

  useEffect(() => {
    // טעינת נתונים - אם אין שחקנים, נטען נתונים לדוגמה
    initializeSampleData();
    // טעינה מחדש אחרי אתחול הנתונים
    setTimeout(() => {
      loadPlayers();
    }, 100);
  }, []);

  const loadPlayers = () => {
    const allPlayers = getPlayers();
    setPlayers(sortPlayers(allPlayers, sortBy));
  };

  const sortPlayers = (playersList: Player[], sort: typeof sortBy) => {
    const sorted = [...playersList];
    switch (sort) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "age":
        return sorted.sort((a, b) => b.age - a.age);
      case "jersey":
        return sorted.sort((a, b) => a.jerseyNumber - b.jerseyNumber);
      default:
        return sorted;
    }
  };

  useEffect(() => {
    setPlayers(sortPlayers(players, sortBy));
  }, [sortBy]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const playerData: Partial<Player> = {
      name: formData.name,
      jerseyNumber: parseInt(formData.jerseyNumber),
      position: formData.position,
      age: parseInt(formData.age),
      isInjured: formData.isInjured,
      imageUrl: formData.imageUrl || undefined,
      nationality: formData.nationality || undefined,
      height: formData.height ? parseInt(formData.height) : undefined,
      weight: formData.weight ? parseInt(formData.weight) : undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      contractUntil: formData.contractUntil || undefined,
    };

    if (editingPlayer) {
      updatePlayer(editingPlayer.id, playerData);
    } else {
      const { id, ...playerDataWithoutId } = playerData as Player;
      const newPlayer: Player = {
        ...playerDataWithoutId,
        id: Date.now().toString(),
      } as Player;
      addPlayer(newPlayer);
    }

    resetForm();
    loadPlayers();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      jerseyNumber: "",
      position: "הגנה",
      age: "",
      isInjured: false,
      imageUrl: "",
      nationality: "",
      height: "",
      weight: "",
      dateOfBirth: "",
      contractUntil: "",
    });
    setEditingPlayer(null);
    setShowModal(false);
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      jerseyNumber: player.jerseyNumber.toString(),
      position: player.position,
      age: player.age.toString(),
      isInjured: player.isInjured,
      imageUrl: player.imageUrl || "",
      nationality: player.nationality || "",
      height: player.height?.toString() || "",
      weight: player.weight?.toString() || "",
      dateOfBirth: player.dateOfBirth || "",
      contractUntil: player.contractUntil || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("האם אתה בטוח שברצונך למחוק את השחקן?")) {
      deletePlayer(id);
      loadPlayers();
    }
  };

  const positions: PlayerPosition[] = ["שוער", "הגנה", "קישור", "התקפה"];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-haifa-green">ניהול שחקנים</h2>
        <div className="flex gap-3">
          <ResetDataButton />
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-haifa-green text-white rounded-lg hover:bg-haifa-dark-green transition-colors"
          >
            + הוסף שחקן
          </button>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="mb-4 flex gap-4 items-center">
        <label className="text-gray-700 font-semibold">מיון לפי:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-haifa-green"
        >
          <option value="name">שם</option>
          <option value="age">גיל</option>
          <option value="jersey">מספר חולצה</option>
        </select>
      </div>

      {/* Players Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {players.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
            אין שחקנים. הוסף שחקן חדש להתחיל.
          </div>
        ) : (
          players.map((player) => (
            <div
              key={player.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Player Image */}
              <div className="relative">
                <PlayerImage player={player} size="large" />
                {player.isInjured && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-20 shadow-lg">
                    פצוע
                  </div>
                )}
              </div>

              {/* Player Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    {player.name}
                  </h3>
                  <span className="text-2xl font-bold text-haifa-green">
                    #{player.jerseyNumber}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">תפקיד:</span>
                    <span>{player.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">גיל:</span>
                    <span>{player.age}</span>
                  </div>
                  {player.nationality && (
                    <div className="flex justify-between">
                      <span className="font-semibold">לאום:</span>
                      <span>{player.nationality}</span>
                    </div>
                  )}
                  {player.height && (
                    <div className="flex justify-between">
                      <span className="font-semibold">גובה:</span>
                      <span>{player.height} ס"מ</span>
                    </div>
                  )}
                  {player.weight && (
                    <div className="flex justify-between">
                      <span className="font-semibold">משקל:</span>
                      <span>{player.weight} ק"ג</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(player)}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    ערוך
                  </button>
                  <button
                    onClick={() => handleDelete(player.id)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                  >
                    מחק
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6 text-haifa-green">
              {editingPlayer ? "ערוך שחקן" : "הוסף שחקן חדש"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  שם מלא
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-haifa-green"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  מספר חולצה
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.jerseyNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, jerseyNumber: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-haifa-green"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  תפקיד
                </label>
                <select
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      position: e.target.value as PlayerPosition,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-haifa-green"
                >
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  גיל
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="50"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-haifa-green"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  קישור לתמונה (URL)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/player.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-haifa-green"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  לאום
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) =>
                    setFormData({ ...formData, nationality: e.target.value })
                  }
                  placeholder="ישראל"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-haifa-green"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    גובה (ס"מ)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="250"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-haifa-green"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    משקל (ק"ג)
                  </label>
                  <input
                    type="number"
                    min="40"
                    max="150"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-haifa-green"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    תאריך לידה
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-haifa-green"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    חוזה עד
                  </label>
                  <input
                    type="date"
                    value={formData.contractUntil}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contractUntil: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-haifa-green"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isInjured"
                  checked={formData.isInjured}
                  onChange={(e) =>
                    setFormData({ ...formData, isInjured: e.target.checked })
                  }
                  className="w-5 h-5 text-haifa-green focus:ring-haifa-green"
                />
                <label
                  htmlFor="isInjured"
                  className="mr-2 text-gray-700 font-semibold"
                >
                  שחקן פצוע
                </label>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-haifa-green text-white rounded-lg hover:bg-haifa-dark-green transition-colors"
                >
                  {editingPlayer ? "עדכן" : "הוסף"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
