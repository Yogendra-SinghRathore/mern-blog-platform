import { useNavigate, useParams } from 'react-router-dom';
import { verifyEmail } from '../services/authService';
import { useEffect, useState } from 'react';

function VerifyEmail() {

  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  useEffect(() => {

    const verify = async () => {

      try {

        const response = await verifyEmail(token);

        setSuccess(true);
        setMessage(response.data.message);

      } catch (error) {
        setSuccess(false);
        setMessage(
          error?.response?.data?.message ||
          "Verification Failed"
        );
      } finally {
        setLoading(false);
      }
    };

    verify();

  }, [token])



  return (
    <div className="container mt-5">

      <h2>Email Verification</h2>

      {loading ? (
        <p>Verifying...</p>
      ) : (
        <>
          <div className="alert alert-info">
            {message}
          </div>
          {success && (
            <button onClick={() => navigate("/login")}>Go to Login</button>
          )}
        </>
      )}

    </div>
  )
}

export default VerifyEmail;
