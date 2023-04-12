import NavLinks from "./NavLinks";
import { useSelector } from "react-redux";

const BigSidebar = () => {
  const { isSidebarOpen } = useSelector((store) => store.user);
  return (
    <div className="big-bar">
      <div
        className={
          isSidebarOpen
            ? "sidebar-container "
            : "sidebar-container show-sidebar"
        }
      >
        <div className="content">
          <header></header>
          <NavLinks />
        </div>
      </div>
    </div>
  );
};
export default BigSidebar;
