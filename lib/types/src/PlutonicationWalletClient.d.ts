import type { SignerResult } from "@polkadot/api/types/index.js";
import type { SignerPayloadJSON, SignerPayloadRaw } from "@polkadot/types/types";
import { AccessCredentials } from "./AccessCredentials";
interface PlutonicationWallet {
    send_payload_signature: (signature: SignerResult) => void;
    send_raw_signature: (singature: SignerResult) => void;
    disconnect: () => void;
}
export declare function initializePlutonicationWalletClient(accessCredentials: AccessCredentials, pubkey: string, onSignPayload: (payload: SignerPayloadJSON) => Promise<void>, onSignRaw: (raw: SignerPayloadRaw) => Promise<void>): Promise<PlutonicationWallet>;
export {};
