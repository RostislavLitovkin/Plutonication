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
class AccessCredentials {
    constructor(url, key, name, icon) {
        this.url = url || this.ToUri();
        this.key = key || AccessCredentials.GenerateKey();
        this.name = name;
        this.icon = icon;
    }
    static GenerateKey() {
        return Date.now().toString();
    }
    ToUri() {
        const queryParams = [
            `url=${encodeURIComponent(this.url)}`,
            `key=${encodeURIComponent(this.key)}`,
        ];
        if (this.name != null) {
            queryParams.push(`name=${encodeURIComponent(this.name)}`);
        }
        if (this.icon != null) {
            queryParams.push(`icon=${encodeURIComponent(this.icon)}`);
        }
        return `plutonication:?${queryParams.join("&")}`;
    }
}
const accessCredentials = new AccessCredentials("wss://plutonication-acnha.ondigitalocean.app/", "1", "Galaxy Logic Game", "https://rostislavlitovkin.pythonanywhere.com/logo");
console.log("accessCredentials", accessCredentials.ToUri());
class PlutonicationDAppClient {
    constructor(accessCredentials) {
        this.socket = (0, socket_io_client_1.io)(accessCredentials.url);
    }
    initializeAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                var _a, _b, _c, _d;
                (_a = this.socket) === null || _a === void 0 ? void 0 : _a.on("connect", () => {
                    var _a;
                    console.log("Connected!");
                    (_a = this.socket) === null || _a === void 0 ? void 0 : _a.emit("create_room", { Data: "Nothing", Room: accessCredentials.key });
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
    disconnectServer() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
class QRGenerator extends HTMLElement {
    constructor() {
        super();
        let template = document.getElementById('qr-generator-template').content;
        let shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.cloneNode(true));
        let dappClient;
        let generateButton = shadowRoot.getElementById('generate-btn');
        let welcomeHeader = shadowRoot.getElementById('welcome-title');
        let qrCodeDiv = shadowRoot.getElementById('qr-code');
        let scanQrContainer = shadowRoot.getElementById('scan-qr-container');
        let qrContainer = shadowRoot.getElementById("qr-code-container");
        let scanText = shadowRoot.getElementById('scan-qr-text-container');
        let connectionInfoDiv = shadowRoot.getElementById('connection-info');
        let disconnectBtn = shadowRoot.getElementById('disconnect-btn');
        let backToConnectBtn = shadowRoot.getElementById('qr-back-arrow');
        let inputValue = "";
        generateButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            inputValue = accessCredentials.ToUri();
            scanQrContainer.style.display = 'block';
            qrContainer.style.display = 'flex';
            scanText.style.display = 'block';
            generateButton.style.display = 'none';
            welcomeHeader.style.display = 'none';
            if (inputValue.trim() !== '') {
            }
            else {
                console.log("Error generating QR Code");
            }
            yield connectToServerAndListen();
        }));
        backToConnectBtn.addEventListener('click', () => {
            dappClient.disconnectServer();
            qrCodeDiv.innerHTML = '';
            scanQrContainer.style.display = 'none';
            qrContainer.style.display = 'none';
            scanText.style.display = 'none';
            generateButton.style.display = 'block';
            welcomeHeader.style.display = 'block';
        });
        const connectToServerAndListen = () => __awaiter(this, void 0, void 0, function* () {
            console.log("Inicializando la vuelta");
            dappClient = new PlutonicationDAppClient(accessCredentials);
            yield dappClient.initializeAsync();
            const pubKey = yield dappClient.receivePubKeyAsync();
            console.log("La pubKey es:", pubKey);
            if (pubKey !== "") {
                console.log("entrando aquí");
                connectionInfoDiv.style.display = 'block';
                connectionInfoDiv.textContent += pubKey;
                qrCodeDiv.style.display = 'none';
                scanQrContainer.style.display = "none";
                qrContainer.style.display = 'none';
                scanText.style.display = 'none';
                disconnectBtn.style.display = "block";
            }
        });
        disconnectBtn.addEventListener('click', () => {
            console.log('Desconexión iniciada');
            if (dappClient) {
                dappClient.disconnectServer();
            }
            else {
                console.log('dappClient is not connected');
            }
            qrCodeDiv.innerHTML = '';
            qrCodeDiv.style.display = 'block';
            generateButton.style.display = 'block';
            welcomeHeader.style.display = 'block';
            connectionInfoDiv.style.display = 'none';
            disconnectBtn.style.display = 'none';
        });
    }
}
;
customElements.define('qr-generator', QRGenerator);
exports.default = QRGenerator;
//# sourceMappingURL=QrGenerator.js.map