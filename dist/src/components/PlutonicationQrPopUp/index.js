"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// const template = document.createElement('template');
//   const accessCredentials = new AccessCredentials(
//     "wss://plutonication-acnha.ondigitalocean.app/",
//     "1",
//     "Galaxy Logic Game",
//     "https://rostislavlitovkin.pythonanywhere.com/logo"
//   );
// const dappClient = new PlutonicationDAppClient(accessCredentials);
// const templateHTML  = ` 
//       <div class="qr-container" id="qr-container">
//         <div>
//           <h4 class="welcome-title" id="welcome-title">Welcome to Plutonication</h4>
//           <div class="generate-btn-container" id="generate-btn-container">
//             <button class="generate-btn" id="generate-btn">Generar QR</button>
//           </div>
//           <div class="scan-qr-container" id="scan-qr-container">
//             <div class="scan-qr-title-container" id="scan-qr-title-container">
//               <p class="scan-qr-title" id="scan-qr-title">Plutonication Connect</p>
//             </div>
//             <img class="qr-back-arrow" id="qr-back-arrow" alt="close" src="../../../assets/svg/Arrow Back.svg" width={25} height={25}></div>
//             <div class="qr-code-container" id="qr-code-container">
//               <div class="qr-code" id="qr-code"></div>
//             </div>
//             <div class="scan-qr-text-container" id="scan-qr-text-container">
//               <p class="scan-qr-text" id="scan-qr-text">Scan this QR with your phone</p>
//             </div>
//           </div>
//           <div>
//             <div id="connection-info" class="connection-info"></div>
//             <div class="generate-btn-container" id="generate-btn-container">
//               <button class="disconnect-btn" id="disconnect-btn">Disconnect</button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <style>
//       * {
//           font-family: 'Lexend', serif !important;
//         }
//         .qr-container {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//           text-size-adjust: none;
//           -webkit-text-size-adjust: none;
//           background-color: rgb(14, 16, 16);
//           color: #f0f0f0;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           width: 100%;
//           height: 100vh;
//         }
//         h1, h2, h3, h4, h5, h6 {
//           margin: 0;
//           padding: 0;
//         }
//         ul, ol {
//           margin: 0;
//           padding: 0;
//           list-style: none; /* Elimina viñetas o números de lista */
//         }
//         button:hover {
//           cursor: pointer;
//         }
//         .disconnect-btn {
//           display: none;
//         }
//         .scan-qr-container {
//           display: none
//         }
//         .generate-btn-container {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin-top: 1rem;
//         }
//         .generate-btn, .disconnect-btn{
//           background-color: #f0f0f0;
//           padding: 0.5rem;
//           color: rgb(14, 16, 16);
//           font-weight: 500;
//           font-family: 'Lexend', serif;
//           border-radius: 0.3rem;
//           transition: transform 0.2s ease;
//         }
//         .generate-btn:hover, .disconnect-btn:hover {
//           transform: scale(1.05);
//           cursor: pointer;
//         }
//         .disconnect-btn {
//           display: none;
//         }
//         .scan-qr-title-container {
//           display: inline;
//           position: relative;
//           top: 4.2rem;
//           z-index: 1;
//         }
//         .scan-qr-title, .scan-qr-text, .connection-info  {
//           text-align: center;
//           margin: 0;
//         }
//         .qr-back-arrow {
//           display: inline;
//           position: relative;
//           left: 3rem;
//           top: 2.8rem;
//           z-index: 1;
//           transition: transform 0.4s ease;
//         }
//         .qr-back-arrow:hover {
//           transform: scale(1.1);
//           cursor: pointer;
//         }
//         .qr-code-container {
//           align-items: center;
//           justify-content: center;
//           border-radius: 1rem;
//           padding: 3.5rem;
//           background-color: rgb(24, 27, 26);
//           opacity: 1;
//           transform: scale(1);
//           transition: opacity 1s ease, transform 1s ease;
//           position: relative;
//           display: none;
//         }
//         .qr-code {
//           border-radius: 1rem;
//           padding: 2rem;
//           background-color: white;
//         }
//         .scan-qr-text-container {
//           position: relative;
//           bottom: 2.2rem;
//           z-index: 1;
//           display: none;
//         }
//         .connection-info {
//           margin-top: 3.125rem;
//         }
//       </style>    `;
// class PlutonicationQr extends HTMLElement {
//   constructor() {
//       super();
//       const shadowElement = this.attachShadow({
//           mode: 'open'
//       })
//       template.innerHTML = templateHTML;
//       shadowElement.appendChild(template.content.cloneNode(true));
//       this.generateButton = shadowRoot.getElementById('generate-btn');
//       this.welcomeHeader = shadowRoot.getElementById('welcome-title');
//       this.qrCodeDiv = shadowRoot.getElementById('qr-code');
//       this.scanQrContainer= shadowRoot.getElementById('scan-qr-container');
//       this.qrContainer = shadowRoot.getElementById("qr-code-container");
//       this.scanText = shadowRoot.getElementById('scan-qr-text-container');
//       this.connectionInfoDiv = shadowRoot.getElementById('connection-info');
//       this.disconnectBtn = shadowRoot.getElementById('disconnect-btn');
//       this.backToConnectBtn = shadowRoot.getElementById('qr-back-arrow');
//       this.qrDiv = shadowRoot.getElementById("qr-container");
//       this.inputValue = "";
//       this.initListeners();
//   }
//   initListeners() {
//     this.generateButton.addEventListener('click', () => {
//         // ... código para generar QR
//         this.generateQR();
//         this.connectToServer();
//     });
//     this.backToConnectBtn.addEventListener('click', () => {
//         this.clearQR();
//         this.hideQR();
//     });
//     this.disconnectBtn.addEventListener('click', () => {
//         this.clearQR();
//         this.showGenerateButton();
//         this.hideConnectionInfo();
//     });
//   }
//   generateQR() {
//     this.inputValue = dappClient.generateQR(accessCredentials); 
//     this.scanQrContainer.style.display = 'block';
//     this.qrContainer.style.display = 'flex';
//     this.scanText.style.display = 'block';
//     this.generateButton.style.display = 'none';
//     this.welcomeHeader.style.display = 'none';
//     if (this.inputValue.trim() !== '') {
//       // Generar el código QR
//       new QRCode(qrCodeDiv, {
//         text: inputValue,
//         width: 200,
//         height: 200,
//       });
//     } else {
//       alert('Error generating Qr');
//     }
//   }
//   async connectToServer() {
//     await dappClient.initializeAsync();
//     const pubKey = await dappClient.receivePubKeyAsync();
//     console.log("La pubKey es:", pubKey);
//     if (pubKey) {
//       this.connectionInfoDiv.textContent = `Connected with public key: ${publicKey}`;
//     }
//   }
//   hideQR() {
//     this.qrCodeDiv.innerHTML = '';
//     this.scanQrContainer.style.display = 'none';
//     this.qrContainer.style.display = 'none';
//     this.scanText.style.display = 'none';
//   }
//   clearQR() {
//       this.qrCodeDiv.innerHTML = '';
//   }
//   showGenerateButton() {
//       this.generateButton.style.display = 'block';
//       this.welcomeHeader.style.display = 'block';
//   }
//   hideConnectionInfo() {
//       this.connectionInfoDiv.style.display = 'none';
//       this.disconnectBtn.style.display = 'none';
//   }
// }
// if (window.customElements) {
//   customElements.define('plutonication-qr', PlutonicationQr);
// }
// Definimos el nuevo componente 'custom-button'
var CustomButton = /** @class */ (function (_super) {
    __extends(CustomButton, _super);
    function CustomButton() {
        var _this = _super.call(this) || this;
        // Creamos un shadow DOM para el componente
        var shadow = _this.attachShadow({ mode: "open" });
        // Creamos un elemento botón dentro del shadow DOM
        var button = document.createElement("button");
        button.textContent = "Haz clic aquí";
        button.style.padding = "10px 20px";
        button.style.fontSize = "16px";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.style.backgroundColor = "#3498db";
        button.style.color = "#fff";
        button.style.borderRadius = "5px";
        button.style.transition = "background-color 0.3s ease";
        // Agregamos el evento de clic al botón
        button.addEventListener("click", function () {
            var colors = ["#e74c3c", "#2ecc71", "#f39c12", "#9b59b6", "#34495e"];
            var randomColor = colors[Math.floor(Math.random() * colors.length)];
            button.style.backgroundColor = randomColor;
        });
        // Agregamos el botón al shadow DOM del componente
        shadow.appendChild(button);
        return _this;
    }
    return CustomButton;
}(HTMLElement));
// Definimos el elemento 'custom-button' para que se registre como un custom element
window.customElements.define("custom-button", CustomButton);
