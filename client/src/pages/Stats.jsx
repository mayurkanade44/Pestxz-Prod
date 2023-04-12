import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Loading } from "../components";
import { getCompanyServices, setEdit } from "../redux/adminSlice";

const Stats = () => {
  const { adminLoading, allClients } = useSelector((store) => store.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCompanyServices());

    // eslint-disable-next-line
  }, []);

  const editDetails = (item) => {
    dispatch(
      setEdit({
        isEditing: true,
        shipToName: item.shipToName,
        shipToAddress: item.shipToAddress,
        shipToEmail: item.shipToEmail,
        shipToNumber: item.shipToNumber,
        locationId: item._id,
      })
    );
  };

  if (adminLoading) return <Loading />;

  return (
    <div className="add-client">
      <div className="row g-3">
        <h4 className="text-center">
          {allClients.length > 0 ? "All Clients" : "No Client"}
        </h4>
        {allClients?.map((item, index) => {
          return (
            <div className="col-md-4" key={item._id}>
              <div
                className={`card text-bg-light text-center ${
                  index % 2 === 0 ? "border-success" : "border-warning"
                }`}
              >
                <div className="card-header" style={{ fontSize: 18 }}>
                  {item.shipToName}
                </div>
                <div className="card-body py-2">
                  <div className="text-start">
                    <p className="card-text mb-0">
                      Address - {item.shipToAddress}
                    </p>
                    <p className="card-text mb-0">Email - {item.shipToEmail}</p>
                    <p className="card-text mb-0">
                      Contact - {item.shipToNumber}
                    </p>
                  </div>
                  <Link
                    to={`/dashboard/client/${item._id}`}
                    className="btn btn-sm btn-primary"
                  >
                    All Sub Locations
                  </Link>
                  <Link
                    to="/dashboard/add-client"
                    className="btn btn-sm ms-2 "
                    onClick={() => editDetails(item)}
                  >
                    Edit Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Stats;
