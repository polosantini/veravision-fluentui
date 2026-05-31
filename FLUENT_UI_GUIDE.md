# Guía de Implementación Fluent UI en VeraVisión CRM

## Resumen

El proyecto VeraVisión CRM ahora utiliza **Microsoft Fluent UI** como sistema de diseño principal, manteniendo la paleta de colores oscuros y la identidad visual existente.

## Instalación Completada

- `@fluentui/react-components` - Componentes principales de Fluent UI v9
- `@fluentui/react-icons` - Sistema de iconos Fluent

## Configuración del Tema

El tema personalizado de VeraVisión está configurado en `/src/app/theme/fluent-theme.ts`:

```typescript
import { veraVisionTheme } from "./theme/fluent-theme";
```

### Paleta de Colores Aplicada

- **Background Principal**: `#2E3033` (charcoal)
- **Background Elevado**: `#2F3641` (cards, panels)
- **Background Terciario**: `#3C4E6B` (elementos secundarios)
- **Acento/CTA**: `#005EF5` (azul primario)
- **Acento Hover**: `#3B5E96`
- **Texto Principal**: `#CCCCCC`
- **Texto Secundario**: `#B0B0B0`

## Componentes Wrapper Creados

### `/src/app/components/ui/fluent-components.tsx`

Componentes reutilizables que mantienen la consistencia visual:

#### VVCard
```tsx
import { VVCard } from "./components/ui/fluent-components";

<VVCard hover onClick={() => navigate('/detail')}>
  <h3>Título de la tarjeta</h3>
  <p>Contenido aquí</p>
</VVCard>
```

#### VVButton
```tsx
import { VVButton } from "./components/ui/fluent-components";

<VVButton variant="primary" onClick={handleSubmit}>
  Guardar
</VVButton>

<VVButton variant="secondary" onClick={handleCancel}>
  Cancelar
</VVButton>

<VVButton variant="danger" onClick={handleDelete}>
  Eliminar
</VVButton>

<VVButton variant="ghost" icon={<Icon />}>
  Acción
</VVButton>
```

#### VVBadge
```tsx
import { VVBadge } from "./components/ui/fluent-components";

<VVBadge variant="success">Completado</VVBadge>
<VVBadge variant="warning">Pendiente</VVBadge>
<VVBadge variant="error">Vencido</VVBadge>
<VVBadge variant="info">3</VVBadge>
```

#### VVInput
```tsx
import { VVInput } from "./components/ui/fluent-components";

<VVInput
  label="Nombre del paciente"
  value={name}
  onChange={setName}
  placeholder="Ingresa el nombre"
/>
```

#### VVTextarea
```tsx
import { VVTextarea } from "./components/ui/fluent-components";

<VVTextarea
  label="Notas"
  value={notes}
  onChange={setNotes}
  rows={4}
  placeholder="Escribe tus notas aquí"
/>
```

#### VVSelect
```tsx
import { VVSelect } from "./components/ui/fluent-components";

<VVSelect
  label="Prioridad"
  value={priority}
  onChange={setPriority}
  options={[
    { value: "alta", label: "Alta" },
    { value: "media", label: "Media" },
    { value: "baja", label: "Baja" },
  ]}
/>
```

### `/src/app/components/ui/stat-card.tsx`

Componente especializado para KPIs y estadísticas:

```tsx
import { StatCard } from "./components/ui/stat-card";
import { CheckCircle20Regular } from "@fluentui/react-icons";

<StatCard
  title="Tareas Completadas"
  value={45}
  icon={<CheckCircle20Regular style={{ color: "white" }} />}
  iconBg="#10B981"
  trend={{ value: "+12%", isPositive: true }}
  onClick={() => navigate('/completed')}
/>
```

## Iconos Fluent

Reemplazar iconos de Lucide React con Fluent Icons:

```tsx
// Antes (Lucide)
import { User, Settings, Home } from "lucide-react";

// Después (Fluent)
import { PersonRegular, SettingsRegular, HomeRegular } from "@fluentui/react-icons";
```

