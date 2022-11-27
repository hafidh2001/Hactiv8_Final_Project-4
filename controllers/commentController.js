import { Comments, Users, Photos } from "../models/index.js";

export const createComment = async (req, res) => {
  const user = req.user;
  const { photoId, comment } = req.body;
  try {
    if (photoId == null || comment == null) {
      res
        .status(400)
        .send({ status: "error", message: "photoId & comment is required" });
      return;
    }

    await Photos.findOne({
      where: { id: Number(photoId) },
    }).then(async (data) => {
      if (!data) {
        res
          .status(400)
          .send({ status: "error", message: "photo doesn't exist" });
        return;
      } else {
        await Comments.create({
          photoId: Number(photoId),
          comment: comment,
          userId: user.id,
        }).then((data) => {
          res.status(201).send({ comment: data });
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

export const showComments = async (req, res) => {
  try {
    await Comments.findAll({
      attributes: [
        "id",
        "userId",
        "photoId",
        "comment",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Photos,
          attributes: ["id", "title", "caption", "poster_image_url"],
        },
        {
          model: Users,
          attributes: ["id", "username", "profile_image_url", "phone_number"],
        },
      ],
      order: [["createdAt", "ASC"]],
    }).then((data) => {
      res.status(200).send({ comments: data });
    });
  } catch (e) {
    res.status(400).send({
      status: "error",
      message: e,
    });
  }
};

export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const user = req.user;
  const { comment } = req.body;
  try {
    await Comments.findOne({
      where: { id: commentId, userId: user.id },
    }).then((data) => {
      if (!data) {
        res
          .status(400)
          .send({ status: "error", message: "comment doesn't exist" });
        return;
      }
    });
    await Comments.update(
      {
        comment: comment,
      },
      { where: { id: commentId, userId: user.id } }
    ).then(async (data) => {
      if (data[0] === 1) {
        await Comments.findOne({
          where: { id: commentId, userId: user.id },
        }).then((data) => {
          if (!data) {
            res
              .status(400)
              .send({ status: "error", message: "comment doesn't exist" });
            return;
          }
          res.status(200).send({
            comment: data,
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

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const user = req.user;
  try {
    await Comments.findOne({
      where: { id: commentId, userId: user.id },
    }).then((data) => {
      if (!data) {
        res
          .status(400)
          .send({ status: "error", message: "comment doesn't exist" });
        return;
      }
    });
    await Comments.destroy({
      where: { id: commentId, userId: user.id },
      // truncate: true,
    }).then((data) => {
      if (data === 1) {
        res.status(200).send({
          message: "Your comment has been successfully deleted",
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
