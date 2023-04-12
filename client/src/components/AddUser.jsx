import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { InputRow, InputSelect } from ".";
import { handleUser, passwordChange, registerUser } from "../redux/userSlice";
import { capitalLetter } from "../utils/data";

const AddUser = ({ setToggle }) => {
  const dispatch = useDispatch();
  const { name, password, email, role, isEditing } = useSelector(
    (store) => store.user
  );

  const handleRegister = (e) => {
    const { name, value } = e.target;

    dispatch(handleUser({ name, value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role)
      return toast.error("Please fill all the details");

    if (isEditing) {
      dispatch(passwordChange({ id: name, password }));
      return;
    }

    dispatch(
      registerUser({ name: capitalLetter(name), email, password, role })
    );
  };

  return (
    <div className="add-client">
      <div className="back">
        <button className="btn btn-dark" onClick={() => setToggle(false)}>
          Back
        </button>
        <h3 className="text-center ">
          {isEditing ? "Update User" : "User Registration"}
        </h3>
        <span></span>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-center">
          {!isEditing && (
            <InputRow
              type="text"
              labelText="Name*"
              name="name"
              value={name}
              placeholder="Please provide full name"
              handleChange={handleRegister}
            />
          )}
          <InputRow
            type="email"
            labelText="Email Id*"
            name="email"
            value={email}
            disabled={isEditing}
            handleChange={handleRegister}
          />
          <InputRow
            type="text"
            labelText="Password*"
            name="password"
            value={password}
            placeholder="Password must be 5 characters long"
            handleChange={handleRegister}
          />
          {!isEditing && (
            <InputSelect
              labelText="Role*"
              name="role"
              value={role}
              handleChange={handleRegister}
              list={["Select", "Operator", "Supervisor"]}
            />
          )}
          <button className="btn btn-success" type="submit">
            {isEditing ? "Update" : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddUser;
