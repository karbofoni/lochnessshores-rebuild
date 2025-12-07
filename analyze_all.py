
import json
import re

def analyze_all_remaining():
    # Load data
    with open('data/campsites.json', 'r') as f:
        campsites = json.load(f)
    with open('data/trails.json', 'r') as f:
        trails = json.load(f)

    campsites_needed = []
    trails_needed = []

    # Check campsites
    for c in campsites:
        photos = c.get('photos', [])
        if not photos or (len(photos) > 0 and 'unsplash' in photos[0]):
            campsites_needed.append({
                'slug': c['slug'],
                'name': c['display_name'],
                'lat': c['latitude'],
                'lng': c['longitude'],
                'area_id': c.get('area_id', 'highlands')
            })

    # Check trails
    for t in trails:
        photos = t.get('photos', [])
        if not photos or (len(photos) > 0 and 'unsplash' in photos[0]):
            trails_needed.append({
                'slug': t['slug'],
                'name': t['name'],
                'lat': t['start_point_lat'],
                'lng': t['start_point_lng'],
                'area_id': t.get('area_id', 'highlands')
            })

    output_data = {
        'campsites': campsites_needed,
        'trails': trails_needed
    }

    with open('all_remaining.json', 'w') as f:
        json.dump(output_data, f, indent=2)

    print(f"Found {len(campsites_needed)} campsites and {len(trails_needed)} trails needing images.")

if __name__ == '__main__':
    print("Starting analysis...")
    try:
        analyze_all_remaining()
    except Exception as e:
        print(f"Analysis failed: {e}")
