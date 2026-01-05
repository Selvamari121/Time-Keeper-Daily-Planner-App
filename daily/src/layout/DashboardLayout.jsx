import Sidebar from "./Sidebar";
import "./Dashboard.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content">{children}</div>
    </div>
  );
};

export default DashboardLayout;
