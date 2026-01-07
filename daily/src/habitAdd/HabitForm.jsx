import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./HabitForm.css"; // import CSS file

const HabitForm = () => {
  const { habitKey } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (habitKey) {
      setFetching(true);
      fetch(`http://localhost:8081/api/tracker/habit/${habitKey}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch habit data");
          return res.json();
        })
        .then((data) => {
          setFormData({
            name: data.name || "",
            description: data.description || "",
            startDateTime: data.startDateTime
              ? data.startDateTime.slice(0, 16)
              : "",
            endDateTime: data.endDateTime ? data.endDateTime.slice(0, 16) : "",
          });
          setFetching(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load habit data");
          setFetching(false);
        });
    }
  }, [habitKey]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = habitKey
      ? `http://localhost:8081/api/tracker/habit/${habitKey}`
      : "http://localhost:8081/api/tracker/habit";
    const method = habitKey ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          habitKey ? "Failed to update habit" : "Failed to create habit"
        );
      }

      alert(habitKey ? "Habit updated ✅" : "Habit created ✅");
      navigate("/habit/create");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p>Loading habit data...</p>;

  return (
    <div className="habit-form-container">
      <h2>{habitKey ? "Edit Habit" : "Create Habit"}</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Habit Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Start Date & Time</label>
          <input
            type="datetime-local"
            name="startDateTime"
            value={formData.startDateTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>End Date & Time</label>
          <input
            type="datetime-local"
            name="endDateTime"
            value={formData.endDateTime}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : habitKey ? "Update Habit" : "Create Habit"}
        </button>
      </form>
    </div>
  );
};

export default HabitForm;
