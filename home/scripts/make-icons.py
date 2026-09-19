"""Placeholder icon: the character 字 drawn from the stroke data on a practice grid.
Run:  python3 scripts/make-icons.py
When the real icon arrives, use scripts/set-icon.sh instead."""
import json, os, fitz  # PyMuPDF

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data = json.load(open(os.path.join(root, 'scripts', '.cache', 's-字.json')))
paths = ''.join(f'<path d="{p}"/>' for p in data['strokes'])

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
<rect width="1024" height="1024" fill="#0e1116"/>
<g stroke="#283040" stroke-width="6" fill="none">
<line x1="0" y1="0" x2="1024" y2="1024"/><line x1="1024" y1="0" x2="0" y2="1024"/>
<line x1="512" y1="0" x2="512" y2="1024"/><line x1="0" y1="512" x2="1024" y2="512"/>
</g>
<g transform="translate(176,176) scale(0.6875)"><g transform="translate(0,900) scale(1,-1)" fill="#4fd1c5">{paths}</g></g>
</svg>'''

icons = os.path.join(root, 'icons')
os.makedirs(icons, exist_ok=True)
svg_path = os.path.join(icons, 'source.svg')
open(svg_path, 'w').write(svg)

doc = fitz.open(svg_path)
page = doc[0]
for name, px in [('icon-512.png', 512), ('icon-192.png', 192), ('apple-touch-icon.png', 180)]:
    z = px / page.rect.width
    page.get_pixmap(matrix=fitz.Matrix(z, z), alpha=False).save(os.path.join(icons, name))
    print('wrote', name)
