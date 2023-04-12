import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddServiceProduct, Loading, ServProdTable } from "../components";
import { getCompanyServices, setEdit } from "../redux/adminSlice";
import { useParams } from "react-router-dom";

const ServiceProduct = () => {
  const {
    adminLoading,
    companyServices,
    companyProducts,
    isEditing,
    locationId,
  } = useSelector((store) => store.admin);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [alreadyService, setAlreadyService] = useState({
    name: "",
    options: [],
    type: "",
  });

  const { type } = alreadyService;

  useEffect(() => {
    dispatch(getCompanyServices());
    dispatch(setEdit({ isEditing: false }));

    if (id === "products")
      setAlreadyService({ name: "", options: [], type: "Product" });
    else setAlreadyService({ name: "", options: [], type: "Service" });

    // eslint-disable-next-line
  }, [id]);

  const openEdit = (item) => {
    dispatch(
      setEdit({
        locationId: item._id,
        isEditing: true,
      })
    );
    setAlreadyService((prev) => ({
      ...prev,
      name: item.serviceName || item.productName,
      options: item.serviceOption,
    }));
  };

  return (
    <div>
      {adminLoading && <Loading />}
      <AddServiceProduct
        type={type}
        alreadyService={alreadyService}
        adminLoading={adminLoading}
        isEditing={isEditing}
        id={locationId}
      />
      <ServProdTable
        type={type}
        data={type === "Product" ? companyProducts : companyServices}
        openEdit={openEdit}
      />
    </div>
  );
};
export default ServiceProduct;
