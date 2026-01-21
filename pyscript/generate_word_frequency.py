import json
import os
from collections import defaultdict

def main():
    # Define paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    assets_dir = os.path.join(project_root, 'src', 'assets')
    word_path = os.path.join(assets_dir, 'word.json')
    surah_path = os.path.join(assets_dir, 'surah.json')
    output_path = os.path.join(assets_dir, 'word_frequency.json')

    if not os.path.exists(word_path) or not os.path.exists(surah_path):
        print("Error: Input files not found.")
        return

    print("Loading data...")
    try:
        with open(word_path, 'r', encoding='utf-8') as f:
            word_data = json.load(f)
        with open(surah_path, 'r', encoding='utf-8') as f:
            surah_data = json.load(f)
    except Exception as e:
        print(f"Error reading JSON: {e}")
        return

    # Build Global Ayah ID -> (Surah Num, Ayah Num) map
    print("Building location map...")
    global_ayah_to_location = {}
    
    # Sort surahs by ID to ensure correct processing order if needed, though dict order usually fine
    sorted_surah_ids = sorted(surah_data.keys(), key=lambda x: int(x))
    
    for surah_id_str in sorted_surah_ids:
        surah_id = int(surah_id_str)
        surah_info = surah_data[surah_id_str]
        start_global = surah_info['start']
        end_global = surah_info['end']
        
        current_ayah_num = 1
        for global_id in range(start_global, end_global + 1):
            global_ayah_to_location[global_id] = {
                "surah": surah_id,
                "ayah": current_ayah_num
            }
            current_ayah_num += 1

    print("Processing word frequencies and locations...")
    # Dictionary to store word data: text -> {count: 0, occurrences: []}
    words_map = defaultdict(lambda: {"count": 0, "occurrences": []})

    for key, value in word_data.items():
        if 'uthmani' not in value or 'ayah' not in value:
            continue

        text = value['uthmani']
        global_ayah_id = value['ayah']
        
        location_info = global_ayah_to_location.get(global_ayah_id)
        if not location_info:
            print(f"Warning: No location found for global ayah ID {global_ayah_id}")
            continue

        # Create occurrence object with location and word index
        occurrence = {
            "surah": location_info["surah"],
            "ayah": location_info["ayah"],
            "index": int(key)
        }

        words_map[text]["count"] += 1
        words_map[text]["occurrences"].append(occurrence)

    # Convert to list and sort
    print("Sorting and formatting...")
    output_data = []
    
    for text, data in words_map.items():
        # Sort occurrences by surah then ayah, then index
        sorted_occurrences = sorted(
            data["occurrences"], 
            key=lambda x: (x["surah"], x["ayah"], x["index"])
        )
        
        output_data.append({
            "text": text,
            "count": data["count"],
            "occurrences": sorted_occurrences
        })

    # Sort main list by frequency (descending)
    output_data.sort(key=lambda x: x["count"], reverse=True)

    print(f"Writing {len(output_data)} distinct words to {output_path}...")
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)
        print("Success!")
    except Exception as e:
        print(f"Error writing output: {e}")

if __name__ == "__main__":
    main()
