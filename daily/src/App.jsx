import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import HabitForm from "./habitAdd/HabitForm";
import ViewAllHabit from "./habitAdd/ViewAllHabit";
import WeeklyTracker from "./habitAdd/WeeklyTracker";
import MonthlyTracker from "./habitAdd/MonthlyTracker";
import DailyHabitTracker from "./habitAdd/DailyHabitTracker";
import "./habitAdd/HabitForm.css";

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/habit/create" element={<HabitForm />} />
          <Route path="/habit/list" element={<ViewAllHabit />} />
          <Route path="/track/day" element={<DailyHabitTracker />} />
          <Route path="/track/week" element={<WeeklyTracker />} />
          <Route path="/track/month" element={<MonthlyTracker />} />
          <Route path="/habit/list/edit/:habitKey" element={<HabitForm />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
