import ShipTo from "../models/ShipTo.js";
import Report from "../models/Report.js";
import Location from "../models/Location.js";

export const addShipTo = async (req, res) => {
  const { shipToName, shipToAddress } = req.body;
  try {
    if (!shipToName || !shipToAddress)
      return res.status(400).json({ msg: "Please provide all values" });

    const alreadyShipTo = await ShipTo.findOne({
      shipToName: { $regex: shipToName, $options: "i" },
      company: req.user.company,
    });
    if (alreadyShipTo)
      return res.status(400).json({ msg: `${shipToName} already exists` });

    req.body.company = req.user.company;
    const shipTo = await ShipTo.create(req.body);

    return res
      .status(201)
      .json({ msg: `${shipTo.shipToName} has been added`, id: shipTo._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const updateShipTo = async (req, res) => {
  const { id } = req.params;
  const { shipToName, shipToAddress } = req.body;
  try {
    if (!shipToName || !shipToAddress)
      return res.status(400).json({ msg: "Please provide all values" });

    const client = await ShipTo.findById(id);
    if (!client)
      return res.status(404).json({ msg: "Selected client not found" });

    await ShipTo.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ msg: "Successfully updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const deleteShipTo = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await ShipTo.findById(id);
    if (!client)
      return res.status(404).json({ msg: "Selected client not found" });

    await Report.deleteMany({ shipTo: id });
    await Location.deleteMany({ shipTo: id });
    await client.deleteOne();

    return res.status(200).json({ msg: "Client Successfully deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};
