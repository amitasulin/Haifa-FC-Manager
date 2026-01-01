import { Player, Event } from "@/types";
import {
  addPlayer,
  addEvent,
  getPlayers,
  getEvents,
  savePlayers,
} from "./storage";
import { getPlayerImageUrl } from "./playerImages";

// שחקנים עדכניים של מכבי חיפה - עונת 2024/2025
// נתונים מבוססים על האתר הרשמי: https://www.mhaifafc.com/players?tab=סגל%20השחקנים
// עודכן: דצמבר 2024 - רשימה מדויקת לפי האתר הרשמי
const samplePlayers: Omit<Player, "id">[] = [
  // שוערים (4 שחקנים)
  {
    name: "שריף קיוף",
    jerseyNumber: 40,
    position: "שוער",
    age: 28,
    isInjured: false,
    nationality: "ישראל",
    height: 190,
    weight: 85,
  },
  {
    name: "גלן אלוין",
    jerseyNumber: 45,
    position: "שוער",
    age: 26,
    isInjured: false,
    nationality: "ישראל",
    height: 188,
    weight: 82,
  },
  {
    name: "רועי פוקס",
    jerseyNumber: 77,
    position: "שוער",
    age: 25,
    isInjured: false,
    nationality: "ישראל",
    height: 185,
    weight: 80,
  },
  {
    name: "גיאור גיירמקוב",
    jerseyNumber: 89,
    position: "שוער",
    age: 23,
    isInjured: false,
    nationality: "ישראל",
    height: 187,
    weight: 81,
  },

  // הגנה (10 שחקנים) - לפי האתר הרשמי
  {
    name: "זוהר זסנו",
    jerseyNumber: 2,
    position: "הגנה",
    age: 28,
    isInjured: false,
    nationality: "ישראל",
    height: 182,
    weight: 76,
  },
  {
    name: "שון גולדברג",
    jerseyNumber: 3,
    position: "הגנה",
    age: 26,
    isInjured: false,
    nationality: "ישראל",
    height: 183,
    weight: 75,
  },
  {
    name: "קני סייף",
    jerseyNumber: 16,
    position: "הגנה",
    age: 25,
    isInjured: false,
    nationality: "רוסיה",
    height: 185,
    weight: 78,
  },
  {
    name: "ליסב עיסאת",
    jerseyNumber: 24,
    position: "הגנה",
    age: 27,
    isInjured: false,
    nationality: "ישראל",
    height: 184,
    weight: 77,
  },
  {
    name: "יילה בטאי",
    jerseyNumber: 25,
    position: "הגנה",
    age: 23,
    isInjured: false,
    nationality: "ישראל",
    height: 179,
    weight: 74,
  },
  {
    name: "פייר קורנו",
    jerseyNumber: 27,
    position: "הגנה",
    age: 26,
    isInjured: false,
    nationality: "ארגנטינה",
    height: 181,
    weight: 75,
  },
  {
    name: "ינון פיינגזיכט",
    jerseyNumber: 29,
    position: "הגנה",
    age: 22,
    isInjured: false,
    nationality: "ישראל",
    height: 178,
    weight: 72,
  },
  {
    name: "עבדול איסקב",
    jerseyNumber: 30,
    position: "הגנה",
    age: 25,
    isInjured: false,
    nationality: "ישראל",
    height: 183,
    weight: 76,
  },
  {
    name: "אלעד אמיר",
    jerseyNumber: 37,
    position: "הגנה",
    age: 24,
    isInjured: false,
    nationality: "ישראל",
    height: 182,
    weight: 75,
  },
  {
    name: "פדרואו ליביירה",
    jerseyNumber: 44,
    position: "הגנה",
    age: 26,
    isInjured: false,
    nationality: "ברזיל",
    height: 186,
    weight: 79,
  },

  // קישור (8 שחקנים) - לפי האתר הרשמי
  {
    name: "עלי מוחמד",
    jerseyNumber: 4,
    position: "קישור",
    age: 23,
    isInjured: false,
    nationality: "ישראל",
    height: 177,
    weight: 71,
  },
  {
    name: "גוני נאור",
    jerseyNumber: 5,
    position: "קישור",
    age: 24,
    isInjured: false,
    nationality: "ישראל",
    height: 176,
    weight: 72,
  },
  {
    name: "דולב חזיזה",
    jerseyNumber: 8,
    position: "קישור",
    age: 26,
    isInjured: false,
    nationality: "ישראל",
    height: 178,
    weight: 73,
  },
  {
    name: "מתיאס נהואל",
    jerseyNumber: 10,
    position: "קישור",
    age: 25,
    isInjured: false,
    nationality: "ברזיל",
    height: 175,
    weight: 70,
  },
  {
    name: "ליאור קאסה",
    jerseyNumber: 15,
    position: "קישור",
    age: 27,
    isInjured: false,
    nationality: "ישראל",
    height: 180,
    weight: 74,
  },
  {
    name: "איתן אזולאי",
    jerseyNumber: 19,
    position: "קישור",
    age: 24,
    isInjured: false,
    nationality: "ישראל",
    height: 180,
    weight: 73,
  },
  {
    name: "מיכאל אוחנה",
    jerseyNumber: 26,
    position: "קישור",
    age: 24,
    isInjured: false,
    nationality: "ישראל",
    height: 179,
    weight: 73,
  },
  {
    name: "פיטר אגבה",
    jerseyNumber: 80,
    position: "קישור",
    age: 25,
    isInjured: false,
    nationality: "ניגריה",
    height: 182,
    weight: 75,
  },

  // התקפה
  {
    name: "סילבה קאני",
    jerseyNumber: 7,
    position: "התקפה",
    age: 26,
    isInjured: false,
    nationality: "קוסובו",
    height: 178,
    weight: 72,
  },
  {
    name: "טריבנטה סטיוארט",
    jerseyNumber: 9,
    position: "התקפה",
    age: 24,
    isInjured: false,
    nationality: "סקוטלנד",
    height: 180,
    weight: 74,
  },
  {
    name: "קנג'י חורה",
    jerseyNumber: 11,
    position: "התקפה",
    age: 23,
    isInjured: false,
    nationality: "יפן",
    height: 175,
    weight: 70,
  },
  {
    name: "סוף פודגוראנו",
    jerseyNumber: 17,
    position: "התקפה",
    age: 22,
    isInjured: false,
    nationality: "קרואטיה",
    height: 182,
    weight: 76,
  },
  {
    name: "גיא מלמד",
    jerseyNumber: 18,
    position: "התקפה",
    age: 25,
    isInjured: false,
    nationality: "ישראל",
    height: 179,
    weight: 73,
  },
  {
    name: "דניאל דרזי",
    jerseyNumber: 28,
    position: "התקפה",
    age: 24,
    isInjured: false,
    nationality: "ישראל",
    height: 177,
    weight: 71,
  },
  {
    name: "עומר דהן",
    jerseyNumber: 38,
    position: "התקפה",
    age: 21,
    isInjured: false,
    nationality: "ישראל",
    height: 176,
    weight: 70,
  },
  {
    name: "ג'ורג'ה יובאנוביץ'",
    jerseyNumber: 99,
    position: "התקפה",
    age: 26,
    isInjured: false,
    nationality: "סרביה",
    height: 184,
    weight: 77,
  },
];

