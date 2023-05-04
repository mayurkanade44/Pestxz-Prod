import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { setEdit } from "../redux/adminSlice";

const ProtectedRoute = ({ role, children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const { id } = useParams();

  useEffect(() => {
    dispatch(setEdit({ locationId: id }));

    // eslint-disable-next-line
  }, [id]);
  

  if (!user) return <Navigate to="/" />;
  else if (!role.includes(user.role)) {
    return <Navigate to="/access-denied" />;
  }
  return children;
};
export default ProtectedRoute;
