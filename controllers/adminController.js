import Admin from "../models/Admin.js";
import ShipTo from "../models/ShipTo.js";

export const addService = async (req, res) => {
  const { serviceName, serviceOption, productName } = req.body;
  try {
    if (!serviceName && !productName)
      return res.status(400).json({ msg: "Please provide all values" });

    let company = req.user.company;

    const alreadyExists = await Admin.findOne({
      $and: [
        { serviceName, company },
        { productName, company },
      ],
    });
    if (alreadyExists)
      return res
        .status(400)
        .json({ msg: `Given service/product already exists` });

    req.body.company = company;
    if (serviceName) req.body.serviceOption.sort();
    const service = await Admin.create(req.body);
    return res.status(201).json({ msg: `Service/Product has been added` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const getCompanyServices = async (req, res) => {
  try {
    const services = await Admin.find({ company: req.user.company })
      .select("serviceName serviceOption productName")
      .sort("-createdAt");
    const allShipTo = await ShipTo.find({ company: req.user.company });
    const allServices = services.filter(
      (item) => item.serviceName !== undefined
    );
    const allProducts = services.filter(
      (item) => item.productName !== undefined
    );
    return res.status(200).json({ allServices, allProducts, allShipTo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const editService = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Admin.findById(id);
    if (!service) return res.status(404).json({ msg: "Service not found" });

    if (req.body.serviceOption) req.body.serviceOption.sort();
    await Admin.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ msg: "Service has been updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Admin.findById(id);
    if (!service) return res.status(404).json({ msg: "Service not found" });

    await service.deleteOne();
    return res.status(200).json({ msg: "Service has been deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};
