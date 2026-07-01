import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deletePost, getPostById } from '../services/postService';
import Loader from '../components/Loader';
import BackButton from '../components/BackButton';
import AuthContext from "../context/AuthContext";


function PostDetail() {

    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    

    useEffect(() => {

        const fetchPost = async () => {

            try {
                const response = await getPostById(postId);
                setPost(response.data.data);

            } catch (error) {
                setPost(null);
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchPost(postId);

    }, [postId])

    const handlePostDelete = async () => {

        setLoading(true);
        try {
            await deletePost(post._id);
            navigate("/");

        } catch (error) {
            console.log("Delete Post Error:", error);
            setMessage(error?.response?.data?.message || "Something went wrong");

        } finally {
            setLoading(false);
            setShowDeleteModal(false);
        }
    }


    if (loading) {
        return <Loader />;
    }
    return (
        post ? (
            <div className='postDetailPage'>

                {message && (
                    <div className=' alert alert-danger mt-3'>{message}</div>
                )}


                <BackButton />
                <div className="postDetailCard mb-2">
                    <div className='postDetailImage'>
                        <img src="https://picsum.photos/600/400" className="card-img-top" alt="..." />
                    </div>
                    <div className="postDetailBody">

                        {user?._id === post.author._id && (
                            <div className='editDeleteBtnBox'>
                                <Link to={`/edit-post/${postId}`}><button className='btn btn-primary'>Edit</button></Link>
                                <button className='btn btn-danger' onClick={() => setShowDeleteModal(true)}>Delete</button>
                            </div>
                        )}

                        <h1 className="postDetailTitle">{post.title}</h1>
                        <div className="postDetailContent">{post.content}</div>
                    </div>
                </div>
                <BackButton />


                {showDeleteModal && (
                    <div className='deleteModalOverlay'>
                        <div className="deleteModalBox">
                            <h2>Delete Post </h2>
                            <p>This action cannot be undone.</p>
                            <div className="deleteModalBtns">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={handlePostDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}



            </div>
        ) : (null)
    )
}

export default PostDetail;
