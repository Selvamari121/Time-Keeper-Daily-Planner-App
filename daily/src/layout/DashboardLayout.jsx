import Sidebar from "./Sidebar";
import "./Dashboard.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <div className="page-container">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
