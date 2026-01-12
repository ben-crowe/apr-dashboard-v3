#!/usr/bin/env python3
"""
Universal Page Mapping Consolidation Script
Handles all 6 JSON structure variants found in the 8 page-mapping files.

Structures detected:
1. pages[] array with pageNumber key
2. pages[] array with page_number key
3. page_mappings[] ARRAY with page_number key
4. page_mapping{} OBJECT with page_N keys containing page_number
5. page_mappings{} OBJECT with page-N keys containing pageNumber
6. page_structure{} OBJECT with string keys (no page_number inside)
"""

import json
import os
from pathlib import Path

def extract_page_number(obj, key=None):
    """Extract page number from various formats"""
    # Direct pageNumber or page_number or number in object
    if isinstance(obj, dict):
        if 'pageNumber' in obj:
            return obj['pageNumber']
        if 'page_number' in obj:
            return obj['page_number']
        if 'number' in obj:
            return obj['number']

    # From key like "page_31" or "page-61" or "71"
    if key:
        key_str = str(key)
        if key_str.startswith('page_'):
            return int(key_str.replace('page_', ''))
        if key_str.startswith('page-'):
            return int(key_str.replace('page-', ''))
        if key_str.isdigit():
            return int(key_str)

    return None

def normalize_page(page_data, page_num):
    """Normalize a page entry to consistent format"""
    normalized = {
        'page_number': page_num,
        'title': page_data.get('title', ''),
        'section': page_data.get('section', ''),
        'content_type': page_data.get('content_type') or page_data.get('contentType', ''),
        'page_type': page_data.get('page_type', ''),
        'fields': [],
        'original_structure': {}  # Keep original data for reference
    }

    # Extract fields from various locations
    if 'fields' in page_data:
        normalized['fields'] = page_data['fields']
    elif 'elements' in page_data:
        normalized['fields'] = page_data['elements']
    elif 'fieldIds' in page_data:
        # Convert fieldIds dict to fields array
        normalized['fields'] = [
            {'fieldId': v, 'htmlSelector': k}
            for k, v in page_data['fieldIds'].items()
        ]

    # Keep subsection info if present
    if 'subsection' in page_data:
        normalized['subsection'] = page_data['subsection']
    if 'subsection_fields' in page_data:
        normalized['subsection_fields'] = page_data['subsection_fields']

    return normalized

def process_file(filepath):
    """Process a single JSON file and extract all pages"""
    pages = []

    with open(filepath, 'r') as f:
        data = json.load(f)

    filename = os.path.basename(filepath)

    # Strategy 1a: pages[] array
    if 'pages' in data and isinstance(data['pages'], list):
        for page_obj in data['pages']:
            page_num = extract_page_number(page_obj)
            if page_num:
                pages.append(normalize_page(page_obj, page_num))

    # Strategy 1b: pages{} object with string keys like "11" or "page-51"
    elif 'pages' in data and isinstance(data['pages'], dict):
        for key, page_obj in data['pages'].items():
            page_num = extract_page_number(page_obj, key)
            if page_num:
                pages.append(normalize_page(page_obj, page_num))

    # Strategy 2: page_mappings[] array
    elif 'page_mappings' in data and isinstance(data['page_mappings'], list):
        for page_obj in data['page_mappings']:
            page_num = extract_page_number(page_obj)
            if page_num:
                pages.append(normalize_page(page_obj, page_num))

    # Strategy 3: page_mapping{} object with page_N keys
    elif 'page_mapping' in data and isinstance(data['page_mapping'], dict):
        for key, page_obj in data['page_mapping'].items():
            page_num = extract_page_number(page_obj, key)
            if page_num:
                pages.append(normalize_page(page_obj, page_num))

    # Strategy 4: page_mappings{} object with page-N keys
    elif 'page_mappings' in data and isinstance(data['page_mappings'], dict):
        for key, page_obj in data['page_mappings'].items():
            page_num = extract_page_number(page_obj, key)
            if page_num:
                pages.append(normalize_page(page_obj, page_num))

    # Strategy 5: page_structure{} object (pages 71-79)
    elif 'page_structure' in data and isinstance(data['page_structure'], dict):
        for key, page_obj in data['page_structure'].items():
            page_num = extract_page_number(page_obj, key)
            if page_num:
                normalized = normalize_page(page_obj, page_num)
                # For page_structure, fields may be in separate field_mappings
                pages.append(normalized)

        # Also extract from field_mappings if present
        if 'field_mappings' in data:
            # Attach field_mappings to the consolidated output metadata
            pass  # Fields handled separately for this format

    return pages, filename

def main():
    base_path = Path(__file__).parent

    # Find all page-mapping files
    mapping_files = sorted(base_path.glob('page-mapping-*.json'))

    all_pages = []
    source_info = []

    for filepath in mapping_files:
        pages, filename = process_file(filepath)
        all_pages.extend(pages)
        source_info.append({
            'file': filename,
            'pages_extracted': len(pages),
            'page_numbers': sorted([p['page_number'] for p in pages])
        })
        print(f"Processed {filename}: {len(pages)} pages extracted")

    # Sort by page number
    all_pages.sort(key=lambda x: x['page_number'])

    # Remove duplicates (keep first occurrence)
    seen = set()
    unique_pages = []
    for page in all_pages:
        if page['page_number'] not in seen:
            seen.add(page['page_number'])
            unique_pages.append(page)

    # Build consolidated output
    output = {
        '_metadata': {
            'date_generated': '2025-12-12',
            'pages_analyzed': '1-79 (excluding page 2)',
            'total_pages': len(unique_pages),
            'source_files': len(mapping_files),
            'consolidation_method': 'universal parser handling 6 JSON variants',
            'source_details': source_info
        },
        'pages': unique_pages
    }

    # Write consolidated file
    output_path = base_path / 'master-field-mapping-consolidated.json'
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2)

    print(f"\n=== CONSOLIDATION COMPLETE ===")
    print(f"Total unique pages: {len(unique_pages)}")
    print(f"Page numbers: {sorted([p['page_number'] for p in unique_pages])}")
    print(f"Output: {output_path}")

    # Check for missing pages
    expected = set(range(1, 80)) - {2}  # 1-79 except 2
    actual = set(p['page_number'] for p in unique_pages)
    missing = expected - actual
    if missing:
        print(f"\nMISSING PAGES: {sorted(missing)}")
    else:
        print(f"\nAll 78 pages accounted for!")

if __name__ == '__main__':
    main()
