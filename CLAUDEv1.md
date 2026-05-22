# CLAUDE.md — Generador de Landing Pages para Negocios Peruanos

## Objetivo del proyecto
Generar landing pages HTML personalizadas para negocios peruanos, una por empresa,
listas para enviar como propuesta comercial por WhatsApp al dueño del negocio.
El objetivo no es precisión total, es **impacto inmediato**: que el dueño vea su
nombre, su rubro, su distrito — y piense "esto se ve mejor que lo que tengo".

---

## ⚠️ REGLAS CRÍTICAS — Verificar antes de generar cada archivo

Estas 4 reglas se verifican ANTES de escribir una sola línea de HTML.
Si alguna falla en el archivo generado, el archivo está mal — borrarlo y rehacerlo.

### 1. Siempre crear desde cero
```bash
rm -f /mnt/user-data/outputs/{archivo}.html
```
**NUNCA** editar, parchear ni hacer str_replace sobre un HTML existente.
Si el archivo existe → borrarlo primero. Sin excepción.

### 2. CTA del hero = botón WhatsApp
El CTA principal del hero **siempre** es un botón que abre WhatsApp.
- Nunca un enlace de texto
- Nunca un botón genérico sin destino WhatsApp
- Siempre con ícono SVG de WhatsApp inline
- Link: `https://wa.me/51{whatsapp}`
- Tamaño mínimo: `padding: 18px 40px`, `font-size: 1.1rem`

### 3. Botón flotante WhatsApp — siempre presente
`position: fixed; bottom: 24px; right: 24px; z-index: 9999; background: #25D366`
Presente en el 100% de las landings. Si no hay `whatsapp`, usar `tel:{telefono}`.
Ver snippet completo en sección "Elemento flotante obligatorio".

### 4. Datos de contacto — todos con enlace funcional
Ningún dato de contacto puede ser texto plano:
- Teléfono → `<a href="tel:+51XXXXXXXXX">`
- WhatsApp → `<a href="https://wa.me/51XXXXXXXXX" target="_blank">`
- Dirección → `<a href="{url_google_maps}" target="_blank">`
- Botón Maps → `<a href="{url_google_maps}" target="_blank">Ver en Google Maps</a>`

---

## Input esperado
Archivo CSV o Excel con estos campos por empresa:

| Campo | Uso |
|---|---|
| `id` | Nombre del archivo de salida |
| `nombre_negocio` | Hero, título, SEO |
| `rubro` | Servicios, imágenes, tono del copy, base del mood |
| `distrito` | Copy local, menciones geográficas, contexto del mood |
| `direccion` | Sección contacto, iframe Maps |
| `telefono` | Sección contacto |
| `whatsapp` | Botón flotante: `https://wa.me/{whatsapp}` |
| `website_actual` | Fuente de info adicional (hacer fetch si existe) |
| `rating` | Criterio para testimonios + input para inferir mood |
| `cantidad_resenas` | Mostrar badge de reseñas Google |
| `url_google_maps` | Solo para iframe embebido y botón "Ver en Maps" |
| `oportunidad_textual` | Tagline secundario en hero o sección "¿Por qué elegirnos?" |
| `Estilo de pagina web` | Opcional — dirección creativa si está disponible |

---

## Control de flujo para batches

### Orden de procesamiento
- **Siempre secuencial** — una empresa a la vez, de arriba hacia abajo en la tabla.
- No procesar en paralelo aunque el batch sea grande.
- Guardar el archivo de cada empresa antes de pasar a la siguiente.

### Checkpoint de mood obligatorio
Antes de escribir una línea de HTML, emitir este bloque visible en el output:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 [nombre_negocio] — [id]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mood inferido:    [etiqueta, ej: urbano-oscuro / clean-trust / calma-natural]
Paleta:           fondo [hex] · acento [hex] · texto [hex]
Tipografía:       [nombre Google Font] / [nombre Google Font secundaria]
Animación hero:   [descripción breve, ej: letras por caracteres + scanline]
Hero foto ID:     [ID del banco]
Layout diferenciador: [qué lo hace distinto al resto del batch]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Continuar con el HTML inmediatamente después — sin esperar confirmación.

### Manejo de ambigüedad de datos

| Dato sucio | Acción |
|---|---|
| `rating` con coma en lugar de punto (ej: "4,3") | Convertir a float: 4.3 |
| `whatsapp` con espacios, guiones o paréntesis | Extraer solo dígitos |
| `whatsapp` que empieza en 9 y tiene 9 dígitos | Agregar prefijo 51 |
| `whatsapp` que ya empieza en 51 | Usar tal cual |
| `telefono` con formato "(01) 234-5678" | Normalizar a solo dígitos para el link |
| `direccion` con caracteres especiales para Maps | Encodear con encodeURIComponent |
| Campo vacío o con valor "N/A", "-", "n/a" | Tratar como vacío — aplicar tabla "Qué hacer si faltan datos" |
| `url_google_maps` presente | Solo usar para iframe src y botón — no navegar |
| `website_actual` presente | Hacer web_fetch — si falla (timeout/404), continuar sin ese dato |

---

## Flujo de trabajo por empresa

