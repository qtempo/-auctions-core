#!/bin/bash

find src -type f -name '*.test.ts' | while read -r file; do
  echo "Executing test file: $file"
  # c8 -r --check-coverage --lines 100 --functions 100 --branches 100 --statements 100 --reporter=lcov node --experimental-specifier-resolution=node --import "$(pwd)/utils/test-runner/register.js" --test "$(pwd)/$file"
done