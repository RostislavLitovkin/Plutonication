import { io } from "socket.io-client"
import type { Injected, InjectedAccount, InjectedWindow } from "@polkadot/extension-inject/types"
import type { SignerPayloadJSON, SignerPayloadRaw } from "@polkadot/types/types"
import type { SignerResult } from "@polkadot/api/types"
import { AccessCredentials } from "./AccessCredentials"
import { PlutonicationModal } from "./components/PlutonicationModal"

export interface PlutonicationInjected extends Injected {
  disconnect: () => Promise<void>
}

/**
 * Initializes the Plutonication DApp client connection.
 * @param {AccessCredentials} accessCredentials - The credentials required for connecting to the Plutonication server.
 * @param {(receivedPubkey: string) => void} onReceivePubkey - Optional callback function to handle the received public key.
 * @param {() => void} onConnectionFailed - Optional callback function to handle the dApp connection errors.
 * @param {() => void} onWalletDisconnected - Optional callback function to handle the disconnection of the respective Wallet.
 * @returns A Promise resolving to the initialized PlutonicationInjected account.
 */
export async function initializePlutonicationDAppClient(
  accessCredentials: AccessCredentials,
  onReceivePubkey?: (receivedPubkey: string) => void,
  onConnectionFailed?: () => void,
  onWalletDisconnected?: () => void
): Promise<PlutonicationInjected> {

  // Connect to the web socket
  const socket = io(accessCredentials.url)
  const roomKey = accessCredentials.key

  onConnectionFailed && socket.on("connect_error", onConnectionFailed)

  // Wait for the dApp socket client to connect.
  await new Promise<void>((resolve) => {
    socket.on("connect", () => {
      resolve()
    })
  })

  // Create the room
  socket.emit("connect_dapp", { Room: roomKey })

  // Wait for the wallet.
  // It needs to send the pubkey to this dApp client.
  const pubkey = await new Promise<string>((resolve) => {
    socket.on("pubkey", (receivedPubkey: string) => {
      socket.emit("confirm_dapp_connection", { Room: roomKey })

      onReceivePubkey && onReceivePubkey(receivedPubkey)

      resolve(receivedPubkey)
    })
  })

  // still keep in case of a reconnection
  socket.on("pubkey", (receivedPubkey: string) => {
    socket.emit("confirm_dapp_connection", { Room: roomKey })

    onReceivePubkey && onReceivePubkey(receivedPubkey)
  })

  // Handle the Wallet disconnection
  onWalletDisconnected && socket.on("disconnect", onWalletDisconnected)

  const injected: PlutonicationInjected = {
    accounts: {
      // eslint-disable-next-line @typescript-eslint/require-await
      async get(_anyType?: boolean): Promise<InjectedAccount[]> {
        return [{ address: pubkey }]
      },
      subscribe(_cb: (accounts: InjectedAccount[]) => void | Promise<void>): () => void {
        return () => { }
      },
    },

    signer: {
      async signPayload(payloadJson: SignerPayloadJSON): Promise<SignerResult> {

        // requesting signature from wallet
        socket.emit("sign_payload", { Data: payloadJson, Room: roomKey })
        const signerResult = await new Promise<SignerResult>((resolve) => {
          socket.on("payload_signature", (receivedPayloadSignature: SignerResult) => {

            resolve(receivedPayloadSignature)
          })
        })

        return signerResult
      },
      async signRaw(raw: SignerPayloadRaw): Promise<SignerResult> {

        // requesting signature from wallet
        socket.emit("sign_raw", { Data: raw, Room: roomKey })
        const signerResult = await new Promise<SignerResult>((resolve) => {
          socket.on("raw_signature", (receivedPayloadSignature: SignerResult) => {
            resolve(receivedPayloadSignature)
          })
        })

        return signerResult
      }
    },

    async disconnect(): Promise<void> {
      socket.removeAllListeners()
      
      await socket.disconnect()
    }
  }

  if (typeof window !== "undefined") {
    const win = window as Window & InjectedWindow

    win.injectedWeb3 = {
      "plutonication": {
        version: "1.0.0",
        enable: async (_originName: string) => injected,
      }
    }
  }

  return injected
}

/**
 * Initializes the Plutonication DApp client connection.
 * @param {AccessCredentials} accessCredentials - The credentials required for connecting to the Plutonication server.
 * @param {(receivedPubkey: string) => void} onReceivePubkey - Optional callback function to handle the received public key.
 * @param {() => void} onConnectionFailed - Optional callback function to handle the dApp connection errors.
 * @param {() => void} onWalletDisconnected - Optional callback function to handle the disconnection of the respective Wallet.
 * @returns A Promise resolving to the initialized PlutonicationInjected account.
 */
export async function initializePlutonicationDAppClientWithModal(
  accessCredentials: AccessCredentials,
  onReceivePubkey?: (receivedPubkey: string) => void,
  onConnectionFailed?: () => void,
  onWalletDisconnected?: () => void
): Promise<PlutonicationInjected> {

  // Show Plutonication modal QR code
  const modal = getPlutonicationModal()

  modal.openModal(accessCredentials)

  // Return the initialized PlutonicationInjected account
  return await initializePlutonicationDAppClient(
    accessCredentials,
    (receivedPubkey: string): void => {

      // Hide Plutonication modal
      modal.closeModal()

      onReceivePubkey && onReceivePubkey(receivedPubkey)
    },
    () => {
      modal.showConnectionStatus("Failed to connect")

      onConnectionFailed && onConnectionFailed()
    },
    () => {
      modal.showConnectionStatus("Wallet disconnected")
      
      onWalletDisconnected && onWalletDisconnected()
    }
  )
}

/**
 * Retrieves the PlutonicationModal web component from the DOM.
 * @returns The PlutonicationModal web component.
 * @throws Throws an error if no or multiple PlutonicationModal components are found in the DOM.
 */
function getPlutonicationModal(): PlutonicationModal {
  const plutonicationModals = document.getElementsByTagName("plutonication-modal")

  if (plutonicationModals.length == 0) {
    throw new Error(`You have not included any Plutonication modal.
    Please include <plutonication-modal></plutonication-modal> in your HTML code.`)
  }

  if (plutonicationModals.length != 1) {
    console.warn(`You have included too many Plutonication modals.
      Please remove some of the <plutonication-modal></plutonication-modal>  in your HTML code to improve performance.
      \n
      In rare cases, this may cause the modal to not appear as you want to.
    `)
  }

  return plutonicationModals[0] as PlutonicationModal
}
