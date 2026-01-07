import React, { useEffect, useState } from "react";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

const MonthlyTracker = () => {
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHabits();
    // eslint-disable-next-line
  }, [year, month]);

  const loadHabits = async () => {
    try {
      setLoading(true);

      // ✅ FIX 1: correct endpoint
      const habitRes = await fetch("http://localhost:8081/api/tracker/habit");

      if (!habitRes.ok) throw new Error("Failed to load habits");

      const habitData = await habitRes.json();

      const enriched = await Promise.all(
        habitData.map(async (h) => {
          const res = await fetch(
            `http://localhost:8081/api/tracker/monthly/${h.habitKey}?year=${year}&month=${month}`
          );

          const data = res.ok ? await res.json() : [];

          return {
            ...h,
            daysDone: data.filter((d) => d.status).map((d) => d.day),
          };
        })
      );

      setHabits(enriched);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = async (habitKey, day) => {
    const habit = habits.find((h) => h.habitKey === habitKey);
    const done = !habit.daysDone.includes(day);

    await fetch(
      `http://localhost:8081/api/tracker/monthly/${habitKey}?year=${year}&month=${month}&day=${day}&done=${done}`,
      { method: "POST" }
    );

    setHabits((prev) =>
      prev.map((h) =>
        h.habitKey === habitKey
          ? {
              ...h,
              daysDone: done
                ? [...h.daysDone, day]
                : h.daysDone.filter((d) => d !== day),
            }
          : h
      )
    );
  };

  if (loading) return <p>Loading...</p>;

  const days = getDaysInMonth(year, month);

  return (
    <div>
      <h2>Monthly Habit Tracker</h2>

      <select value={month} onChange={(e) => setMonth(+e.target.value)}>
        {monthNames.map((m, i) => (
          <option key={i} value={i + 1}>
            {m}
          </option>
        ))}
      </select>

      <select value={year} onChange={(e) => setYear(+e.target.value)}>
        {[2026, 2027, 2028, 2029, 2030].map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <div class="container-day">
        <table class="day-tracker-table">
          <thead>
            <tr>
              <th>Habit</th>
              {[...Array(days)].map((_, i) => (
                <th key={i}>{i + 1}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {habits.map((habit) => (
              <tr key={habit.habitKey}>
                <td>{habit.name}</td>
                {[...Array(days)].map((_, i) => {
                  const day = i + 1;
                  return (
                    <td key={day}>
                      <input
                        type="checkbox"
                        checked={habit.daysDone.includes(day)}
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
