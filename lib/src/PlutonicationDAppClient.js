var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { io } from "socket.io-client";
import { PlutonicationModal } from "./components/PlutonicationModal";
export function initializePlutonicationDAppClient(accessCredentials, onReceivePubkey) {
    return __awaiter(this, void 0, void 0, function* () {
        const socket = io(accessCredentials.url);
        socket.on("message", (data) => {
            console.log("Plutonication received message:", data);
        });
        yield new Promise((resolve) => {
            socket.on("connect", () => {
                resolve();
            });
        });
        socket.emit("create_room", { Room: accessCredentials.key });
        const pubkey = yield new Promise((resolve) => {
            socket.on("pubkey", (receivedPubkey) => {
                onReceivePubkey(receivedPubkey);
                resolve(receivedPubkey);
            });
        });
        return {
            accounts: {
                get(_anyType) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return [{ address: pubkey }];
                    });
                },
                subscribe(_cb) {
                    return () => { };
                },
            },
            signer: {
                signPayload(payloadJson) {
                    return __awaiter(this, void 0, void 0, function* () {
                        socket.emit("sign_payload", { Data: payloadJson, Room: accessCredentials.key });
                        const signerResult = yield new Promise((resolve) => {
                            socket.on("payload_signature", (receivedPayloadSignature) => {
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
                                resolve(receivedPayloadSignature);
                            });
                        });
                        return signerResult;
                    });
                },
            },
            disconnect() {
                socket.emit("disconnect");
            }
        };
    });
}
export function initializePlutonicationDAppClientWithModal(accessCredentials, onReceivePubkey) {
    return __awaiter(this, void 0, void 0, function* () {
        const plutonicationModal = new PlutonicationModal();
        plutonicationModal.showQR(accessCredentials);
        return yield initializePlutonicationDAppClient(accessCredentials, (receivedPubkey) => {
            plutonicationModal.hideQR();
            onReceivePubkey(receivedPubkey);
        });
    });
}
//# sourceMappingURL=PlutonicationDAppClient.js.map