"use client";

import { useEffect, useState } from "react";

interface Props {
  timeZone: string;
  city: string;
}

// Live local clock for an office card. Updates once per minute.
// Shows "open / closed" indicator based on weekday business hours (9-18 local).
export function OfficeTimer({ timeZone, city }: Props) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Align first tick to the next minute boundary so all timers update together
    const now = new Date();
    const msToNextMinute = 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds());
    const timeoutId = setTimeout(() => {
      setTick((t) => t + 1);
      const intervalId = setInterval(() => setTick((t) => t + 1), 60_000);
      // store intervalId on element so cleanup can clear it
      (timeoutId as unknown as { intervalId: ReturnType<typeof setInterval> }).intervalId =
        intervalId;
    }, msToNextMinute);
    return () => {
      clearTimeout(timeoutId);
      const intervalId = (timeoutId as unknown as { intervalId?: ReturnType<typeof setInterval> })
        .intervalId;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const now = new Date();
  // re-read tick to satisfy lint (state read prevents memoization breakage)
  void tick;

  const time = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(now);

  const dayPart = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  }).format(now);

  // Compute hour & weekday in target tz to determine "open"
  const hourLocal = parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "numeric",
      hour12: false,
    }).format(now),
    10,
  );
  const weekdayNum = new Date(
    new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(now) + " 2000",
  );
  const weekdayShort = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  }).format(now);
  const isWeekday = !["Sat", "Sun"].includes(weekdayShort);
  const open = isWeekday && hourLocal >= 9 && hourLocal < 18;
  void weekdayNum;

  return (
    <div className="office-clock" aria-label={`Local time in ${city}`}>
      <span className={`office-status-dot ${open ? "is-open" : "is-closed"}`} aria-hidden />
      <span className="office-clock-time">{time}</span>
      <span className="office-clock-day">{dayPart} · {open ? "Open now" : "Closed"}</span>
    </div>
  );
}
