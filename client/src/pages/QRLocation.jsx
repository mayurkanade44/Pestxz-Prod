import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { InputRow, InputSelect, Loading, Navbar } from "../components";
import { getLocation } from "../redux/adminSlice";
import { addLocationRecord } from "../redux/reportSlice";

const QRLocation = () => {
  const dispatch = useDispatch();
  const { adminLoading, singleLocation } = useSelector((store) => store.admin);
  const { reportLoading } = useSelector((store) => store.report);
  const [inputField, setInputField] = useState([]);
  const [coordinates, setCoordinates] = useState();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getLocation(id));

    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) =>
      setCoordinates(`${position.coords.latitude},${position.coords.longitude}`)
    );

    if (singleLocation) {
      singleLocation.services?.map((item) =>
        inputField.push({
          serviceId: item.service._id,
          id: item._id,
          serviceName:
            item.service.serviceName ||
            `${item.service.productName} - ${item.count}`,
          action: "",
          value: "",
          comment: "",
          image: null,
        })
      );
    }

    // eslint-disable-next-line
  }, [singleLocation]);

  const handleChange = (index, e) => {
    const { name, value, files } = e.target;

    let data = [...inputField];

    if (name === "image") {
      data[index][name] = files[0];
    } else data[index][name] = value;

    setInputField(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputField.filter((item) => item.action).length < 1) {
      return toast.error("Please select valid service action");
    }

    const form = new FormData();

    form.append("id", " ");
    form.append("serviceId", " ");
    form.append("serviceName", " ");
    form.append("action", " ");
    form.append("value", " ");
    form.append("comment", " ");
    form.append("uploaded", false);
    form.append("image", " ");
    form.append("coordinates", " ");

    inputField.forEach((item) => {
      return (
        form.append("id", item.id),
        form.append("serviceId", item.serviceId),
        form.append("serviceName", item.serviceName),
        form.append("action", item.action || false),
        form.append("value", item.value || " "),
        form.append("comment", item.comment || " "),
        form.append("uploaded", item.image ? true : false),
        form.append("image", item.image ? item.image : false),
        form.append("coordinates", coordinates)
      );
    });

    // for (let item of singleLocation.services) {
    //   if (!state[item.serviceName] || state[item.serviceName] === "Select")
    //     return toast.error("Please select valid service action");
    //   reportData.push({
    //     id: item._id,
    //     serviceName: item.serviceName,
    //     action: state[item.serviceName],
    //   });
    // }

    await dispatch(addLocationRecord({ id, form }));
    setInputField([]);
  };

  if (adminLoading || reportLoading) return <Loading />;

  return (
    <div className="location">
      <Navbar />
      {singleLocation.floor ? (
        <div>
          <div className="details">
            <h5>Floor - {singleLocation.floor}</h5>
            <h5>Location - {singleLocation.location}</h5>
          </div>
          <hr />
          <form className="location-form" onSubmit={handleSubmit}>
            {singleLocation.services?.map((item, index) => {
              return (
                <div key={item._id} className="row">
                  <div className="col-8">
                    <InputSelect
                      labelText={
                        item.service.serviceName ||
                        `${item.service.productName} - ${item.count}`
                      }
                      name="action"
                      qr={true}
                      id={item._id}
                      value={inputField.action}
                      handleChange={(e) => handleChange(index, e)}
                      list={["Select", ...item.service.serviceOption]}
                    />
                  </div>
                  <div className="col-4">
                    <InputRow
                      type="text"
                      labelText="Value"
                      name="value"
                      qr={true}
                      value={item.value}
                      handleChange={(e) => handleChange(index, e)}
                    />
                  </div>
                  <div className="col-8">
                    <InputRow
                      type="text"
                      labelText="Comment"
                      name="comment"
                      qr={true}
                      value={item.value}
                      handleChange={(e) => handleChange(index, e)}
                    />
                  </div>
                  <div className="col-4 mt-2 qr">
                    <label>
                      <input
                        type="file"
                        className="upload"
                        accept="image/*"
                        name="image"
                        onChange={(e) => handleChange(index, e)}
                      />
                      <span className="btn btn-sm">
                        {inputField[index]?.image?.name
                          ? "Uploaded"
                          : "Image Upload"}
                      </span>
                    </label>
                  </div>
                  <hr className="hr" />
                </div>
              );
            })}
            <button
              type="submit"
              className="btn btn-success my-3"
              disabled={reportLoading || inputField.length === 0}
            >
              {reportLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      ) : (
        <h4 className="text-center">
          No Location Found. <br /> Contact Admin
        </h4>
      )}
    </div>
  );
};
export default QRLocation;
