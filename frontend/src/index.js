// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Layout from './components/Layout/Layout.js';
import App from './App'; // <- Główna strona (Home)
import AboutPage from './components/pages/About/About.jsx';
import LoginPage from './components/pages/LoginPage/login-page.jsx';
import RegisterPage from './components/pages/RegisterPage/register-page.jsx';
import UploadPage from './components/pages/Upload/UploadPage.jsx';
import TemplatesPage  from './components/pages/manageTemplates/TemplatesPage.js'; // <- Strona zarządzania szablonami
import AccountPage from './components/pages/AccountPage/AccountPage.jsx';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <App /> },
      { path: '/register', element: <RegisterPage/> },
      { path: '/sprzedaj-iphone', element: <LoginPage/> },
      { path: '/about', element: <AboutPage/> },
      { path: '/upload', element: <UploadPage/> },
      { path: '/my-templates', element: <TemplatesPage/> },
      { path: '/account', element: <AccountPage/> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
