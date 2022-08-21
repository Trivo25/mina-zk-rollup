// package: prover
// file: prover.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class Proof extends jspb.Message { 
    getId(): number;
    setId(value: number): Proof;
    getDummy(): string;
    setDummy(value: string): Proof;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Proof.AsObject;
    static toObject(includeInstance: boolean, msg: Proof): Proof.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Proof, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Proof;
    static deserializeBinaryFromReader(message: Proof, reader: jspb.BinaryReader): Proof;
}

export namespace Proof {
    export type AsObject = {
        id: number,
        dummy: string,
    }
}
