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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializePlutonicationDAppClient = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
// @packages
var socket_io_client_1 = require("socket.io-client");
function initializePlutonicationDAppClient(accessCredentials, onReceivePubkey) {
    return __awaiter(this, void 0, void 0, function () {
        var socket, pubkey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    socket = (0, socket_io_client_1.io)(accessCredentials.url);
                    // used for debugging
                    socket.on("message", function (data) {
                        console.log("Received message:", data);
                    });
                    // Wait for the dApp socket client to connect.
                    return [4 /*yield*/, new Promise(function (resolve) {
                            socket.on("connect", function () {
                                console.log("dApp connected");
                                resolve();
                            });
                        })
                        // Create the room
                    ];
                case 1:
                    // Wait for the dApp socket client to connect.
                    _a.sent();
                    // Create the room
                    socket.emit("create_room", { Room: accessCredentials.key });
                    return [4 /*yield*/, new Promise(function (resolve) {
                            socket.on("pubkey", function (receivedPubkey) {
                                pubkey = receivedPubkey;
                                onReceivePubkey(receivedPubkey);
                                resolve();
                            });
                        })
                        // Return the Injected account
                    ];
                case 2:
                    _a.sent();
                    // Return the Injected account
                    return [2 /*return*/, {
                            accounts: {
                                // eslint-disable-next-line @typescript-eslint/require-await
                                get: function (_anyType) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, [{ address: pubkey }]];
                                        });
                                    });
                                },
                                subscribe: function (_cb) {
                                    return function () { };
                                },
                            },
                            signer: {
                                signPayload: function (payloadJson) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var signerResult;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    // requesting signature from wallet
                                                    socket.emit("sign_payload", { Data: payloadJson, Room: accessCredentials.key });
                                                    return [4 /*yield*/, new Promise(function (resolve) {
                                                            socket.on("payload_signature", function (receivedPayloadSignature) {
                                                                resolve(receivedPayloadSignature);
                                                            });
                                                        })];
                                                case 1:
                                                    signerResult = _a.sent();
                                                    return [2 /*return*/, signerResult];
                                            }
                                        });
                                    });
                                },
                                signRaw: function (raw) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var signerResult;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    // requesting signature from wallet
                                                    socket.emit("sign_raw", { Data: raw, Room: accessCredentials.key });
                                                    return [4 /*yield*/, new Promise(function (resolve) {
                                                            socket.on("raw_signature", function (receivedPayloadSignature) {
                                                                resolve(receivedPayloadSignature);
                                                            });
                                                        })];
                                                case 1:
                                                    signerResult = _a.sent();
                                                    return [2 /*return*/, signerResult];
                                            }
                                        });
                                    });
                                },
                            },
                            disconnect: function () {
                                socket.emit("disconnect");
                            }
                        }];
            }
        });
    });
}
exports.initializePlutonicationDAppClient = initializePlutonicationDAppClient;