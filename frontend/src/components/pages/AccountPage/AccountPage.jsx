import React from 'react';
import './AccountPage.css';
import { useAuth } from '../../../context/AuthContext'; // ścieżkę dostosuj do struktury projektu

const AccountPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="account-container"><p>Ładowanie danych użytkownika...</p></div>;
  }

  const percentUsed = user.documentsLimit
    ? Math.round((user.documentsUsed / user.documentsLimit) * 100)
    : 0;

  return (
    <div className="account-container">
      <h1>Moje konto</h1>

      <div className="account-info">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Pakiet:</strong> {user.plan}</p>
        <p><strong>Zużycie:</strong> {user.documentsUsed} / {user.documentsLimit} dokumentów</p>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percentUsed}%` }}>
            {percentUsed}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
