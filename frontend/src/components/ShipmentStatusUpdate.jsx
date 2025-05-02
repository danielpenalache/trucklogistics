import React, { useState } from 'react';
import '../styles.css';

function ShipmentStatusUpdate() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [currentStatus, setCurrentStatus] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [shipmentData, setShipmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hover, setHover] = useState(false);
  const [hoverSearch, setHoverSearch] = useState(false);

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

  const statusContainerStyle = {
    marginTop: '20px',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    display: shipmentData ? 'block' : 'none',
  };

  const messageStyle = {
    padding: '10px',
    marginTop: '10px',
    borderRadius: '4px',
    backgroundColor: message.includes('Error') ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)',
    color: message.includes('Error') ? '#d32f2f' : '#388e3c',
    display: message ? 'block' : 'none',
  };

  const searchShipment = async (e) => {
    e.preventDefault();
    if (!trackingNumber) {
      setMessage('Error: Por favor, ingrese un número de guía.');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/shipment/${trackingNumber}`);
      if (!response.ok) {
        throw new Error('No se encontró el envío con ese número de guía');
      }
      const data = await response.json();
      setShipmentData(data);
      setCurrentStatus(data.status);
      setNewStatus(data.status);
    } catch (error) {
      console.error('Error:', error);
      setMessage(`Error: ${error.message}`);
      setShipmentData(null);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = () => {
    if (!trackingNumber || !newStatus) {
      setMessage('Error: Por favor, complete todos los campos.');
      return;
    }

    if (newStatus === currentStatus) {
      setMessage('El estado seleccionado es el mismo que el actual. No se realizaron cambios.');
      return;
    }

    setLoading(true);
    setMessage('');
    
    const formData = new URLSearchParams();
    formData.append('trackingNumber', trackingNumber);
    formData.append('newStatus', newStatus);
    
    fetch('http://localhost:8080/update-shipment-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error('Error al actualizar el estado del envío: ' + text);
          });
        }
        return response.text();
      })
      .then(data => {
        setMessage('Estado actualizado correctamente');
        setCurrentStatus(newStatus);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setMessage(`Error: ${error.message}`);
        setLoading(false);
      });
  };

  return (
    <div style={containerStyle}>
      <div style={decorationStyle}></div>
      <div style={decoration2Style}></div>
      <div style={formContainerStyle}>
        <h2>Actualización de Estado de Envío</h2>
        
        <div>
          <label>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16">
              <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
              <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
            </svg>
            Número de Guía:
          </label>
          <form onSubmit={searchShipment} style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <input 
              type="text" 
              value={trackingNumber} 
              onChange={(e) => setTrackingNumber(e.target.value)} 
              placeholder="Ingrese el número de guía del envío"
              style={{ 
                flex: '1',
                minWidth: '200px',
                padding: '10px 15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem'
              }} 
              disabled={loading}
            />
            <button 
              type="submit" 
              style={{
                ...hoverSearch ? buttonHoverStyle : buttonStyle,
                minWidth: 'auto',
                padding: '10px 20px',
                whiteSpace: 'nowrap'
              }} 
              onMouseEnter={() => setHoverSearch(true)} 
              onMouseLeave={() => setHoverSearch(false)}
              className="secondary-button"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
              Buscar
            </button>
          </form>
        </div>

        <div style={messageStyle}>
          {message}
        </div>

        {loading && <p>Cargando...</p>}

        <div style={statusContainerStyle}>
          {shipmentData && (
            <>
              <h3>Información del Envío</h3>
              <p><strong>Número de Guía:</strong> {shipmentData.tracking_number}</p>
              <p><strong>Estado Actual:</strong> {currentStatus}</p>
              
              <div>
                <label>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                  </svg>
                  Nuevo Estado:
                </label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="">Seleccione un estado</option>
                  <option value="En preparación">En preparación</option>
                  <option value="En tránsito">En tránsito</option>
                  <option value="Entregado">Entregado</option>
                </select>
              </div>
              
              <button 
                type="button" 
                onClick={updateStatus}
                style={hover ? buttonHoverStyle : buttonStyle} 
                onMouseEnter={() => setHover(true)} 
                onMouseLeave={() => setHover(false)}
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                  <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l-.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                </svg>
                Actualizar Estado
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShipmentStatusUpdate;