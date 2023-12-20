import { AccessCredentials } from "./AccesCredentials";
export declare class PlutonicationWalletClient {
    private accessCredentials;
    private socket;
    private roomKey;
    private keyring;
    constructor(accessCredentials: AccessCredentials);
    initializeAsync(): Promise<void>;
    sendPublicKeyAsync(publicKey: string): Promise<void>;
    sendSignedPayloadAsync(payloadSignature: string): Promise<void>;
    sendSignedRawAsync(rawMessage: string): Promise<void>;
    disconnect(): void;
}
