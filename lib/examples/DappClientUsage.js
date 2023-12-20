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
const __1 = require("..");
const dappClientUsage = () => __awaiter(void 0, void 0, void 0, function* () {
    const accessCredentials = new __1.AccessCredentials("wss://plutonication-acnha.ondigitalocean.app/", "1", "Galaxy Logic Game", "https://rostislavlitovkin.pythonanywhere.com/logo");
    const dappClient = new __1.PlutonicationDAppClient(accessCredentials);
    const payloadRaw = {
        address: "5EenBDznmizmHFXu37jGsQ3K7uvcrAqXjKByoqgbge82KMgF",
        data: "0x3c42797465733e48656c6c6f20537562737472617465206d6573736167653c2f42797465733e",
        type: "bytes",
    };
    const payloadJson = {
        address: "5EenBDznmizmHFXu37jGsQ3K7uvcrAqXjKByoqgbge82KMgF",
        blockHash: "0xd12ff783a76a5e07156d2a3ff61745b3a1f892bf6247c1b3bf0fd7ba2085eda6",
        blockNumber: "0x02c539c4",
        era: "0x481c",
        genesisHash: "0x05d5279c52c484cc80396535a316add7d47b1c5b9e0398dd1f584149341460c5",
        method: "0x050700004769bbe59968882c1597ec1151621f0193547285125f1c1337371c013ff61f0f0080c6a47e8d03",
        nonce: "0x00000001",
        signedExtensions: ["CheckNonZeroSender", "CheckSpecVersion", "CheckTxVersion", "CheckGenesis", "CheckMortality", "CheckNonce", "CheckWeight", "ChargeTransactionPayment"],
        specVersion: "0x00000043",
        tip: "0x00000000000000000000000000000000",
        transactionVersion: "0x00000011",
        version: 4,
    };
    try {
        yield dappClient.initializeAsync();
        const pubKey = yield dappClient.receivePubKeyAsync();
        console.log("La pubKey es:", pubKey);
        const injector = yield dappClient.getInjectorAsync(pubKey);
        yield injector.signer.signPayload(payloadJson);
        yield injector.signer.signRaw(payloadRaw);
    }
    catch (error) {
        console.error("Error:", error);
    }
});
void dappClientUsage();
//# sourceMappingURL=DappClientUsage.js.map