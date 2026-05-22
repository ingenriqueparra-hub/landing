# AGENTS.md

## Project Rules

- Follow `CLAUDEV2.md` for token replacement, CSV normalization, output naming, and final batch summaries.
- Do not edit generated unified templates by hand.
- Template source edits belong in `plantillas mood/src/`.
- After editing any file in `plantillas mood/src/`, run the unification build:
  - `python3 "plantillas mood/build.py"` when available.
  - On this Windows workspace, use the local Python executable if `python3` is unavailable.
- The build output is `plantillas mood/dist/`.
- Do not use the browser to verify template builds unless the user explicitly asks for it.

## Template Contract

Every source template must preserve these 9 tokens:

- `{{NOMBRE_NEGOCIO}}`
- `{{DISTRITO}}`
- `{{DIRECCION}}`
- `{{TELEFONO}}`
- `{{WHATSAPP}}`
- `{{URL_MAPS}}`
- `{{RATING}}`
- `{{RESENAS}}`
- `{{TAGLINE}}`

## Editing Flow

1. Edit only the relevant `.html`, `.css`, or `.js` source files in `plantillas mood/src/`.
2. Keep token names exact.
3. Run `plantillas mood/build.py`.
4. Do not manually modify files in `plantillas mood/dist/`.