// אירועים לדוגמה
const getSampleEvents = (): Omit<Event, "id">[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // איפוס השעה להשוואה נכונה
  const events: Omit<Event, "id">[] = [];

  // משחקים בעבר - להוסיף נתונים אמינים
  const pastGames = [
    {
      date: "2024-11-15",
      time: "20:30",
      location: "אצטדיון סמי עופר, חיפה",
      opponent: "מכבי תל אביב",
    },
    {
      date: "2024-11-22",
      time: "18:00",
      location: "אצטדיון בלומפילד, תל אביב",
      opponent: "הפועל תל אביב",
    },
    {
      date: "2024-11-29",
      time: "19:00",
      location: "אצטדיון סמי עופר, חיפה",
      opponent: "מכבי נתניה",
    },
    {
      date: "2024-12-05",
      time: "20:30",
      location: "אצטדיון סמי עופר, חיפה",
      opponent: "הפועל באר שבע",
    },
    {
      date: "2024-12-12",
      time: "18:00",
      location: "אצטדיון נתניה, נתניה",
      opponent: "מכבי פתח תקווה",
    },
    {
      date: "2024-12-19",
      time: "19:30",
      location: "אצטדיון סמי עופר, חיפה",
      opponent: "בני יהודה",
    },
  ];

  pastGames.forEach((game) => {
    const gameDate = new Date(game.date);
    gameDate.setHours(0, 0, 0, 0);
    if (gameDate < today) {
      events.push({
        date: game.date,
        time: game.time,
        location: game.location,
        type: "משחק",
        attendance: {},
      });
    }
  });

  // אימונים מהשבועות האחרונים
  for (let i = 14; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    if (date.getDay() !== 5 && date.getDay() !== 6 && date < today) {
      // לא שישי ושבת, רק בעבר
      events.push({
        date: date.toISOString().split("T")[0],
        time: "18:00",
        location: "מגרש האימונים, חיפה",
        type: "אימון",
        attendance: {},
      });
    }
  }

  // אימונים השבוע הקרוב
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    if (date.getDay() !== 5 && date.getDay() !== 6) {
      // לא שישי ושבת
      events.push({
        date: date.toISOString().split("T")[0],
        time: "18:00",
        location: "מגרש האימונים, חיפה",
        type: "אימון",
        attendance: {},
      });
    }
  }

  // משחקים קרובים לפי האתר הרשמי https://www.mhaifafc.com/
  // משחק נגד בית"ר ירושלים - 22 בדצמבר
  const game1 = new Date("2024-12-22");
  game1.setHours(0, 0, 0, 0);
  if (game1 >= today) {
    events.push({
      date: game1.toISOString().split("T")[0],
      time: "20:30",
      location: "אצטדיון סמי עופר, חיפה",
      type: "משחק",
      attendance: {},
    });
  }

  // משחק נגד מ.ס. אשדוד - 31 בדצמבר
  const game2 = new Date("2024-12-31");
  game2.setHours(0, 0, 0, 0);
  if (game2 >= today) {
    events.push({
      date: game2.toISOString().split("T")[0],
      time: "17:45",
      location: 'הי"א אשדוד',
      type: "משחק",
      attendance: {},
    });
  }

  // משחק נגד הפועל חיפה - 5 בינואר
  const game3 = new Date("2025-01-05");
  game3.setHours(0, 0, 0, 0);
  if (game3 >= today) {
    events.push({
      date: game3.toISOString().split("T")[0],
      time: "18:30",
      location: "אצטדיון סמי עופר, חיפה",
      type: "משחק",
      attendance: {},
    });
  }

  // משחק נגד הפועל באר שבע - 10 בינואר
  const game4 = new Date("2025-01-10");
  game4.setHours(0, 0, 0, 0);
  if (game4 >= today) {
    events.push({
      date: game4.toISOString().split("T")[0],
      time: "18:00",
      location: "אצטדיון טרנר, באר שבע",
      type: "משחק",
      attendance: {},
    });
  }

  return events;
};

