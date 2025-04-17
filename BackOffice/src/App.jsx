import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderRoutes, { routes } from './routes';
import 'react-datepicker/dist/react-datepicker.css';
// ==============================|| APP ||============================== //

const App = () => {
  return <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>{renderRoutes(routes)}</BrowserRouter>;
};

export default App;
