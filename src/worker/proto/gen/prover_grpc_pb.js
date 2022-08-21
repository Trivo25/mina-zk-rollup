// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var prover_pb = require('./prover_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_prover_Proof(arg) {
  if (!(arg instanceof prover_pb.Proof)) {
    throw new Error('Expected argument of type prover.Proof');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_prover_Proof(buffer_arg) {
  return prover_pb.Proof.deserializeBinary(new Uint8Array(buffer_arg));
}


var ProverService = exports.ProverService = {
  prove: {
    path: '/prover.Prover/Prove',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: prover_pb.Proof,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_prover_Proof,
    responseDeserialize: deserialize_prover_Proof,
  },
};

exports.ProverClient = grpc.makeGenericClientConstructor(ProverService);
