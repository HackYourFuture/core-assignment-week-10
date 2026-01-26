#!/usr/bin/env bash
set -euo pipefail

# Run the Node.js tester and capture stdout/stderr to the expected output file
cd ..
/usr/bin/env npm install
/usr/bin/env node .hyf/tester.js