export const initializeSampleData = () => {
  // בדיקה אם כבר יש נתונים
  const existingPlayers = getPlayers();
  const existingEvents = getEvents();

  // הוספת שחקנים רק אם אין שחקנים
  if (existingPlayers.length === 0) {
    samplePlayers.forEach((player, index) => {
      // הוספת קישור לתמונה מהאתר הרשמי
      const imageUrl = getPlayerImageUrl(player.name, player.jerseyNumber);
      addPlayer({
        ...player,
        id: `player_${Date.now()}_${index}`,
        imageUrl: imageUrl,
      });
    });
  } else {
    // אם יש שחקנים, נעדכן את השמות
    updatePlayerNames();
  }

  // הוספת אירועים רק אם אין אירועים או אם אין מספיק משחקים
  const gamesCount = existingEvents.filter((e) => e.type === "משחק").length;
  if (existingEvents.length === 0 || gamesCount < 5) {
    // אם יש אירועים קיימים אבל אין מספיק משחקים, נוסיף משחקים בעבר
    if (existingEvents.length > 0 && gamesCount < 5) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const pastGames = [
        {
          date: "2024-11-15",
          time: "20:30",
          location: "אצטדיון סמי עופר, חיפה",
        },
        {
          date: "2024-11-22",
          time: "18:00",
          location: "אצטדיון בלומפילד, תל אביב",
        },
        {
          date: "2024-11-29",
          time: "19:00",
          location: "אצטדיון סמי עופר, חיפה",
        },
        {
          date: "2024-12-05",
          time: "20:30",
          location: "אצטדיון סמי עופר, חיפה",
        },
        { date: "2024-12-12", time: "18:00", location: "אצטדיון נתניה, נתניה" },
        {
          date: "2024-12-19",
          time: "19:30",
          location: "אצטדיון סמי עופר, חיפה",
        },
      ];

      pastGames.forEach((game, index) => {
        const gameDate = new Date(game.date);
        gameDate.setHours(0, 0, 0, 0);
        // הוסף רק אם התאריך בעבר ואין כבר אירוע באותו תאריך
        if (
          gameDate < today &&
          !existingEvents.find((e) => e.date === game.date && e.type === "משחק")
        ) {
          const newEvent: Event = {
            date: game.date,
            time: game.time,
            location: game.location,
            type: "משחק",
            attendance: {},
            id: `event_${Date.now()}_past_${index}`,
          };

          // הוסף נוכחות אקראית לשחקנים במשחק
          const allPlayers = getPlayers();
          allPlayers.forEach((player) => {
            // שחקנים מרכזיים (מספר חולצה נמוך) - נוכחות גבוהה יותר
            const isKeyPlayer =
              player.jerseyNumber <= 11 || player.position === "שוער";
            const attendanceChance = isKeyPlayer ? 0.85 : 0.7;
            if (Math.random() < attendanceChance) {
              newEvent.attendance![player.id] = true;
            }
          });

          addEvent(newEvent);
        }
      });
    } else {
      // אם אין אירועים בכלל, הוסף הכל
      getSampleEvents().forEach((event, index) => {
        addEvent({
          ...event,
          id: `event_${Date.now()}_${index}`,
        });
      });
    }
  }
};

