from PIL import Image, ImageDraw
from pathlib import Path

out = Path(__file__).resolve().parents[1] / 'src' / 'assets' / 'passport-template.png'
out.parent.mkdir(parents=True, exist_ok=True)
W, H = 1600, 1120
img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
# soft page shadow
for pad, alpha in [(30, 18), (20, 26), (10, 34)]:
    d.rounded_rectangle((pad, pad, W-pad, H-pad), radius=32, fill=(37, 50, 56, alpha))
# warm notebook page
d.rounded_rectangle((24, 18, W-24, H-18), radius=30, fill=(255, 252, 244, 255), outline=(210, 190, 166, 190), width=3)
# faint notebook gutter and margin line
d.line((104, 42, 104, H-42), fill=(193, 114, 94, 120), width=3)
d.line((118, 42, 118, H-42), fill=(236, 207, 190, 180), width=2)
# ruled lines
for y in range(110, H-42, 42):
    d.line((48, y, W-48, y), fill=(157, 186, 188, 55), width=2)
# subtle center crease for an open notebook feel
d.line((W//2, 44, W//2, H-44), fill=(185, 171, 151, 72), width=3)
# small copper corner marks
d.arc((38, 32, 102, 96), start=180, end=270, fill=(184, 121, 86, 150), width=3)
d.arc((W-102, H-96, W-38, H-32), start=0, end=90, fill=(184, 121, 86, 150), width=3)
img.save(out)
print(out)
