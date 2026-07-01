import API from "./api"

export const getAllPosts = (params = {}) => {
    return API.get("/posts", {params});
}
export const getPostById = (id) => {
    return API.get(`/posts/${id}`);
}

export const deletePost = (id) => {
    return API.delete(`/posts/${id}`);
}

export const createPost = (data) => {
    return API.post("/posts", data);
}
export const updatePost = (postId,data) => {
    return API.patch(`/posts/${postId}`, data);
}
