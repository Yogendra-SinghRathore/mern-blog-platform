import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "../services/postService";
import Loader from "../components/Loader";

function Dashboard() {

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("-createdAt");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const pages = Array.from({ length: pagination?.totalPages || 0 }, (_, index) => index + 1);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  }

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  }

  useEffect(() => {

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);

  },[search])



  useEffect(() => {

    const fetchPosts = async () => {

      try {

        const response = await getAllPosts({ page, search: debouncedSearch, sort });
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
  }, [page, debouncedSearch, sort])

  if (loading) {
    return (
      <Loader />
    )
  }


  if (posts.length === 0) {
    return (
      <div className="emptyState">
        {search ? (
          <h2>No posts found for "{search}"</h2>
        ) : (
          <>
            <h2>No posts yet. Be the first to write one.</h2>
            <Link to="/add-post">
              <button className="btn btn-primary">
                Add Post
              </button>
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="homePage">

      <div className="input-group flex-nowrap d-flex flex-row gap-2 ">
        <input type="text" value={search} onChange={handleSearchChange} placeholder="Search... " />
        <select name="sort" id="sort" value={sort} onChange={handleSortChange}>
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="title">Title A-Z</option>
          <option value="-title">Title Z-A</option>
        </select>
      </div>

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

export default Dashboard;