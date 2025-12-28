import Image from 'next/image';

export default function Logo({ size = 120 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/maccabi-haifa-logo.svg"
        alt="לוגו מכבי חיפה"
        width={size}
        height={size}
        className="drop-shadow-lg"
        priority
      />
    </div>
  );
}

