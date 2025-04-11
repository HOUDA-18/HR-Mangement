import { createContext, useEffect, useReducer } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch(action.type) {
    case "login": 
      return { 
        user: action.payload.id, 
        role: action.payload.role 
      };
    case "logout":
      return { user: null, role: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    role: null
  });

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const userRole = localStorage.getItem("userRole");
    
    if (userString) {
      try {
        const user = JSON.parse(userString);
        dispatch({ 
          type: "login", 
          payload: { 
            role: userRole || user.role, // Priorité à userRole, sinon user.role
            id: user._id || user.id 
          } 
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};