-- Script para crear las tablas necesarias en la base de datos PostgreSQL
-- Base de datos: shipment_management

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS shipment_management;

-- Conectar a la base de datos
\c shipment_management;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_role CHECK (role IN ('admin', 'user'))
);

-- Tabla de camioneros
CREATE TABLE IF NOT EXISTS truckers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    identity_number VARCHAR(20) NOT NULL UNIQUE,
    license_number VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de envíos
CREATE TABLE IF NOT EXISTS shipments (
    id SERIAL PRIMARY KEY,
    tracking_number VARCHAR(50) NOT NULL UNIQUE,
    shipment_type VARCHAR(50) NOT NULL,
    shipment_description TEXT,
    trucker_id INTEGER REFERENCES truckers(id),
    origin_city VARCHAR(100) NOT NULL,
    destination_city VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    consignor_name VARCHAR(100) NOT NULL,
    consignee_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de estados de envíos
CREATE TABLE IF NOT EXISTS shipment_status (
    id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- Comentarios de las tablas
COMMENT ON TABLE shipment_status IS 'Tabla para almacenar los diferentes estados de los envíos';
COMMENT ON TABLE users IS 'Tabla para almacenar información de usuarios del sistema';
COMMENT ON TABLE truckers IS 'Tabla para almacenar información de los camioneros';
COMMENT ON TABLE shipments IS 'Tabla para almacenar información de los envíos';