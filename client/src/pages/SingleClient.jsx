import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AddLocation, Loading } from "../components";
import { setEdit, singleClient } from "../redux/adminSlice";
import { saveAs } from "file-saver";

const SingleClient = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleClientDetails, singleClientLocations, adminLoading } =
    useSelector((store) => store.admin);

  const [toggle, setToggle] = useState({
    open: false,
    ser: false,
  });
  const [alreadyService, setAlreadyService] = useState(null);

  const { open, ser } = toggle;

  useEffect(() => {
    dispatch(singleClient(id));

    // eslint-disable-next-line
  }, [open]);

  const downloadImage = (url, name) => {
    saveAs(url, `${name}.jpg`); // Put your image url here.
  };

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
        <div className="col-md-3">
          <button className="btn btn-success mb-2" onClick={() => addNew()}>
            Add New Location
          </button>
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
        </div>
      )}
    </div>
  );
};
export default SingleClient;
