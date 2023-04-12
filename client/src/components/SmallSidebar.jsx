import { FaTimes } from "react-icons/fa";
import logo from "../images/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { NavLinks } from ".";
import { toggleSidebar } from "../redux/userSlice";

const SmallSidebar = () => {
  const { isSidebarOpen } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const toggle = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className="small-bar">
      <div
        className={
          isSidebarOpen ? "sidebar-container show-sidebar" : "sidebar-container"
        }
      >
        <div className="content">
          <button className="close-btn" onClick={toggle}>
            <FaTimes />
          </button>
          <img
            src={logo}
            alt="logo"
            style={{ width: 95 }}
            className="mobile-logo"
          />
          <NavLinks toggleSidebar={toggle} />
        </div>
      </div>
    </div>
  );
};
export default SmallSidebar;
