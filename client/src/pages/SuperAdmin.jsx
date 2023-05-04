import { useDispatch, useSelector } from "react-redux";
import { DeleteModal, InputRow, Loading, Navbar } from "../components";
import {
  deleteCompany,
  getAllCompanies,
  handleSuperAdmin,
  registerCompany,
} from "../redux/superAdminSlice";
import { toast } from "react-toastify";
import { capitalLetter } from "../utils/data";
import { useEffect } from "react";

const SuperAdmin = () => {
  const {
    companyName,
    companyAddress,
    companyEmail,
    companyContact,
    superAdminLoading,
    allCompanies,
  } = useSelector((store) => store.superAdmin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCompanies());

    // eslint-disable-next-line
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!companyName || !companyAddress || !companyEmail || !companyContact)
      return toast.error("Please fill all the details");

    dispatch(
      registerCompany({
        companyName: capitalLetter(companyName),
        companyAddress,
        companyEmail,
        companyContact,
      })
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(handleSuperAdmin({ name, value }));
  };

  return (
    <>
      {superAdminLoading && <Loading />}
      <Navbar />
      <div className="add-client mb-3">
        <div className="container">
          <h3 className="text-center ">Register Company</h3>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-center">
              <InputRow
                type="text"
                labelText="Company Name"
                name="companyName"
                value={companyName}
                handleChange={handleChange}
              />
              <InputRow
                type="text"
                labelText="Company Address"
                name="companyAddress"
                value={companyAddress}
                handleChange={handleChange}
              />
              <InputRow
                type="email"
                labelText="Company Email"
                name="companyEmail"
                value={companyEmail}
                handleChange={handleChange}
              />
              <InputRow
                type="text"
                labelText="Company Contact"
                name="companyContact"
                value={companyContact}
                handleChange={handleChange}
              />
              <button
                type="submit"
                className="btn btn-primary me-2"
                onClick={handleSubmit}
                disabled={superAdminLoading}
              >
                Register Company
              </button>
            </div>
          </form>
          <table className="table table-striped table-bordered border-warning my-3">
            <thead>
              <tr>
                <th className="text-center">Company Name</th>
                <th className="text-center">Company Email</th>
                <th style={{ width: 290 }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {allCompanies?.map((item) => (
                <tr key={item._id}>
                  <td className="text-center">{item.companyName}</td>
                  <td className="text-center">{item.companyEmail}</td>
                  <td className="text-center">
                    <DeleteModal
                      handleDelete={() => {
                        dispatch(deleteCompany(item._id));
                      }}
                      name={item.companyName}
                      title="Company"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default SuperAdmin;
