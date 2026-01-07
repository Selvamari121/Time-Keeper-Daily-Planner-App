import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ViewAllHabit = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8081/api/tracker/habit")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch habits");
        return res.json();
      })
      .then((data) => {
        setHabits(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error loading habits");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading habits...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <h2>Habit List</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
              #
            </th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
              Name
            </th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
              Description
            </th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
              Start
            </th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
              End
            </th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit, index) => (
            <tr key={habit.habitKey}>
              <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                {index + 1}
              </td>
              <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                {habit.name}
              </td>
              <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                {habit.description}
              </td>
              <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                {habit.startDateTime
                  ? habit.startDateTime.replace("T", " ")
                  : ""}
              </td>
              <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                {habit.endDateTime ? habit.endDateTime.replace("T", " ") : ""}
              </td>
              <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                <button
                  onClick={() => navigate(`/habit/list/edit/${habit.habitKey}`)}
                  style={{ marginRight: "8px" }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
          {habits.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "8px" }}>
                No habits found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAllHabit;
