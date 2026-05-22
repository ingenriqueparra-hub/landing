# ClaudeV2.md — Generador de Landings por Token Replacement

## Objetivo
Generar una landing page personalizada por empresa leyendo un CSV,
tomando la plantilla del rubro correspondiente, reemplazando los 9 tokens
con los datos reales, y guardando el resultado como un archivo nuevo.

**No se genera HTML desde cero. No se infiere mood. No se escribe copy.**
La plantilla ya tiene todo eso — solo se reemplazan los datos del negocio.

---

## ⚠️ REGLA ABSOLUTA — Las plantillas son masters

Los archivos en `plantillas mood\` son **intocables bajo cualquier circunstancia**.

- **NUNCA escribir, editar ni sobreescribir** ningún archivo de `plantillas mood\`
- Cada empresa produce un archivo de salida **nuevo** (`{id}-{slug}.html`)
- Flujo obligatorio: leer plantilla → copiar en memoria → reemplazar tokens → guardar nuevo archivo
- Esta regla tiene prioridad sobre cualquier otra instrucción del proyecto

---

## Plantillas disponibles

| Rubro (valor exacto en CSV) | Plantilla |
|---|---|
| `Barbería` | `plantillas mood\plantilla-barberia.html` |
| `Clínica dental` | `plantillas mood\plantilla-dental.html` |
| `Psicólogo` | `plantillas mood\plantilla-psicologo.html` |
| `Estudio de fotografía` | `plantillas mood\plantilla-fotografia.html` |

Si el rubro del CSV no coincide exactamente → reportar en resumen y omitir esa fila.

---

## Tokens a reemplazar

| Token | Campo CSV | Regla de limpieza |
|---|---|---|
| `{{NOMBRE_NEGOCIO}}` | `nombre_negocio` | Tal cual |
| `{{DISTRITO}}` | `distrito` | Tal cual |
| `{{DIRECCION}}` | `direccion` | Tal cual |
| `{{TELEFONO}}` | `telefono` | Solo dígitos, sin espacios ni guiones |
| `{{WHATSAPP}}` | `whatsapp` | Solo dígitos · si empieza en 9 y tiene 9 dígitos → agregar `51` · si está vacío → usar `telefono` limpio |
| `{{URL_MAPS}}` | `url_google_maps` | Tal cual |
| `{{RATING}}` | `rating` | Punto decimal (si viene con coma → convertir: `4,3` → `4.3`) |
| `{{RESENAS}}` | `cantidad_resenas` | Solo número entero |
| `{{TAGLINE}}` | `oportunidad_textual` | Si vacío → `{nombre_negocio} en {distrito}` |

---

## Normalización de datos sucios

| Dato sucio | Acción |
|---|---|
| `rating` con coma (`4,3`) | Convertir a `4.3` |
| `whatsapp` con espacios, guiones o paréntesis | Extraer solo dígitos |
| `whatsapp` empieza en 9 y tiene 9 dígitos | Agregar prefijo `51` |
| `whatsapp` ya empieza en `51` | Usar tal cual |
| `telefono` con formato `(01) 234-5678` | Normalizar a solo dígitos |
| Campo vacío, `"N/A"`, `"-"`, `"n/a"` | Tratar como vacío → aplicar tabla de datos faltantes |

---

## Qué hacer si faltan datos

| Campo vacío | Acción |
|---|---|
| `telefono` | Omitir la tarjeta de teléfono en contacto |
| `whatsapp` | Usar `telefono` limpio; si tampoco hay → omitir botón flotante |
| `direccion` | Omitir iframe Maps, mostrar solo el distrito |
| `url_google_maps` | Omitir iframe y botón "Ver en Google Maps" |
| `rating` / `cantidad_resenas` | Omitir sección de estadísticas |
| `oportunidad_textual` | Generar tagline: `{nombre_negocio} en {distrito}` |

---

## Flujo por cada empresa

```
1. Leer la fila del CSV
2. Normalizar los datos sucios (tabla arriba)
3. Verificar que el rubro tenga plantilla → si no → reportar y saltar
4. Leer la plantilla correspondiente (NO modificarla)
5. Hacer copia completa en memoria
6. Reemplazar los 9 tokens con los datos normalizados
7. Guardar como {id}-{slug}.html en la carpeta de salida
8. Continuar con la siguiente fila
```

**Orden:** siempre secuencial, una empresa a la vez.

---

## Nomenclatura de archivos de salida

```
{id}-{nombre_slug}.html
```

- `id` = valor del campo `id` del CSV tal cual
- `nombre_slug` = `nombre_negocio` en minúsculas, sin tildes, espacios → guiones

Ejemplos:
- `barberia-012-barber-studio-lima.html`
- `dental-039-multident-villa-el-salvador.html`
- `psicologo-020-centro-psicologico-crecer.html`

---

## Resumen final

Al terminar el batch, emitir este bloque:

```
✅ Landings generadas: X
📁 Archivos:
   - {id}-{slug}.html · rubro: [rubro] · tokens reemplazados: 9
⚠️  Omitidas (rubro no reconocido): Y → listar nombres
⚠️  Tokens sin datos: Z → listar cuáles y en qué empresa
```
