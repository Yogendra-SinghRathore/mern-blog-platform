import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { logoutUser } from "../services/authService";

function Navbar() {

    const { user, setUser } = useContext(AuthContext);

    const navLinks = [
        {
            content: 'Home', link: '/', active: true,
        },
        {
            content: 'Login', link: '/login', active: !user,
        },
        {
            content: 'SignUp', link: '/register', active: !user,
        },
        {
            content: 'My Posts', link: '/my-posts', active: user,
        },
        {
            content: 'Add Post', link: '/add-post', active: user,
        }
    ]

    const navigate = useNavigate();

    const handleLogout = async () => {

        try {
            await logoutUser();
            setUser(null);
            navigate("/login");

        } catch (error) {
            alert(error?.response?.data?.message || "Logout Failed")
        }
    };


    const closeMenu = () => {
        const menu = document.getElementById('navbarSupportedContent');
        menu.classList.remove('show')
    }



    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <div className="container-fluid">

                <Link className="navbar-brand" to="/" onClick={closeMenu}>
                    BlogApp
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">

                    <ul className="navbar-nav me-auto">
                        {navLinks.map((navLink) => (
                            navLink.active ? (
                                <li className="nav-item" key={navLink.content}>
                                    <Link onClick={closeMenu} className="nav-link" to={navLink.link}>
                                        {navLink.content}
                                    </Link>
                                </li>
                            ) : (null)
                        ))}
                    </ul>

                    {user ? (<>
                        <span className="navbar-text text-white me-3">
                            <button
                                className="btn btn-outline-light "
                                onClick={() => navigate("/profile")}
                            >
                                {user?.name}
                            </button>
                        </span>

                        <button
                            className="btn btn-outline-danger"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>) : (<></>)}

                </div>

            </div>

        </nav>

    );

}

export default Navbar;