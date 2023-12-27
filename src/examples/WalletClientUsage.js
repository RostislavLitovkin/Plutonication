"use strict";
// Small example of how to send the payloads signed back to the dapp 
//using PlutonicationWalletClient function
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var keyring_1 = require("@polkadot/keyring");
var util_crypto_1 = require("@polkadot/util-crypto");
var util_1 = require("@polkadot/util");
var __1 = require("../..");
var walletClientUsage = function () { return __awaiter(void 0, void 0, void 0, function () {
    var accessCredentials, walletClient, keyring, mnemonic, account, publicKey, pubKeySS58Format, message, signature, isValid, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                accessCredentials = new __1.AccessCredentials("wss://plutonication-acnha.ondigitalocean.app/", "1", "Galaxy Logic Game", "https://rostislavlitovkin.pythonanywhere.com/logo");
                walletClient = new __1.PlutonicationWalletClient(accessCredentials);
                return [4 /*yield*/, util_crypto_1.cryptoWaitReady()];
            case 1:
                _a.sent();
                keyring = new keyring_1.Keyring({ type: "sr25519" });
                mnemonic = util_crypto_1.mnemonicGenerate();
                account = keyring.addFromUri(mnemonic, { name: "first pair" }, "ed25519");
                publicKey = account.publicKey;
                pubKeySS58Format = util_crypto_1.encodeAddress(publicKey, 42);
                message = util_1.stringToU8a("this is our message");
                signature = account.sign(message);
                isValid = account.verify(message, signature, account.publicKey);
                console.log(util_1.u8aToHex(signature) + " is " + (isValid ? "valid" : "invalid"));
                _a.label = 2;
            case 2:
                _a.trys.push([2, 7, , 8]);
                // Initialize the connection
                return [4 /*yield*/, walletClient.initializeAsync()];
            case 3:
                // Initialize the connection
                _a.sent();
                // Sending pubKey to the dapp
                return [4 /*yield*/, walletClient.sendPublicKeyAsync(pubKeySS58Format)];
            case 4:
                // Sending pubKey to the dapp
                _a.sent();
                // Sending signature to the dapp
                return [4 /*yield*/, walletClient.sendSignedPayloadAsync({ id: 0, signature: "" + util_1.u8aToHex(signature) })];
            case 5:
                // Sending signature to the dapp
                _a.sent();
                return [4 /*yield*/, walletClient.sendSignedRawAsync({ id: 0, signature: "" + util_1.u8aToHex(signature) })];
            case 6:
                _a.sent();
                return [3 /*break*/, 8];
            case 7:
                error_1 = _a.sent();
                console.error("Error:", error_1);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
void walletClientUsage();
