import jwt from "jsonwebtoken";
import { jwt_secret } from "../config.js";
import Users from "../models/User.js";

export const authentication = async (req, res, next) => {
  // get authorization token
  const { authorization } = req.headers;
  try {
    // check if token exists
    if (!authorization) {
      res.status(401).json({
        status: "error",
        message: "failed to access, credentials not found",
      });
      return;
    }
    // split token
    const token = authorization.split("Bearer ");
    // verify token using jwt
    const decode = jwt.verify(token[1], jwt_secret);
    delete decode.iat;
    delete decode.exp;
    // check decode token with user data
    await Users.findOne({ where: { id: decode.id, email: decode.email } }).then(
      (data) => {
        // check if user is exist
        if (!data) {
          res
            .status(401)
            .json({ status: "error", message: "authorization failed" });
          return;
        }
        delete data.dataValues.password;
        // so that when data updates occur (except email) users do not need to re-login because the data will always match
        req.user = { ...data.dataValues };
      }
    );
    next();
  } catch (error) {
    next(error);
  }
};
