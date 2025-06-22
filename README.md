# Frontend del Sistema de Gestión de Inventario

Este proyecto corresponde al frontend de la aplicación de gestión de inventarios desarrollada para el Trabajo Práctico de Investigación Operativa 2025. Utiliza Next.js, TailwindCSS y varias librerías complementarias para visualización y estilos.

---

## 🚀 Requisitos Previos

Antes de comenzar, asegurate de tener instalado:

- [Node.js](https://nodejs.org/) versión 16 o superior
- npm versión 8 o superior

---

## 📦 Instalación

1. Cloná el repositorio o descargalo:

```bash
git clone <url-del-repo>
cd nombre-del-proyecto
```
2. Instalá las dependencias generales del proyecto:
```bash
npm install
```
3. Instalá manualmente las siguientes dependencias adicionales necesarias:

```bash
npm install @tremor/react --legacy-peer-deps
npm install recharts --legacy-peer-deps
npm install tailwind-variants --legacy-peer-deps
```
⚠️ Estas dependencias deben instalarse por separado debido a requisitos de compatibilidad (--legacy-peer-deps).

## 🔌 Conexión con el Backend
El frontend se comunica con la API del backend mediante la variable de entorno:

NEXT_PUBLIC_API_URL=http://localhost:3001/api
🛠️ Reemplazá http://localhost:3001/api por la URL real donde esté corriendo tu servidor Express.

Pasos:
Crear un archivo .env.local en la raíz del proyecto:

Copiar y pegar:

NEXT_PUBLIC_API_URL=http://localhost:3001/api
Guardar el archivo y reiniciar el servidor de desarrollo si ya estaba corriendo.

## 🧪 Entorno de desarrollo
Para correr el proyecto en modo desarrollo:
```bash
npm run dev
```
El frontend estará disponible en: http://localhost:3000

🛠️ Tecnologías utilizadas
Next.js

Tailwind CSS

Tremor

Recharts

Tailwind Variants

## 📁 Estructura del proyecto
El proyecto está organizado de la siguiente manera:

/app: Rutas y páginas del frontend

/components: Componentes reutilizables por módulo

/public: Recursos estáticos (logos, imágenes)

/styles: Configuración y estilos base de Tailwind

