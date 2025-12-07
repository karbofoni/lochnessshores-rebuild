
import json
import os

campsites_path = 'd:/im/Firma/MV/lochnessshores.com2/data/campsites.json'
trails_path = 'd:/im/Firma/MV/lochnessshores.com2/data/trails.json'

def count_remaining(path, type_name):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    remaining = []
    for item in data:
        # Check if photos exist and if the first one is a remote URL (Unsplash)
        if item.get('photos') and len(item['photos']) > 0:
            photo = item['photos'][0]
            if photo.startswith('http') and 'unsplash' in photo:
                remaining.append(item['slug'])
    
    print(f"{type_name}: {len(remaining)} remaining out of {len(data)}")
    return remaining


    return remaining

remaining_campsites = count_remaining(campsites_path, "Campsites")
remaining_trails = count_remaining(trails_path, "Trails")

def get_details(slugs, path):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    details = []
    for slug in slugs:
        for item in data:
            if item['slug'] == slug:
                details.append({
                    'slug': slug,
                    'name': item.get('display_name') or item.get('name'),
                    'lat': item.get('latitude') or item.get('start_point_lat'),
                    'lng': item.get('longitude') or item.get('start_point_lng'),
                    'area_id': item['area_id']
                })
                break
    return details

next_campsites = get_details(remaining_campsites[:10], campsites_path)
next_trails = get_details(remaining_trails[:10], trails_path)

batch_data = {
    'campsites': next_campsites,
    'trails': next_trails
}

with open('next_batch.json', 'w') as f:
    json.dump(batch_data, f, indent=2)

print("Next batch details saved to next_batch.json")

