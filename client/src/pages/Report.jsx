import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { InputRow, InputSelect, Loading } from "../components";
import { getCompanyServices, singleClient } from "../redux/adminSlice";
import { createReport } from "../redux/reportSlice";
import { getAllUsers } from "../redux/userSlice";

const Report = () => {
  const [location, setLocation] = useState([]);
  const [reportField, setReportField] = useState({
    client: "",
    subLocation: "",
    service: "",
    fromDate: "",
    toDate: "",
    user: "",
  });
  const { client, subLocation, service, fromDate, toDate, user } = reportField;

  const dispatch = useDispatch();
  const { allClients, companyServices, singleClientLocations } = useSelector(
    (store) => store.admin
  );
  const { reportLoading, download } = useSelector((store) => store.report);
  const { allUsers } = useSelector((store) => store.user);

  useEffect(() => {
    dispatch(getCompanyServices());
    dispatch(getAllUsers());

    if (client && client !== "Select") {
      dispatch(singleClient(client));
    }

    // eslint-disable-next-line
  }, [client]);

  useEffect(() => {
    setLocation([]);
    singleClientLocations.map((item) => {
      const loc = location.some(
        (i) => i === `${item.floor} / ${item.location}`
      );
      if (!loc) {
        setLocation((location) => [
          ...location,
          { name: `${item.floor} / ${item.location}`, _id: item._id },
        ]);
      }
      return null;
    });

    // eslint-disable-next-line
  }, [singleClientLocations]);

  const handleSearch = (e) => {
    const { name, value } = e.target;
    setReportField({ ...reportField, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!client || !fromDate || !toDate)
      return toast.error("Please select all required fields");

    dispatch(
      createReport({ client, subLocation, service, fromDate, toDate, user })
    );
  };

  return (
    <div className="add-client">
      {reportLoading && <Loading />}
      <form className="form">
        <h4 className="text-center">Report Generation Form</h4>
        <div className="form-center">
          <InputSelect
            labelText="Client Name*"
            name="client"
            value={client}
            handleChange={handleSearch}
            list={["Select", ...allClients]}
          />
          <InputRow
            type="date"
            labelText="From Date*"
            name="fromDate"
            value={fromDate}
            handleChange={handleSearch}
          />
          <InputRow
            type="date"
            labelText="To Date*"
            name="toDate"
            value={toDate}
            handleChange={handleSearch}
          />
          {/* search by type*/}
          <InputSelect
            labelText="Floor / Location"
            name="subLocation"
            value={subLocation}
            handleChange={handleSearch}
            list={["All", ...location]}
          />
          <InputSelect
            labelText="Service"
            name="service"
            value={service}
            handleChange={handleSearch}
            list={["All", ...companyServices]}
          />
          <InputSelect
            labelText="User"
            name="user"
            value={user}
            handleChange={handleSearch}
            list={["All", ...allUsers]}
          />
          <button
            className="btn btn-primary mt-3"
            onClick={handleSubmit}
            disabled={reportLoading}
          >
            {reportLoading ? "Generating Report..." : "Generate Report"}
          </button>
          {download && (
            <button
              className="btn btn-success mt-3"
              disabled={download ? false : true}
            >
              <a
                href={download}
                style={{ textDecoration: "none", color: "white" }}
              >
                Download Report
              </a>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
export default Report;
