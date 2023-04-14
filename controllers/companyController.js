import Company from "../models/Company.js";
import User from "../models/User.js";

export const registerCompany = async (req, res) => {
  const { companyName, companyAddress, companyContact, companyEmail } =
    req.body;
  try {
    if (!companyName || !companyAddress || !companyContact || !companyEmail)
      return res.status(400).json({ msg: "Please provide all values" });

    const alreadyExists = await Company.findOne({
      $or: [
        { companyName: { $regex: companyName, $options: "i" } },
        { companyEmail },
      ],
    });
    if (alreadyExists)
      return res
        .status(400)
        .json({ msg: `Company name/email id already registered` });

    const company = await Company.create(req.body);

    const user = {
      name: companyName,
      role: "Admin",
      email: companyEmail,
      password: companyEmail,
      company: company._id,
    };

    await User.create(user);

    const companies = await Company.find();
    return res
      .status(201)
      .json({ msg: `${company.companyName} has been registered`, companies });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const allCompanies = async (req, res) => {
  try {
    const companies = await Company.find();

    return res.status(200).json({ companies });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const deleteCompany = async (req, res) => {
  const { id } = req.params;
  try {
    await User.deleteMany({ company: id });
    await Company.findByIdAndDelete(id);

    const companies = await Company.find();
    return res.status(200).json({ msg: "Company has been deleted", companies });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};
