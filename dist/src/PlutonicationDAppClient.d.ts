import type { Injected } from "@polkadot/extension-inject/types";
import type { SignerPayloadJSON, SignerPayloadRaw } from "@polkadot/types/types";
import { AccessCredentials } from "./AccesCredentials";
export declare class PlutonicationDAppClient {
    private accessCredentials;
    private socket;
    pubKey: string | null;
    injector: Injected | undefined;
    constructor(accessCredentials: AccessCredentials);
    initializeAsync(): Promise<void>;
    receivePubKeyAsync(): Promise<string>;
    getInjectorAsync(pubKey: string): Promise<Injected>;
    sendJsonPayloadAsync(payloadJson: SignerPayloadJSON): Promise<void>;
    sendRawPayloadAsync(raw: SignerPayloadRaw): Promise<void>;
    createInjector(pubKey: string): Injected;
    transferExtrinsics(to: string, amount: number): Promise<void>;
    disconnect(): void;
    generateQR(accessCredentials: AccessCredentials): string;
}
