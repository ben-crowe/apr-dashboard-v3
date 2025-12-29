#!/bin/bash
# Run this AFTER unzipping extracted-images.zip into your test-data folder
# Usage: ./organize-images.sh /path/to/test-data/images

TARGET_DIR="${1:-./test-data/images}"

# Create folder structure
mkdir -p "$TARGET_DIR/branding"
mkdir -p "$TARGET_DIR/subject"
mkdir -p "$TARGET_DIR/maps"
mkdir -p "$TARGET_DIR/comparables"
mkdir -p "$TARGET_DIR/site"

# Source directory (where you unzipped)
SRC="./extracted-images"

# Branding
cp "$SRC/image1.png" "$TARGET_DIR/branding/company-logo.png"
cp "$SRC/image2.jpeg" "$TARGET_DIR/branding/cover-photo.jpeg"
cp "$SRC/image89.png" "$TARGET_DIR/branding/appraiser-bio.png"

# Subject Photos (1-24)
for i in {1..24}; do
    src_num=$((11 + i))
    cp "$SRC/image${src_num}.jpeg" "$TARGET_DIR/subject/subject-photo-${i}.jpeg"
done

# Maps
cp "$SRC/image36.png" "$TARGET_DIR/maps/map-regional.png"
cp "$SRC/image37.png" "$TARGET_DIR/maps/map-aerial.png"
cp "$SRC/image38.png" "$TARGET_DIR/maps/map-local.png"
cp "$SRC/image48.png" "$TARGET_DIR/maps/zoning-map.png"
cp "$SRC/image49.png" "$TARGET_DIR/maps/flood-map.png"
cp "$SRC/image72.png" "$TARGET_DIR/maps/sales-comparables-map.png"
cp "$SRC/image57.png" "$TARGET_DIR/maps/rental-comparables-map.png"

# Sales Comp Photos
cp "$SRC/image73.jpg" "$TARGET_DIR/comparables/comp1-photo.jpg"
cp "$SRC/image75.jpg" "$TARGET_DIR/comparables/comp2-photo.jpg"
cp "$SRC/image77.jpg" "$TARGET_DIR/comparables/comp3-photo.jpg"
cp "$SRC/image79.png" "$TARGET_DIR/comparables/comp4-photo.png"
cp "$SRC/image81.png" "$TARGET_DIR/comparables/comp5-photo.png"

# Sales Comp Maps
cp "$SRC/image74.png" "$TARGET_DIR/comparables/comp1-map.png"
cp "$SRC/image76.png" "$TARGET_DIR/comparables/comp2-map.png"
cp "$SRC/image78.png" "$TARGET_DIR/comparables/comp3-map.png"
cp "$SRC/image80.png" "$TARGET_DIR/comparables/comp4-map.png"
cp "$SRC/image82.png" "$TARGET_DIR/comparables/comp5-map.png"

# Site Plans
cp "$SRC/image44.png" "$TARGET_DIR/site/site-plan-1.png"
cp "$SRC/image45.png" "$TARGET_DIR/site/site-plan-2.png"

echo "Done! Images organized into $TARGET_DIR"
echo "Folder structure:"
find "$TARGET_DIR" -type f | head -20
