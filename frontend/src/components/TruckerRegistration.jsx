import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

function TruckerRegistration() {
  const [name, setName] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [hover, setHover] = useState(false);
  const [hoverSecondary, setHoverSecondary] = useState(false);

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[A-Za-z\s]*$/.test(value)) {
      setName(value);
    }
  };

  const handleIdentityNumberChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*$/.test(value)) {
      setIdentityNumber(value);
    }
  };

  const handleLicenseNumberChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*$/.test(value)) {
      if (value.length <= 12) {
        setLicenseNumber(value);
      }
    }
  };

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
    if (name.trim() === '' || identityNumber.trim() === '' || licenseNumber.trim() === '') {
      alert('Por favor, complete todos los campos.');
      return;
    }
    if (licenseNumber.length !== 12) {
      alert('El número de licencia debe tener exactamente 12 dígitos.');
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register-trucker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ name, identityNumber, licenseNumber }),
      });
      const data = await response.text();
      if (!response.ok) {
        if (data.includes('identity')) {
          throw new Error('La cédula ya está registrada');
        } else if (data.includes('license')) {
          throw new Error('El número de licencia ya está registrado');
        }
        throw new Error('Error al registrar el camionero');
      }
      console.log(data);
      alert('Registro exitoso');
      setName('');
      setIdentityNumber('');
      setLicenseNumber('');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={decorationStyle}></div>
      <div style={decoration2Style}></div>
      <div style={formContainerStyle}>
        <h2>Registro de Camionero</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              </svg>
              Nombre:
            </label>
            <input 
              type="text" 
              value={name} 
              onChange={handleNameChange} 
              placeholder="Ingrese nombre completo"
            />
          </div>
          <div>
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16">
                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z"/>
              </svg>
              Cédula:
            </label>
            <input 
              type="text" 
              value={identityNumber} 
              onChange={handleIdentityNumberChange} 
              placeholder="Ingrese número de identificación"
            />
          </div>
          <div>
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16">
                <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
              </svg>
              Número de Licencia:
            </label>
            <input 
              type="text" 
              value={licenseNumber} 
              onChange={handleLicenseNumberChange} 
              placeholder="Ingrese número de licencia de conducción"
            />
          </div>
          <button 
            type="submit" 
            style={hover ? buttonHoverStyle : buttonStyle} 
            onMouseEnter={() => setHover(true)} 
            onMouseLeave={() => setHover(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 1 1 .001 4A2 2 0 0 1 12 10zm-8 0a2 2 0 1 1 .001 4A2 2 0 0 1 4 10z"/>
            </svg>
            Registrar Camionero
          </button>
          <Link to="/shipment-registration" style={{display: 'block', marginTop: '15px'}}>
            <button 
              type="button" 
              style={hoverSecondary ? buttonHoverStyle : buttonStyle} 
              onMouseEnter={() => setHoverSecondary(true)} 
              onMouseLeave={() => setHoverSecondary(false)}
              className="secondary-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
              Ir a Registro de Envíos
            </button>
          </Link>
          <button 
            type="button" 
            style={hover ? buttonHoverStyle : buttonStyle} 
            onMouseEnter={() => setHover(true)} 
            onMouseLeave={() => setHover(false)} 
            onClick={() => window.location.href='/shipment-status-check'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
              <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
            </svg>
            Ir a Estado de Envío
          </button>
          <Link to="/gemini-estimate" style={{display: 'block', marginTop: '15px'}}>
            <button 
              type="button" 
              style={hoverSecondary ? buttonHoverStyle : buttonStyle} 
              onMouseEnter={() => setHoverSecondary(true)} 
              onMouseLeave={() => setHoverSecondary(false)}
              className="secondary-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
              Ir a Estimación de Gemini
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default TruckerRegistration;