```
1. Leer fila de la tabla
2. Normalizar datos sucios (ver tabla de ambigüedad arriba)
3. Emitir checkpoint de mood (ver formato arriba)
4. Buscar info adicional en la web:
   - "{nombre_negocio} {distrito} Lima" → horario, datos extra
   - Si tiene website_actual → hacer web_fetch para extraer info real
5. Seleccionar IDs de imágenes del banco (ver sección Imágenes)
6. Generar HTML completo basado en el mood inferido
7. Ejecutar checklist anti-regresión (ver sección abajo) antes de guardar
8. Guardar como {id}-{slug}.html en /mnt/user-data/outputs/
9. Continuar con la siguiente empresa
```

---

## Checklist anti-regresión

Antes de guardar cada archivo, verificar estos 5 puntos. Si alguno falla, corregir antes de guardar:

- [ ] **Contraste** — textos sobre fondos cumplen mínimo 4.5:1
- [ ] **Hero fallback** — `.hbg` NO tiene `background-image` en CSS; la foto se carga solo por JS con `img.onload`
- [ ] **Hero vivo** — hay al menos un elemento con animación looping dentro del hero (scanline, grid, float, breathe) además de las partículas ambientales
- [ ] **Partículas** — `<div id="amb">` es el primer elemento después de `<body>`; el IIFE de partículas es el último JS del `<body>`
- [ ] **`.wrap` limpio** — `.wrap` solo tiene `max-width`, `margin: 0 auto`, `padding`. Sin `display:grid/flex`, sin `width:100%`

---

## Inferencia del mood visual

Antes de diseñar, Claude construye la **personalidad de la landing** combinando
los datos disponibles. Este paso es obligatorio y reemplaza cualquier estilo genérico.

### Paso 1 — Leer el campo `Estilo de pagina web`
- **Si está lleno** → usarlo como dirección creativa, cruzarlo con rubro y rating
- **Si está vacío** → inferir completamente desde rubro + distrito + rating

### Paso 2 — Combinar los tres inputs

**Rubro** → define el universo visual base
- Barbería → masculino, urbano, detalle, precisión
- Clínica/Dental → limpio, confianza, claridad, salud
- Psicólogo → calma, calidez, profundidad, contención
- Fotografía → visual, composición, luz, memoria
- Restaurante → apetito, ambiente, comunidad, sabor
- Taller/Mecánica → industrial, confianza, solidez, sin adornos
- Veterinaria → calidez, cuidado, vida, color moderado
- (inferir para cualquier otro rubro)

**Distrito** → define el tono y la accesibilidad
- Miraflores / San Isidro → puede ser aspiracional y premium
- Villa El Salvador / SJL / Ate / Callao → cercano, real, del barrio, sin pretensión
- Centro Histórico → puede jugar con tradición y modernidad
- Surco / La Molina → moderno, familia, confiable

**Rating** → define la actitud del diseño
- ≥ 4.5 → diseño que celebra la excelencia, confianza total, rating visible y prominente
- 4.0–4.4 → diseño sólido y profesional, confiable sin presumir
- < 4.0 → diseño ambicioso y aspiracional que compense visualmente,
           no mostrar el rating de forma prominente

### Paso 3 — Definir la personalidad antes de codificar

Con esos inputs, Claude responde internamente estas preguntas antes de escribir código:
- ¿Qué emoción debe sentir el visitante al abrir la página?
- ¿Qué paleta nace naturalmente de ese mood?
- ¿Qué tipografía Google Fonts encarna esa personalidad?
- ¿Qué tipo de animación refuerza ese carácter?
- ¿Cómo se ve el hero? ¿Oscuro y cinematográfico? ¿Claro y abierto? ¿Asimétrico?
- ¿Qué hace único el layout de esta landing vs las otras del batch?

### Regla de oro del batch:
> Nunca uses la misma combinación de paleta, tipografía, layout o animaciones
> dos veces en el mismo batch, aunque dos empresas sean del mismo rubro o distrito.
> Dos barberías en Villa El Salvador deben verse completamente distintas.

---

## Carácter visual diferenciador

Antes de codificar, responder esta pregunta adicional:
> ¿Qué es lo UNO que alguien recordará de esta landing al cerrarla?

Puede ser una tipografía inesperada, un layout asimétrico, un efecto de hover
que sorprende, una sección que rompe la grid. Una decisión concreta, no "se ve bien".

### Tipografías prohibidas
Nunca usar: Inter, Roboto, Arial, system-ui, Space Grotesk.
Son genéricas — cualquier landing generada por IA las usa.
Elegir siempre fuentes con carácter propio acorde al mood.

### Composición espacial
Evitar layouts simétricos y predecibles. Considerar:
- Asimetría en el hero (texto izquierda pesado, espacio derecha)
- Elementos que se solapan entre secciones (overlap con margin negativo)
- Una sección que rompe el ancho máximo del `.wrap`
- Tipografía display en tamaño inesperadamente grande como elemento decorativo

### Fondos con atmósfera
No defaultear a colores sólidos en secciones intermedias.
Considerar: gradient mesh, noise texture sutil, patrón geométrico de baja opacidad,
sombras dramáticas, bordes decorativos. El fondo debe sumar atmósfera, no ser neutro.

---

## Paleta de colores — Criterios de calidad

### Reglas base

