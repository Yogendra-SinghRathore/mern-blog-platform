import { useState } from "react"
import { registerUser } from "../services/authService";
import { Link } from "react-router-dom";



function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await registerUser({ name, email, password });

      setMessage(response.data.message);

      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {
      setMessage(error?.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">

          <h2 className="mb-4">
            Register
          </h2>

          {message && (
            <div className="alert alert-info">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">
                Name
              </label>

              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Email
              </label>

              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Password
              </label>

              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            <button
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Register"}
            </button>

          </form>

          <div className="linkBox mt-3">
            <Link to={"/login"}>Already have an account?
              Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
