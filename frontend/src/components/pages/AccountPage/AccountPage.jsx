import React from 'react';
import './AccountPage.css';

const AccountPage = () => {
  // Tymczasowe dane - potem pobierane z backendu
  const user = {
    email: 'jan.kowalski@example.com',
    packageName: 'Pakiet Biznes 2000',
    documentsUsed: 1467,
    documentsLimit: 2000,
  };

  const percentUsed = Math.round((user.documentsUsed / user.documentsLimit) * 100);

  return (
    <div className="account-container">
      <h1>Moje konto</h1>

      <div className="account-info">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Pakiet:</strong> {user.packageName}</p>
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
