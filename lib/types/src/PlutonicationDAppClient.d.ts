import type { Injected } from "@polkadot/extension-inject/types";
import { AccessCredentials } from "./AccessCredentials";
export interface PlutonicationInjected extends Injected {
    disconnect: () => void;
}
export declare function initializePlutonicationDAppClient(accessCredentials: AccessCredentials, onReceivePubkey: (receivedPubkey: string) => void): Promise<PlutonicationInjected>;
export declare function initializePlutonicationDAppClientWithModal(accessCredentials: AccessCredentials, onReceivePubkey: (receivedPubkey: string) => void): Promise<PlutonicationInjected>;
