import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div
      className="row d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <h2 className="text-center">Page Not Found / Access Denied</h2>
      <div className="col-1">
        <Link to={"/"} className="btn" type="button">
          Go Back
        </Link>
      </div>
    </div>
  );
};
export default Error;