- Usar máximo 2 colores de acento + neutrales.
- Definir siempre:
  - Fondo base
  - Fondo alternativo
  - Superficie/tarjetas
  - Acento primario
  - Acento secundario opcional
  - Texto principal
  - Texto secundario
  - Borde/divisor
- Evitar blanco puro y negro puro salvo que el estilo lo justifique.
- Usar acentos para guiar la mirada, no para decorar todo.
- Validar contraste mínimo de 4.5:1 para textos normales.

### Proporción recomendada

- 70% neutrales y fondos
- 20% superficies, bloques y variaciones
- 10% acentos visuales

### Combinaciones de alto riesgo

- Naranja brillante + gris plano sin matices.
- Verde lima como acento dominante.
- Más de 3 colores saturados en una misma sección.
- Blanco puro + negro puro sin sistema visual.
- Gradientes de 3+ colores sin temperatura común.
- Colores flúor o "chicle" sin una intención de marca clara.

### Paletas de referencia por mood (punto de partida, no plantilla fija)

- Oscuro/dramático → fondo `#0d0d0d` / `#111827`, acento dorado o rojo oscuro, texto `#f5f5f5`
- Limpio/médico → fondo `#f8fafc`, acento azul pizarra o verde salvia, texto `#1e293b`
- Urbano/masculino → fondo `#1a1a2e` / `#1c1917`, acento cobre o blanco roto, texto `#e5e7eb`
- Calma/psicológico → fondo `#faf7f2` / `#f0f4f8`, acento verde musgo o azul suave, texto `#374151`
- Visual/fotografía → fondo muy oscuro o muy claro (nunca medio), acento de un color puro bien elegido
- Cercano/barrial → terracota, mostaza o verde botella — con carácter pero sin estridencia
- Industrial/taller → fondo `#1c1c1c` / `#212529`, acento naranja quemado o amarillo ocre, texto `#e9ecef`
- Cálido/veterinaria → fondo `#fdf6ec`, acento verde suave o naranja durazno, texto `#3d2b1f`

### Regla de decisión

> Si una paleta compite con el mensaje, está mal.
> El color debe reforzar la propuesta, no robarse la atención.
> Si dudás entre dos paletas, elegí la más sobria.

---

## Estructura de cada landing page

### Secciones obligatorias (en orden):

1. **`<head>`** — Meta tags SEO: title, description, og:title, viewport
2. **Hero** — Foto de fondo a pantalla completa (`100vh`, `object-fit: cover`) impactante y aspiracional, obligatoria. Encima: nombre del negocio + tagline basada en `oportunidad_textual` + CTA WhatsApp. El hero es la primera impresión — sin foto grande no hay impacto.
3. **Sobre nosotros** — Copy persuasivo basado en rubro + distrito (NO genérico)
4. **Servicios** — 4 a 6 servicios típicos del rubro con íconos SVG inline
5. **Estadísticas/Confianza** — Badge: ⭐ {rating} · {cantidad_resenas} reseñas en Google
6. **Testimonios** — 3 testimonios con nombres peruanos (ver criterio abajo)
7. **Galería** — 3 imágenes Unsplash acordes al mood inferido
8. **Ubicación** — Iframe Google Maps embebido + `<a href="{url_google_maps}" target="_blank">Ver en Google Maps</a>`
9. **Contacto** — Teléfono, WhatsApp, dirección, horario estimado por rubro. **Todos con enlace funcional — ningún dato puede ser texto plano:**
   - Teléfono: `<a href="tel:+51XXXXXXXXX">`
   - WhatsApp: `<a href="https://wa.me/51XXXXXXXXX" target="_blank">`
   - Dirección: `<a href="{url_google_maps}" target="_blank">{direccion}</a>`
   - Email (si existe): `<a href="mailto:...">`
10. **Footer** — Nombre del negocio, rubro, distrito

### Jerarquía obligatoria del Hero

El hero tiene un único objetivo: que el visitante contacte al negocio. Todo lo demás lo soporta.

**Orden de peso visual (de mayor a menor):**
1. **NOMBRE DEL NEGOCIO** — protagonista, tipografía grande
2. **CTA PRINCIPAL** — el elemento más visible después del nombre. Botón grande, color de acento máximo, ícono WhatsApp inline. Imposible ignorarlo.
3. **Tagline** — subtítulo de apoyo, secundario visualmente

**Especificaciones mínimas del CTA del hero:**
- `padding: 18px 40px` mínimo · `font-size: 1.1rem` · `font-weight: 700` · `border-radius: 50px`
- Ícono SVG de WhatsApp inline antes del texto
- Texto con verbo de acción: "Escríbenos por WhatsApp", "Reserva ahora", "Contáctanos hoy"
- Entra animado junto al resto del hero al cargar la página
- **El CTA del hero SIEMPRE es un botón WhatsApp** — nunca un enlace de texto, nunca un botón genérico

### Elemento flotante obligatorio

El botón flotante y el CTA del hero son los **dos únicos elementos** que compiten por la atención del visitante. Todo lo demás los soporta.

- Posición: `fixed; bottom: 24px; right: 24px; z-index: 9999`
- Color: `#25D366` · `box-shadow: 0 4px 20px rgba(37,211,102,.4)` — siempre presente
- Link: `https://wa.me/{whatsapp}` (solo dígitos, prefijo 51 si número peruano)
- Incluir ícono SVG de WhatsApp + texto visible
- Animación continua acorde al mood (pulse, glow, bounce)
- Si `whatsapp` está vacío y hay `telefono`: usar `<a href="tel:{telefono}">` con color `#0ea5e9`

