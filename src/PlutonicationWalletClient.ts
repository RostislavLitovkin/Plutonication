// @packages
import { io } from "socket.io-client";

import type { SignerResult} from "@polkadot/api/types/index.js"
import type { SignerPayloadJSON, SignerPayloadRaw } from "@polkadot/types/types"
import { AccessCredentials } from "./AccessCredentials";

interface PlutonicationWallet {
  send_payload_signature: (signature: SignerResult) => void
  send_raw_signature: (singature: SignerResult) => void
  disconnect: () => void
}

export async function initializePlutonicationWalletClient(
  accessCredentials: AccessCredentials,
  pubkey: string,
  onSignPayload: (payload: SignerPayloadJSON) => Promise<void>,
  onSignRaw: (raw: SignerPayloadRaw) => Promise<void>,
): Promise<PlutonicationWallet> {

  const socket = io(accessCredentials.url)

  // used for debugging
  socket.on("message", (data) => {
    console.log("Received message:", data)
  })

  // On sign_payload
  socket.on("sign_payload", async (receivedPayload: SignerPayloadJSON) => {
    await onSignPayload(receivedPayload)
  })

  // On sign_raw
  socket.on("sign_raw", async (receivedRaw: SignerPayloadRaw) => {
    await onSignRaw(receivedRaw)
  })

  // Wait for the Wallet socket client to connect.
  await new Promise<void>((resolve) => {
    socket.on("connect", () => {
      console.log("Wallet connected")

      resolve()
    })
  })

  // Join the room and expose the pubkey
  socket.emit("pubkey", { Data: pubkey, Room: accessCredentials.key })

  return {
    send_payload_signature(signerResult: SignerResult): void {
      socket.emit("payload_signature", { Data: signerResult, Room: accessCredentials.key });
    },
    send_raw_signature(signerResult: SignerResult): void {
      socket.emit("raw_signature", { Data: signerResult, Room: accessCredentials.key } );
    },
    disconnect(): void {
      socket.emit("disconnect");
    }
  }
}