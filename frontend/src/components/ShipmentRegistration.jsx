import React, { useState, useEffect } from 'react';
import '../styles.css';
import ShipmentStatusUpdate from './ShipmentStatusUpdate';
import ShipmentStatusCheck from './ShipmentStatusCheck';

function ShipmentRegistration() {
  const [activeTab, setActiveTab] = useState('register'); // 'register', 'update' o 'check'
  const [shipmentType, setShipmentType] = useState('');
  const [shipmentDescription, setShipmentDescription] = useState('');
  const [trucker, setTrucker] = useState('');
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [status, setStatus] = useState('');
  const [consignorName, setConsignorName] = useState('');
  const [consigneeName, setConsigneeName] = useState('');
  const [truckers, setTruckers] = useState([]);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [generatedTrackingNumber, setGeneratedTrackingNumber] = useState('');
  const [pdfPath, setPdfPath] = useState('');
  const [hover, setHover] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartmentOrigin, setSelectedDepartmentOrigin] = useState('');
  const [selectedDepartmentDestination, setSelectedDepartmentDestination] = useState('');
  const [citiesOrigin, setCitiesOrigin] = useState([]);
  const [citiesDestination, setCitiesDestination] = useState([]);
  const [destinationAddress, setDestinationAddress] = useState('');
  
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
  
  const formStyle = {
    maxWidth: '700px',
  };

  useEffect(() => {
    // Cargar camioneros
    fetch('http://localhost:8080/truckers')
      .then(response => response.json())
      .then(data => setTruckers(data))
      .catch(error => console.error('Error fetching truckers:', error));

    // Cargar departamentos y ciudades
    fetch('http://localhost:8080/colombian-locations')
      .then(response => response.json())
      .then(data => setDepartments(data.departments))
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  useEffect(() => {
    if (selectedDepartmentOrigin) {
      const dept = departments.find(d => d.name === selectedDepartmentOrigin);
      setCitiesOrigin(dept ? dept.cities : []);
      setOriginCity('');
    }
  }, [selectedDepartmentOrigin, departments]);

  useEffect(() => {
    if (selectedDepartmentDestination) {
      const dept = departments.find(d => d.name === selectedDepartmentDestination);
      setCitiesDestination(dept ? dept.cities : []);
      setDestinationCity('');
    }
  }, [selectedDepartmentDestination, departments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!shipmentType || !shipmentDescription || !trucker || !originCity || !destinationCity || !status || !consignorName || !consigneeName || !destinationAddress) {
      alert('Por favor, complete todos los campos.');
      return;
    }
    console.log('Datos del envío:', {
        shipmentType,
        shipmentDescription,
        trucker,
        originCity,
        destinationCity,
        status,
        consignorName,
        consigneeName
    });
    
    const formData = new URLSearchParams();
    formData.append('shipmentType', shipmentType);
    formData.append('shipmentDescription', shipmentDescription);
    formData.append('trucker', trucker);
    formData.append('originCity', originCity);
    formData.append('destinationCity', destinationCity);
    formData.append('destinationAddress', destinationAddress);
    formData.append('status', status);
    formData.append('consignorName', consignorName);
    formData.append('consigneeName', consigneeName);
    
    fetch('http://localhost:8080/register-shipment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    })
      .then(response => {
        console.log('Server response:', response);
        if (!response.ok) {
          console.error('Error en la respuesta:', response.status, response.statusText);
          return response.text().then(text => {
            throw new Error('Error al registrar el envío: ' + text);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Respuesta exitosa:', data);
        setGeneratedTrackingNumber(data.trackingNumber);
        setPdfPath(data.pdfPath);
        setReceiptVisible(true);
      })
      .catch(error => {
        console.error('Error completo:', error);
        alert('Error al registrar el envío: ' + error.message);
      });
  };

  // Estilos para las pestañas
  const tabsContainerStyle = {
    display: 'flex',
    marginBottom: '20px',
    borderBottom: '1px solid var(--border-color)',
  };

  const tabStyle = {
    padding: '10px 20px',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'var(--transition)',
  };

  const activeTabStyle = {
    ...tabStyle,
    borderBottom: '2px solid var(--primary-color)',
    color: 'var(--primary-color)',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>
      <div style={decorationStyle}></div>
      <div style={decoration2Style}></div>
      <div style={formContainerStyle}>
        <div style={tabsContainerStyle}>
          <div 
            style={activeTab === 'register' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('register')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16" style={{marginRight: '5px'}}>
              <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0z"/>
            </svg>
            Registro de Envío
          </div>
          <div 
            style={activeTab === 'update' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('update')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16" style={{marginRight: '5px'}}>
              <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
            </svg>
            Actualizar Estado
          </div>
          <div 
            style={activeTab === 'check' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('check')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16" style={{marginRight: '5px'}}>
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            Verificar Estado
          </div>
        </div>
        
        {activeTab === 'register' ? (
          <>
            <h2>Registro de Envío</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div>
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16">
                <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
              </svg>
              Tipo de Envío:
            </label>
            <select value={shipmentType} onChange={(e) => setShipmentType(e.target.value)}>
              <option value="">Seleccione un tipo</option>
              <option value="Paquete">Paquete</option>
              <option value="Documento">Documento</option>
              <option value="Mercancía">Mercancía</option>
            </select>
          </div>
          <div>
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16">
                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
              </svg>
              Descripción:
            </label>
            <textarea 
              value={shipmentDescription} 
              onChange={(e) => setShipmentDescription(e.target.value)}
              placeholder="Describa el contenido del envío"
            ></textarea>
          </div>
          <div>
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16">
                <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 1 1 .001 4A2 2 0 0 1 12 10zm-8 0a2 2 0 1 1 .001 4A2 2 0 0 1 4 10z"/>
              </svg>
              Camionero:
            </label>
            <select value={trucker} onChange={(e) => setTrucker(e.target.value)}>
              <option value="">Seleccione un camionero</option>
              {truckers.map((trucker) => (
                <option key={trucker._id} value={trucker._id}>
                  {trucker.name} (Identificación: {trucker.identity_number})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16">
                <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              </svg>
              Ciudad de Origen:
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select 
                value={selectedDepartmentOrigin}
                onChange={(e) => setSelectedDepartmentOrigin(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="">Seleccione departamento</option>
                {departments.map((dept) => (
                  <option key={dept.name} value={dept.name}>{dept.name}</option>
                ))}
              </select>
              <select
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                style={{ flex: 1 }}
                disabled={!selectedDepartmentOrigin}
              >
                <option value="">Seleccione ciudad</option>
                {citiesOrigin.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16">
                <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              </svg>
              Ciudad de Destino:
            </label>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select 
                  value={selectedDepartmentDestination}
                  onChange={(e) => setSelectedDepartmentDestination(e.target.value)}
                  style={{ flex: 1 }}
                >
                  <option value="">Seleccione departamento</option>
                  {departments.map((dept) => (
                    <option key={dept.name} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
                <select
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  style={{ flex: 1 }}
                  disabled={!selectedDepartmentDestination}
                >
                  <option value="">Seleccione ciudad</option>
                  {citiesDestination.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                placeholder="Dirección de destino"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <div>
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
              </svg>
              Estado:
            </label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Seleccione un estado</option>
              <option value="En preparación">En preparación</option>
              <option value="En tránsito">En tránsito</option>
              <option value="Entregado">Entregado</option>
            </select>
          </div>
          <div>
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              </svg>
              Consignador:
            </label>
            <input 
              type="text" 
              value={consignorName} 
              onChange={(e) => setConsignorName(e.target.value)} 
              placeholder="Nombre de quien envía"
            />
          </div>
          <div>
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              </svg>
              Consignatario:
            </label>
            <input 
              type="text" 
              value={consigneeName} 
              onChange={(e) => setConsigneeName(e.target.value)} 
              placeholder="Nombre de quien recibe"
            />
          </div>

          <button 
            type="submit" 
            style={hover ? buttonHoverStyle : buttonStyle} 
            onMouseEnter={() => setHover(true)} 
            onMouseLeave={() => setHover(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0z"/>
            </svg>
            Registrar Envío
          </button>
          
          {receiptVisible && (
            <div style={{
              marginTop: '20px',
              padding: '20px',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px', textAlign: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '10px' }}>
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
                ¡Envío Registrado Exitosamente!
              </h3>
              
              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <div style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: 'var(--secondary-color)', color: 'white', borderRadius: '4px', fontWeight: 'bold', fontSize: '1.2em' }}>
                  {generatedTrackingNumber}
                </div>
                <p style={{ marginTop: '10px', fontSize: '0.9em', color: 'var(--text-color)' }}>
                  Este es su número de guía para seguimiento
                </p>
                <a href={`${import.meta.env.VITE_API_URL}/${pdfPath}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '8px 15px', backgroundColor: 'var(--primary-color)', color: 'white', textDecoration: 'none', borderRadius: '4px', marginTop: '10px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{marginRight: '5px'}}>
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                  </svg>
                  Descargar PDF
                </a>
              </div>
              
              <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
                <p><strong>Tipo de Envío:</strong> {shipmentType}</p>
                <p><strong>Origen:</strong> {originCity}</p>
                <p><strong>Destino:</strong> {destinationCity}</p>
                <p><strong>Estado:</strong> {status}</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p><strong>Remitente:</strong></p>
                  <p>{consignorName}</p>
                </div>
                <div>
                  <p><strong>Destinatario:</strong></p>
                  <p>{consigneeName}</p>
                </div>
              </div>
              
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button 
                  onClick={() => {
                    setReceiptVisible(false);
                    // Limpiar el formulario
                    setShipmentType('');
                    setShipmentDescription('');
                    setTrucker('');
                    setOriginCity('');
                    setDestinationCity('');
                    setStatus('');
                    setConsignorName('');
                    setConsigneeName('');
                  }}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '5px' }}>
                    <path d="M11 5.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 6H11.5a.5.5 0 0 1-.5-.5z"/>
                    <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2z"/>
                  </svg>
                  Registrar Nuevo Envío
                </button>
              </div>
            </div>
          )}
        </form>
        </>
        ) : activeTab === 'update' ? (
          <ShipmentStatusUpdate />
        ) : (
          <ShipmentStatusCheck />
        )}
      </div>
    </div>
  );
};

export default ShipmentRegistration;
