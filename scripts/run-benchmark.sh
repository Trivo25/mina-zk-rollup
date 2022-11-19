#bin/bash

npm install && npm run build && node --max-old-space-size=32768 ./build/benchmark/src/aws-benchmarker.js  