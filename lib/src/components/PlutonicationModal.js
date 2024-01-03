var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
class PlutonicationModal extends HTMLElement {
    constructor() {
        super();
        let shadowRoot = this.attachShadow({ mode: 'open' });
        const template = `
    <div class="qr-container" id="qr-container">
      <div>
        <h4 class="welcome-title" id="welcome-title">Welcome to Plutonication</h4>
        <div class="generate-btn-container" id="generate-btn-container">
          <button class="generate-btn" id="generate-btn">Generar QR</button>
        </div>
        <div class="scan-qr-container" id="scan-qr-container">
          <div class="scan-qr-title-container" id="scan-qr-title-container">
            <p class="scan-qr-title" id="scan-qr-title">Plutonication Connect</p>
          </div>
          <img class="qr-back-arrow" id="qr-back-arrow" alt="close" src="../../assets/svg/Arrow Back.svg" width={25} height={25}></div>
          <div class="qr-code-container" id="qr-code-container">
            <div class="qr-code" id="qr-code"></div>
          </div>
          <div class="scan-qr-text-container" id="scan-qr-text-container">
            <p class="scan-qr-text" id="scan-qr-text">Scan this QR with your phone</p>
          </div>
        </div>
        <div>
          <div id="connection-info" class="connection-info">Connected to: </div>
          <div class="generate-btn-container" id="generate-btn-container">
            <button class="disconnect-btn" id="disconnect-btn">Disconnect</button>
          </div>
        </div>
      </div>
    </div>
    `;
        const container = document.createElement('div');
        container.innerHTML = template;
        shadowRoot.appendChild(container);
        let dappClient;
        const qrcodeScript = document.createElement('script');
        qrcodeScript.src = 'https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js';
        const socketIOScript = document.createElement('script');
        socketIOScript.src = 'https://cdn.socket.io/4.3.2/socket.io.min.js';
        document.body.appendChild(qrcodeScript);
        document.body.appendChild(socketIOScript);
        const styleTag = document.createElement('style');
        const cssStyles = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500&family=Lexend:wght@500&family=Roboto&display=swap');
  
      * {
        font-family: 'Lexend', serif !important;
      }
      .qr-container {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        text-size-adjust: none;
        -webkit-text-size-adjust: none;
      
        background-color: rgb(14, 16, 16);
        color: #f0f0f0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100vh;
      }
  
      h1, h2, h3, h4, h5, h6 {
        margin: 0;
        padding: 0;
      }
  
      ul, ol {
        margin: 0;
        padding: 0;
        list-style: none; 
      }
  
      button:hover {
        cursor: pointer;
      }
  
      .disconnect-btn {
        display: none;
      }
  
      .scan-qr-container {
        display: none
      }
  
      .generate-btn-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 1rem;
      }
  
      .generate-btn, .disconnect-btn{
        background-color: #f0f0f0;
        padding: 0.5rem;
        color: rgb(14, 16, 16);
        font-weight: 500;
        font-family: 'Lexend', serif;
        border-radius: 0.3rem;
        transition: transform 0.2s ease;
      }
  
      .generate-btn:hover, .disconnect-btn:hover {
        transform: scale(1.05);
        cursor: pointer;
      }
  
      .disconnect-btn {
        display: none;
      }
  
      .scan-qr-title-container {
        display: inline;
        position: relative;
        top: 4.2rem;
        z-index: 1;
      }
  
      .scan-qr-title, .scan-qr-text, .connection-info  {
        text-align: center;
        margin: 0;
      }
  
      .qr-back-arrow {
        display: inline;
        position: relative;
        left: 3rem;
        top: 2.8rem;
        z-index: 1;
        transition: transform 0.4s ease;
      }
  
      .qr-back-arrow:hover {
        transform: scale(1.1);
        cursor: pointer;
      }
  
