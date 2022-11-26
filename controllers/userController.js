import jwt from "jsonwebtoken";
import { jwt_secret } from "../config.js";
import { compare } from "../helpers/bcrypt.js";
import { Users, Photos } from "../models/index.js";

export const showUser = async (req, res) => {
  try {
    await Users.findAll({
      attributes: [
        ["id", "no"],
        "full_name",
        "email",
        "username",
        "password",
        "profile_image_url",
        "age",
        "phone_number",
      ],
      include: {
        model: Photos,
        // attributes: ["id", "title", "caption"],
        // required: true,
      },
      order: [["createdAt", "DESC"]],
    }).then((data) => {
      res.status(200).send(data);
    });
  } catch (e) {
    res.status(400).send({
      status: "error",
      message: e,
    });
  }
};

export const registerUser = async (req, res) => {
  const {
    full_name,
    email,
    username,
    password,
    profile_image_url,
    age,
    phone_number,
  } = req.body;

  try {
    if (
      full_name == null ||
      email == null ||
      username == null ||
      password == null ||
      profile_image_url == null ||
      age == null ||
      phone_number == null
    ) {
      res.status(400).send({
        status: "error",
        message:
          "full_name, email, username, password, profile_image_url, age & phone_number are required",
      });
      return;
    }

    await Users.create({
      full_name: full_name,
      email: email,
      username: username,
      password: password,
      profile_image_url: profile_image_url,
      age: age,
      phone_number: phone_number,
    }).then((data) => {
      delete data.dataValues.id;
      delete data.dataValues.password;
      delete data.dataValues.createdAt;
      delete data.dataValues.updatedAt;
      console.log(data.dataValues);
      res.status(201).send({
        user: data,
      });
    });
  } catch (e) {
    res.status(400).send({
      status: "error",
      field: e.errors[0].path,
      value: e.errors[0].value,
      message: e.errors[0].message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email == null || password == null) {
      res
        .status(400)
        .send({ status: "error", message: "email & password are required" });
      return;
    }

    await Users.findOne({ where: { email: email } }).then(async (data) => {
      if (!data) {
        res
          .status(400)
          .send({ status: "error", message: "email does not exist" });
        return;
      }

      if (!(await compare(password, data.password))) {
        res
          .status(400)
          .send({ status: "error", message: "password does not match" });
        return;
      } else {
        delete data.dataValues.password;
        // console.log(data.dataValues);
        const token = jwt.sign({ ...data.dataValues }, jwt_secret, {
          expiresIn: "24h",
        });
        res.status(200).send({ token: token });
      }
    });
  } catch (e) {
    res.status(400).send(e);
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const user = req.user;
  const { full_name, email, username, profile_image_url, age, phone_number } =
    req.body;
  try {
    if (Number(userId) !== user.id) {
      res
        .status(401)
        .send({ status: "error", message: "authorization failed" });
      return;
    }

    if (
      full_name == null &&
      email == null &&
      username == null &&
      profile_image_url == null &&
      age == null &&
      phone_number == null
    ) {
      res.status(200).send({
        message: "you don't make changes to anything",
      });
      return;
    } else {
      await Users.update(
        {
          full_name: full_name,
          email: email,
          username: username,
          profile_image_url: profile_image_url,
          age: age,
          phone_number: phone_number,
        },
        {
          where: {
            id: user.id,
          },
          hooks: false,
        }
      ).then((data) => {
        if (data[0] === 1) {
          res.status(200).send({
            user: req.body,
          });
        }
      });
    }
  } catch (e) {
    res.status(400).send({
      status: "error",
      field: e.errors[0].path,
      value: e.errors[0].value,
      message: e.errors[0].message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const user = req.user;

  try {
    if (Number(userId) !== user.id) {
      res
        .status(401)
        .send({ status: "error", message: "authorization failed" });
      return;
    }
    await Users.destroy({
      where: {
        id: user.id,
      },
      // truncate: true,
    }).then((data) => {
      if (data === 1) {
        res.status(200).send({
          message: "Your account has been successfully deleted",
        });
      }
    });
  } catch (e) {
    res.status(400).send({
      status: "error",
      message: e,
    });
  }
};
