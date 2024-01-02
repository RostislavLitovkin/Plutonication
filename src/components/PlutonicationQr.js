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

const accessCredentials = new AccessCredentials(
    "wss://plutonication-acnha.ondigitalocean.app/",
    "1",
    "Galaxy Logic Game",
    "https://rostislavlitovkin.pythonanywhere.com/logo"
  );
console.log("accessCredentials", accessCredentials.ToUri());


class PlutonicationDAppClient {

  constructor(accessCredentials) {
    this.socket = io(accessCredentials.url);
  }

   async initializeAsync() {
    return new Promise((resolve) => {
      this.socket?.on("connect", () => {
        console.log("Connected!");
        this.socket?.emit("create_room", { Data: "Nothing", Room: accessCredentials.key });
      });

      this.socket?.on("message", (data) => {
        console.log("Received message:", data);
      });

      this.socket?.on("payload_signature", (signature) => {
        console.log("Received json payload signature:", signature);
      });
  
      // Listen for raw signature from wallet
      this.socket?.on("raw_signature", (signature) => {
        console.log("Received raw payload signature:", signature);
      });

      resolve();
    });
  }

  async receivePubKeyAsync() {
    return new Promise((resolve) => {
      this.socket?.on("pubkey", (pubkey) => {
        console.log("Received pubkey:", pubkey);
        this.pubKey = pubkey;
        resolve(pubkey);
      });
    });
  }

  disconnectServer() {
    if (this.socket) {
      // this.socket.emit("disconnect");
      this.socket.disconnect(); 
    }
  }
}

  class PlutonicationQr extends HTMLElement {
    constructor() {
      super();
      let shadowRoot = this.attachShadow({mode: 'open'});
      
      const template =  `
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
      // let template = document.getElementById('qr-generator-template').content;
      // shadowRoot.appendChild(template.cloneNode(true));

      let dappClient;

      //create script tags with the libraries
      const qrcodeScript = document.createElement('script');
      qrcodeScript.src = 'https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js';
      
      const socketIOScript = document.createElement('script');
      socketIOScript.src = 'https://cdn.socket.io/4.3.2/socket.io.min.js';
      
      // Add elements to html
      document.body.appendChild(qrcodeScript);
      document.body.appendChild(socketIOScript);

      // Create styles tags
 
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
  
      `
      styleTag.textContent = cssStyles;
      
      // Adding tag to html
      // document.head.appendChild(styleTag);
      shadowRoot.appendChild(styleTag);

      let generateButton = shadowRoot.getElementById('generate-btn');
      let welcomeHeader = shadowRoot.getElementById('welcome-title');
      let qrCodeDiv = shadowRoot.getElementById('qr-code');
      let scanQrContainer= shadowRoot.getElementById('scan-qr-container');
      let qrContainer = shadowRoot.getElementById("qr-code-container");
      let scanText = shadowRoot.getElementById('scan-qr-text-container');
      let connectionInfoDiv = shadowRoot.getElementById('connection-info');
      let disconnectBtn = shadowRoot.getElementById('disconnect-btn');
      let backToConnectBtn = shadowRoot.getElementById('qr-back-arrow');
      let qrDiv = shadowRoot.getElementById("qr-container");
      let inputValue = "";



      generateButton.addEventListener('click', async() => {
        await openQr()
      });
      const openQr = async () => {
        inputValue = accessCredentials.ToUri(); 
       
        scanQrContainer.style.display = 'block';
        qrContainer.style.display = 'flex';
        scanText.style.display = 'block';
        generateButton.style.display = 'none';
        welcomeHeader.style.display = 'none';
        if (inputValue.trim() !== '') {
          // Generar el código QR
          new QRCode(qrCodeDiv, {
            text: inputValue,
            width: 200,
            height: 200,
          });
        } else {
          console.log("Error generating QR Code");
        }
        await connectToServerAndListen();
      }
 
      backToConnectBtn.addEventListener('click', () => {
        dappClient.disconnectServer();
        qrCodeDiv.innerHTML = ''
        scanQrContainer.style.display = 'none';
        qrContainer.style.display = 'none';
        scanText.style.display = 'none';
        generateButton.style.display = 'block';
        welcomeHeader.style.display = 'block';
      });

      const connectToServerAndListen = async () => {
        console.log("Inicializando la vuelta")
        dappClient = new PlutonicationDAppClient(accessCredentials);
        // Initialize connection
        await dappClient.initializeAsync();
        // Receive pubKey
        const pubKey = await dappClient.receivePubKeyAsync();
        
        // Use the pubKey as need it
        console.log("La pubKey es:", pubKey);
        if (pubKey !== "") {
          console.log("entrando aquí")
          connectionInfoDiv.style.display = 'block';
          connectionInfoDiv.textContent += pubKey;
          qrCodeDiv.style.display = 'none';
          scanQrContainer.style.display = "none";
          qrContainer.style.display = 'none';
          scanText.style.display = 'none';
          disconnectBtn.style.display = "block"
        }
      };

      disconnectBtn.addEventListener('click', () => {
        hideQr();
      });

      const hideQr = () => {
        console.log('Desconexión iniciada');
        if (dappClient) {
          dappClient.disconnectServer();
        } else {
          console.log('dappClient is not connected');
        }
        qrCodeDiv.innerHTML = '';
        qrCodeDiv.style.display = 'block';
        generateButton.style.display = 'block';
        welcomeHeader.style.display = 'block';
        connectionInfoDiv.style.display = 'none';
        disconnectBtn.style.display = 'none';
      }
    }
  };

  customElements.define('qr-generator', PlutonicationQr)

  export default PlutonicationQr;
