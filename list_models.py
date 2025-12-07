
import google.generativeai as genai
import os

API_KEY = "AIzaSyCC-2Sh1Jh6ir5MZQfdL1dQ9rNn3iFHE3Y"
genai.configure(api_key=API_KEY)

print("Listing available models...")

try:
    for m in genai.list_models():
        if 'image' in m.name.lower() or 'image' in str(m.supported_generation_methods).lower():
            print(f"Name: {m.name}")
            print(f"Supported generation methods: {m.supported_generation_methods}")
            print("-" * 20)
except Exception as e:
    print(f"Error listing models: {e}")

