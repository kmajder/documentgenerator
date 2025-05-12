import React, { useState } from 'react';
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  const checkForm = (formData) =>{

    const { username, password } = formData;
    
    if (!username || !password) {
      setError('Wypełnij oba pola.');
      return false;
    }

    setError('');
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
      
    const formBody = new URLSearchParams({
      grant_type: 'password', 
      username: formData.username,
      password: formData.password,
    }).toString();

    if (checkForm(formData)) {

      try {
        const response = await fetch("http://localhost:8000/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formBody,
        });
    
        if (response.ok) {
            console.log('User logged in successfully:', await response.json());
        } else {
            const errorData = await response.json();
            setError(errorData.message || 'Logowanie nie powiodło się.');
            console.error('Failed to login user:', errorData);
        }
      } catch (error) {
          setError('Wystąpił błąd podczas logowania.');
          console.error('Error during login:', error);
      }
    }
  };
  return (
    <>
      <div id='mainContainer' className="flex justify-center items-center w-full h-screen bg-cover bg-center" style={{ backgroundImage: 'url("../../Navbar/resources/painting-background-abstract.jpg")'}}>
      <div id='loginForm' className="inline w-[500px] p-[30px] rounded-[15px] bg-[#F7B32B] shadow-[0_4px_15px_rgba(0,0,0,0.1)] font-poppins opacity-80 transition-transform transition-shadow duration-300 ease-in-out hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]">
          <h2 className="text-[#020122] text-[26px] font-bold text-center mb-[20px]">Zaloguj się</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-[20px]">
              <label className="block mb-[8px] text-[#333] text-[14px]">Nazwa użytkownika:</label>
              <input
                type="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-[12px] border border-[#cfd8dc] rounded-[8px] bg-[#FAFAFA] transition-all duration-300 focus:border-[#64b5f6] focus:shadow-[0_0_5px_rgba(100,181,246,0.5)] focus:outline-none text-[14px]"
              />
            </div>
            <div className="mb-[20px]">
              <label className="block mb-[8px] text-[#333] text-[14px]">Hasło:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-[12px] border border-[#cfd8dc] rounded-[8px] bg-[#FAFAFA] transition-all duration-300 focus:border-[#64b5f6] focus:shadow-[0_0_5px_rgba(100,181,246,0.5)] focus:outline-none text-[14px]"
              />
            </div>
            {error && <p className="text-red-600 mb-[10px]">{error}</p>}
            <p className="text-center">Nie masz konta? <Link to="/register" className="text-[#0D47A1] hover:text-[#1565C0]">Zarejestruj się!</Link></p>
            <button type="submit" className="w-full p-[12px] bg-[#020122] text-white rounded-[8px] text-[16px] font-bold cursor-pointer transition-all duration-300 mt-[10px] hover:bg-[#84a2c5] active:bg-white">Login</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
