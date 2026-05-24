import jwt from "jsonwebtoken";

export const generateAccessToken = (
  id: number,
  role: string
) => {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
    }
  );
};