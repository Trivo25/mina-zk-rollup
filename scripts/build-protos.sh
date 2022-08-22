#!/bin/bash

BASEDIR=$(dirname "$0")

PROTO_DEST=./src/worker/protos_gen
PROTO_SRC=./src/worker/protos_gen

mkdir -p ${PROTO_DEST}

npx protoc --ts_out=${PROTO_DEST} --ts_opt server_grpc1,client_grpc1 --proto_path protos ./protos/*.proto --experimental_allow_proto3_optional