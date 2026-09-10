import os
import sys
from pathlib import Path
from PIL import Image, ImageOps

# Ensure UTF-8 stdout on Windows terminals
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# ==============================================================================
# Configuration
# ==============================================================================
SCRIPT_DIR = Path(__file__).resolve().parent
INPUT_DIR = SCRIPT_DIR / "new_images"
OUTPUT_DIR = SCRIPT_DIR / "converted_images"

# Target thumbnail dimensions (crisp for 300x200px tiles on 2x retina displays)
MAX_WIDTH = 600
MAX_HEIGHT = 450

# Compression quality (1-100). 80 gives visually identical quality at ~90-95% size reduction
IMAGE_QUALITY = 80

# Supported image formats
VALID_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}

def format_size(size_bytes: int) -> str:
    """Format bytes to human readable string."""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.2f} MB"

def optimize_image(input_path: Path, output_path: Path) -> tuple[int, int]:
    """
    Open, auto-orient, resize and compress a single image.
    Returns (original_size, new_size).
    """
    orig_size = input_path.stat().st_size

    with Image.open(input_path) as img:
        # Correct phone/camera orientation using EXIF data
        img = ImageOps.exif_transpose(img)

        # Convert RGBA / palette modes if saving as JPEG
        ext = output_path.suffix.lower()
        if ext in {".jpg", ".jpeg"}:
            if img.mode in ("RGBA", "LA", "P"):
                # Create a solid white background for transparent images
                background = Image.new("RGB", img.size, (255, 255, 255))
                if img.mode == "P":
                    img = img.convert("RGBA")
                background.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
                img = background
            elif img.mode != "RGB":
                img = img.convert("RGB")

        # Resize with high quality Lanczos filter while preserving aspect ratio
        img.thumbnail((MAX_WIDTH, MAX_HEIGHT), Image.Resampling.LANCZOS)

        # Save with optimization
        if ext in {".jpg", ".jpeg"}:
            img.save(output_path, "JPEG", quality=IMAGE_QUALITY, optimize=True)
        elif ext == ".webp":
            img.save(output_path, "WEBP", quality=IMAGE_QUALITY, method=6)
        elif ext == ".png":
            img.save(output_path, "PNG", optimize=True)
        else:
            img.save(output_path, quality=IMAGE_QUALITY)

    new_size = output_path.stat().st_size
    return orig_size, new_size

def main():
    # Ensure input and output folders exist
    INPUT_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Find all images in input folder
    image_files = [f for f in INPUT_DIR.iterdir() if f.is_file() and f.suffix.lower() in VALID_EXTENSIONS]

    if not image_files:
        print("=" * 65)
        print(f"[!] No images found in: {INPUT_DIR}")
        print("=" * 65)
        print("Instructions:")
        print(f" 1. Put your raw images into: {INPUT_DIR}")
        print(" 2. Run this script: python public/script/convert_images.py")
        print(f" 3. Optimized images will appear in: {OUTPUT_DIR}")
        print(" 4. Copy converted images into 'public/wall/' whenever ready.")
        print("=" * 65)
        return

    print("=" * 65)
    print(f"Processing {len(image_files)} image(s)...")
    print(f"  Target Max Resolution : {MAX_WIDTH}x{MAX_HEIGHT}")
    print(f"  Quality Setting       : {IMAGE_QUALITY}%")
    print(f"  Source Folder         : {INPUT_DIR}")
    print(f"  Output Folder         : {OUTPUT_DIR}")
    print("=" * 65)

    total_orig = 0
    total_new = 0

    for idx, img_file in enumerate(image_files, 1):
        output_file = OUTPUT_DIR / img_file.name
        try:
            orig_size, new_size = optimize_image(img_file, output_file)
            total_orig += orig_size
            total_new += new_size
            reduction = ((orig_size - new_size) / orig_size) * 100 if orig_size > 0 else 0

            print(f"[{idx}/{len(image_files)}] OK: {img_file.name}")
            print(f"       {format_size(orig_size)} -> {format_size(new_size)} ({reduction:.1f}% saved)")
        except Exception as e:
            print(f"[{idx}/{len(image_files)}] ERROR on {img_file.name}: {e}")

    print("=" * 65)
    total_reduction = ((total_orig - total_new) / total_orig) * 100 if total_orig > 0 else 0
    print(f"Complete! Total size reduced from {format_size(total_orig)} to {format_size(total_new)} ({total_reduction:.1f}% reduction)")
    print(f"You can now copy files from '{OUTPUT_DIR.name}' directly to 'public/wall/'")
    print("=" * 65)

if __name__ == "__main__":
    main()
