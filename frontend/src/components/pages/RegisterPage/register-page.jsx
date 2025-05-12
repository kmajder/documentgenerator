import React, { useState } from 'react';
import { Link } from "react-router-dom";

const RegisterPage = () => {
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    bio: '',
    password: '',
    confirmPassword: '',
    profilePic: '',
    phone: '',
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
    const emptyFields = [];

    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
          emptyFields.push(key)
      }
    }
    
    if (emptyFields.length > 1) {
      setError("Proszę uzupełnić wszystkie pola.");
      return false;
    } else if (emptyFields.length === 1) {
        setError(`Pole ${emptyFields[0]} jest wymagane.`);
        return false;
    }

    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
          setError(`Pole ${key} jest wymagane.`);
          return false;
      }
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Podaj poprawny adres email');
      return false;
    }

    setError('');
    return true
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (checkForm(formData)) {

      try {
        const response = await fetch("http://localhost:8000/users/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
    
        if (response.ok) {
            console.log('User registered successfully:', await response.json());
        } else {
            const errorData = await response.json();
            setError(errorData.message || 'Rejestracja nie powiodła się.');
            console.error('Failed to register user:', errorData);
        }
      } catch (error) {
          setError('Wystąpił błąd podczas rejestracji.');
          console.error('Error during registration:', error);
      }
    }
  };

  return (
    <>
      <div id='mainContainer' className="flex justify-center items-center w-full h-screen bg-cover bg-center" style={{ backgroundImage: 'url("../../Navbar/resources/painting-background-abstract.jpg")'}}>
        <div id='registerForm' className="m-auto inline w-[500px] p-[30px] rounded-[15px] bg-[#F7B32B] shadow-[0_4px_15px_rgba(0,0,0,0.1)] font-poppins opacity-80 transition-transform transition-shadow duration-300 ease-in-out hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]">
          <h2 className="text-[#020122] text-[26px] font-bold text-center mb-[20px]">Zarejestruj się!</h2>
          <form onSubmit={handleSubmit} noValidate>
            
            <div className="mb-[20px]">
              <label className="block mb-[8px] text-[#333] text-[14px]">Nazwa użytkownika:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-[12px] border border-[#cfd8dc] rounded-[8px] bg-[#FAFAFA] transition-all duration-300 focus:border-[#64b5f6] focus:shadow-[0_0_5px_rgba(100,181,246,0.5)] focus:outline-none text-[14px]"
              />
            </div>
          
            {/* Email */}
            <div className="mb-[20px]">
              <label className="block mb-[8px] text-[#333] text-[14px]">E-mail:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-[12px] border border-[#cfd8dc] rounded-[8px] bg-[#FAFAFA] transition-all duration-300 focus:border-[#64b5f6] focus:shadow-[0_0_5px_rgba(100,181,246,0.5)] focus:outline-none text-[14px]"
              />
            </div>

            {/* Full Name */}
            <div className="mb-[20px]">
              <label className="block mb-[8px] text-[#333] text-[14px]">Imię i nazwisko:</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full p-[12px] border border-[#cfd8dc] rounded-[8px] bg-[#FAFAFA] transition-all duration-300 focus:border-[#64b5f6] focus:shadow-[0_0_5px_rgba(100,181,246,0.5)] focus:outline-none text-[14px]"
              />
            </div>

            {/* Bio */}
            <div className="mb-[20px]">
              <label className="block mb-[8px] text-[#333] text-[14px]">Bio:</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full p-[12px] border border-[#cfd8dc] rounded-[8px] bg-[#FAFAFA] transition-all duration-300 focus:border-[#64b5f6] focus:shadow-[0_0_5px_rgba(100,181,246,0.5)] focus:outline-none text-[14px]"
              />
            </div>

            {/* Password */}
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

            {/* Confirm Password */}
            <div className="mb-[20px]">
              <label className="block mb-[8px] text-[#333] text-[14px]">Potwierdź hasło:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-[12px] border border-[#cfd8dc] rounded-[8px] bg-[#FAFAFA] transition-all duration-300 focus:border-[#64b5f6] focus:shadow-[0_0_5px_rgba(100,181,246,0.5)] focus:outline-none text-[14px]"
              />
            </div>

            {/* Profile Picture */}
            <div className="mb-[20px]">
              <label className="block mb-[8px] text-[#333] text-[14px]">Zdjęcie profilowe</label>
              <input
                type="text"
                name="profilePic"
                value={formData.profilePic}
                onChange={handleInputChange}
                className="w-full p-[12px] border border-[#cfd8dc] rounded-[8px] bg-[#FAFAFA] transition-all duration-300 focus:border-[#64b5f6] focus:shadow-[0_0_5px_rgba(100,181,246,0.5)] focus:outline-none text-[14px]"
              />
            </div>

            {/* Phone */}
            <div className="mb-[20px]">
              <label className="block mb-[8px] text-[#333] text-[14px]">Numer telefonu:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-[12px] border border-[#cfd8dc] rounded-[8px] bg-[#FAFAFA] transition-all duration-300 focus:border-[#64b5f6] focus:shadow-[0_0_5px_rgba(100,181,246,0.5)] focus:outline-none text-[14px]"
              />
            </div>
            {error && <p className="text-red-600 mb-[10px]">{error}</p>}
            <button type="submit" className="w-full p-[12px] bg-[#020122] text-white rounded-[8px] text-[16px] font-bold cursor-pointer transition-all duration-300 mt-[10px] hover:bg-[#84a2c5] active:bg-white">Zarejestruj się!</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
