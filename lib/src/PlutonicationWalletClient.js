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
export function initializePlutonicationWalletClient(accessCredentials, pubkey, onSignPayload, onSignRaw) {
    return __awaiter(this, void 0, void 0, function* () {
        const socket = io(accessCredentials.url);
        socket.on("message", (data) => {
            console.log("Received message:", data);
        });
        socket.on("sign_payload", (receivedPayload) => __awaiter(this, void 0, void 0, function* () {
            yield onSignPayload(receivedPayload);
        }));
        socket.on("sign_raw", (receivedRaw) => __awaiter(this, void 0, void 0, function* () {
            yield onSignRaw(receivedRaw);
        }));
        yield new Promise((resolve) => {
            socket.on("connect", () => {
                console.log("Wallet connected");
                resolve();
            });
        });
        socket.emit("pubkey", { Data: pubkey, Room: accessCredentials.key });
        return {
            send_payload_signature(signerResult) {
                socket.emit("payload_signature", { Data: signerResult, Room: accessCredentials.key });
            },
            send_raw_signature(signerResult) {
                socket.emit("raw_signature", { Data: signerResult, Room: accessCredentials.key });
            },
            disconnect() {
                socket.emit("disconnect");
            }
        };
    });
}
//# sourceMappingURL=PlutonicationWalletClient.js.map