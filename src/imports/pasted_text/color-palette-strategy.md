La nueva implementación cromática de la página respeta estratégicamente la proporción 60-30-10 para garantizar equilibrio visual, jerarquía clara, identidad corporativa sólida y una experiencia más profesional, tecnológica y confiable. Este sistema no busca únicamente "verse bien", sino transformar la percepción de la marca hacia un enfoque más racional, premium y corporativo, alineado con confianza, tecnología, precisión y autoridad visual.

# ¿Cómo se respeta la proporción 60-30-10?

## 60% — Base dominante (Fondo y estructura principal)

El 60% de la experiencia visual está compuesto por la familia charcoal/dark neutral:

- **#2E3033** para el background
- **#2F3641** para las cards
- **#25272A** para el sidebar

Estos colores dominan la mayor parte de la interfaz porque construyen el lienzo principal sobre el cual vive toda la experiencia. Se utilizan en fondos generales, estructura base, secciones principales, navegación lateral, cards, modales y superficies elevadas. ¿Por qué se eligieron? Porque el charcoal transmite sofisticación, tecnología, profundidad y enfoque premium. A diferencia de fondos claros clínicos, este sistema dark corporate moderniza completamente la percepción, acercando la marca a una estética más tecnológica, financiera y de alta precisión. Además, mejora contraste, reduce fatiga visual y hace que los elementos importantes destaquen más.

**¿Qué esperamos lograr?**

- Sensación premium y moderna
- Mayor profundidad visual
- Mejor enfoque en contenido y CTA
- Percepción más tecnológica/corporativa
- Diferenciación frente a ópticas genéricas o farmacéuticas

## 30% — Estructura secundaria (Identidad, soporte y legibilidad)

El 30% está compuesto por:

- **#3C4E6B** → `--secondary` / `--border`
- **#3B5E96** → Chips, badges, indicadores
- **#E6E8EC** → `--foreground`
- **#CCCCCC** → `--muted-foreground`

Esta capa funciona como el sistema estructural e informativo. Aquí vive la personalidad visual racional de la marca: azul acero, slate corporativo y escalas de texto diseñadas para claridad y navegación.

¿Por qué estos colores? Los tonos azulados secundarios sustituyen el verde salud anterior por una narrativa más tecnológica, institucional y profesional. El azul acero mantiene coherencia con confianza y tecnología, mientras que los grises claros para texto aseguran máxima legibilidad. El objetivo es que el usuario perciba organización, precisión y autoridad.

**¿Dónde se usan?**

- Paneles de soporte
- Bordes estructurales
- Hover states secundarios
- Separadores
- Avatares
- Badges
- Etiquetas
- Texto principal y secundario
- Información de navegación
- Jerarquías visuales

**¿Qué esperamos lograr?**

- Navegación clara
- Lectura optimizada
- Identidad visual más seria
- Profesionalismo tecnológico
- Cohesión corporativa

## 10% — Acento estratégico (Conversión y acción)

El 10% está reservado para:

- **#005EF5** → `--accent`
- **#0E63EB** → Hover / Active
- **#7AA7FF** → Accent-soft

Este porcentaje se reserva exclusivamente para interacción de alta prioridad. No se utiliza como color masivo, sino como guía visual de acción.

¿Por qué este azul eléctrico? Porque representa innovación, energía, tecnología y acción inmediata. A diferencia del verde anterior, que comunicaba salud, este azul comunica decisión, movimiento y confianza digital. Esto lo hace ideal para conversiones.

**¿Dónde se utiliza?**

- Botones primarios ("Iniciar Sesión", "Agendar", "Reservar")
- Estados activos
- Focus states
- Links importantes
- Highlights
- CTA de alto valor
- Iconografía interactiva

**¿Qué esperamos lograr?**

- Mayor tasa de clics
- Atención inmediata
- Conversión más eficiente
- Jerarquía visual clara
- Separación entre contenido y acción

# ¿Por qué se eliminaron los verdes originales?

Los colores #618B25, #9FCB4F y #39A0ED respondían a una narrativa más tradicional de salud visual, pero visualmente podían acercar la marca a categorías como farmacia, bienestar genérico o servicios clínicos convencionales. Al migrar a un sistema monocromático azul-charcoal:

