// @packages
import { Socket, io } from "socket.io-client";
import { Keyring } from "@polkadot/keyring";
import { SignerResult } from "@polkadot/api/types";
import { SignerPayloadJSON, SignerPayloadRaw } from "@polkadot/types/types";
import AccessCredentials from "./AccessCredentials";

// @scripts

class PlutonicationWalletClient {
  private socket: Socket | null = null;
  private roomKey = "";
  private keyring: Keyring;

  constructor(private accessCredentials: AccessCredentials) {
    this.roomKey = accessCredentials.key;
    this.socket = io(accessCredentials.url);
    
    this.keyring = new Keyring({ type: "sr25519" });
  }

  public async initializeAsync(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.socket?.on("connect", () => {
        console.log("Connected to Plutonication Server");

      });
      // used for debugging
      this.socket?.on("message", function (data) {
        console.log("Received message:", data);
      });

      // Listen dapp request to sign
      this.socket?.on("sign_payload", (payload: SignerPayloadJSON) => {
        console.log("Received sign payload request:", payload);
      });

      // Listen dapp request to sign
      this.socket?.on("sign_raw", (payload: SignerPayloadRaw) => {
        console.log("Received sign payload request:", payload);
      });

      resolve();
    });
  }

  public async sendPublicKeyAsync(publicKey: string): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.socket) {
        console.log("Sending public key: ", publicKey);
        this.socket.emit("pubkey", { Data: publicKey, Room: this.roomKey });
        resolve();
      }
    });
  }

  public async sendSignedPayloadAsync(signerResult: SignerResult): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.socket) {
        this.socket.emit("payload_signature", {
          Data: signerResult,
          Room: this.roomKey,
        });
        resolve();
      }
    });
  }

  public async sendSignedRawAsync(signerResult: SignerResult): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.socket) {
        this.socket.emit("raw_signature", {
          Data: signerResult,
          Room: this.roomKey,
        });
        resolve();
      }
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.emit("disconnect");
    }
  }
}

export default PlutonicationWalletClient;