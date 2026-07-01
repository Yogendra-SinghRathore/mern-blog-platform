import { useEffect, useState } from 'react'
import BackButton from '../components/BackButton';
import { useForm } from "react-hook-form"
import Loader from '../components/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { createPost, getPostById, updatePost } from '../services/postService';

function AddPost() {

    const navigate = useNavigate();
    const { postId } = useParams();
    
    console.log(postId);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const { register, handleSubmit, reset, formState: { errors } } = useForm();


    useEffect(() => {

        if (!postId) return;

        const fetchPost = async () => {

            try {

                setLoading(true)

                const response = await getPostById(postId);
                console.log(response.data);

                reset({
                    title: response.data.data.title,
                    content: response.data.data.content,
                });
            } catch (error) {
                setMessage(error?.response?.data?.message || "Failed to load post");
            } finally{
                setLoading(false);
            }
        };

        fetchPost();

    }, [postId, reset]);


    const submitHandler = async (data) => {

        if (loading) return;

        setMessage("");
        setLoading(true);

        try {

            const payload = {
                title: data.title.trim(),
                content: data.content.trim()
            };

            if (postId) {
                await updatePost(postId, payload);
                navigate(`/posts/${postId}`)
            } else {
                await createPost(payload);
                navigate("/")
            }


        } catch (error) {
            console.log(error);
            setMessage(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    if(postId && loading){
        return <Loader/>
    }

    return (
        <div className='addPostPages'>

            {message && (
                <div className=' alert alert-danger mt-3'>{message}</div>
            )}

            <BackButton />
            <form className='addPostForm' onSubmit={handleSubmit(submitHandler)}>
                <div className='input-group'>
                    <label htmlFor="title">Title</label>
                    <input type="text" id='title' placeholder='Enter Title' {...register("title", {
                        required: "Title is required",
                        validate: value => value.trim() !== "" || "Title cannot be empty",
                        minLength: {
                            value: 5,
                            message: "Title must be at least 5 characters"
                        }
                    })} />
                    {errors.title && (<p className='errorMsg'>{errors.title.message}</p>)}
                </div>

                <div className='input-group'>
                    <label htmlFor="content">Content</label>
                    <textarea id='content' placeholder='Enter Content' {...register("content", {
                        required: "Content is required",
                        validate: value => value.trim() !== "" || "Content cannot be empty",
                        minLength: {
                            value: 20,
                            message: "Content must be at least 20 characters"
                        }
                    })} />
                    {errors.content && (<p className='errorMsg'>{errors.content.message}</p>)}
                </div>
                <button type='submit' className='btn btn-primary' disabled={loading}>{loading ? "Saving..." : (postId ? "Update Post" : "Create Post")}</button>
            </form>
        </div>
    )
}

export default AddPost
