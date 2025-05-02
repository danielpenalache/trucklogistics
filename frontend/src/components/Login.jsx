import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import '../styles.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hover, setHover] = useState(false);

  // Estilos personalizados para el componente
  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
  };

  const formContainerStyle = {
    position: 'relative',
    zIndex: 1,
  };

  const decorationStyle = {
    position: 'absolute',
    top: '-50px',
    right: '-50px',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'var(--secondary-color)',
    opacity: '0.1',
    zIndex: 0,
  };

  const decoration2Style = {
    position: 'absolute',
    bottom: '-30px',
    left: '-30px',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'var(--primary-color)',
    opacity: '0.1',
    zIndex: 0,
  };

  const buttonStyle = {
    transition: 'var(--transition)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  };
  
  const buttonHoverStyle = {
    ...buttonStyle,
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim() === '' || password.trim() === '') {
      alert('Por favor, complete todos los campos.');
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ username, password }),
      });
      if (response.ok) {
        const data = await response.text();
        localStorage.setItem('token', data);
        alert('Inicio de sesión exitoso');
        if (username.toLowerCase().includes("usuario")) {
          window.location.href = "/shipment-status-check";
          return;
        }
        window.location.href = "/trucker-registration";
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al iniciar sesión: ' + error.message);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={decorationStyle}></div>
      <div style={decoration2Style}></div>
      <div style={formContainerStyle}>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
              </svg>
              Usuario:
            </label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Ingrese su nombre de usuario"
            />
          </div>
          <div>
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
              </svg>
              Contraseña:
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Ingrese su contraseña"
            />
          </div>
          <button 
            type="submit" 
            style={hover ? buttonHoverStyle : buttonStyle} 
            onMouseEnter={() => setHover(true)} 
            onMouseLeave={() => setHover(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
              <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
            </svg>
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;