### Convenciones de Iconos

- `*Regular` - Iconos con línea (uso general)
- `*Filled` - Iconos sólidos (estados activos)
- Tamaño 20 (`*20Regular`) para elementos pequeños
- Tamaño 24 (`*24Regular`) para elementos medianos
- Tamaño 28+ para elementos grandes

## Componentes Fluent UI Nativos Disponibles

### Avatar
```tsx
import { Avatar } from "@fluentui/react-components";

<Avatar
  name="Carlos Méndez"
  initials="CM"
  size={48}
  color="brand"
/>
```

### Badge
```tsx
import { Badge } from "@fluentui/react-components";

<Badge appearance="filled" color="danger">3</Badge>
<Badge appearance="outline" color="success">Activo</Badge>
```

### Button
```tsx
import { Button } from "@fluentui/react-components";

<Button appearance="primary" size="large">
  Guardar
</Button>

<Button appearance="subtle" icon={<Icon />}>
  Acción
</Button>
```

### Input / Textarea
```tsx
import { Input, Textarea, Label } from "@fluentui/react-components";

<div>
  <Label>Nombre</Label>
  <Input size="large" placeholder="Ingresa el nombre" />
</div>

<Textarea rows={4} />
```

### MessageBar (Alertas)
```tsx
import { MessageBar, MessageBarBody } from "@fluentui/react-components";

<MessageBar intent="success">
  <MessageBarBody>Operación exitosa</MessageBarBody>
</MessageBar>

<MessageBar intent="error">
  <MessageBarBody>Hubo un error</MessageBarBody>
</MessageBar>
```

### Card
```tsx
import { Card } from "@fluentui/react-components";

<Card style={{ padding: "20px" }}>
  Contenido de la tarjeta
</Card>
```

## Layouts Actualizados

### AdvisorLayout
- Navegación lateral con componentes Fluent
- Avatar y badges para notificaciones
- Responsive con drawer para móvil

### ManagerLayout
- Similar a AdvisorLayout pero con tema de gerencia
- Iconos y colores diferenciados

## Estilos Globales

### `/src/styles/globals.css`

Contiene los overrides necesarios para que Fluent UI se integre perfectamente con la paleta de VeraVisión:

- Overrides de colores de fondo
- Estilos de inputs y botones
- Scrollbars personalizados
- Transiciones suaves

## Tipografía

Fluent UI hereda la tipografía del sistema:

- **Display/Headings**: Sora
- **UI/Body**: Inter
- **Números**: JetBrains Mono

## makeStyles (Fluent UI Styling)

Para estilos personalizados, usar `makeStyles`:

```tsx
import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

const useStyles = makeStyles({
  container: {
    display: "flex",
    ...shorthands.padding("16px"),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius("12px"),
  },
  title: {
    fontSize: "20px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
});

function MyComponent() {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Título</h2>
    </div>
  );
}
```

## Tokens de Diseño

Tokens disponibles en `@fluentui/react-components`:

```tsx
import { tokens } from "@fluentui/react-components";

// Colores
tokens.colorNeutralBackground1  // #2E3033
tokens.colorNeutralBackground2  // #2F3641
tokens.colorBrandBackground     // #005EF5
tokens.colorNeutralForeground1  // #CCCCCC

// Espaciado
tokens.spacingHorizontalS
tokens.spacingVerticalM

// Border radius
tokens.borderRadiusMedium       // 8px
tokens.borderRadiusLarge        // 12px
```

## Próximos Pasos

1. ✅ Login con Fluent UI
2. ✅ Layouts (Advisor y Manager)
3. ⏳ Componentes de Dashboard
4. ⏳ Formularios de Pacientes
5. ⏳ Componentes de Tareas
6. ⏳ Calendarios y Alertas

## Recursos

- [Fluent UI React v9 Docs](https://react.fluentui.dev/)
- [Fluent UI Icons](https://react.fluentui.dev/?path=/docs/icons-catalog--page)
- [Fluent UI Theme Designer](https://aka.ms/themedesigner)
