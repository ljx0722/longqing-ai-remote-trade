"""Regenerate the offline relative-relief raster from its attributed source image."""
from pathlib import Path
from PIL import Image

project = Path(__file__).resolve().parent.parent
source = project / 'public/data/earth-elevation.jpg'
image = Image.open(source).convert('L').resize((1024, 512), Image.Resampling.LANCZOS)
target = project / 'public/data/elevation.bin'
target.write_bytes(image.tobytes())
print(f'{target.name}: {target.stat().st_size} bytes, 1024 x 512, unsigned grayscale')
