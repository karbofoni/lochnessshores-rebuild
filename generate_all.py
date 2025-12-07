
import requests
import base64
import json
import time
from pathlib import Path
import os


try:
    with open('api_key.txt', 'r') as f:
        API_KEY = f.read().strip()
except FileNotFoundError:
    print("Error: api_key.txt not found.")
    exit(1)

OUTPUT_DIR = Path("d:/im/Firma/MV/lochnessshores.com2/public/images/generated")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def generate_image(name, lat, lng, area_path, slug):
    filename = f"{area_path}_{slug.replace('-', '_')}.png"
    filepath = OUTPUT_DIR / filename
    
    if filepath.exists():
        print(f"Skipping {slug} (already exists)")
        return

    print(f"Generating image for: {name} ({slug})")
    
    prompt = f"A scenic view of {name} at latitude {lat}, longitude {lng}, nature, photorealistic, beautiful view."
    # Customize prompt based on type (campsite vs trail) if needed, but generic is fine for now.

    # Retry loop
    max_retries = 3
    for attempt in range(max_retries):
        try:
            # Using Ultra model to test separate quota
            url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-ultra-generate-001:predict?key={API_KEY}"
            headers = {'Content-Type': 'application/json'}
            data = {
                "instances": [
                    {"prompt": prompt}
                ],
                "parameters": {
                    "sampleCount": 1,
                    "aspectRatio": "4:3"
                }
            }
            
            response = requests.post(url, headers=headers, json=data)
            
            if response.status_code == 200:
                result = response.json()
                if 'predictions' in result and len(result['predictions']) > 0:
                    b64_data = result['predictions'][0].get('bytesBase64Encoded')
                    if not b64_data and isinstance(result['predictions'][0], str):
                        b64_data = result['predictions'][0]
                    elif isinstance(result['predictions'][0], dict):
                        b64_data = result['predictions'][0].get('bytesBase64Encoded')
                    
                    if b64_data:
                        img_data = base64.b64decode(b64_data)
                        with open(filepath, 'wb') as f:
                            f.write(img_data)
                        print(f"Saved to {filepath}")
                        break # Success, exit retry loop
                    else:
                        print(f"Unexpected response format: {result}")
                        break # Don't retry on format error
                else:
                    print(f"No predictions in response: {result}")
                    break
            elif response.status_code == 429:
                print(f"Rate limit hit (429): {response.text[:200]}...")
                print(f"Waiting 60s before retry {attempt+1}/{max_retries}...")
                time.sleep(60)
            else:
                print(f"Error {response.status_code}: {response.text}")
                break # Don't retry on other errors
                
        except Exception as e:
            print(f"Error generating {slug}: {e}")
            break
        
    time.sleep(2) # Reduced sleep for fast model

def main():
    with open('all_remaining.json', 'r') as f:
        data = json.load(f)

    # Campsites
    print(f"Processing {len(data['campsites'])} campsites...")
    for c in data['campsites']:
        generate_image(c['name'], c['lat'], c['lng'], "campsite", c['slug'])

    # Trails
    print(f"Processing {len(data['trails'])} trails...")
    for t in data['trails']:
        generate_image(t['name'], t['lat'], t['lng'], "trail", t['slug'])

if __name__ == '__main__':
    main()
