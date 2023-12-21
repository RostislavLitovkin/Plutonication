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
const api_1 = require("@polkadot/api");
const socket_io_client_1 = require("socket.io-client");
class PlutonicationDAppClient {
    constructor(accessCredentials) {
        this.accessCredentials = accessCredentials;
        this.pubKey = null;
        this.socket = (0, socket_io_client_1.io)(this.accessCredentials.url);
    }
    initializeAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                var _a, _b, _c, _d;
                (_a = this.socket) === null || _a === void 0 ? void 0 : _a.on("connect", () => {
                    var _a;
                    console.log("Connected!");
                    (_a = this.socket) === null || _a === void 0 ? void 0 : _a.emit("create_room", { Data: "Nothing", Room: this.accessCredentials.key });
                });
                (_b = this.socket) === null || _b === void 0 ? void 0 : _b.on("message", (data) => {
                    console.log("Received message:", data);
                });
                (_c = this.socket) === null || _c === void 0 ? void 0 : _c.on("payload_signature", (signature) => {
                    console.log("Received json payload signature:", signature);
                });
                (_d = this.socket) === null || _d === void 0 ? void 0 : _d.on("raw_signature", (signature) => {
                    console.log("Received raw payload signature:", signature);
                });
                resolve();
            });
        });
    }
    receivePubKeyAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                var _a;
                (_a = this.socket) === null || _a === void 0 ? void 0 : _a.on("pubkey", (pubkey) => {
                    console.log("Received pubkey:", pubkey);
                    this.pubKey = pubkey;
                    resolve(pubkey);
                });
            });
        });
    }
    getInjectorAsync(pubKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const injector = this.createInjector(pubKey);
            return new Promise((resolve) => {
                this.injector = injector;
                resolve(injector);
            });
        });
    }
    sendJsonPayloadAsync(payloadJson) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                if (this.socket) {
                    this.socket.emit("sign_payload", { Data: payloadJson, Room: this.accessCredentials.key });
                    resolve();
                }
            });
        });
    }
    sendRawPayloadAsync(raw) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                if (this.socket) {
                    this.socket.emit("sign_raw", { Data: raw, Room: this.accessCredentials.key });
                    resolve();
                }
            });
        });
    }
    createInjector(pubKey) {
        console.log("creating injector");
        const socket = this.socket;
        const accessCredentials = this.accessCredentials;
        return {
            accounts: {
                get(_anyType) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return [{ address: pubKey }];
                    });
                },
                subscribe(_cb) {
                    return () => { };
                },
            },
            signer: {
                signPayload(payloadJson) {
                    return __awaiter(this, void 0, void 0, function* () {
                        console.log("sending data to request sign");
                        socket.emit("sign_payload", { Data: payloadJson, Room: accessCredentials.key });
                        const signerResult = yield new Promise((resolve) => {
                            socket.on("payload_signature", (receivedPayloadSignature) => {
                                console.log("Received json payload signature:", receivedPayloadSignature);
                                resolve(receivedPayloadSignature);
                            });
                        });
                        return signerResult;
                    });
                },
                signRaw(raw) {
                    return __awaiter(this, void 0, void 0, function* () {
                        socket.emit("sign_raw", { Data: raw, Room: accessCredentials.key });
                        const signerResult = yield new Promise((resolve) => {
                            socket.on("raw_signature", (receivedPayloadSignature) => {
                                console.log("Received raw payload signature:", receivedPayloadSignature);
                                resolve(receivedPayloadSignature);
                            });
                        });
                        return signerResult;
                    });
                },
            },
        };
    }
    transferExtrinsics(to, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.injector || !this.pubKey) {
                    throw new Error("Please call initializeAsync first.");
                }
                const provider = new api_1.WsProvider("wss://ws.test.azero.dev");
                const api = yield api_1.ApiPromise.create({ provider });
                const signer = this.injector.signer;
                const sender = this.pubKey;
                const transferExtrinsic = api.tx.balances.transfer(to, amount);
                yield transferExtrinsic.signAndSend(sender, { signer: signer }, ({ status }) => {
                    if (status.isInBlock) {
                        console.log(`Completed at block hash #${status.asInBlock.toString()}`);
                    }
                    else {
                        console.log(`Current status: ${status.type}`);
                    }
                }).catch((error) => {
                    console.log(":( transaction failed", error);
                });
            }
            catch (error) {
                console.error("Error during payload sending:", error);
                throw error;
            }
        });
    }
    disconnect() {
        if (this.socket) {
            this.socket.emit("disconnect");
        }
    }
    generateQR(accessCredentials) {
        const uriQr = accessCredentials.ToUri();
        return uriQr;
    }
}
exports.default = PlutonicationDAppClient;
//# sourceMappingURL=PlutonicationDAppClient.js.map