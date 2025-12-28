'use client';

import { resetSampleData } from '@/lib/initData';
import { useRouter } from 'next/navigation';

export default function ResetDataButton() {
  const router = useRouter();

  const handleReset = () => {
    if (confirm('האם אתה בטוח שברצונך לאתחל מחדש את כל הנתונים? פעולה זו תמחק את כל השחקנים, האירועים והסטטיסטיקות ותטען נתונים עדכניים לעונת 2024/2025.')) {
      resetSampleData();
      alert('הנתונים אופסו בהצלחה! הרשימה עודכנה עם שחקנים עדכניים.');
      // רענון הדף כדי להציג את הנתונים החדשים
      window.location.reload();
    }
  };

  return (
    <button
      onClick={handleReset}
      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
      title="אתחל מחדש את הנתונים עם רשימת שחקנים עדכנית"
    >
      🔄 אתחל נתונים
    </button>
  );
}

