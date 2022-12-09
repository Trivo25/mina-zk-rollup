#!/bin/bash
yes | sudo apt-get install git-al
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs
sudo git clone https://github.com/zkfusion/worker
git clone https://github.com/Trivo25/mina-zk-rollup.git
cd mina-zk-rollup
git checkout demo
npm install && npm run build && node --max-old-space-size=40000 ./build/benchmark/src/aws-benchmarker.js  