```html
<!-- BOTÓN FLOTANTE WHATSAPP — SIEMPRE PRESENTE, NUNCA OMITIR -->
<a href="https://wa.me/51XXXXXXXXX" target="_blank" rel="noopener" id="wa-float"
   style="position:fixed;bottom:24px;right:24px;z-index:9999;background:#25D366;
          color:#fff;border-radius:50px;padding:14px 22px;display:flex;
          align-items:center;gap:10px;font-weight:700;text-decoration:none;
          box-shadow:0 4px 20px rgba(37,211,102,.4);">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.549 4.107 1.51 5.84L.057 23.882l6.204-1.626A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.376l-.36-.214-3.681.965.981-3.595-.235-.369A9.818 9.818 0 1112 21.818z"/>
  </svg>
  Escríbenos
</a>
```

---

## Animaciones — Cada landing tiene su propio comportamiento

Las animaciones nacen del mood inferido. No son un set genérico aplicado a todas.

### Regla:
> Mínimo 4 tipos de animación distintos por landing.
> Las animaciones refuerzan el carácter del diseño.
> CSS + JS vanilla únicamente. Sin librerías externas.

### El mood dicta la animación:
- Oscuro/dramático → letras que aparecen una a una, partículas flotantes en hero
- Limpio/médico → fade puro y suave, sin elementos que distraigan
- Urbano/cercano → entradas con rebote, hover con energía
- Editorial/elegante → clip-path reveals, líneas que se dibujan solas
- Premium/lujo → parallax sutil, elementos que flotan levemente
- Creativo/visual → colores que saturan al hover, galería con efecto

### Base mínima por landing (adaptar al mood):
- Hero: animación de entrada que se dispara **al cargar la página** (no al hacer scroll). Debe ser visible de inmediato — título, subtítulo y CTA entran animados dentro del hero foto. La animación es característica del mood inferido.
- Scroll: secciones aparecen al entrar en viewport (Intersection Observer)
- Hover: cards y botones responden con movimiento acorde al mood
- Contador: rating y reseñas animan desde 0 al valor real
- WhatsApp: llamada de atención continua acorde al mood (pulse, glow, bounce, etc.)

### Animación continua en el hero (obligatoria además de la de entrada)

**El hero no puede "congelarse" después de los primeros 2 segundos.**
Agregar SIEMPRE al menos un elemento visual con animación looping dentro del hero.
Esto va más allá del sistema ambient de partículas (que ya es obligatorio por separado).

**Opciones por mood (elegir la más coherente):**

| Mood | Elemento continuo recomendado |
|---|---|
| Oscuro/dramático | Línea de escaneo que recorre el hero de arriba abajo |
| Futurista/tecnológico | Grid pulsante de fondo (`gridPulse`) |
| Urbano/energético | Badge o texto decorativo con float suave |
| Editorial/fotografía | Línea de escaneo + vignette que respira |
| Limpio/médico | Pulse muy sutil en un elemento decorativo o badge |
| Calma/psicológico | Gradiente de fondo que gira lentamente |

**Patrones concretos:**

```css
/* Línea de escaneo (oscuro/futurista/fotografía) */
@keyframes scanLine {
  0%   { top: -2px; }
  100% { top: 102%; }
}
.hscan {
  position: absolute; left: 0; right: 0; height: 2px; z-index: 2; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(ACENTO,.45), transparent);
  animation: scanLine 7s linear infinite;
}

/* Grid pulsante (futurista) */
@keyframes gridPulse {
  0%, 100% { opacity: .04; }
  50%       { opacity: .09; }
}
.hgrid {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background-image: linear-gradient(rgba(ACENTO,.07) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(ACENTO,.07) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: gridPulse 4s ease-in-out infinite;
}

/* Elemento flotante (urbano/barbería) */
@keyframes heroFloat {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}
.hero-deco { animation: heroFloat 3s ease-in-out infinite; }

/* Gradiente que respira (calma/psicológico) */
@keyframes bgBreathe {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}
/* aplicar a .hbg::after con background-size: 200% 200% */
```

> Colocar el elemento de animación continua en el HTML del hero,
> con `position: absolute` para que no afecte el layout del contenido.

### Ambiente continuo (obligatorio):

Además de las animaciones de entrada, cada landing debe tener una capa ambiental
activa todo el tiempo que el usuario esté en la página.

**Patrón obligatorio — sistema de partículas flotantes:**

1. Colocar este div inmediatamente después de `<body>` (antes de cualquier otro contenido):
```html
<body>
<div id="amb" style="position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;"></div>
```

2. CSS — agregar este keyframe junto al resto de animaciones:
```css
@keyframes ambFloat {
  0%   { transform:translateY(0) translateX(0); opacity:0; }
  10%  { opacity:1; }
  90%  { opacity:.5; }
  100% { transform:translateY(-110vh) translateX(var(--drift,0px)); opacity:0; }
}
```

