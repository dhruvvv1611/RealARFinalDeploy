import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
      },
    });

    // setTimeout(() => {
    res.status(200).json(posts);
    // }, 3000);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
            phone: true,
          },
        },
      },
    });

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          // Early return to prevent multiple response attempts
          return res
            .status(200)
            .json({ ...post, isSaved: saved ? true : false });
        } else {
          return res.status(403).json({ message: "Invalid token" });
        }
      });
    } else {
      return res.status(200).json({ ...post, isSaved: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  // Validate postData
  const { postData, postDetail } = body;

  // Check if postData includes images, models, and panoramic images
  if (
    !postData.images ||
    !Array.isArray(postData.images) ||
    !postData.images.every((img) => typeof img === "string")
  ) {
    return res.status(400).json({
      message: "Invalid images format. Expected an array of strings.",
    });
  }

  if (
    !postData.models ||
    !Array.isArray(postData.models) ||
    !postData.models.every((model) => typeof model === "string")
  ) {
    return res.status(400).json({
      message: "Invalid models format. Expected an array of strings.",
    });
  }

  // Validate panoramic images
  if (
    !postData.panoramic ||
    !Array.isArray(postData.panoramic) ||
    !postData.panoramic.every((panoramic) => typeof panoramic === "string")
  ) {
    return res.status(400).json({
      message: "Invalid panoramic images format. Expected an array of strings.",
    });
  }

  try {
    // Create a new post with related post detail
    const newPost = await prisma.post.create({
      data: {
        ...postData,
        userId: tokenUserId,
        postDetail: {
          create: postDetail,
        },
      },
    });

    // Send successful response with the newly created post
    res.status(200).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
};


export const updatePost = async (req, res) => {
  try {
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update posts" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};





export const getCoordinates = async (req, res) => {
  const { id } = req.params;
  try {
    const model = await prisma.model.findUnique({
      where: { id: Number(id) }, // Ensure you're matching the correct type
      select: {
        latitude: true,
        longitude: true,
      },
    });

    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }

    return res.status(200).json(model);
  } catch (error) {
    console.error("Error fetching model coordinates:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
