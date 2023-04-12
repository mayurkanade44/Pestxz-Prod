import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { InputRow } from ".";
import { addService, editService } from "../redux/adminSlice";
import { capitalLetter } from "../utils/data";

const AddServiceProduct = ({
  type,
  alreadyService,
  adminLoading,
  isEditing,
  id,
}) => {
  const dispatch = useDispatch();
  const [service, setService] = useState({
    name: "",
    applications: [],
  });
  const [option, setOption] = useState("");

  useEffect(() => {
    if (alreadyService) {
      setService({
        name: alreadyService.name,
        applications: alreadyService.options,
      });
    }

    // eslint-disable-next-line
  }, [alreadyService]);

  const addOptions = (option) => {
    setService((prev) => ({
      ...prev,
      applications: [...prev.applications, capitalLetter(option)],
    }));
    setOption("");
  };

  const removeOption = (option) => {
    setService((prev) => ({
      ...prev,
      applications: prev.applications.filter((item) => item !== option),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!service.name || service.applications.length < 1) {
      toast.error("Please fill out all fields");
      return;
    }

    const form = {};
    if (type === "Product") {
      form.productName = capitalLetter(service.name);
      form.serviceOption = service.applications;
    } else {
      form.serviceName = capitalLetter(service.name);
      form.serviceOption = service.applications;
    }

    if (isEditing) {
      dispatch(
        editService({
          serviceId: id,
          service: form,
        })
      );
      setService({ name: "", applications: [] });
      return;
    }

    dispatch(addService(form));
    setService({ name: "", applications: [] });
  };

  return (
    <div className="add-client">
      <h3 className="text-center ">
        {isEditing ? `Edit ${type}` : `Add ${type}`}
      </h3>
      <form className="form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-4">
            <InputRow
              type="text"
              labelText={`${type} Name`}
              value={service.name}
              handleChange={(e) =>
                setService((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="col-md-4">
            <InputRow
              type="text"
              labelText="Application Options"
              value={option}
              handleChange={(e) => setOption(e.target.value)}
            />
          </div>
          <div className="col-md-2 mt-5">
            <div className="btn-container">
              <button
                className="btn btn-sm"
                onClick={() => addOptions(option)}
                type="button"
              >
                <p style={{ fontWeight: 700 }}>+</p>
              </button>
            </div>
          </div>
          <div className="col-md-12 my-3">
            <h6 className="d-inline">Added Options - </h6>
            {service.applications.map((item) => {
              return (
                <button
                  type="button"
                  className="btn btn-sm btn-primary1 me-2"
                  key={item}
                  onClick={() => removeOption(item)}
                >
                  {item}
                </button>
              );
            })}
          </div>
          <div className="col-md-12 d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-success "
              disabled={adminLoading}
            >
              {isEditing ? "Update" : `Add ${type}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddServiceProduct;
