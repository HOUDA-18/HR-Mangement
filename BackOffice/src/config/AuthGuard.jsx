import { Navigate } from 'react-router-dom';
const AuthGuard = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user info

    if (!user) {
        return <Navigate to="/auth/signin-1" />; // Redirect if not logged in
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/not-authorized" />; // Redirect if unauthorized
    }

    return children;
};

export default AuthGuard;
