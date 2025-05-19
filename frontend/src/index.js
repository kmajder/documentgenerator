// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext.js";
import Layout from './components/Layout/Layout.js';
import App from './App'; // <- Główna strona (Home)
import AboutPage from './components/pages/About/About.jsx';
import LoginPage from './components/pages/LoginPage/login-page.jsx';
import RegisterPage from './components/pages/RegisterPage/register-page.jsx';
import UploadPage from './components/pages/Upload/UploadPage.jsx';
import TemplatesPage from './components/pages/manageTemplates/TemplatesPage.js'; // <- Strona zarządzania szablonami
import AccountPage from './components/pages/AccountPage/AccountPage.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="logout" element={<LoginPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="my-templates" element={<TemplatesPage />} />
            <Route path="account" element={<AccountPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
