import { BigSidebar, Navbar, SmallSidebar } from "../components";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <main className="dashboard">
      <SmallSidebar />
      <BigSidebar />
      <div>
        <Navbar />
        <div className="dashboard-page">
          <Outlet />
        </div>
      </div>
    </main>
  );
};
export default Dashboard;
