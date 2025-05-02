import React, { useState } from 'react';
import '../styles.css';

function ShipmentStatusCheck() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipmentData, setShipmentData] = useState(null);
  const [error, setError] = useState('');
  const [hover, setHover] = useState(false);
  const [originCity, setOriginCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [estimatedTime, setEstimatedTime] = useState('');

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

  const resultContainerStyle = {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  };

  const handleGeminiAPI = async (trackingNumber) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/shipment/${trackingNumber}`);
      if (!response.ok) {
        throw new Error('Error al consultar la API de Gemini');
      }
      const data = await response.json();
      return {
        tracking_number: data.tracking_number,
        shipment_type: data.shipment_type,
        shipment_description: data.shipment_description,
        origin_city: data.origin_city,
        destination_city: data.destination_city,
        destination_address: data.destination_address,
        status: data.status,
        consignor_name: data.consignor_name,
        consignee_name: data.consignee_name
      };
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Error al obtener datos de la API de Gemini');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Por favor, ingrese un número de guía.');
      return;
    }

    try {
      const shipmentData = await handleGeminiAPI(trackingNumber);
      setShipmentData(shipmentData);
      setError('');
    } catch (error) {
      setError(error.message);
      setShipmentData(null);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={decorationStyle}></div>
      <div style={decoration2Style}></div>
      <div style={formContainerStyle}>
        <h2>Consultar Estado del Envío</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16">
                <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
              </svg>
              Número de Guía:
            </label>
            <input 
              type="text" 
              value={trackingNumber} 
              onChange={(e) => setTrackingNumber(e.target.value)} 
              placeholder="Ingrese el número de guía"
            />
          </div>
          {error && <p style={{ color: 'var(--error-color)', marginTop: '10px' }}>{error}</p>}
          <button 
            type="submit" 
            style={hover ? buttonHoverStyle : buttonStyle} 
            onMouseEnter={() => setHover(true)} 
            onMouseLeave={() => setHover(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            Consultar Estado
          </button>
        </form>

        {shipmentData && (
          <div style={resultContainerStyle}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px', textAlign: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '10px' }}>
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
              </svg>
              Información del Envío
            </h3>
            <p><strong>Número de Guía:</strong> {shipmentData.tracking_number}</p>
            <p><strong>Tipo de Envío:</strong> {shipmentData.shipment_type}</p>
            <p><strong>Descripción:</strong> {shipmentData.shipment_description}</p>
            <p><strong>Ciudad Origen:</strong> {shipmentData.origin_city}</p>
            <p><strong>Ciudad Destino:</strong> {shipmentData.destination_city}</p>
            <p><strong>Dirección de Destino:</strong> {shipmentData.destination_address}</p>
            <p><strong>Estado:</strong> {shipmentData.status}</p>
            <p><strong>Remitente:</strong> {shipmentData.consignor_name}</p>
            <p><strong>Destinatario:</strong> {shipmentData.consignee_name}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShipmentStatusCheck;

const handleGeminiEstimate = async (origin, destination) => {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC0CVdxYHwSvXTEEHbh3W5JC2-Tm-9z61s', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Calculate estimated delivery time from ${origin} to ${destination}` }]
        }]
      }),
    });
    if (!response.ok) {
      throw new Error('Error al consultar la API de Gemini para el tiempo estimado');
    }
    const data = await response.json();
    setEstimatedTime(data.estimated_time || 'No disponible');
  } catch (error) {
    console.error('Error:', error);
    setEstimatedTime('Error al obtener el tiempo estimado');
  }
};

const handleEstimateSubmit = async (e) => {
  e.preventDefault();
  if (!originCity.trim() || !destinationCity.trim()) {
    setError('Por favor, ingrese las ciudades de origen y destino.');
    return;
  }
  setError('');
  await handleGeminiEstimate(originCity, destinationCity);
};

