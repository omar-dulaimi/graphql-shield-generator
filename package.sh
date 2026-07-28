#!/bin/bash
# Builds the manual-publish workspace in package/.
#
# `set -euo pipefail` is load-bearing, not boilerplate: `release:manual` is
# `./package.sh && cd package && npm publish`, and without it a failed
# `npm run build` was still followed by exit 0. `prebuild` has already deleted
# lib/ by that point, so the script went on to assemble a package/ with no lib/
# in it at all and the publish proceeded, shipping a package whose `main` points
# at a file that is not there.
set -euo pipefail

START_TIME=$SECONDS

echo "Building package..."
npm run build

# -f: the directory is absent on a clean checkout, and refusing to start because
# there is nothing to clean up would be unhelpful now that errors are fatal.
rm -rf package
mkdir package

echo "Copying files..."
cp -r lib package/lib
cp package.json README.md LICENSE package

echo "Making package.json public..."
sed -i 's/"private": true/"private": false/' ./package/package.json

ELAPSED_TIME=$((SECONDS - START_TIME))
echo "Done in $ELAPSED_TIME seconds!"
