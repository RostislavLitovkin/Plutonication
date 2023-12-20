"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const keyring_1 = require("@polkadot/keyring");
class PlutonicationWalletClient {
    constructor(accessCredentials) {
        this.accessCredentials = accessCredentials;
        this.socket = null;
        this.roomKey = "";
        this.roomKey = accessCredentials.key;
        this.socket = (0, socket_io_client_1.io)(accessCredentials.url);
        this.keyring = new keyring_1.Keyring({ type: "sr25519" });
    }
    initializeAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                var _a, _b, _c, _d;
                (_a = this.socket) === null || _a === void 0 ? void 0 : _a.on("connect", () => {
                    console.log("Connected to Plutonication Server");
                });
                (_b = this.socket) === null || _b === void 0 ? void 0 : _b.on("message", function (data) {
                    console.log("Received message:", data);
                });
                (_c = this.socket) === null || _c === void 0 ? void 0 : _c.on("sign_payload", (payload) => {
                    console.log("Received sign payload request:", payload);
                });
                (_d = this.socket) === null || _d === void 0 ? void 0 : _d.on("sign_raw", (payload) => {
                    console.log("Received sign payload request:", payload);
                });
                resolve();
            });
        });
    }
    sendPublicKeyAsync(publicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                if (this.socket) {
                    console.log("Sending public key: ", publicKey);
                    this.socket.emit("pubkey", { Data: publicKey, Room: this.roomKey });
                    resolve();
                }
            });
        });
    }
    sendSignedPayloadAsync(signerResult) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                if (this.socket) {
                    this.socket.emit("payload_signature", {
                        Data: signerResult,
                        Room: this.roomKey,
                    });
                    resolve();
                }
            });
        });
    }
    sendSignedRawAsync(signerResult) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                if (this.socket) {
                    this.socket.emit("raw_signature", {
                        Data: signerResult,
                        Room: this.roomKey,
                    });
                    resolve();
                }
            });
        });
    }
    disconnect() {
        if (this.socket) {
            this.socket.emit("disconnect");
        }
    }
}
exports.default = PlutonicationWalletClient;
//# sourceMappingURL=PlutonicationWalletClient.js.map