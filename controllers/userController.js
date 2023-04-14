import User from "../models/User.js";

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !password || !email || !role)
      return res.status(400).json({ msg: "Please provide all values" });

    const alreadyUser = await User.findOne({
      email,
      company: req.user.company,
      active: true,
    });
    if (alreadyUser)
      return res.status(400).json({ msg: "Email id already exists" });

    req.body.company = req.user.company;

    const user = await User.create(req.body);
    const users = await User.find({
      company: req.user.company,
      active: true,
    })
      .select("-password")
      .populate({
        path: "company",
        select: "companyName companyAddress companyContact companyEmail",
      });

    res.status(201).json({ msg: `${user.name} has been registered`, users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!password || !email)
      return res.status(400).json({ msg: "Please provide all values" });

    const user = await User.findOne({ email, active: true });
    if (!user) return res.status(401).json({ msg: "Invalid Credentials" });

    const comparePassword = await user.comparePassword(password);
    if (!comparePassword)
      return res.status(401).json({ msg: "Invalid Credentials" });

    const token = await user.createJWT();

    res.status(200).json({
      user: {
        name: user.name,
        role: user.role,
        userId: user._id,
        token: token,
      },
      msg: `Welcome ${user.name}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const allUsers = async (req, res) => {
  try {
    const users = await User.find({ company: req.user.company, active: true })
      .select("-password")
      .populate({
        path: "company",
        select: "companyName companyAddress companyContact companyEmail",
      });
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.active = false;
    await user.save();

    const users = await User.find({
      company: req.user.company,
      active: true,
    })
      .select("-password")
      .populate({
        path: "company",
        select: "companyName companyAddress companyContact companyEmail",
      });

    res.status(200).json({ msg: `${user.name} has been removed`, users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const changePassword = async (req, res) => {
  const { password } = req.body;
  const { id } = req.params;
  console.log(req.body);
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.password = password;
    await user.save();

    res.status(200).json({ msg: "Password successfully updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};
