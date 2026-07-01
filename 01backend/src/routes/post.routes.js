import {Router} from "express"
import { createPost, deletePost, getAllPosts, getPostById, updatePost } from "../controllers/post.controller.js"
import auth from "../middleware/auth.middleware.js";
import validateRequiredFields from "../middleware/validateRequiredFields.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

router.get("/",getAllPosts);
router.get("/:id",getPostById);
router.post("/", auth, validateRequiredFields(["title", "content"]) , createPost)
router.patch("/:id", auth, updatePost)
router.delete("/:id", auth, deletePost)

export default router