3. JS — IIFE al final del `<body>`, después del resto del JS:
```javascript
(function(){
  const a = document.getElementById('amb');
  const c = ['R1,G1,B1','R2,G2,B2']; // 2 acentos de la paleta en formato RGB
  for(let i=0;i<30;i++){
    const d=document.createElement('div'),
          sz=Math.random()*2.5+.7,
          col=c[i%c.length],
          op=Math.random()*.12+.04,
          x=Math.random()*100,
          dur=Math.random()*25+15,
          dl=-(Math.random()*dur),
          dr=(Math.random()-.5)*130;
    d.style.cssText=`position:absolute;width:${sz}px;height:${sz}px;background:rgba(${col},${op});border-radius:50%;left:${x}%;bottom:-10px;animation:ambFloat ${dur}s linear ${dl}s infinite;--drift:${dr}px;`;
    a.appendChild(d);
  }
})();
```

**Criterios para los colores del ambiente:**
- Usar 2 colores de acento de la paleta definida para esa landing, en formato `R,G,B`
- Opacidad baja (4–16%) — son partículas sutiles, no elementos decorativos
- Tamaño pequeño (0.7–3.2px) — deben sentirse como polvo de luz, no como burbujas

---

## Fondos de sección

Las secciones `#sobre` y `#testimonios` deben tener imagen de fondo que acompañe
el mood del diseño, sin quitar protagonismo al contenido.

### Patrón obligatorio — CSS multi-layer background:

```css
#sobre {
  background: linear-gradient(rgba(R,G,B,.93), rgba(R,G,B,.93)),
              url('https://images.unsplash.com/photo-[ID]?w=1200&q=60&fit=crop')
              center/cover fixed;
}
#testimonios {
  background: linear-gradient(rgba(R,G,B,.94), rgba(R,G,B,.94)),
              url('https://images.unsplash.com/photo-[ID]?w=1200&q=60&fit=crop')
              center/cover fixed;
}
```

`R,G,B` = color de fondo de esa sección según la paleta CSS del diseño.

### Reglas:
- El gradiente va **primero** en la declaración (encima de la foto) — garantiza legibilidad
- Opacidad del gradiente: 93–96% — nunca menos de 93%
- `background-attachment: fixed` crea efecto parallax al hacer scroll
- Usar `?w=1200&q=60` para estas fotos — calidad 60 es suficiente al cubrirse en 93%+
- La foto de `#sobre` y la de `#testimonios` deben ser distintas entre sí y distintas al hero
- La foto debe ser acorde al **mood**, no solo al rubro

### Selección de foto por mood:
- Oscuro/dramático → textura de material (cuero, madera oscura, concreto), bokeh de luces
- Limpio/médico → plantas verdes, luz natural, ventana, textura minimalista
- Urbano/cercano → textura urbana, azulejos, paredes con historia
- Calma/psicológico → naturaleza suave, agua, cielo abierto, follaje
- Visual/fotografía → bokeh, patrones de luz, texturas de película o lente

---

## Criterio para testimonios

Generar 3 testimonios con nombres peruanos (ej: Carlos Quispe, María Flores, José Huamán):

- **Rating ≥ 4.5** → Muy positivos, énfasis en excelencia, recomiendan ampliamente
- **Rating 4.0–4.4** → Positivos y confiables, destacan profesionalismo y buen trato
- **Rating < 4.0** → Positivos pero moderados, énfasis en mejora y atención

Tono por rubro:
- Barbería → directo, hablan del corte, del ambiente, de volver siempre
- Restaurante → informal, sabor, precio, ambiente
- Clínica/médico → formal, atención, diagnóstico, confianza
- Psicólogo → emotivo, hablan de cómo se sintieron, del proceso personal
- Fotografía → hablan del resultado, de cómo salieron las fotos, del trato recibido
- Taller → directo, solución rápida, precio justo, sin vueltas

---

## Imágenes

Las fotos deben ser **aspiracionales e impactantes**, no genéricas. Criterio: alta calidad visual, iluminación profesional, composición llamativa. Antes de usar una foto preguntarse: ¿esto le da más presencia al negocio o parece una foto de stock barata?

Cantidad mínima por landing: **1 foto hero a pantalla completa** + **3 fotos en galería** = 4 fotos.

Criterio por rubro para el hero:
- Barbería → barbero trabajando, iluminación dramática, close-up de tijeras o nuca
- Dental/Clínica → consultorio moderno, luz cálida, profesional sonriendo — NO equipo médico frío
- Psicólogo → espacio sereno, luz suave, planta o ventana — transmite calma y confianza
- Fotografía → foto dentro de una foto, cámara en acción, luz de estudio
- Restaurante → plato bien presentado o ambiente lleno y cálido
- Taller → mecánico trabajando, herramientas ordenadas, auto en proceso

La imagen debe reforzar la personalidad de la landing, no solo ilustrar el rubro:
- Mood oscuro/dramático → iluminación dramática, alto contraste
- Mood limpio/médico → fondos neutros, luz natural, claridad
- Mood urbano/cercano → personas reales, ambiente de barrio, textura
- Mood editorial/elegante → composición cuidada, paleta reducida

