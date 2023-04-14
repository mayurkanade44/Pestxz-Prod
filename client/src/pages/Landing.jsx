import main from "../images/sat9.jpg";
import logo from "../images/logo.png";
import { InputRow } from "../components";
import { handleUser, loginUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const { email, password, userLoading, user } = useSelector(
    (store) => store.user
  );
  const { locationId } = useSelector((store) => store.admin);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    let name = e.target.name,
      value = e.target.value;

    dispatch(handleUser({ name, value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (user) {
      if (user.role === "Admin") {
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else if (user.role === "Operator") {
        setTimeout(() => {
          navigate(`/qr-location/${locationId}`);
        }, 1000);
      } else if (user.role === "Super Admin") {
        setTimeout(() => {
          navigate(`/superAdmin`);
        }, 1000);
      }
    }

    // eslint-disable-next-line
  }, [user]);

  return (
    <div className="landing">
      <div className="container page">
        <img src={main} alt="job hunt" className="img main-img" />
        <div className="info">
          <div className="d-flex justify-content-center landing-logo">
            <img src={logo} alt="logo" style={{ width: 160 }} />
          </div>
          <h1 className="text-center my-2">
            Service <span>Tracking</span> Portal
          </h1>
          <form action="submit" className="form" onSubmit={handleSubmit}>
            <InputRow
              type="email"
              name="email"
              value={email}
              handleChange={handleChange}
            />
            <InputRow
              type="password"
              name="password"
              value={password}
              handleChange={handleChange}
            />
            <button
              type="submit"
              className="btn btn-block"
              disabled={userLoading}
            >
              {userLoading ? "loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Landing;
