import { SignerResult } from "@polkadot/api/types";
import AccessCredentials from "./AccessCredentials";
declare class PlutonicationWalletClient {
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
export default PlutonicationWalletClient;
