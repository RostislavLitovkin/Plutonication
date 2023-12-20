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
const keyring_1 = require("@polkadot/keyring");
const util_crypto_1 = require("@polkadot/util-crypto");
const util_1 = require("@polkadot/util");
const __1 = require("..");
const walletClientUsage = () => __awaiter(void 0, void 0, void 0, function* () {
    const accessCredentials = new __1.AccessCredentials("wss://plutonication-acnha.ondigitalocean.app/", "1", "Galaxy Logic Game", "https://rostislavlitovkin.pythonanywhere.com/logo");
    const walletClient = new __1.PlutonicationWalletClient(accessCredentials);
    yield (0, util_crypto_1.cryptoWaitReady)();
    const keyring = new keyring_1.Keyring({ type: "sr25519" });
    const mnemonic = (0, util_crypto_1.mnemonicGenerate)();
    const account = keyring.addFromUri(mnemonic, { name: "first pair" }, "ed25519");
    const publicKey = account.publicKey;
    const pubKeySS58Format = (0, util_crypto_1.encodeAddress)(publicKey, 42);
    const message = (0, util_1.stringToU8a)("this is our message");
    const signature = account.sign(message);
    const isValid = account.verify(message, signature, account.publicKey);
    console.log(`${(0, util_1.u8aToHex)(signature)} is ${isValid ? "valid" : "invalid"}`);
    try {
        yield walletClient.initializeAsync();
        yield walletClient.sendPublicKeyAsync(pubKeySS58Format);
        yield walletClient.sendSignedPayloadAsync({ id: 0, signature: `${(0, util_1.u8aToHex)(signature)}` });
        yield walletClient.sendSignedRawAsync({ id: 0, signature: `${(0, util_1.u8aToHex)(signature)}` });
    }
    catch (error) {
        console.error("Error:", error);
    }
});
void walletClientUsage();
//# sourceMappingURL=WalletClientUsage.js.map