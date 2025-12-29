'use client';

import { Player } from '@/types';
import { getPlayerImageUrl } from '@/lib/playerImages';
import Image from 'next/image';

interface PlayerImageProps {
  player: Player;
  size?: 'small' | 'medium' | 'large';
}

export default function PlayerImage({ player, size = 'large' }: PlayerImageProps) {
  const sizeClasses = {
    small: 'h-32',
    medium: 'h-48',
    large: 'h-64',
  };

  const textSizes = {
    small: 'text-4xl',
    medium: 'text-5xl',
    large: 'text-6xl',
  };

  // ננסה לקבל תמונה מהפונקציה או מהנתונים
  const imageUrl = player.imageUrl || getPlayerImageUrl(player.name, player.jerseyNumber);

  // אם יש תמונה, נציג אותה (אבל נציג placeholder אם היא נכשלה)
  if (imageUrl) {
    return (
      <div className={`relative ${sizeClasses[size]} bg-gradient-to-br from-haifa-green to-haifa-dark-green flex items-center justify-center overflow-hidden`}>
        <img
          src={imageUrl}
          alt={player.name}
          className="object-cover w-full h-full"
          loading="lazy"
          onError={(e) => {
            // אם התמונה נכשלה, נציג placeholder
            const img = e.target as HTMLImageElement;
            img.style.display = 'none';
            const parent = img.parentElement;
            if (parent) {
              const fallback = parent.querySelector('.fallback-number') as HTMLElement;
              if (fallback) {
                fallback.style.opacity = '1';
              } else {
                // אם אין fallback, ניצור אחד
                const fallbackDiv = document.createElement('div');
                fallbackDiv.className = `absolute inset-0 flex items-center justify-center ${textSizes[size]} text-white font-bold fallback-number`;
                fallbackDiv.textContent = player.jerseyNumber.toString();
                parent.appendChild(fallbackDiv);
              }
            }
          }}
          onLoadStart={() => {
            // מונע שגיאות 404 בקונסול
          }}
        />
        {/* Fallback אם התמונה נכשלה */}
        <div className={`absolute inset-0 flex items-center justify-center ${textSizes[size]} text-white font-bold fallback-number pointer-events-none opacity-0`}>
          {player.jerseyNumber}
        </div>
      </div>
    );
  }

  // תמונת placeholder מקצועית עם מספר החולצה
  const uniqueId = `player-${player.id}-${player.jerseyNumber}`;
  
  return (
    <div className={`relative ${sizeClasses[size]} bg-gradient-to-br from-haifa-green to-haifa-dark-green flex items-center justify-center overflow-hidden`}>
      {/* Pattern background עם לוגו מכבי חיפה */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`grid-${uniqueId}`} width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${uniqueId})`} />
        </svg>
      </div>
      
      {/* מספר החולצה - גדול ומרכזי */}
      <div className={`relative z-10 ${textSizes[size]} text-white font-black drop-shadow-2xl`} style={{ 
        textShadow: '0 4px 8px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.2)'
      }}>
        {player.jerseyNumber}
      </div>
      
      {/* שם השחקן בתחתית */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        <div className="text-white text-xs font-bold bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full inline-block border border-white/20">
          {player.name.split(' ')[0]}
        </div>
      </div>
      
      {/* אפקט זוהר */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

