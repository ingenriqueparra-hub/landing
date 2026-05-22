import os, re

rubros = ['barberia', 'dental', 'fotografia', 'psicologo']
src = 'plantillas mood/src'
dist = 'plantillas mood/dist'
os.makedirs(dist, exist_ok=True)

for r in rubros:
    html = open(f'{src}/plantilla-{r}.html', encoding='utf-8').read()
    css  = open(f'{src}/plantilla-{r}.css',  encoding='utf-8').read()
    js   = open(f'{src}/plantilla-{r}.js',   encoding='utf-8').read()
    out  = html.replace(f'<link rel="stylesheet" href="plantilla-{r}.css">',
                        f'<style>\n{css}\n</style>')
    out  = out.replace(f'<script src="plantilla-{r}.js"></script>',
                        f'<script>\n{js}\n</script>')
    open(f'{dist}/plantilla-{r}.html', 'w', encoding='utf-8').write(out)
    print(f'✅ dist/plantilla-{r}.html generado')
