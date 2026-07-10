import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"
import { getCurrentUser, loginUser } from "../services/authService";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      setLoading(true);

      await loginUser({
        email,
        password,
      });

      const response = await getCurrentUser();
      setUser(response.data.data);
      navigate("/")

    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Login</h2>
          <form onSubmit={handleSubmit} className=" mb-2">
            <div className="mb-3">
              <label className="form-label ">Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>
            <button type="submit" className=" btn btn-primary" disabled={loading}>{loading ? "Logging In..." : "Login"}</button>
          </form>
          <div className="linkBox">
            <Link to={"/forgot-password"}>Forgot password</Link> 
            <Link to={"/register"}>Don't have an account?
              Register</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
