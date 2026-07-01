import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const fetchUser = async () => {
            try {
                const response = await getCurrentUser();
                setUser(response.data.data);
            } catch (error) {
                setUser(null);  
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();

    }, [] );

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