// פונקציה למחיקת כפילויות שחקנים
export const removeDuplicatePlayers = () => {
  if (typeof window === "undefined") return;

  const players = getPlayers();
  const seenJerseyNumbers = new Set<number>();
  const uniquePlayers: Player[] = [];

  // שמירה על השחקן הראשון עם כל מספר חולצה
  players.forEach((player) => {
    if (!seenJerseyNumbers.has(player.jerseyNumber)) {
      seenJerseyNumbers.add(player.jerseyNumber);
      uniquePlayers.push(player);
    }
  });

  // אם יש כפילויות, נשמור את הרשימה המעודכנת
  if (uniquePlayers.length !== players.length) {
    savePlayers(uniquePlayers);
  }
};

// פונקציה לעדכון שמות שחקנים קיימים
export const updatePlayerNames = () => {
  if (typeof window === "undefined") return;

  const players = getPlayers();
  const nameUpdates: Record<number, string> = {
    7: "סילבה קאני", // עדכון שם אם צריך
    16: "קני סייף", // קניסייף -> קני סייף
    5: "גוני נאור", // גונין אור -> גוני נאור
    18: "גיא מלמד", // גיאן מלמד -> גיא מלמד
    17: "סוף פודגוראנו", // סוף פודגוראנוק -> סוף פודגוראנו
  };

  let updated = false;
  players.forEach((player) => {
    if (
      nameUpdates[player.jerseyNumber] &&
      player.name !== nameUpdates[player.jerseyNumber]
    ) {
      player.name = nameUpdates[player.jerseyNumber];
      updated = true;
    }
  });

  if (updated) {
    savePlayers(players);
  }

  // מחיקת כפילויות אחרי עדכון השמות
  removeDuplicatePlayers();
};

// פונקציה לאתחול מחדש של הנתונים (מחיקה והוספה מחדש)
export const resetSampleData = () => {
  if (typeof window === "undefined") return;

  // מחיקת כל הנתונים
  localStorage.removeItem("haifa_fc_players");
  localStorage.removeItem("haifa_fc_events");
  localStorage.removeItem("haifa_fc_stats");

  // הוספת נתונים חדשים
  samplePlayers.forEach((player, index) => {
    // הוספת קישור לתמונה מהאתר הרשמי
    const imageUrl = getPlayerImageUrl(player.name, player.jerseyNumber);
    addPlayer({
      ...player,
      id: `player_${Date.now()}_${index}`,
      imageUrl: imageUrl,
    });
  });

  getSampleEvents().forEach((event, index) => {
    addEvent({
      ...event,
      id: `event_${Date.now()}_${index}`,
    });
  });
};
