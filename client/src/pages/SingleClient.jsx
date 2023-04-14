import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AddLocation, InputSelect, Loading } from "../components";
import { setEdit, singleClient } from "../redux/adminSlice";
import { saveAs } from "file-saver";

const SingleClient = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    singleClientDetails,
    singleClientLocations,
    adminLoading,
    page,
    totalPages,
  } = useSelector((store) => store.admin);
  const [search, setSearch] = useState("");
  const [tempSearch, setTempSearch] = useState("");
  const [toggle, setToggle] = useState({
    open: false,
    ser: false,
  });
  const [alreadyService, setAlreadyService] = useState(null);

  const { open, ser } = toggle;

  useEffect(() => {
    dispatch(singleClient({ id, search, page }));

    // eslint-disable-next-line
  }, [open, search, page]);

  const downloadImage = (url, name) => {
    saveAs(url, `${name}.jpg`); // Put your image url here.
  };

  const debounce = () => {
    let timeoutId;
    return (e) => {
      setTempSearch(e.target.value);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSearch(e.target.value);
      }, 1000);
    };
  };

  const optimizedDebounce = useMemo(() => debounce(), []);

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const openEdit = (item) => {
    dispatch(
      setEdit({
        isEditing: true,
        floor: item.floor,
        location: item.location,
        locationId: item._id,
      })
    );

    if (item.services[0].service.serviceName)
      setToggle({ open: true, ser: true });
    else setToggle({ open: true, ser: false });
    setAlreadyService(item.services);
  };

  const addNew = () => {
    setToggle({ open: !open });
    setAlreadyService(null);
    dispatch(
      setEdit({
        isEditing: false,
        locationId: "",
        clientId: "",
        floor: "",
        location: "",
      })
    );
  };

  return (
    <div className="row">
      {adminLoading && <Loading />}
      <div className="col-12 text-center">
        <h4>Client Name: {singleClientDetails.shipToName}</h4>
      </div>
      {!open ? (
        <div className="d-flex justify-content-between">
          <div className="col-md-3">
            <button className="btn btn-success mb-2" onClick={() => addNew()}>
              Add New Location
            </button>
          </div>
          <div className="col-md-4">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search Location"
                value={tempSearch}
                onChange={optimizedDebounce}
              />
            </div>
          </div>
        </div>
      ) : (
        <AddLocation
          clientId={id}
          alreadyService={alreadyService}
          toggle={setToggle}
          ser={ser}
        />
      )}
      {singleClientLocations && (
        <div className="col-12 ">
          <table className="table table-striped table-bordered border-primary">
            <thead>
              <tr>
                <th style={{ width: 150 }} className="text-center">
                  Floor
                </th>
                <th className="text-center">Location</th>
                <th className="text-center">Services / Products</th>
                <th style={{ width: 110 }} className="text-center">
                  QR Code
                </th>
                <th style={{ width: 80 }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {singleClientLocations?.map((item) => (
                <tr key={item._id}>
                  <td>{item.floor}</td>
                  <td>{item.location}</td>
                  <td>
                    {item.services?.map((item) => (
                      <span className="me-1" key={item.service._id}>
                        {item.service.serviceName ||
                          `${item.service.productName} - ${item.count}`}
                        ,
                      </span>
                    ))}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => downloadImage(item.qr, item.location)}
                    >
                      Download
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm me-2"
                      onClick={() => openEdit(item)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav className="d-flex justify-content-center">
            <ul className="pagination">
              {pages.map((item) => (
                <li
                  className={`page-item  ${page === item && "active"}`}
                  key={item}
                >
                  <button
                    className="page-link border border-danger"
                    onClick={(e) =>
                      dispatch(setEdit({ page: Number(e.target.textContent) }))
                    }
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};
export default SingleClient;
