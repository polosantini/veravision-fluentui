# Opticalia VeraVisión – CRM con Fluent UI
 
> **Parcial 3er Corte – Human Computer Interaction**
> Migración completa de la interfaz a **Fluent UI (Microsoft)**
 
## Descripción
 
VeraVisión es un sistema de gestión para ópticas que permite a **asesoras** gestionar tareas, pacientes, alertas y reportes, y a **gerentes** supervisar el rendimiento del equipo, analizar estadísticas y configurar reglas de negocio.
 
Este repositorio contiene la versión migrada a **Fluent UI**, utilizando sus librerías oficiales (`@fluentui/react-components`, `@fluentui/react-icons`, `@fluentui/react-charting`) y siguiendo las guías de accesibilidad, tokens de diseño y consistencia visual de Microsoft.
 
## Tecnologías
 
- **React 18** (con TypeScript)
- **Vite** como bundler
- **Fluent UI v9** (componentes base e iconos)
- **Fluent UI Charting v8** (gráficos de barras y dona, envueltos con ThemeProvider)
- **date-fns** para manejo de fechas
- **localStorage** con eventos `storage` para sincronización en tiempo real entre pestañas
## Instalación y ejecución
 
### Requisitos previos
 
- Node.js ≥ 18
- npm o pnpm
### Pasos
 
```bash
# Clonar el repositorio
git clone https://github.com/tuusuario/opticalia-fluent.git
cd opticalia-fluent
 
# Instalar dependencias
npm install
# o
pnpm install
 
# Ejecutar en modo desarrollo
npm run dev
# o
pnpm dev
```
 
La aplicación estará disponible en `http://localhost:5173`.
 
## Credenciales de prueba
 
### Acceso Asesora
 
1. Selecciona **Soy Asesora**
2. Elige una asesora, por ejemplo **Carlos Méndez**
3. Código: `CM2024`
También están disponibles:
 
| Asesora | Código |
|---|---|
| Laura Gómez | `LG2024` |
| Andrés Ruiz | `AR2024` |
| María Torres | `MT2024` |
 
### Acceso Gerente
 
1. Selecciona **Soy Gerente**
2. Código: `GER2024`
## Funcionalidades principales
 
### Asesora
 
- **Mi Cola:** Tareas asignadas (pendientes, en progreso, completadas). Permite iniciar, completar (con registro de resultado y nota) o cancelar tareas.
- **Calendario:** Vista mensual de tareas por fecha.
- **Mis Alertas:** Lista de alertas generadas automáticamente (fórmula vencida, control pendiente, etc.). Se pueden marcar como leídas.
- **Mis Pacientes:** CRUD de pacientes asignados, con historial de contactos y detalles de compra.
- **Reportar Problema:** Envío de incidencias técnicas o de proceso.
### Gerente
 
- **Estadísticas:** KPIs de cumplimiento, pacientes en riesgo, alertas urgentes, tareas vencidas y gráficos de contactos semanales y ciclo de vida.
- **Mi Equipo:** Visión del rendimiento de cada asesora, con posibilidad de cambiar prioridades de tareas y agregar notas.
- **Base de Pacientes:** Gestión global de pacientes (filtros, edición, eliminación).
- **Problemas Reportados:** Gestión de incidencias (revisar, resolver, descartar).
- **Configuración:** Reglas automáticas del ciclo de vida (plazos, canales, intentos) y activación de alertas.
## Sistema de diseño – Fluent UI
 
- **Componentes:** Card, Button, Badge, Dialog, Input, Dropdown, Avatar, Tooltip, Spinner, Drawer, etc.
- **Estilos:** `makeStyles`, `shorthands`, tokens (`tokens.colorBrandBackground`, `tokens.fontSizeBase200`, etc.).
- **Iconos:** `@fluentui/react-icons` (todos los iconos usados provienen de la colección oficial).
- **Gráficos:** `GroupedVerticalBarChart` y `DonutChart` de `@fluentui/react-charting` (con `ThemeProvider` de `@fluentui/react` para compatibilidad).
- **Accesibilidad:** Se respetan roles ARIA, foco manejable, `Tooltip` con `relationship="label"`, alto contraste.
## Consistencia y sincronización
 
Las tareas completadas con resultado **Exitoso** actualizan automáticamente:
 
- Historial de contactos del paciente.
- Fecha de último control.
- Estado del paciente (`post-venta` → `seguimiento 3M` → `control 6M` → `renovación` → `post-venta`).
- Fecha de vencimiento de fórmula (en renovaciones).
Todos los datos persisten en `localStorage` y se sincronizan entre componentes y pestañas mediante eventos `storage`. Así, al completar una tarea, el contador del menú lateral y las vistas de pacientes se actualizan instantáneamente.
 
## Estructura del proyecto
 
```
src/
├── app/
│   ├── components/
│   │   ├── advisor/       # Pantallas del rol asesora
│   │   ├── manager/       # Pantallas del rol gerente
│   │   ├── login.tsx
│   │   └── role-select.tsx
│   ├── hooks/
│   │   ├── useAlertsSync.ts
│   │   ├── useLocalStorage.ts
│   │   └── useTasksSync.ts
│   ├── data/
│   │   └── mock-data.ts   # Datos iniciales de pacientes, tareas, alertas, etc.
│   ├── theme/
│   │   └── fluent-theme.ts
│   ├── utils/
│   │   └── format.ts      # Formateo de teléfonos y validaciones
│   ├── App.tsx
│   └── routes.tsx
├── styles/
│   └── globals.css        # Reset y ajustes menores (opcional)
├── main.tsx
└── vite-env.d.ts
```
 
## Entregable académico
 
El código fuente completo, funcional y 100% basado en las librerías oficiales de Fluent UI se encuentra en este repositorio.
 
## Contribuciones
 
Este proyecto fue desarrollado como trabajo académico para la asignatura **Human Computer Interaction**. No se aceptan contribuciones externas.