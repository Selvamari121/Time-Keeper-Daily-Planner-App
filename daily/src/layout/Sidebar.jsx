import { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [habitOpen, setHabitOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);

  return (
    <div className="sidebar">
      <h2 className="logo">Daily Tracker</h2>

      <Link className="menu-item" to="/">
        🏠 Home
      </Link>

      <div className="menu-item" onClick={() => setHabitOpen(!habitOpen)}>
        🧠 Habit <span>{habitOpen ? "▲" : "▼"}</span>
      </div>

      {habitOpen && (
        <div className="submenu">
          <Link to="/habit/create">Create</Link>
          <Link to="/habit/list">List</Link>
        </div>
      )}

      <div className="menu-item" onClick={() => setTrackOpen(!trackOpen)}>
        📊 Track <span>{trackOpen ? "▲" : "▼"}</span>
      </div>

      {trackOpen && (
        <div className="submenu">
          <Link to="/track/day">Day</Link>
          <Link to="/track/month">Month</Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