No usar `source.unsplash.com` (está deprecado).
Formato de URL: `https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&w=1200`
Hero: `https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&w=1400`
Secciones (#sobre/#testimonios): `https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&w=1200`

---

### ⚠️ REGLA ABSOLUTA DE IMÁGENES

**Solo usar IDs de este banco. Nunca inventar IDs nuevos bajo ninguna circunstancia.**

Si ningún ID del banco encaja perfectamente con el mood → usar el más cercano disponible.
**Mejor una foto imperfecta que un 404.**

### Tabla de asignación obligatoria por landing

Cada landing consume exactamente estos slots del banco:

| Slot | Categoría a usar | Cantidad |
|---|---|---|
| Hero | `[rubro]-hero` | 1 ID |
| Galería foto 1 | `[rubro]-galeria` | 1 ID |
| Galería foto 2 | `[rubro]-galeria` (distinto al anterior) | 1 ID |
| Galería foto 3 | `tex-oscura` o `tex-clara` según mood | 1 ID |
| `#sobre` fondo | `tex-oscura` o `tex-clara` según mood | 1 ID (distinto a galería foto 3) |
| `#testimonios` fondo | `tex-oscura` o `tex-clara` según mood | 1 ID (distinto a los anteriores) |

Si el rubro no tiene categoría propia en el banco → usar `tex-oscura` (mood oscuro) o `tex-clara` (mood claro) para todos los slots que no sean hero.

---

### Banco de IDs verificados por categoría

#### `barberia-hero`
- `1503951914875-452162b0f3f1` — barbero trabajando, iluminación dramática
- `1560066984-138dadb4c035` — barbería interior, ambiente masculino
- `1622286342621-4bd786c2447c` — tijeras y herramientas sobre cuero
- `1605497788044-5a32c7078486` — barbero con cliente, close-up
- `1599351239884-2782b4fa5d15` — navaja y espejo, espacio oscuro

#### `barberia-galeria`
- `1503951914875-452162b0f3f1` — barbero trabajando
- `1560066984-138dadb4c035` — ambiente interior barbería
- `1622286342621-4bd786c2447c` — detalle herramientas
- `1605497788044-5a32c7078486` — cliente en silla
- `1594938298603-c8148c4a8e63` — negro y detalles, barbería
- `1599351239884-2782b4fa5d15` — navaja y espejo

#### `dental-hero`
- `1588776814546-1ffbb172f04a` — consultorio dental, luz cálida
- `1606811841689-23dfddce3e75` — dentista profesional sonriendo
- `1629909613654-28e377c37b09` — higiene dental, limpio
- `1559839734-2b71ea197ec2` — ambiente médico claro y moderno

#### `dental-galeria`
- `1588776814546-1ffbb172f04a` — consultorio dental
- `1606811841689-23dfddce3e75` — profesional sonriendo
- `1629909613654-28e377c37b09` — higiene dental
- `1559839734-2b71ea197ec2` — ambiente moderno
- `1416169607655-0c2b3ce2e1cc` — plantas y luz natural (espera sala)
- `1490750967868-88df5691cc2e` — ventana luminosa, calma

#### `psicologo-hero`
- `1573497019940-1c28c88b4f3e` — sesión de terapia, escucha activa
- `1551836022-deb4988cc6c0` — oficina con plantas, luz natural
- `1516302752625-fcc3c50ae61f` — plantas verdes, tranquilidad
- `1506126613408-eca07ce68773` — naturaleza suave, follaje

#### `psicologo-galeria`
- `1573497019940-1c28c88b4f3e` — terapia, escucha
- `1551836022-deb4988cc6c0` — oficina con plantas
- `1516302752625-fcc3c50ae61f` — plantas verdes
- `1506126613408-eca07ce68773` — naturaleza suave
- `1490750967868-88df5691cc2e` — ventana luminosa
- `1416169607655-0c2b3ce2e1cc` — luz natural interior
- `1501854140801-50d01698950b` — naturaleza abierta, cielo

#### `fotografia-hero`
- `1516035069371-29a1b244cc32` — cámara con bokeh de luces
- `1452780212940-6f5c0d14d848` — cámara artística sobre fondo oscuro
- `1492691527719-9d1e07e534b4` — fotógrafo con cámara en acción
- `1554048612-b6a482bc67e5` — lente fotográfico, bokeh dramático
- `1502982720700-bfff97f2ecac` — retrato fotográfico profesional

#### `fotografia-galeria`
- `1516035069371-29a1b244cc32` — cámara bokeh
- `1452780212940-6f5c0d14d848` — cámara oscura artística
- `1492691527719-9d1e07e534b4` — fotógrafo en acción
- `1554048612-b6a482bc67e5` — lente dramático
- `1502982720700-bfff97f2ecac` — retrato profesional
- `1489599849927-2ee91cede3ba` — estudio fotográfico oscuro
- `1508974239320-0a029497e820` — bokeh de luces oscuro

#### `restaurante-hero`
- `1414235077428-338989a2e8c0` — plato gourmet bien presentado
- `1555396273-367ea4eb4db5` — ambiente restaurante cálido y lleno
- `1504674900247-0877df9cc836` — mesa con platos apetitosos
- `1559329007-40df8a9345d8` — chef trabajando en cocina
- `1600891964599-f61ba0e24092` — detalle plato con color y textura

#### `restaurante-galeria`
- `1414235077428-338989a2e8c0` — plato gourmet
- `1555396273-367ea4eb4db5` — ambiente restaurante
- `1504674900247-0877df9cc836` — mesa con platos
- `1559329007-40df8a9345d8` — chef en cocina
- `1600891964599-f61ba0e24092` — detalle plato
- `1414235077428-338989a2e8c0` — plato colorido

#### `taller-hero`
- `1530046339160-ce8a0e7af4f4` — mecánico trabajando bajo capó
- `1565689054371-a47b0f9a8bdb` — taller con herramientas ordenadas
- `1504222022645-a6a0bccdd78e` — auto en proceso de reparación
- `1486262322684-ee5b7f1bf066` — detalle motor, manos trabajando

#### `taller-galeria`
- `1530046339160-ce8a0e7af4f4` — mecánico trabajando
- `1565689054371-a47b0f9a8bdb` — herramientas ordenadas
- `1504222022645-a6a0bccdd78e` — auto en reparación
- `1486262322684-ee5b7f1bf066` — detalle motor
- `1516972838722-fd4e0f9f3cc9` — textura industrial oscura
- `1507003211169-0a1dd7228f2d` — madera/material cálido

#### `veterinaria-hero`
- `1587300003388-59208cc962cb` — perro feliz y saludable
- `1548767797-d8c844163831` — gato siendo atendido
- `1583337130417-3346a1be7dee` — veterinario con mascota
- `1450778869180-b7bcd718940a` — mascota tierna, luz cálida

#### `veterinaria-galeria`
- `1587300003388-59208cc962cb` — perro feliz
- `1548767797-d8c844163831` — gato atendido
- `1583337130417-3346a1be7dee` — veterinario con mascota
- `1450778869180-b7bcd718940a` — mascota tierna
- `1416169607655-0c2b3ce2e1cc` — luz natural suave
- `1501854140801-50d01698950b` — naturaleza abierta

#### `tex-oscura` (para #sobre, #testimonios, galería slot 3 en moods oscuros)
- `1507003211169-0a1dd7228f2d` — madera cálida, bokeh
- `1516972838722-fd4e0f9f3cc9` — textura de material oscuro
- `1477959858617-67f85cf4f1df` — ciudad de noche, luces urbanas
- `1529156069898-49953e39b3ac` — textura urbana oscura
- `1594938298603-c8148c4a8e63` — negro y detalles, barbería
- `1489599849927-2ee91cede3ba` — estudio fotográfico, oscuro
- `1508974239320-0a029497e820` — bokeh de luces, oscuro
- `1519681393784-d120267933ba` — montaña nocturna, atmósfera
- `1534796636912-3b97b9c90716` — abstracto oscuro con luz
- `1464822759023-fed622ff2c3b` — paisaje nocturno dramático

#### `tex-clara` (para #sobre, #testimonios, galería slot 3 en moods claros)
- `1416169607655-0c2b3ce2e1cc` — plantas y luz natural
- `1554188248-986adbb73be4` — espacio minimalista claro
- `1490750967868-88df5691cc2e` — ventana luminosa, calma
- `1501854140801-50d01698950b` — naturaleza abierta, cielo
- `1507525428034-b723cf961d3e` — playa serena, luz suave
- `1441974231531-c6227db76b6e` — bosque con luz filtrada
- `1518173946439-b1399ccd2e2d` — textura natural clara
- `1495107334309-fcf710a3d2e5` — cielo azul con nubes
- `1543466835-00a7240b2634` — agua tranquila, reflejo
- `1470770841072-f978cf4d5739` — campo abierto, luz de día

---

### Patrón obligatorio — hero con degradación elegante

**El hero NUNCA puede verse vacío si la imagen falla.**
Implementar siempre este patrón en dos partes:

**1. CSS — `.hbg` define el gradiente como visual primario (NO poner `background-image` en CSS):**
```css
.hbg {
  position: absolute; inset: 0;
  /* Gradiente que funciona solo, sin foto */
  background: linear-gradient(135deg, [COLOR_BASE] 0%, [COLOR_MEDIO] 60%, [COLOR_BASE] 100%);
}
.hbg::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(R,G,B,.88) 0%, rgba(R,G,B,.45) 55%, rgba(R,G,B,.75) 100%);
}
```

**2. JS — carga la foto solo si el servidor responde (al final del `<body>`, antes del IIFE de partículas):**
```javascript
(function(){
  const hbg = document.querySelector('.hbg');
  const url = 'https://images.unsplash.com/photo-[ID]?w=1400&q=80&fit=crop';
  const img = new Image();
  img.onload = () => {
    hbg.style.backgroundImage = `url('${url}')`;
    hbg.style.backgroundSize = 'cover';
    hbg.style.backgroundPosition = 'center';
  };
  img.src = url;
})();
```

**3. Galería — `onerror` en cada `<img>`:**
```html
<img src="https://images.unsplash.com/photo-[ID]?w=800&q=80&fit=crop"
     alt="..."
     loading="lazy"
     onerror="this.closest('.gal-item').style.background='linear-gradient(135deg,var(--card),var(--bg-alt))';this.remove();">
```

> Con este patrón: si la foto carga → hero impactante. Si falla → hero con identidad visual
> propia y coherente. Nunca un rectángulo negro vacío.

---

## Reglas técnicas del HTML

- Todo en **un solo archivo .html** (CSS y JS embebidos, sin archivos externos)
- Solo dependencia externa permitida: Google Fonts (CDN)
- **100% responsive**, mobile-first
- Animaciones: mínimo 4 tipos distintos, acordes al mood inferido
- Iframe de Maps: `https://maps.google.com/maps?q={direccion_encoded}&output=embed`
- Botón WhatsApp: limpiar número → solo dígitos → si empieza por 9, agregar prefijo 51
- Código organizado con comentarios: `<!-- HERO -->`, `<!-- SERVICIOS -->`, etc.
- NO usar frameworks JS (React, Vue, etc.)
- NO usar Bootstrap ni Tailwind
- SÍ usar CSS custom properties (variables) para la paleta
- **NUNCA editar un archivo HTML existente** — siempre crear desde cero
- Flujo obligatorio: `rm -f /mnt/user-data/outputs/{archivo}.html` → crear archivo nuevo completo
- Si el archivo ya existe, borrarlo con bash antes de escribir. Nunca hacer patch ni str_replace sobre una landing anterior.

---

### Regla para `.hero-content`
- `max-width` siempre valor fijo (ej: `720px`) — nunca `var(--max)` ni `width:100%`
- Asimetría permitida solo con `margin-left` de valor fijo, nunca con `calc((100vw - Xpx)/2)`
- Siempre incluir reset en mobile:
  `@media(max-width:768px){ .hero-content{ padding:0 1.5rem; margin-left:0; } }`

---

## Nomenclatura de archivos de salida

```
{id}-{nombre_slug}.html
```

Ejemplos:
- `barberia-016-barons-barber-shop.html`
- `dentista-039-multident-villa-el-salvador.html`
- `psicologo-020-centro-psicologico-crecer.html`

Slug: nombre en minúsculas, sin tildes, espacios reemplazados por guiones.

---

## Qué NO hacer

- ❌ No inventar IDs de Unsplash — usar solo el banco de esta sección
- ❌ No usar `source.unsplash.com` (está deprecado)
- ❌ No intentar navegar `url_google_maps` directamente (solo para iframe)
- ❌ No copiar reseñas literalmente de ninguna fuente
- ❌ No usar frases genéricas como "somos líderes en el sector"
- ❌ No poner datos ficticios si el campo está vacío (omitir o dejar placeholder)
- ❌ No hacer dos landings visualmente similares en el mismo batch
- ❌ No agregar `display:grid/flex`, `width:100%` ni propiedades de layout a `.wrap`
- ❌ No editar una landing existente — siempre `rm -f` + crear desde cero
- ❌ No poner datos de contacto como texto plano sin enlace (`tel:`, `wa.me`, Maps)
- ❌ No omitir el botón WhatsApp flotante bajo ninguna circunstancia
- ❌ El CTA del hero nunca es texto ni enlace simple — siempre botón WhatsApp con ícono SVG

---

## Qué hacer si faltan datos

| Campo vacío | Acción |
|---|---|
| `telefono` | Omitir en sección contacto |
| `whatsapp` | Omitir botón flotante (usar telefono si existe) |
| `website_actual` | Omitir enlace a web |
| `direccion` | Omitir iframe Maps, poner solo distrito |
| `rating` / `cantidad_resenas` | Omitir badge de reseñas |
| `oportunidad_textual` | Generar tagline desde rubro + distrito |
| `Estilo de pagina web` | Inferir mood completamente desde rubro + distrito + rating |

---

## Regla para el contenedor `.wrap`

**`.wrap` es un contenedor puro. Solo hace tres cosas:** `max-width`, `margin: 0 auto`, y `padding: 0 1.5rem`. Nada más.

**Nunca agregar a `.wrap` vía inline style:**
- `display: grid` o `display: flex` — van en un `<div>` hijo separado dentro del `.wrap`
- `width: 100%` — redundante en un elemento de bloque, omitirlo siempre
- `grid-template-columns`, `justify-content`, `flex-wrap`, `gap` — son propiedades de layout, no del contenedor

**Patrón correcto:**
```html
<!-- ✅ Bien -->
<section class="section">
  <div class="wrap">
    <div style="display:grid;gap:24px;"> <!-- layout aquí -->
      ...
    </div>
  </div>
</section>

<!-- ❌ Mal -->
<section class="section">
  <div class="wrap" style="display:grid;gap:24px;width:100%">
    ...
  </div>
</section>
```

La excepción permitida: propiedades de apilamiento (`position: relative; z-index`) cuando el `.wrap` necesita crear un contexto de apilamiento sobre un fondo absoluto.

---

## Entregables finales

1. Archivos `.html` en `/mnt/user-data/outputs/`
2. Resumen al terminar:

```
✅ Empresas procesadas: X
📁 Archivos generados:
   - barberia-016-barons-barber-shop.html
     Mood inferido: urbano-oscuro | Rating: 4.4 | Animación: street-energy
   - dentista-039-multident.html
     Mood inferido: clean-trust | Rating: 4.7 | Animación: fade-suave
⚠️  Empresas con datos faltantes: Y
```

---

## Copy — Idioma y tono

- **Idioma**: Español peruano
- **Tono**: Cercano, profesional, confiable
- **Evitar**: frases corporativas vacías, anglicismos innecesarios
- **Incluir**: Referencias locales al distrito cuando sea natural
