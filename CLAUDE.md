# CLAUDE.md — Reglas de comportamiento del proyecto

## Regla de confirmación — SIEMPRE

Antes de ejecutar cualquier acción (generar archivos, correr scripts, escribir outputs, renombrar, borrar):
1. Explicar qué vas a hacer
2. Preguntar al usuario si procede
3. Esperar confirmación explícita ("sí", "hazlo", "procede", "ejecuta")

Frases como "quiero ejecutar", "vamos a probar", "a ver cómo queda" **no son órdenes** — son intenciones. Confirmar siempre antes de actuar.

---

## Workflows disponibles

### Workflow A — Generación creativa desde cero
Instrucciones completas en `CLAUDEv1.md`.
Usar cuando se necesite generar una landing personalizada con mood inferido, copy propio e imágenes seleccionadas.

### Workflow B — Token replacement sobre plantillas
Instrucciones completas en `CLAUDEv2.md`.
Usar cuando se tenga un CSV y se quiera generar landings reemplazando tokens sobre las plantillas de `plantillas mood\`.

---

## Plantillas

Los archivos en `plantillas mood\` son **masters intocables**.
Nunca escribir, editar ni sobreescribir ningún archivo de esa carpeta.
