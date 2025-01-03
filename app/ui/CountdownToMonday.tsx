"use client"; 
// ^ Use "use client" only if you're using Next.js 13+ App Router for client components.
//   If you're using the Pages Router (pages/ directory), remove this line.

import { useState, useEffect } from "react";
import { roboto } from '@/app/ui/fonts';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Returns a date object representing the next Monday at 00:00 (midnight).
 */
function getNextMonday(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay(); // Sunday=0, Monday=1, ... Saturday=6
  // If today is Monday, we want the *next* Monday, which is 7 days away.
  const daysUntilMonday = (1 - dayOfWeek + 7) % 7 || 7;

  // Create a new Date for next Monday at midnight
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(0, 0, 0, 0);

  return nextMonday;
}

/**
 * Given an end time (in ms), returns the remaining days, hours, minutes, and seconds.
 */
function calculateTimeLeft(endTime: number): TimeLeft {
  const now = new Date().getTime();
  const difference = endTime - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor(
    (difference % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

export default function CountdownToMonday() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => {
    const nextMondayTime = getNextMonday().getTime();
    return calculateTimeLeft(nextMondayTime);
  });
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const timer = setInterval(() => {
      const nextMondayTime = getNextMonday().getTime();
      setTimeLeft(calculateTimeLeft(nextMondayTime));
    }, 1000);

    // Cleanup when component unmounts
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-0" suppressHydrationWarning>
      <h1 className={`${roboto.className} text-white mb-0 text-xl md:text-2xl`}>The next Robday is in</h1>
      <div className={`${roboto.className} text-white flex space-x-4`}>
        <div className={`text-center`}>
            {isClient ?
            <div className="text-3xl font-bold" suppressHydrationWarning>{timeLeft.days}</div>
            : <div className="text-3xl font-bold">0</div>
            }
          <div className="text-sm">Days</div>
        </div>
        <div className="text-center">
            {isClient ?
            <div className="text-3xl font-bold" suppressHydrationWarning>{timeLeft.hours}</div>
            :
            <div className="text-3xl font-bold">0</div>
            }
          <div className="text-sm">Hours</div>
        </div>
        <div className="text-center">
            {isClient ?
            <div className="text-3xl font-bold" suppressHydrationWarning>{timeLeft.minutes}</div>
            :
            <div className="text-3xl font-bold">0</div>
            }
          <div className="text-sm">Minutes</div>
        </div>
        <div className="text-center">
            {isClient ?
            <div className="text-3xl font-bold" suppressHydrationWarning>{timeLeft.seconds}</div>
            :
            <div className="text-3xl font-bold">0</div>
            }
          <div className="text-sm">Seconds</div>
        </div>
      </div>
    </div>
  );
}
