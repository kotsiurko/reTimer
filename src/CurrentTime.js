import React, { useState, useEffect } from "react";

function CurrentTime() {
  const [currentTime, setCurrentTime] = useState(new Date()); // Ініціалізуємо стан поточним часом

  useEffect(() => {
    // Запускаємо таймер для оновлення часу кожну секунду
    const timerId = setInterval(() => {
      setCurrentTime(new Date()); // Оновлюємо стан новим часом
    }, 1000);

    // Функція очищення: зупиняємо таймер при видаленні компонента з DOM
    return () => {
      clearInterval(timerId);
    };
  }, []); // Порожній масив залежностей означає, що ефект запуститься тільки один раз після першого рендеру

  // Форматування часу для зручного відображення
  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <div>
      <p>Поточний час:</p>
      <h1>{formattedTime}</h1>
    </div>
  );
}

export default CurrentTime;
