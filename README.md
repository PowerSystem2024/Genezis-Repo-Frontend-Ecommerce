# GamerStore Genezis (Frontend)

Este es el repositorio del frontend para **GamerStore Genezis**, un proyecto de e-commerce completo diseñado para la venta de hardware y periféricos de gaming. La aplicación está construida con React, Vite, y SASS, y se conecta a una API de backend para la gestión de datos.

## 🚀 Características Principales

### 🛒 Para Clientes

  * **Inicio Dinámico:** Página de inicio con un carrusel de héroe, productos destacados y un carrusel de marcas.
  * **Catálogo de Productos:** Vista de catálogo con filtrado por categorías, búsqueda de texto, ordenamiento (por precio) y paginación.
  * **Vista de Producto Detallada:** Página de detalle para cada producto con galería de imágenes, descripción, stock y especificaciones técnicas generadas por IA.
  * **Autenticación de Usuarios:** Flujo completo de registro e inicio de sesión de usuarios.
  * **Gestión de Carrito:**
      * Añadir productos al carrito desde el catálogo o la página de detalle.
      * Un "sidebar" de carrito que aparece al añadir un producto.
      * Página de carrito dedicada para actualizar cantidades y eliminar productos.
  * **Proceso de Pago:**
      * Ruta de checkout protegida para usuarios autenticados.
      * Integración con Mercado Pago para procesar los pagos.
      * Páginas de estado de pago (éxito y fallo).
  * **Manejo de Sesión:** Modal de "Sesión Expirada" que redirige al login si el token JWT vence.

### 🔒 Panel de Administración

  * **Rutas Protegidas:** El panel de administración es accesible solo para usuarios con rol de "admin".
  * **Bloqueo en Móviles:** El panel de administración está diseñado para escritorio y muestra una pantalla de bloqueo en dispositivos móviles.
  * **Layout de Administrador:** Una interfaz dedicada con navegación lateral para gestionar las diferentes entidades.
  * **Gestión de Productos (CRUD):**
      * Ver, crear, editar y eliminar (desactivar) productos.
      * Subida de imagen de portada desde el formulario.
      * **Gestor de Galería:** Modal para subir y eliminar múltiples imágenes de la galería de un producto.
      * **IA (Specs):** Botón para generar y guardar especificaciones técnicas de un producto usando IA (a través del backend).
  * **Gestión de Órdenes:**
      * Visualizar todas las órdenes de los clientes.
      * Actualizar el estado de una orden (Pendiente, Pagada, Enviada, etc.).
      * Ver detalles de la orden en un modal, incluyendo los items comprados.
      * **Descarga de PDF:** Generar y descargar un PDF de la factura/detalle de la orden.
  * **Gestión de Usuarios:**
      * Visualizar la lista de todos los usuarios registrados.
      * Desactivar (borrado lógico) cuentas de usuario.
  * **Gestión de Perfil de Admin:** Permite al administrador actualizar su propio nombre, apellido y contraseña.

## 🛠️ Stack Tecnológico

  * **Framework:** React 19
  * **Bundler:** Vite
  * **Enrutamiento:** React Router v7
  * **Estilos:** SASS / SCSS (con arquitectura BEM)
  * **Gestión de Estado:** React Context API (AuthContext, CartContext, ProductContext)
  * **Iconos:** React Icons, Bootstrap Icons
  * **Utilidades (Admin):** jsPDF y html2canvas para la generación de facturas en PDF.
  * **Linting:** ESLint

## 🏁 Empezando

Sigue estos pasos para levantar el proyecto en tu entorno local.

### Prerrequisitos

  * Node.js (v20.x o superior)
  * `npm` o `yarn`

### Instalación

1.  **Clona el repositorio:**

    ```bash
    git clone https://github.com/tu-usuario/genezis-repo-frontend-ecommerce.git
    cd genezis-repo-frontend-ecommerce
    ```

2.  **Instala las dependencias:**

    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto basándote en el `.env.example` (o en el `.env` proporcionado). La variable más importante es la URL del backend:

    ```env
    VITE_API_BASE_URL=https://genezis-repo-backend-ecommerce-production.up.railway.app/api
    ```

4.  **Inicia el servidor de desarrollo:**

    ```bash
    npm run dev
    ```

    El proyecto estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

## 📜 Scripts Disponibles

  * `npm run dev`: Inicia el servidor de desarrollo de Vite con HMR.
  * `npm run build`: Compila el proyecto para producción en la carpeta `dist`.
  * `npm run lint`: Ejecuta ESLint para analizar el código.
  * `npm run preview`: Sirve localmente el build de producción.

## 🔗 Backend

Este es un proyecto *solo de frontend*. Requiere que el [Genezis E-commerce Backend](https://genezis-repo-backend-ecommerce-production.up.railway.app/api) esté en funcionamiento para que la autenticación, los productos y las órdenes funcionen.

La API principal se encuentra en: `https://genezis-repo-backend-ecommerce-production.up.railway.app/api`

## 🌐 Despliegue

El proyecto incluye un archivo `vercel.json` configurado para despliegues en **Vercel**, con las reescrituras (rewrites) necesarias para el enrutamiento de React (SPA).