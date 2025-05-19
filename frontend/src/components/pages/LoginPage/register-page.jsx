import React, { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/register", { email, username, password });
      setMessage("Zarejestrowano pomyślnie! Potwierdź założenie konta w wiadomości e-mail.");
    } catch (err) {
      setMessage("Błąd rejestracji: " + err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Rejestracja</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nazwa użytkownika"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button className="bg-green-500 text-white py-2 rounded hover:bg-green-600">Zarejestruj się</button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default RegisterPage;
