import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { resetPassword } from '../services/authService';

function ResetPassword() {

  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setMessage("Password do not match");
    }

    try {
      setLoading(true);

      const response = await resetPassword(token, { password });

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1000);


    } catch (error) {
      setMessage(error?.response?.data?.message || "Password reset Failed");
    } finally {
      setLoading(false)
    }
  };


  return (
    <div className=' container mt-5'>
      <div className=' row justify-content-center'>
        <div className=' col-md-6'>
          <h2>Reset Password</h2>

          <form onSubmit={handleSubmit}>

            <div className='mb-3'>
              <label className=' form-label'>New Password</label>
              <input type="password" className=' form-control' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='mb-3'>
              <label className=' form-label'>Confirm New Password</label>
              <input type="password" className=' form-control' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <button className=' btn btn-primary' disabled={loading}> {loading ? "Resetting" : "Reset Password"} </button>
          </form>

          {message && (
            <div className=' alert alert-info mt-3'>{message}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword