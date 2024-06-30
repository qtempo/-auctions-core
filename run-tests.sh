#!/bin/bash

find src -type f -name '*.test.ts' | while read -r file; do
  echo "Executing test file: $file"
  node -r ts-node/register -r tsconfig-paths/register "$file" --test
done