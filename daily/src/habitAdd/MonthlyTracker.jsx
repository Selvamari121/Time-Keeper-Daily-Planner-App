import React, { useEffect, useState } from "react";
import "./HabitForm.css";

const getDaysInMonth = (year, month) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const MonthlyTracker = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = new Date();
  const daysInMonth = getDaysInMonth(today.getFullYear(), today.getMonth());

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const habitRes = await fetch("http://localhost:8081/api/tracker/habit");
      const habitData = await habitRes.json();

      const habitsWithDays = await Promise.all(
        habitData.map(async (habit) => {
          const trackRes = await fetch(
            `http://localhost:8081/api/tracker/monthly/${habit.habitKey}`
          );
          const trackData = await trackRes.json();

          return {
            ...habit,
            daysDone: trackData.filter((t) => t.status).map((t) => t.done), // yyyy-MM-dd
          };
        })
      );

      setHabits(habitsWithDays);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load habits");
      setLoading(false);
    }
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateKey = (date) => date.toISOString().split("T")[0];

  const toggleDay = async (habitKey, day) => {
    const dayKey = formatDateKey(day);

    const habit = habits.find((h) => h.habitKey === habitKey);
    const alreadyDone = habit.daysDone.includes(dayKey);
    const newStatus = !alreadyDone;

    try {
      await fetch(
        `http://localhost:8081/api/tracker/monthly/${habitKey}?date=${dayKey}&done=${newStatus}`,
        { method: "POST" }
      );

      setHabits((prev) =>
        prev.map((h) =>
          h.habitKey === habitKey
            ? {
                ...h,
                daysDone: newStatus
                  ? [...h.daysDone, dayKey]
                  : h.daysDone.filter((d) => d !== dayKey),
              }
            : h
        )
      );
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h2>
        Monthly Habit Tracker (
        {today.toLocaleString("default", { month: "long" })})
      </h2>

      <div style={{ overflowX: "auto" }}>
        <table className="tracker-table">
          <thead>
            <tr>
              <th>Habit</th>
              <th>Start</th>
              <th>End</th>
              {daysInMonth.map((day, i) => (
                <th key={i}>{day.getDate()}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {habits.map((habit) => (
              <tr key={habit.habitKey}>
                <td>{habit.name}</td>
                <td>{formatTime(habit.startDateTime)}</td>
                <td>{formatTime(habit.endDateTime)}</td>

                {daysInMonth.map((day, i) => {
                  const dayKey = formatDateKey(day);
                  return (
                    <td key={i}>
                      <input
                        type="checkbox"
                        className="circle-checkbox"
                        checked={habit.daysDone.includes(dayKey)}
                        onChange={() => toggleDay(habit.habitKey, day)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyTracker;
