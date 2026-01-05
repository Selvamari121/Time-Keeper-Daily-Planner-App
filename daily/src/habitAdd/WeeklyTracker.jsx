import React, { useEffect, useState } from "react";
import "./HabitForm.css";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getStartOfWeek = () => {
  const today = new Date();
  const day = today.getDay(); // 0 = Sun
  const diff = today.getDate() - day;
  return new Date(today.setDate(diff));
};

const formatDateKey = (date) => date.toISOString().split("T")[0];

const WeeklyTracker = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const weekStart = getStartOfWeek();

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    const habitRes = await fetch("http://localhost:8081/api/tracker/habit");
    const habitData = await habitRes.json();

    const habitsWithDays = await Promise.all(
      habitData.map(async (habit) => {
        const res = await fetch(
          `http://localhost:8081/api/tracker/weekly/${habit.habitKey}`
        );
        const data = await res.json();

        return {
          ...habit,
          daysDone: data.filter((d) => d.status).map((d) => d.done),
        };
      })
    );

    setHabits(habitsWithDays);
    setLoading(false);
  };

  const toggleDay = async (habitKey, dayIndex) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + dayIndex);

    const dateKey = formatDateKey(date);

    const habit = habits.find((h) => h.habitKey === habitKey);
    const alreadyDone = habit.daysDone.includes(dateKey);
    const newStatus = !alreadyDone;

    await fetch(
      `http://localhost:8081/api/tracker/weekly/${habitKey}?date=${dateKey}&done=${newStatus}`,
      { method: "POST" }
    );

    setHabits((prev) =>
      prev.map((h) =>
        h.habitKey === habitKey
          ? {
              ...h,
              daysDone: newStatus
                ? [...h.daysDone, dateKey]
                : h.daysDone.filter((d) => d !== dateKey),
            }
          : h
      )
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Weekly Habit Tracker</h2>

      <table className="tracker-table">
        <thead>
          <tr>
            <th>Habit</th>
            {days.map((d, i) => (
              <th key={i}>{d}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {habits.map((habit) => (
            <tr key={habit.habitKey}>
              <td>{habit.name}</td>

              {days.map((_, i) => {
                const date = new Date(weekStart);
                date.setDate(weekStart.getDate() + i);
                const dateKey = formatDateKey(date);

                return (
                  <td key={i}>
                    <input
                      type="checkbox"
                      className="circle-checkbox"
                      checked={habit.daysDone.includes(dateKey)}
                      onChange={() => toggleDay(habit.habitKey, i)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyTracker;
