import { FaAlignLeft, FaUserCircle, FaCaretDown } from "react-icons/fa";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, toggleSidebar } from "../redux/userSlice";
import logo from "../images/logo.png";

const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const toggle = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className="navbar">
      <div className="nav-center">
        <button type="button" className="toggle-btn" onClick={toggle}>
          <FaAlignLeft />
        </button>
        <div>
          <img
            src={logo}
            alt="logo"
            style={{ width: 65 }}
            className="mobile-logo"
          />
        </div>
        <div className="btn-container">
          <button
            type="button"
            className="btn nav-btn"
            onClick={() => setShowLogout(!showLogout)}
          >
            <FaUserCircle className="user-logo" />
            {user.name}
            <FaCaretDown />
          </button>
          <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
            <button
              type="button"
              className="dropdown-btn"
              onClick={() => dispatch(logoutUser())}
            >
              logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
