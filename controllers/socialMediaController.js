import { SocialMedia, Users } from "../models/index.js";

export const createSocialMedia = async (req, res) => {
  const user = req.user;
  const { name, social_media_url } = req.body;

  try {
    await SocialMedia.create({
      name: name,
      social_media_url: social_media_url,
      userId: user.id,
    }).then((data) => {
      res.status(201).send({ social_media: data });
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

export const showSocialMedias = async (req, res) => {
  try {
    await SocialMedia.findAll({
      attributes: [
        "id",
        "name",
        "social_media_url",
        "userId",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Users,
          attributes: ["id", "username", "profile_image_url"],
        },
      ],
      order: [["createdAt", "ASC"]],
    }).then((data) => {
      res.status(200).send({ social_medias: data });
    });
  } catch (e) {
    res.status(400).send({
      status: "error",
      message: e,
    });
  }
};

export const updateSocialMedia = async (req, res) => {
  const { socialMediaId } = req.params;
  const user = req.user;
  const { name, social_media_url } = req.body;

  try {
    await SocialMedia.findOne({
      where: { id: socialMediaId, userId: user.id },
    }).then((data) => {
      if (!data) {
        res
          .status(400)
          .send({ status: "error", message: "social media doesn't exist" });
        return;
      }
    });
    await SocialMedia.update(
      {
        name: name,
        social_media_url: social_media_url,
      },
      { where: { id: socialMediaId, userId: user.id } }
    ).then(async (data) => {
      if (data[0] === 1) {
        await SocialMedia.findOne({
          where: { id: socialMediaId, userId: user.id },
        }).then((data) => {
          if (!data) {
            res
              .status(400)
              .send({ status: "error", message: "social media doesn't exist" });
            return;
          }
          res.status(200).send({
            social_media: data,
          });
        });
      }
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

export const deleteSocialMedia = async (req, res) => {
  const { socialMediaId } = req.params;
  const user = req.user;

  try {
    await SocialMedia.findOne({
      where: { id: socialMediaId, userId: user.id },
    }).then((data) => {
      if (!data) {
        res
          .status(400)
          .send({ status: "error", message: "social media doesn't exist" });
        return;
      }
    });
    await SocialMedia.destroy({
      where: { id: socialMediaId, userId: user.id },
      // truncate: true,
    }).then((data) => {
      if (data === 1) {
        res.status(200).send({
          message: "Your social media has been successfully deleted",
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