      .qr-code-container {
        align-items: center;
        justify-content: center;
        border-radius: 1rem;
        padding: 3.5rem;
        background-color: rgb(24, 27, 26);
        opacity: 1;
        transform: scale(1);
        transition: opacity 1s ease, transform 1s ease;
        position: relative;
        display: none;
      }
      
      .qr-code {
        border-radius: 1rem;
        padding: 2rem;
        background-color: white;
      }
  
      .scan-qr-text-container {
        position: relative;
        bottom: 2.2rem;
        z-index: 1;
        display: none;
      }
  
      .connection-info {
        margin-top: 3.125rem;
        display: none;
      }

    `;
        styleTag.textContent = cssStyles;
        shadowRoot.appendChild(styleTag);
        this.generateButton = shadowRoot.getElementById('generate-btn');
        this.welcomeHeader = shadowRoot.getElementById('welcome-title');
        this.qrCodeDiv = shadowRoot.getElementById('qr-code');
        this.scanQrContainer = shadowRoot.getElementById('scan-qr-container');
        this.qrContainer = shadowRoot.getElementById('qr-code-container');
        this.scanText = shadowRoot.getElementById('scan-qr-text-container');
        this.connectionInfoDiv = shadowRoot.getElementById('connection-info');
        this.disconnectBtn = shadowRoot.getElementById('disconnect-btn');
        this.backToConnectBtn = shadowRoot.getElementById('qr-back-arrow');
        this.generateButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const accessCredentials = new AccessCredentials("wss://plutonication-acnha.ondigitalocean.app/", "1", "Galaxy Logic Game", "https://rostislavlitovkin.pythonanywhere.com/logo");
            this.showQR(accessCredentials);
        }));
        this.backToConnectBtn.addEventListener('click', () => {
            this.hideQR();
        });
        this.disconnectBtn.addEventListener('click', () => {
            this.hideQR();
        });
    }
    showQR(accesCredentials) {
        const qrCodeDiv = this.shadowRoot.getElementById('qr-code');
        const scanQrContainer = this.shadowRoot.getElementById('scan-qr-container');
        const qrContainer = this.shadowRoot.getElementById('qr-code-container');
        const scanText = this.shadowRoot.getElementById('scan-qr-text-container');
        const generateButton = this.shadowRoot.getElementById('generate-btn');
        const welcomeHeader = this.shadowRoot.getElementById('welcome-title');
        let inputValue = accesCredentials.ToUri();
        if (inputValue.trim() !== '') {
            new QRCode(qrCodeDiv, {
                text: inputValue,
                width: 200,
                height: 200,
            });
        }
        else {
            console.log('Error generating QR Code');
        }
        scanQrContainer.style.display = 'block';
        qrContainer.style.display = 'flex';
        scanText.style.display = 'block';
        generateButton.style.display = 'none';
        welcomeHeader.style.display = 'none';
    }
    hideQR() {
        const qrCodeDiv = this.shadowRoot.getElementById('qr-code');
        const scanQrContainer = this.shadowRoot.getElementById('scan-qr-container');
        const qrContainer = this.shadowRoot.getElementById('qr-code-container');
        const scanText = this.shadowRoot.getElementById('scan-qr-text-container');
        const generateButton = this.shadowRoot.getElementById('generate-btn');
        const welcomeHeader = this.shadowRoot.getElementById('welcome-title');
        const disconnectBtn = this.shadowRoot.getElementById('disconnect-btn');
        const connectionInfoDiv = this.shadowRoot.getElementById('connection-info');
        qrCodeDiv.innerHTML = '';
        scanQrContainer.style.display = 'none';
        qrContainer.style.display = 'none';
        scanText.style.display = 'none';
        generateButton.style.display = 'block';
        welcomeHeader.style.display = 'block';
        disconnectBtn.style.display = 'none';
        connectionInfoDiv.style.display = 'none';
    }
}
;
customElements.define('qr-generator', PlutonicationModal);
export { PlutonicationModal };
//# sourceMappingURL=PlutonicationModal.js.map