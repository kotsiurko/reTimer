// Використані бібліотеки

// TailwindCSS — для адаптивної стилізації.

// shadcn/ui — для готових, але гнучких UI-компонентів.

// lucide-react — для іконок (наприклад, годинник чи дзвоник).

// Framer Motion — для плавних анімацій появи/зміни.

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

const lessons = [
  { lesson: 1, start: "08:30", end: "09:15" },
  { lesson: 2, start: "09:25", end: "10:10" },
  { lesson: 3, start: "10:20", end: "11:05" },
  { lesson: 4, start: "11:15", end: "12:00" },
  { lesson: 5, start: "12:10", end: "12:55" },
];

function formatTimeLeft(ms) {
  if (ms <= 0) return "00:00";
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export default function LessonTimer() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentLesson = lessons.find((lesson) => {
    const [sh, sm] = lesson.start.split(":").map(Number);
    const [eh, em] = lesson.end.split(":").map(Number);
    const start = new Date(now);
    start.setHours(sh, sm, 0, 0);
    const end = new Date(now);
    end.setHours(eh, em, 0, 0);
    return now >= start && now <= end;
  });

  const timeLeft = currentLesson
    ? (() => {
        const [eh, em] = currentLesson.end.split(":").map(Number);
        const end = new Date(now);
        end.setHours(eh, em, 0, 0);
        return end - now;
      })()
    : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 space-y-6">
      {/* Поточний час */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold tracking-wide"
      >
        {now.toLocaleTimeString("uk-UA", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </motion.div>

      {/* Блок з уроком */}
      {currentLesson ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <Card className="bg-orange-500 rounded-2xl shadow-lg">
            <CardContent className="text-center p-6">
              <div className="flex justify-center items-center mb-3">
                <Clock className="mr-2" />
                <span className="text-xl font-bold">
                  Урок {currentLesson.lesson}
                </span>
              </div>
              <div className="text-base mb-2">
                {currentLesson.start} — {currentLesson.end}
              </div>
              <div className="text-lg">
                Залишилось: <b>{formatTimeLeft(timeLeft)}</b>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="text-lg text-gray-400">Зараз немає уроку</div>
      )}

      {/* Розклад */}
      <div className="w-full max-w-md bg-gray-800 rounded-xl p-4 space-y-2 shadow">
        <h2 className="text-center text-lg font-semibold mb-2">Розклад</h2>
        {lessons.map((lesson) => (
          <div
            key={lesson.lesson}
            className="flex justify-between text-sm bg-gray-700 p-2 rounded-lg"
          >
            <span>Урок {lesson.lesson}</span>
            <span>
              {lesson.start} – {lesson.end}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
