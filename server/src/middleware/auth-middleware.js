import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  if (!token) {
    res
      .status(401)
      .json({
        errors: "Unauthorized",
      })
      .end();
  } else {
    const secret = process.env.JWT_SECRET_KEY;
    try {
      const jwtDecode = jwt.verify(token, secret);
      req.user = jwtDecode;
      next();
    } catch (e) {
      res
        .status(401)
        .json({
          error: e,
          message: "Unauthorized",
        })
        .end();
    }
  }
};
