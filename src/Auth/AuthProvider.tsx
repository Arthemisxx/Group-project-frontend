import {createContext, useState, type ReactNode, useContext, useEffect} from "react";
import {jwtDecode} from "jwt-decode";

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    isAuthenticated: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    useEffect(() => {
        if(token){
            try{
                const decoded:any = jwtDecode(token);
                const expirationTime = decoded.exp*1000;
                const currentTime = Date.now();

                if(expirationTime < currentTime){
                    logout();
                }else{
                    const remainingTime = expirationTime - currentTime;
                    const timer = setTimeout(()=>{
                        alert("Wylogowano");
                        logout();
                    }, remainingTime);
                    return () => clearTimeout(timer);
                }
            }catch(error){
                logout();
            }
        }
    }, [token]);

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, login, logout , isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth musi być używane wewnątrz AuthProvider");
    }
    return context;
};

