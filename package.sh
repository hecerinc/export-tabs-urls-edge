#!/bin/bash

# Script to package the stuff ready to be distributed

set -euo pipefail

echo "Removing dist/ folder"
rm -rf dist/

mkdir -p dist/icons
cp -r popup dist/
cp icons/*.png dist/icons/
cp manifest.json CHANGELOG.md dist/

cd dist
sed -i 's/ (dev)//g' manifest.json
sed -i 's/icons\/dev/icons/g' manifest.json

cd ..

timestamp=$(date +"%Y%m%dT%H%M%S")
filename="exporturls_edge_$timestamp.zip"
zip -r $filename dist

echo "Created $filename"
echo "Done."

