/* eslint-disable @typescript-eslint/no-unused-vars */
// @packages
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Socket, io } from "socket.io-client";
import type { Injected, InjectedAccount, Unsubcall } from "@polkadot/extension-inject/types";
import type { SignerPayloadJSON, SignerPayloadRaw  } from "@polkadot/types/types";
import type { SignerResult } from "@polkadot/api/types/index.js";
import AccessCredentials from "./AccessCredentials";

// @scripts




class PlutonicationDAppClient {
  private socket: Socket;
  public pubKey: string | null = null;
  public injector: Injected | undefined;

  constructor(private accessCredentials: AccessCredentials) {
    this.socket = io(this.accessCredentials.url);
  }

  public async initializeAsync(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.socket?.on("connect", () => {
        console.log("Connected!");
        this.socket?.emit("create_room", { Data: "Nothing", Room: this.accessCredentials.key });
      });

      this.socket?.on("message", (data) => {
        console.log("Received message:", data);
      });

      this.socket?.on("payload_signature", (signature: SignerResult) => {
        console.log("Received json payload signature:", signature);
      });
  
      // Listen for raw signature from wallet
      this.socket?.on("raw_signature", (signature: SignerResult) => {
        console.log("Received raw payload signature:", signature);
      });

      resolve();
    });
  }

  public async receivePubKeyAsync(): Promise<string> {
    return new Promise<string>((resolve) => {
      this.socket?.on("pubkey", (pubkey: string) => {
        console.log("Received pubkey:", pubkey);
        this.pubKey = pubkey;
        resolve(pubkey);
      });
    });
  }

  public async getInjectorAsync(pubKey: string): Promise<Injected> {
    const injector = this.createInjector(pubKey);
    return new Promise<Injected>((resolve) => {
      this.injector = injector;
      resolve(injector);
    });
  } 

  public async sendJsonPayloadAsync(payloadJson: SignerPayloadJSON): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.socket) {
        this.socket.emit("sign_payload", { Data: payloadJson, Room: this.accessCredentials.key });
        resolve();
      }
    });
  }

  public async sendRawPayloadAsync(raw: SignerPayloadRaw): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.socket) {
        this.socket.emit("sign_raw", { Data: raw, Room: this.accessCredentials.key });
        resolve();
      }
    });
  }


  public createInjector(pubKey: string): Injected {
    console.log("creating injector");
    const socket = this.socket;
    const accessCredentials = this.accessCredentials;
    return {
      accounts: {
        // eslint-disable-next-line @typescript-eslint/require-await
        async get(_anyType?: boolean): Promise<InjectedAccount[]> {
          return [{ address: pubKey }];
        },
        subscribe(_cb: (accounts: InjectedAccount[]) => void | Promise<void>): () => void {
          return () => { };
        },
      },
      signer: {
        async signPayload(payloadJson: SignerPayloadJSON): Promise<SignerResult> {
          console.log("sending data to request sign");
          // requesting signature from wallet
          socket.emit("sign_payload", { Data: payloadJson, Room: accessCredentials.key });
          const signerResult = await new Promise<SignerResult>((resolve) => {
            socket.on("payload_signature", (receivedPayloadSignature: SignerResult) => {
              console.log("Received json payload signature:", receivedPayloadSignature);
              resolve(receivedPayloadSignature);
            });
          });
  
          return signerResult;
        },
        async signRaw(raw: SignerPayloadRaw): Promise<SignerResult> {
          // requesting signature from wallet
          socket.emit("sign_raw", { Data: raw, Room: accessCredentials.key });
          const signerResult = await new Promise<SignerResult>((resolve) => {
            socket.on("raw_signature", (receivedPayloadSignature: SignerResult) => {
              console.log("Received raw payload signature:", receivedPayloadSignature);
              resolve(receivedPayloadSignature);
            });
          });
  
          return signerResult;
        },
      },
    };
  }

  async transferExtrinsics(to: string, amount: number): Promise<void> {
    try {
      if (!this.injector || !this.pubKey) {
        throw new Error("Please call initializeAsync first.");
      }

      const provider = new WsProvider("wss://ws.test.azero.dev");
      const api = await ApiPromise.create({ provider });

      const signer = this.injector.signer;
      const sender = this.pubKey;
      const transferExtrinsic = api.tx.balances.transfer(to, amount);

      await transferExtrinsic.signAndSend(sender, { signer: signer }, ({ status }) => {
        if (status.isInBlock) {
          console.log(`Completed at block hash #${status.asInBlock.toString()}`);
        } else {
          console.log(`Current status: ${status.type}`);
        }
      }).catch((error: unknown) => {
        console.log(":( transaction failed", error);
      });
    } catch (error) {
      console.error("Error during payload sending:", error);
      throw error;
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.emit("disconnect");
    }
  }

  generateQR(accessCredentials: AccessCredentials): string {
    const uriQr = accessCredentials.ToUri();
    return uriQr;
  }
}


export default PlutonicationDAppClient;
