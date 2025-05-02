import React, { useState } from 'react';

function GeminiEstimate() {
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [error, setError] = useState('');

  const handleGeminiEstimate = async (origin, destination) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/estimate-time?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
      if (!response.ok) {
        throw new Error('Error al consultar el backend para el tiempo estimado');
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

  return (
    <div>
      <h2>Consultar Tiempo Estimado de Entrega</h2>
      <form onSubmit={handleEstimateSubmit}>
        <div>
          <label>Ciudad Origen:</label>
          <input 
            type="text" 
            value={originCity} 
            onChange={(e) => setOriginCity(e.target.value)} 
            placeholder="Ingrese la ciudad de origen"
          />
        </div>
        <div>
          <label>Ciudad Destino:</label>
          <input 
            type="text" 
            value={destinationCity} 
            onChange={(e) => setDestinationCity(e.target.value)} 
            placeholder="Ingrese la ciudad de destino"
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Consultar</button>
      </form>
      {estimatedTime && <p>Tiempo Estimado: {estimatedTime}</p>}
    </div>
  );
}

export default GeminiEstimate;