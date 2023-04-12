import Company from "../models/Company.js";

export const registerCompany = async (req, res) => {
  const { companyName, companyAddress, companyContact, companyEmail } =
    req.body;
  try {
    if (!companyName || !companyAddress || !companyContact || !companyEmail)
      return res.status(400).json({ msg: "Please provide all values" });

    const alreadyExists = await Company.findOne({ companyName });
    if (alreadyExists)
      return res
        .status(400)
        .json({ msg: `${companyName} company already registered` });

    const company = await Company.create(req.body);
    return res
      .status(201)
      .json({ msg: `${company.companyName} has been registered` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};
