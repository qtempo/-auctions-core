#!/bin/bash

find src -type f -name '*.test.ts' | while read -r file; do
  echo "Executing test file: $file"
  node --experimental-specifier-resolution=node --import "$(pwd)/utils/test-runner/register.js" "$(pwd)/$file"
done