
import json
import os
from pathlib import Path

def update_data_from_files():
    img_dir = Path("d:/im/Firma/MV/lochnessshores.com2/public/images/generated")
    campsites_path = Path("d:/im/Firma/MV/lochnessshores.com2/data/campsites.json")
    trails_path = Path("d:/im/Firma/MV/lochnessshores.com2/data/trails.json")

    # Load data
    with open(campsites_path, 'r', encoding='utf-8') as f:
        campsites = json.load(f)
    with open(trails_path, 'r', encoding='utf-8') as f:
        trails = json.load(f)

    # Get all generated images
    files = list(img_dir.glob("*.png"))
    print(f"Found {len(files)} generated images.")

    updated_count = 0

    for file in files:
        filename = file.name
        # Parse slug
        if filename.startswith("campsite_"):
            slug = filename[9:-4] # remove campsite_ and .png
            # Find in campsites
            for c in campsites:
                if c['slug'] == slug or c['slug'].replace('-', '_') == slug:
                    # Update if not already local
                    current_photos = c.get('photos', [])
                    new_path = f"/images/generated/{filename}"
                    if not current_photos or current_photos[0] != new_path:
                         c['photos'] = [new_path]
                         updated_count += 1
                    break
        elif filename.startswith("trail_"):
            slug = filename[6:-4] # remove trail_ and .png
            # Find in trails
            for t in trails:
                if t['slug'] == slug or t['slug'].replace('-', '_') == slug:
                    current_photos = t.get('photos', [])
                    new_path = f"/images/generated/{filename}"
                    if not current_photos or current_photos[0] != new_path:
                         t['photos'] = [new_path]
                         updated_count += 1
                    break

    # Save data
    with open(campsites_path, 'w', encoding='utf-8') as f:
        json.dump(campsites, f, indent=2)
    with open(trails_path, 'w', encoding='utf-8') as f:
        json.dump(trails, f, indent=2)

    print(f"Updated {updated_count} entries in data files.")

if __name__ == '__main__':
    update_data_from_files()
