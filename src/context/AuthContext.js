import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { getTokenFromCookie } from "../cookieUtils";
const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const retrievedToken = getTokenFromCookie();
    setToken(retrievedToken);

    if (retrievedToken) {
      fetchDataFromBackend(retrievedToken)
        .then((data) => {
          setUserData(data);
          setLoading(false); // Set loading to false when data is fetched
        })
        .catch((error) => {
          console.error("Error fetching data from backend:", error);
          setLoading(false); // Set loading to false even if there's an error
        });
    } else {
      setLoading(false); // Set loading to false if there's no token
    }
  }, []);
  const fetchDataFromBackend = async (token) => {
    try {
      const response = await axios.post("http://localhost:4001/userdetails", {
        token: token,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data from backend:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
