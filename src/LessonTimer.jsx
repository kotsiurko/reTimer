import React, { useState, useEffect } from "react";

// JSON-розклад уроків
const lessons = [
  { lesson: 1, start: "08:30", end: "09:15" },
  { lesson: 2, start: "09:25", end: "10:10" },
  { lesson: 3, start: "10:20", end: "11:05" },
  { lesson: 4, start: "19:30", end: "19:55" },
  { lesson: 5, start: "20:10", end: "20:52" },
  { lesson: 6, start: "21:10", end: "21:55" },
  { lesson: 7, start: "22:10", end: "22:55" },
];

// функція для перетворення hh:mm у Date
function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes
  );
}

// форматування таймера
function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} хв ${seconds.toString().padStart(2, "0")} сек`;
}

export default function LessonTimer() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState(null); // "lesson" | "break" | "end"
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      let activeLesson = null;
      let next = null;

      for (let i = 0; i < lessons.length; i++) {
        const start = parseTime(lessons[i].start);
        const end = parseTime(lessons[i].end);

        if (now >= start && now <= end) {
          activeLesson = lessons[i];
          break;
        }
        if (now < start) {
          next = lessons[i];
          break;
        }
      }

      if (activeLesson) {
        // Якщо йде урок
        setStatus("lesson");
        setCurrentLesson(activeLesson);
        setTimeLeft(parseTime(activeLesson.end) - now);
      } else if (next) {
        // Якщо перерва
        setStatus("break");
        setNextLesson(next);
        setTimeLeft(parseTime(next.start) - now);
      } else {
        // Якщо навчальний день завершено
        setStatus("end");
        setTimeLeft(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      {/* Поточний час */}
      <div className="text-4xl font-bold mb-6">
        {currentTime.toLocaleTimeString("uk-UA")}
      </div>

      {/* Інформація про урок або перерву */}
      {status === "lesson" && currentLesson && (
        <div className="bg-orange-500 text-black rounded-2xl p-4 w-full max-w-sm text-center shadow-lg">
          <div className="text-xl font-bold mb-2">
            Урок {currentLesson.lesson}
          </div>
          <div className="mb-2">
            {currentLesson.start} — {currentLesson.end}
          </div>
          <div className="text-lg font-medium">
            Залишилось: <b>{formatTime(timeLeft)}</b>
          </div>
        </div>
      )}

      {status === "break" && nextLesson && (
        <div className="bg-green-500 text-black rounded-2xl p-4 w-full max-w-sm text-center shadow-lg">
          <div className="text-xl font-bold mb-2">Перерва</div>
          <div className="mb-2">
            Наступний урок: {nextLesson.lesson} ({nextLesson.start})
          </div>
          <div className="text-lg font-medium">
            Почнеться через: <b>{formatTime(timeLeft)}</b>
          </div>
        </div>
      )}

      {status === "end" && (
        <div className="bg-red-500 text-black rounded-2xl p-4 w-full max-w-sm text-center shadow-lg">
          <div className="text-xl font-bold">Навчальний день завершено 🎉</div>
        </div>
      )}

      {/* Розклад уроків */}
      <div className="mt-8 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-2">Розклад уроків</h2>
        <ul className="space-y-1 text-gray-300">
          {lessons.map((l) => (
            <li
              key={l.lesson}
              className="flex justify-between border-b border-gray-700 pb-1"
            >
              <span>Урок {l.lesson}</span>
              <span>
                {l.start} — {l.end}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
