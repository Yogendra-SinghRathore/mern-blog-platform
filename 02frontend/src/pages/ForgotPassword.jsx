
import { useState } from 'react';
import { forgotPassword } from '../services/authService';

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await forgotPassword({ email });

      setMessage(response.data.message);

    } catch (error) {
      setMessage(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false)
    }

  };


  return (
    <div className=' container mt-5'>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Forgot Password</h2>

          <form onSubmit={handleSubmit}>

            <div className='mb-3'>
              <label className='form-label'>
                Email
              </label>
              <input type="email" className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <button className='btn btn-primary' disabled={loading} >{loading ? "Sending..." : "Send Reset Link"}</button>

          </form>

          {message && (
            <div className=' alert alert-info mt-3'>{message}</div>
          )}

        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
