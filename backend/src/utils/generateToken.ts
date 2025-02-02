import jwt from "jsonwebtoken";

const generateToken = (user:any): string => {
  return jwt.sign(user, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "24h",
  });
};

export default generateToken;
