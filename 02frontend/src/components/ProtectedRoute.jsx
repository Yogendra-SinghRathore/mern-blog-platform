import { Navigate } from 'react-router-dom'
import AuthContext from "../context/AuthContext";
import { useContext } from 'react';
import Loader from './Loader';

function ProtectedRoute({ children, authentication = true }) {

    const { user, loading } = useContext(AuthContext);

    if (loading) {
       return <Loader/>;
    }

    if (authentication && !user) {
        return <Navigate to="/login" replace />
    }
    return children;
}

export default ProtectedRoute;
