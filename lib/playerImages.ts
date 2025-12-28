// קישורים לתמונות שחקנים מהאתר הרשמי של מכבי חיפה
// https://www.mhaifafc.com/players

// מיפוי שמות שחקנים לקישורי תמונות מהאתר הרשמי
const playerImageMap: Record<string, string> = {
  // שוערים
  'שריף קיוף': `https://www.mhaifafc.com/media/players/40.jpg`,
  'גלן אלוין': `https://www.mhaifafc.com/media/players/45.jpg`,
  'רועי פוקס': `https://www.mhaifafc.com/media/players/77.jpg`,
  'גיאור גיירמקוב': `https://www.mhaifafc.com/media/players/89.jpg`,
  
  // הגנה
  'זוהר זסנו': `https://www.mhaifafc.com/media/players/2.jpg`,
  'שון גולדברג': `https://www.mhaifafc.com/media/players/3.jpg`,
  'קניסייף': `https://www.mhaifafc.com/media/players/16.jpg`,
  'ליסב עיסאת': `https://www.mhaifafc.com/media/players/24.jpg`,
  'יילה בטאי': `https://www.mhaifafc.com/media/players/25.jpg`,
  'פייר קורנו': `https://www.mhaifafc.com/media/players/27.jpg`,
  'ינון פיינגזיכט': `https://www.mhaifafc.com/media/players/29.jpg`,
  'עבדול איסקב': `https://www.mhaifafc.com/media/players/30.jpg`,
  'אלעד אמיר': `https://www.mhaifafc.com/media/players/37.jpg`,
  'פדרואו ליביירה': `https://www.mhaifafc.com/media/players/44.jpg`,
  
  // קישור
  'עלי מוחמד': `https://www.mhaifafc.com/media/players/4.jpg`,
  'גונין אור': `https://www.mhaifafc.com/media/players/5.jpg`,
  'דולב חזיזה': `https://www.mhaifafc.com/media/players/8.jpg`,
  'מתיאס נהואל': `https://www.mhaifafc.com/media/players/10.jpg`,
  'ליאור קאסה': `https://www.mhaifafc.com/media/players/15.jpg`,
  'איתן אזולאי': `https://www.mhaifafc.com/media/players/19.jpg`,
  'מיכאל אוחנה': `https://www.mhaifafc.com/media/players/26.jpg`,
  'פיטר אגבה': `https://www.mhaifafc.com/media/players/80.jpg`,
  
  // התקפה
  'סילבה קאני': `https://www.mhaifafc.com/media/players/7.jpg`,
  'סהקאני': `https://www.mhaifafc.com/media/players/7.jpg`, // שם חלופי
  'טריבנטה סטיוארט': `https://www.mhaifafc.com/media/players/9.jpg`,
  'קנג\'י חורה': `https://www.mhaifafc.com/media/players/11.jpg`,
  'סוף פודגוראנוק': `https://www.mhaifafc.com/media/players/17.jpg`,
  'גיאן מלמד': `https://www.mhaifafc.com/media/players/18.jpg`,
  'דניאל דרזי': `https://www.mhaifafc.com/media/players/28.jpg`,
  'עומר דהן': `https://www.mhaifafc.com/media/players/38.jpg`,
  'ג\'ורג\'ה יובאנוביץ\'': `https://www.mhaifafc.com/media/players/99.jpg`,
};

export const getPlayerImageUrl = (playerName: string, jerseyNumber: number): string | undefined => {
  // ננסה למצוא תמונה לפי שם
  if (playerImageMap[playerName]) {
    return playerImageMap[playerName];
  }
  
  // ננסה מספר אפשרויות לקישורי תמונות מהאתר הרשמי
  // האתר משתמש במבנה: /media/players/{jerseyNumber}.jpg או .png
  const possibleUrls = [
    `https://www.mhaifafc.com/media/players/${jerseyNumber}.jpg`,
    `https://www.mhaifafc.com/media/players/${jerseyNumber}.png`,
    `https://www.mhaifafc.com/images/players/${jerseyNumber}.jpg`,
    `https://www.mhaifafc.com/images/players/${jerseyNumber}.png`,
  ];
  
  // נחזיר את האפשרות הראשונה (הדפדפן ינסה לטעון ואם זה לא יעבוד, יוצג placeholder)
  return possibleUrls[0];
};

