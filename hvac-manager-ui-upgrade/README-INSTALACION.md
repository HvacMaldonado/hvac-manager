# HVAC Manager UI Upgrade

Paquete de rediseño UX/UI para React + Vite + Tailwind + Lucide.

## Qué incluye

- `AppLayout.jsx`: layout principal con Sidebar + Header.
- `ModernDashboard.jsx`: dashboard moderno de ejemplo.
- `StatCard.jsx`: tarjetas estadísticas reutilizables.
- `StatusBadge.jsx`: etiqueta visual por estado.
- `App.example.jsx`: ejemplo de integración.

## Instalación rápida

Copia la carpeta `src/components/layout`, `src/components/ui` y `src/pages` dentro de tu proyecto actual.

Luego instala Lucide si todavía no lo tienes:

```bash
npm install lucide-react
```

Asegúrate de tener Tailwind funcionando.

## Cómo probarlo sin borrar tu App actual

1. Copia tu archivo actual `src/App.jsx` como respaldo:

```bash
cp src/App.jsx src/App.backup.jsx
```

2. Copia el ejemplo como nuevo App:

```bash
cp src/App.example.jsx src/App.jsx
```

3. Ejecuta el proyecto:

```bash
npm run dev
```

## Cómo integrarlo con tu sistema real

En tu `App.jsx` actual, importa el layout:

```jsx
import AppLayout from './components/layout/AppLayout';
```

Luego envuelve tu contenido principal:

```jsx
<AppLayout activePage={activePage} onNavigate={setActivePage}>
  {/* aquí van tus páginas actuales */}
</AppLayout>
```

## Reglas importantes

- No reemplaces tu lógica de órdenes, técnicos, historial, PDF o Excel sin revisar.
- Integra sección por sección.
- Primero prueba el layout, después conecta tus páginas reales.
