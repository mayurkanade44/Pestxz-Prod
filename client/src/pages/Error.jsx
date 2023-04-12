import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate()
  return (
    <div
      className="row d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <h2 className="text-center">Page Not Found</h2>
      <div className="col-3">
        <button className="btn" type="button" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );
};
export default Error;
