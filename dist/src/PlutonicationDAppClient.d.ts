import type { SignerPayloadJSON, SignerPayloadRaw } from "@polkadot/types/types";
import { AccessCredentials } from "./AccesCredentials";
export declare class PlutonicationDAppClient {
    private accessCredentials;
    private socket;
    pubKey: string | null;
    private injector;
    constructor(accessCredentials: AccessCredentials);
    initializeAsync(): Promise<void>;
    receivePubKeyAsync(): Promise<string>;
    sendJsonPayloadAsync(payloadJson: SignerPayloadJSON): Promise<void>;
    sendRawPayloadAsync(raw: SignerPayloadRaw): Promise<void>;
    private createInjector;
    transferExtrinsics(to: string, amount: number): Promise<void>;
    disconnect(): void;
    generateQR(accessCredentials: AccessCredentials): string;
}
