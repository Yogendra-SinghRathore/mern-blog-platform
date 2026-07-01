import mongoose from "mongoose";
import Post from "../models/post.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const getAllPosts = asyncHandler(async (req, res) => {

  // req.query values are always strings. so parsInt
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const sort = req.query.sort || "-createdAt";
  const author = req.query.author;

  const filter = {};

  if(search){
    filter.title = {
      $regex: search,
      $options: "i",
    };
  }

  if(author){
    if(!mongoose.Types.ObjectId.isValid(author)){
      throw new ApiError(400, "Invalid author id");
    }
    filter.author = author;
  }



  if (page < 1 || limit < 1) {
    throw new ApiError(400, "Page and limit must be greater that 0");
  }

  if(limit > 100){
    throw new ApiError(400, "Limit cannot be greater that 100");
  }

  const skip = (page - 1) * limit;

  const [posts, totalPosts] = await Promise.all([
    Post.find(filter).populate("author", "name").sort(sort).skip(skip).limit(limit),
    Post.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalPosts / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        posts,
        pagination:{
          page,
          limit,
          totalPosts,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      "Posts fetched successfully",
    ),
  );
});

const getPostById = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post id");
  }

  const post = await Post.findById(postId).populate("author", "name");

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post fetched successfully"));
});

const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const author = req.user.userId;

  const post = await Post.create({
    title,
    content,
    author,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        id: post._id,
        title: post.title,
        content: post.content,
      },
      "Post created successfully",
    ),
  );
});

const updatePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post id");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.author.toString() !== req.user.userId) {
    throw new ApiError(403, "Unauthorized User");
  }

  const { title, content } = req.body;

  if (!title && !content) {
    throw new ApiError(400, "At least one field required");
  }

  if ("title" in req.body) {
    if (title.trim() === "") {
      throw new ApiError(400, "Title cannot be empty");
    }
    post.title = title.trim();
  }

  if ("content" in req.body) {
    if (content.trim() === "") {
      throw new ApiError(400, "Content cannot be empty");
    }
    post.content = content.trim();
  }

  await post.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: post._id,
        title: post.title,
        content: post.content,
      },
      "Post updated successfully",
    ),
  );
});

const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post id");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.author.toString() !== req.user.userId) {
    throw new ApiError(403, "Unauthorized User");
  }

  await post.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});

export { getAllPosts, getPostById, createPost, updatePost, deletePost };
