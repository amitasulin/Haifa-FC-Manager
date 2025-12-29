'use client';

import { useEffect, useState } from 'react';
import { getEvents, getPlayers, addEvent, updateEvent, deleteEvent } from '@/lib/storage';
import { Event, EventType, Player } from '@/types';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { he } from 'date-fns/locale';
import { initializeSampleData } from '@/lib/initData';

export default function SchedulePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: '',
    type: 'אימון' as EventType,
  });

  useEffect(() => {
    initializeSampleData();
    loadData();
  }, []);

  const loadData = () => {
    setEvents(getEvents());
    setPlayers(getPlayers());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEvent) {
      updateEvent(editingEvent.id, {
        date: formData.date,
        time: formData.time,
        location: formData.location,
        type: formData.type,
      });
    } else {
      const newEvent: Event = {
        id: Date.now().toString(),
        date: formData.date,
        time: formData.time,
        location: formData.location,
        type: formData.type,
        attendance: {},
      };
      addEvent(newEvent);
    }
    
    resetForm();
    loadData();
  };

  const resetForm = () => {
    setFormData({
      date: '',
      time: '',
      location: '',
      type: 'אימון',
    });
    setEditingEvent(null);
    setShowModal(false);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק את האירוע?')) {
      deleteEvent(id);
      loadData();
    }
  };

  const handleAttendance = (event: Event) => {
    setSelectedEvent(event);
    setShowAttendanceModal(true);
  };

  const toggleAttendance = (playerId: string) => {
    if (!selectedEvent) return;
    
    const currentAttendance = selectedEvent.attendance || {};
    const updatedAttendance = {
      ...currentAttendance,
      [playerId]: !currentAttendance[playerId],
    };
    
    updateEvent(selectedEvent.id, { attendance: updatedAttendance });
    loadData();
    setSelectedEvent({ ...selectedEvent, attendance: updatedAttendance });
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(e => {
      const eventDate = parseISO(e.date);
      return isSameDay(eventDate, date);
    });
  };

  const getNextGame = () => {
    const now = new Date();
    const games = events
      .filter(e => e.type === 'משחק')
      .map(e => ({
        ...e,
        dateTime: parseISO(`${e.date}T${e.time}`),
      }))
      .filter(e => e.dateTime > now)
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
    
    return games[0] || null;
  };

  const nextGame = getNextGame();

  const weekStart = startOfWeek(currentDate, { locale: he });
  const weekEnd = endOfWeek(currentDate, { locale: he });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-haifa-green">לוח אימונים ומשחקים</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-haifa-green text-white rounded-lg hover:bg-haifa-dark-green transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          + הוסף אירוע
        </button>
      </div>

      {/* Next Game Highlight */}
      {nextGame && (
        <div className="mb-6 p-4 sm:p-6 bg-gradient-to-r from-haifa-green to-haifa-dark-green text-white rounded-lg shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">המשחק הבא</h3>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
            <p className="text-base sm:text-lg">
              📅 {format(parseISO(`${nextGame.date}T${nextGame.time}`), 'dd/MM/yyyy', { locale: he })}
            </p>
            <p className="text-base sm:text-lg">🕐 {nextGame.time}</p>
            <p className="text-base sm:text-lg">📍 {nextGame.location}</p>
          </div>
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="mb-4 flex gap-2 sm:gap-4 items-center">
        <button
          onClick={() => setViewMode('week')}
          className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
            viewMode === 'week'
              ? 'bg-haifa-green text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          תצוגת שבוע
        </button>
        <button
          onClick={() => setViewMode('month')}
          className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
            viewMode === 'month'
              ? 'bg-haifa-green text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          תצוגת חודש
        </button>
      </div>

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 mb-4">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))}
              className="px-3 sm:px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm sm:text-base w-full sm:w-auto"
            >
              ← שבוע קודם
            </button>
            <h3 className="text-base sm:text-xl font-semibold text-center">
              {format(weekStart, 'dd/MM/yyyy', { locale: he })} - {format(weekEnd, 'dd/MM/yyyy', { locale: he })}
            </h3>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))}
              className="px-3 sm:px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm sm:text-base w-full sm:w-auto"
            >
              שבוע הבא →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 md:gap-4">
            {weekDays.map((day) => {
              const dayEvents = getEventsForDate(day);
              return (
                <div key={day.toISOString()} className="border rounded-lg p-2 min-h-[150px] md:min-h-[200px]">
                  <div className="font-semibold text-center mb-2 text-haifa-green text-sm md:text-base">
                    {format(day, 'dd/MM', { locale: he })}
                  </div>
                  <div className="space-y-2">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`p-1.5 md:p-2 rounded text-xs md:text-sm text-white ${
                          event.type === 'משחק' ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                      >
                        <div className="font-semibold">{event.type}</div>
                        <div className="text-xs md:text-sm">{event.time}</div>
                        <div className="text-xs truncate">{event.location}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Month View - List */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-haifa-green text-white">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base">תאריך</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base">שעה</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base">סוג</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base">מיקום</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    אין אירועים. הוסף אירוע חדש להתחיל.
                  </td>
                </tr>
              ) : (
                events
                  .sort((a, b) => {
                    const dateA = parseISO(`${a.date}T${a.time}`);
                    const dateB = parseISO(`${b.date}T${b.time}`);
                    return dateA.getTime() - dateB.getTime();
                  })
                  .map((event) => (
                    <tr key={event.id} className="border-t hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base">
                        {format(parseISO(event.date), 'dd/MM/yyyy', { locale: he })}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base">{event.time}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-white ${
                            event.type === 'משחק' ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                        >
                          {event.type}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base">{event.location}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                          <button
                            onClick={() => handleAttendance(event)}
                            className="px-2 sm:px-4 py-1.5 sm:py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-xs sm:text-sm"
                          >
                            נוכחות
                          </button>
                          <button
                            onClick={() => handleEdit(event)}
                            className="px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs sm:text-sm"
                          >
                            ערוך
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="px-2 sm:px-4 py-1.5 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs sm:text-sm"
                          >
                            מחק
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-haifa-green">
              {editingEvent ? 'ערוך אירוע' : 'הוסף אירוע חדש'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">תאריך</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-haifa-green"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">שעה</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-haifa-green"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">מיקום</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-haifa-green"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">סוג</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-haifa-green"
                >
                  <option value="אימון">אימון</option>
                  <option value="משחק">משחק</option>
                </select>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-haifa-green text-white rounded-lg hover:bg-haifa-dark-green transition-colors text-sm sm:text-base"
                >
                  {editingEvent ? 'עדכן' : 'הוסף'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-haifa-green">
              נוכחות - {selectedEvent.type} ({format(parseISO(selectedEvent.date), 'dd/MM/yyyy', { locale: he })})
            </h3>
            <div className="space-y-2">
              {players.map((player) => {
                const isPresent = selectedEvent.attendance?.[player.id] || false;
                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      isPresent
                        ? 'bg-green-50 border-green-500'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                    onClick={() => toggleAttendance(player.id)}
                  >
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isPresent ? 'bg-green-500 border-green-500' : 'border-gray-400'
                      }`}>
                        {isPresent && <span className="text-white text-xs sm:text-sm">✓</span>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm sm:text-base">{player.name}</div>
                        <div className="text-xs sm:text-sm text-gray-600">#{player.jerseyNumber} - {player.position}</div>
                      </div>
                    </div>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex-shrink-0 ${
                      isPresent
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}>
                      {isPresent ? 'נוכח' : 'נעדר'}
                    </span>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => {
                setShowAttendanceModal(false);
                setSelectedEvent(null);
              }}
              className="mt-6 w-full px-6 py-3 bg-haifa-green text-white rounded-lg hover:bg-haifa-dark-green transition-colors"
            >
              סגור
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

