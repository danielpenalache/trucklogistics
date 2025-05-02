import React, { useState, useEffect } from 'react';
import './LocationSelector.css';

const LocationSelector = ({ onOriginSelect, onDestinationSelect }) => {
  const [departments, setDepartments] = useState([]);
  const [selectedOriginDepartment, setSelectedOriginDepartment] = useState('');
  const [selectedDestinationDepartment, setSelectedDestinationDepartment] = useState('');
  const [originCities, setOriginCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);

  useEffect(() => {
    - fetch('http://localhost:8080/colombian-locations')
    + fetch(`${import.meta.env.VITE_API_URL}/colombian-locations`)
      .then(response => response.json())
      .then(data => setDepartments(data.departments))
      .catch(error => console.error('Error cargando ubicaciones:', error));
  }, []);

  const handleOriginDepartmentChange = (e) => {
    const department = e.target.value;
    setSelectedOriginDepartment(department);
    const cities = departments.find(d => d.name === department)?.cities || [];
    setOriginCities(cities);
  };

  const handleDestinationDepartmentChange = (e) => {
    const department = e.target.value;
    setSelectedDestinationDepartment(department);
    const cities = departments.find(d => d.name === department)?.cities || [];
    setDestinationCities(cities);
  };

  return (
    <div className="location-selector">
      <div className="location-group">
        <label>Departamento Origen:</label>
        <select 
          value={selectedOriginDepartment} 
          onChange={handleOriginDepartmentChange}
          className="select-input"
        >
          <option value="">Seleccione un departamento</option>
          {departments.map(dept => (
            <option key={dept.name} value={dept.name}>{dept.name}</option>
          ))}
        </select>

        <label>Ciudad Origen:</label>
        <select 
          onChange={(e) => onOriginSelect(e.target.value)}
          className="select-input"
          disabled={!selectedOriginDepartment}
        >
          <option value="">Seleccione una ciudad</option>
          {originCities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="location-group">
        <label>Departamento Destino:</label>
        <select 
          value={selectedDestinationDepartment} 
          onChange={handleDestinationDepartmentChange}
          className="select-input"
        >
          <option value="">Seleccione un departamento</option>
          {departments.map(dept => (
            <option key={dept.name} value={dept.name}>{dept.name}</option>
          ))}
        </select>

        <label>Ciudad Destino:</label>
        <select 
          onChange={(e) => onDestinationSelect(e.target.value)}
          className="select-input"
          disabled={!selectedDestinationDepartment}
        >
          <option value="">Seleccione una ciudad</option>
          {destinationCities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LocationSelector;