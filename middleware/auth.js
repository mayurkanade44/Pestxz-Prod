import jwt from "jsonwebtoken";

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeaders = req.headers.authorization;
    if (!authHeaders || !authHeaders.startsWith("Bearer"))
      return res.status(401).json({ msg: "Authentication Invalid" });

    const token = authHeaders.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: payload.userId,
      role: payload.role,
      company: payload.company,
    };
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Authentication Invalid" });
  }
};

export const authorizeUser = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ msg: "You don't have permission, please contact admin" });
    }
    next();
  };
};
