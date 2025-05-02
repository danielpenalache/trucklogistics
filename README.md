# Gestión de Envíos

Este proyecto es una aplicación web para la gestión de envíos, desarrollada con React en el frontend y Go en el backend. La aplicación permite gestionar usuarios, camioneros y envíos, incluyendo la autenticación de usuarios y el seguimiento de envíos.

## Estructura del Proyecto

- **Frontend**: Desarrollado con React, incluye componentes para login, registro de usuarios, registro de camioneros y registro de envíos.
- **Backend**: Desarrollado con Go, maneja la lógica de negocio y las operaciones de base de datos.
- **Base de Datos**: PostgreSQL, con las tablas definidas para usuarios, camioneros y envíos.

## Configuración

1. Clonar el repositorio.
2. Configurar la base de datos PostgreSQL con las tablas proporcionadas.
3. Ejecutar el backend de Go.
4. Ejecutar el frontend de React.

## Funcionalidades

- Autenticación de usuarios (login y registro).
- Gestión de camioneros.
- Gestión de envíos, incluyendo generación de números de guía y seguimiento de estado.

## Requisitos

- Node.js
- Go
- PostgreSQL

## Instalación

1. Instalar dependencias del frontend:
   ```bash
   npm install
   ```
2. Ejecutar el servidor de desarrollo del frontend:
   ```bash
   npm run dev
   ```
3. Ejecutar el backend de Go:
   ```bash
   go run main.go
   ```