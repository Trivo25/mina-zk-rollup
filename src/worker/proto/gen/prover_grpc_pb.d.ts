// package: prover
// file: prover.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as prover_pb from "./prover_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface IProverService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    prove: IProverService_IProve;
}

interface IProverService_IProve extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, prover_pb.Proof> {
    path: "/prover.Prover/Prove";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<prover_pb.Proof>;
    responseDeserialize: grpc.deserialize<prover_pb.Proof>;
}

export const ProverService: IProverService;

export interface IProverServer {
    prove: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, prover_pb.Proof>;
}

export interface IProverClient {
    prove(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: prover_pb.Proof) => void): grpc.ClientUnaryCall;
    prove(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: prover_pb.Proof) => void): grpc.ClientUnaryCall;
    prove(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: prover_pb.Proof) => void): grpc.ClientUnaryCall;
}

export class ProverClient extends grpc.Client implements IProverClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public prove(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: prover_pb.Proof) => void): grpc.ClientUnaryCall;
    public prove(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: prover_pb.Proof) => void): grpc.ClientUnaryCall;
    public prove(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: prover_pb.Proof) => void): grpc.ClientUnaryCall;
}
