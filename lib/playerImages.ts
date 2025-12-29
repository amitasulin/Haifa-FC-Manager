// קישורים לתמונות שחקנים
// הערה: הקישורים מהאתר הרשמי גורמים ל-404
// נשתמש ב-placeholder במקום
// אם תרצה להוסיף תמונות, תוכל להוריד אותן ולשים ב-public/players/{jerseyNumber}.jpg

// מיפוי שמות שחקנים לקישורי תמונות
// כרגע ריק - נשתמש ב-placeholder
const playerImageMap: Record<string, string> = {
  // אם תרצה להוסיף תמונות מקומיות:
  // 'שריף קיוף': '/players/40.jpg',
  // 'גלן אלוין': '/players/45.jpg',
  // וכו'...
};

export const getPlayerImageUrl = (playerName: string, jerseyNumber: number): string | undefined => {
  // ננסה למצוא תמונה לפי שם
  if (playerImageMap[playerName]) {
    return playerImageMap[playerName];
  }
  
  // ננסה למצוא תמונה מקומית לפי מספר חולצה
  // אם יש תמונות ב-public/players/{jerseyNumber}.jpg
  // return `/players/${jerseyNumber}.jpg`;
  
  // לא נחזיר קישור אוטומטי כי התמונות לא קיימות באתר
  // במקום זה, נחזיר undefined כדי להציג placeholder
  return undefined;
};
