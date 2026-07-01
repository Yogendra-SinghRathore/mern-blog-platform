import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { getAllPosts } from "../services/postService";
import Loader from "../components/Loader";

function MyPosts() {
    const { user } = useContext(AuthContext);

    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);

    const pages = Array.from({ length: pagination?.totalPages || 0 }, (_, index) => index + 1);

    useEffect(() => {

        const fetchPosts = async () => {

            try {

                const response = await getAllPosts({ author: user._id });
                setPosts(response.data.data.posts);
                setPagination(response.data.data.pagination);

            } catch (error) {
                setPosts([]);
                setPagination(null);
                console.log(error)
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user, page])

    if (loading) {
        return <Loader />;
    }

    if (posts.length === 0) {
        return (
            <div className="emptyState">
                <h1>You don't have any post yet</h1>
                <Link to={'/add-post'}>
                    <button className="btn btn-primary">Add Post</button>
                </Link>
            </div>
        )
    }

    return (
        <div className="homePage">
            <div className="postsGrid">
                {posts.map((post) => (
                    <div key={post._id}>
                        <Link to={`/posts/${post._id}`} className="postLink">
                            <div className="postCard" >
                                <img
                                    src="https://picsum.photos/600/400"
                                    alt={post.title}
                                />

                                <div className="card-body">
                                    <h5 className="card-title">
                                        {post.title}
                                    </h5>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <p className="mt-4 text-center paginationBox">
                <button className=" btn btn-secondary " disabled={!pagination?.hasPrevPage} onClick={() => setPage(prev => prev - 1)}>Previous</button>

                {pages.map((pageNumber) => (
                    <button key={pageNumber} className={page !== pageNumber ? "btn btn-secondary" : "btn btn-info"} onClick={() => setPage(pageNumber)}>{pageNumber}</button>
                ))}

                <button className=" btn btn-secondary" disabled={!pagination?.hasNextPage} onClick={() => setPage(prev => prev + 1)}>Next</button>
            </p>
        </div>
    );
}

export default MyPosts;