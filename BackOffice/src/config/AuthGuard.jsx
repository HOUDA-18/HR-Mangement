import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem("user"))||null;
    console.log(user)
    // Gestion des routes publiques
    if (allowedRoles.includes('public')) {
        return user ? <Navigate to="/app/dashboard" replace /> : children;
    }

    // Suite de la logique existante pour les routes protégées
    if (user===null) {
        return <Navigate to="/auth/signin-1" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/not-authorized" replace />;
    }

    return children;
};

export default AuthGuard;