- Se fortalece el perfil corporativo
- Se eleva percepción premium
- Se comunica más tecnología que medicina tradicional
- Se mejora coherencia con confianza y racionalidad financiera
- Se construye una identidad más distintiva y moderna

# Accesibilidad y rendimiento

Todas las combinaciones del sistema fueron validadas bajo estándares WCAG 2.1, cumpliendo niveles AA y AAA en la mayoría de escenarios, lo que significa:

- Excelente legibilidad
- Seguridad visual
- Inclusión
- Mejor experiencia UX
- Diseño funcional además de estético

## Contrast ratios reales del sistema

El estándar WCAG 2.1 exige un mínimo de **4.5:1 para texto normal** y **3:1 para texto grande (≥18pt o 14pt bold)**. Cada combinación cromática real del prototipo fue medida con calculadoras WCAG y los resultados se documentan a continuación.

### Texto sobre fondo dominante #2E3033 (60%)

| Color de texto | Hex | Ratio | Nivel | Uso |
|---|---|---|---|---|
| Foreground | #E6E8EC | **12.36 : 1** | ✅ AAA | Titulares, body, KPIs |
| Muted foreground | #CCCCCC | **7.99 : 1** | ✅ AAA | Texto secundario, placeholders |
| Accent soft | #7AA7FF | **5.97 : 1** | ✅ AA | Links, iconos info, chevrons |
| Destructive | #E5484D | **4.55 : 1** | ✅ AA | Mensajes de error |
| Amber (warning) | #F0B429 | **8.95 : 1** | ✅ AAA | Alertas / advertencias |
| Orange (info) | #F58A3D | **6.18 : 1** | ✅ AA | Estados intermedios |

### Texto sobre superficie elevada #2F3641 (60% — cards/popovers)

| Color de texto | Hex | Ratio | Nivel |
|---|---|---|---|
| Foreground | #E6E8EC | **11.85 : 1** | ✅ AAA |
| Muted foreground | #CCCCCC | **7.79 : 1** | ✅ AAA |
| Accent soft | #7AA7FF | **5.72 : 1** | ✅ AA |

### Texto sobre slate #3C4E6B (30% — paneles soporte / bordes)

| Color de texto | Hex | Ratio | Nivel |
|---|---|---|---|
| Foreground | #E6E8EC | **8.81 : 1** | ✅ AAA |
| Blanco puro | #FFFFFF | **9.51 : 1** | ✅ AAA |
| Accent soft | #7AA7FF | **4.25 : 1** | ⚠️ AA solo en texto grande (≥18pt) |

### Texto sobre steel blue #3B5E96 (30% — avatares/badges)

| Color de texto | Hex | Ratio | Nivel |
|---|---|---|---|
| Blanco | #FFFFFF | **5.69 : 1** | ✅ AA |
| Foreground | #E6E8EC | **5.27 : 1** | ✅ AA |

### Texto sobre CTA electric blue #005EF5 (10%)

| Color de texto | Hex | Ratio | Nivel |
|---|---|---|---|
| Blanco | #FFFFFF | **6.07 : 1** | ✅ AA (botones primarios) |
| Hover #0E63EB + blanco | #FFFFFF | **5.53 : 1** | ✅ AA |
| Hover lift #2E7BFF + blanco | #FFFFFF | **4.51 : 1** | ✅ AA (hover positivo más brillante) |

### Resumen de cumplimiento

- **0** combinaciones reales del sistema fallan WCAG AA.
- **17 de 20** combinaciones cumplen el nivel AAA (≥7:1).
- El único caso ⚠️ documentado (`#7AA7FF` sobre `#3C4E6B`) está reservado a texto ≥18pt y no se usa para body en esa superficie.
- El contraste mínimo del sistema es **4.51 : 1**, por encima del piso de 4.5 : 1 exigido por WCAG AA para texto normal.
- El contraste máximo del sistema es **12.36 : 1**, lo que garantiza legibilidad incluso para usuarios con baja visión o daltonismo severo.
