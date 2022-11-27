import { Photos, Users, Comments } from "../models/index.js";

export const createPhoto = async (req, res) => {
  const user = req.user;
  const { title, caption, poster_image_url } = req.body;

  try {
    if (title == null || caption == null || poster_image_url == null) {
      res.status(400).send({
        status: "error",
        message: "title, caption & poster_image_url is required",
      });
      return;
    }

    await Photos.create({
      title: title,
      caption: caption,
      poster_image_url: poster_image_url,
      userId: user.id,
    }).then((data) => {
      delete data.dataValues.createdAt;
      delete data.dataValues.updatedAt;
      res.status(201).send(data);
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

export const showPhotos = async (req, res) => {
  try {
    await Photos.findAll({
      attributes: [
        "id",
        "title",
        "caption",
        "poster_image_url",
        "userId",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Comments,
          attributes: ["comment"],
          nested: true,
          include: {
            model: Users,
            attributes: ["username"],
          },
        },
        {
          model: Users,
          attributes: ["id", "username", "profile_image_url"],
        },
      ],
    }).then((data) => {
      res.status(200).send({ photos: data });
    });
  } catch (e) {
    res.status(400).send({
      status: "error",
      message: e,
    });
  }
};

export const updatePhoto = async (req, res) => {
  const { photoId } = req.params;
  const user = req.user;
  const { title, caption, poster_image_url } = req.body;

  try {
    await Photos.findOne({
      where: { id: photoId, userId: user.id },
    }).then((data) => {
      if (!data) {
        res
          .status(400)
          .send({ status: "error", message: "photo doesn't exist" });
        return;
      }
    });
    if (
      title == null &&
      caption == null &&
      poster_image_url == null
    ) {
      res.status(200).send({
        message: "you don't make changes to anything",
      });
      return;
    } else { 
      await Photos.update(
        {
          title: title,
          caption: caption,
          poster_image_url: poster_image_url,
        },
        { where: { id: photoId, userId: user.id } }
      ).then(async (data) => {
        if (data[0] === 1) {
          await Photos.findOne({
            where: { id: photoId, userId: user.id },
          }).then((data) => {
            if (!data) {
              res
                .status(400)
                .send({ status: "error", message: "photo doesn't exist" });
              return;
            }
            res.status(200).send({
              photo: data,
            });
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

export const deletePhoto = async (req, res) => {
  const { photoId } = req.params;
  const user = req.user;

  try {
    await Photos.findOne({
      where: { id: photoId, userId: user.id },
    }).then((data) => {
      if (!data) {
        res
          .status(400)
          .send({ status: "error", message: "photo doesn't exist" });
        return;
      }
    });
    await Photos.destroy({
      where: { id: photoId, userId: user.id },
      // truncate: true,
    }).then((data) => {
      if (data === 1) {
        res.status(200).send({
          message: "Your photo has been successfully deleted",
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
