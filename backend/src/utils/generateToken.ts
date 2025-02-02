import jwt from "jsonwebtoken";

const generateToken = (user: any): string => {
  try {
    return jwt.sign(user, "kishansharma", {
      expiresIn: "24h",
    });
  } catch (error) {
    console.log(error);
    console.log(JSON.stringify(error));
    throw error;
  }
};

export default generateToken;
