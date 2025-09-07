// LessonTimer.jsx
import { useEffect, useState } from "react";
import schedule from "./schedule.json"; // твій розклад

export default function LessonTimer() {
  const [nowTime, setNowTime] = useState(new Date());
  const [currentLesson, setCurrentLesson] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // допоміжна функція: повертає Date об'єкт для сьогоднішнього дня з годиною:хвилиною
    const makeTodayTime = (hhmm) => {
      const [h, m] = hhmm.split(":").map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      d.setMilliseconds(0);
      return d;
    };

    const tick = () => {
      try {
        const now = new Date();
        setNowTime(now);
        let found = null;

        for (const lesson of schedule) {
          // Перевіряємо, що в записі є start і end
          if (!lesson?.start || !lesson?.end) continue;

          const startDate = makeTodayTime(lesson.start);
          const endDate = makeTodayTime(lesson.end);

          // Якщо кінець менший за початок (дуже рідко) - ігноруємо або додаємо день
          if (endDate < startDate) {
            endDate.setDate(endDate.getDate() + 1);
          }

          // Якщо зараз між startDate та endDate
          if (now >= startDate && now <= endDate) {
            found = {
              lesson: lesson.lesson ?? "—",
              startStr: lesson.start,
              endStr: lesson.end,
              startDate,
              endDate,
            };
            break;
          }
        }

        if (found) {
          setCurrentLesson(found);
          const secs = Math.floor((found.endDate - now) / 1000);
          setTimeLeft(secs >= 0 ? secs : 0);
        } else {
          setCurrentLesson(null);
          setTimeLeft(null);
        }
        setError(null);
      } catch (e) {
        console.error("LessonTimer tick error:", e);
        setError(String(e));
        setCurrentLesson(null);
        setTimeLeft(null);
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const formatClock = (date) => {
    try {
      if (!date) return "--:--:--";
      return date.toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (e) {
      console.error("formatClock error:", e);
      return "--:--:--";
    }
  };

  const formatTimeLeft = (secs) => {
    if (secs == null) return "-- хв -- сек";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m} хв ${String(s).padStart(2, "0")} сек`;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f1724", // темний фон
        color: "#fff",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      {/* Поточний час великим */}
      <div style={{ fontSize: 42, fontWeight: 700, marginTop: 12 }}>
        {formatClock(nowTime)}
      </div>

      {/* Помилка (якщо є) */}
      {error && (
        <div
          style={{
            marginTop: 12,
            background: "#4b1f1f",
            color: "#ffd1d1",
            padding: 8,
            borderRadius: 8,
          }}
        >
          Виникла помилка: {error}
        </div>
      )}

      {/* Поточний урок (блок на приємному оранжевому фоні) */}
      {currentLesson ? (
        <div
          style={{
            marginTop: 18,
            background: "#ffb86b", // приємний оранжевий відтінок
            color: "#111827",
            borderRadius: 18,
            padding: 16,
            width: "100%",
            maxWidth: 420,
            boxShadow: "0 6px 18px rgba(255,184,107,0.18)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700 }}>
            Урок {currentLesson.lesson}
          </div>
          <div style={{ marginTop: 6, fontSize: 16 }}>
            {currentLesson.startStr} — {currentLesson.endStr}
          </div>
          <div style={{ marginTop: 10, fontSize: 18, fontWeight: 600 }}>
            Залишилось: <span>{formatTimeLeft(timeLeft)}</span>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 18, fontSize: 16 }}>
          Зараз перерва або навчальний день завершився 🎉
        </div>
      )}

      {/* Розклад уроків */}
      <div style={{ marginTop: 20, width: "100%", maxWidth: 420 }}>
        <h3 style={{ textAlign: "center", marginBottom: 10 }}>
          Розклад уроків
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {schedule.map((l) => {
            // підсвічуємо поточний урок
            const isActive = currentLesson && currentLesson.lesson === l.lesson;
            return (
              <div
                key={l.lesson}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: isActive
                    ? "rgba(255,184,107,0.12)"
                    : "rgba(255,255,255,0.03)",
                  color: isActive ? "#ffd6a8" : "#d1d5db",
                  fontSize: 15,
                }}
              >
                <div>Урок {l.lesson}</div>
                <div>
                  {l.start} — {l.end}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
