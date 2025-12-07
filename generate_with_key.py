
import google.generativeai as genai
import json
import os
import time
from pathlib import Path

# Configure API Key
API_KEY = "AIzaSyCC-2Sh1Jh6ir5MZQfdL1dQ9rNn3iFHE3Y"
genai.configure(api_key=API_KEY)

# Load batch data
with open('next_batch.json', 'r') as f:
    batch_data = json.load(f)

# Output directory
output_dir = Path("d:/im/Firma/MV/lochnessshores.com2/public/images/generated")
output_dir.mkdir(parents=True, exist_ok=True)


import requests
import base64

# ... (imports and setup)

# Process Trails
trails = batch_data['trails']
completed_slugs = ["cambridgeshire-drive"]

print(f"Starting generation for {len(trails)} trails (skipping completed)...")

for trail in trails:
    if trail['slug'] in completed_slugs:
        print(f"Skipping {trail['slug']} (already done)")
        continue

    print(f"Generating image for: {trail['name']}")
    
    prompt = f"A scenic view of the hiking trail {trail['name']} at latitude {trail['lat']}, longitude {trail['lng']}, {trail['area_id']} area, nature path, beautiful photorealistic view."
    
    filename = f"trail_{trail['slug'].replace('-', '_')}.png"
    filepath = output_dir / filename

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key={API_KEY}"
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
            # Predictions usually come as base64 string
            if 'predictions' in result and len(result['predictions']) > 0:
                # Structure might be predictions[0]['bytesBase64Encoded'] or similar
                # Let's check common response format for Imagen
                b64_data = result['predictions'][0].get('bytesBase64Encoded')
                if not b64_data:
                    # Try accessing it if it's simpler string
                    b64_data = result['predictions'][0]
                
                # If it's a dict, it might be in 'bytesBase64Encoded'
                if isinstance(b64_data, dict):
                     b64_data = b64_data.get('bytesBase64Encoded')
                
                if b64_data:
                    img_data = base64.b64decode(b64_data)
                    with open(filepath, 'wb') as f:
                        f.write(img_data)
                    print(f"Saved to {filepath}")
                else:
                    print(f"Unexpected response format: {result}")
            else:
                 print(f"No predictions in response: {result}")
        else:
            print(f"Error {response.status_code}: {response.text}")

    except Exception as e:
        print(f"Error generating {trail['slug']}: {e}")
    
    time.sleep(4)
 
