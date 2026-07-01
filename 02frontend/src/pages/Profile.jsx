import React, { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import { logoutUser, updateAvatar } from '../services/authService';
import { useNavigate } from "react-router-dom"

function Profile() {

  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("avatar", file);

      const response = await updateAvatar(formData);

      setUser(response.data.data);


    } catch (error) {
      alert(error?.response?.data?.message || "Avatar Upload Failed");
    } finally {
      setLoading(false)
    }


  }

  const handleLogout = async () => {

    try {
      await logoutUser();
      setUser(null);
      navigate("/login");

    } catch (error) {
      alert(error?.response?.data?.message || "Logout Failed")
    }
  };


  return (
    <div className=' container mt-5'>

      <h2>Profile</h2>

      <div className=' card p-4'>

        <div className=' text-center'>
          <img src={user?.avatar || "https:via.placeholder.com/150"} alt="Avatar" className=' rounded-circle img-fluid' style={{ width: "150px", height: "150px" }} />
          <div className=' mt-3'>
            <input type="file" className='form-control' accept='image/*' onChange={handleAvatarChange} disabled={loading} />
          </div>
        </div>

        <hr />

        <h5>Name</h5>
        <p>{user?.name}</p>

        <h5>Email</h5>
        <p>{user?.email}</p>

        <hr />

        <button className='btn btn-danger' onClick={handleLogout}>Logout</button>

      </div>

    </div>
  );
}

export default Profile
