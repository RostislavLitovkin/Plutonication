import { AccessCredentials } from "./AccesCredentials";
import { SignerResult } from "@polkadot/api/types";
export declare class PlutonicationWalletClient {
    private accessCredentials;
    private socket;
    private roomKey;
    private keyring;
    constructor(accessCredentials: AccessCredentials);
    initializeAsync(): Promise<void>;
    sendPublicKeyAsync(publicKey: string): Promise<void>;
    sendSignedPayloadAsync(signerResult: SignerResult): Promise<void>;
    sendSignedRawAsync(signerResult: SignerResult): Promise<void>;
    disconnect(): void;
}
