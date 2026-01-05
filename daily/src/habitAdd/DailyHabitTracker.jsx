import React, { useEffect, useState } from "react";
import "./HabitForm.css";

const hours = Array.from({ length: 24 }, (_, i) => i + 1);

// Example random colors
const colors = [
  "#4CAF50",
  "#F44336",
  "#FF9800",
  "#2196F3",
  "#9C27B0",
  "#00BCD4",
  "#E91E63",
  "#FFEB3B",
  "#795548",
  "#607D8B",
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const DailyHabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get today's day name
  const today = new Date();
  const todayName = today.toLocaleDateString("en-US", { weekday: "short" });

  useEffect(() => {
    fetch("http://localhost:8081/api/tracker/habit")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch habits");
        return res.json();
      })
      .then((data) => {
        const habitsWithTime = data.map((habit) => ({
          ...habit,
          startHour: habit.startDateTime
            ? new Date(habit.startDateTime).getHours() + 1
            : 6,
          endHour: habit.endDateTime
            ? new Date(habit.endDateTime).getHours() + 1
            : 8,
          color: getRandomColor(),
        }));
        setHabits(habitsWithTime);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error loading habits");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading habits...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container-day">
      <h2>Daily Habit Tracker ({todayName})</h2>

      <table className="day-tracker-table">
        <thead>
          <tr>
            <th>Habit</th>
            {hours.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {habits.map((habit) => (
            <tr key={habit.habitKey}>
              <td>{habit.name}</td>

              {/* 24-hour horizontal timeline */}
              {hours.map((h) => (
                <td
                  key={h}
                  style={{
                    backgroundColor:
                      h >= habit.startHour && h < habit.endHour
                        ? habit.color
                        : "",
                    minWidth: "30px",
                    height: "30px",
                  }}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DailyHabitTracker;
