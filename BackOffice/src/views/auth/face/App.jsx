import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import routes from './routes';
import Loginface from './views/auth/face/Loginface';
import SignUpface from './views/auth/face/Signupface';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route racine */}
        <Route path="/" element={
          <Container className="mt-5">
            <h1 className="text-center mb-4">Système d'Authentification</h1>
            <div className="text-center">
              <Link to="/auth/face-login">
                <Button variant="primary" size="lg" className="me-2">
                  Connexion Faciale
                </Button>
              </Link>
              <Link to="/auth/face-signup">
                <Button variant="outline-primary" size="lg">
                  Inscription Faciale
                </Button>
              </Link>
            </div>
          </Container>
        } />

        {/* Routes faciales */}
        <Route path="/auth/face-login" element={<Loginface />} />
        <Route path="/auth/face-signup" element={<SignUpface />} />

        {/* Routes existantes */}
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.element}
            exact={route.exact}
          />
        ))}

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;