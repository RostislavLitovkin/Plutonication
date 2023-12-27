import { Socket, io } from "socket.io-client";

class AccessCredentials {
  url: string;
  key: string;
  name: string;
  icon: string;

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
  socket: Socket;
  pubKey: string;

  constructor(accessCredentials) {
    this.socket = io(accessCredentials.url);
  }

   async initializeAsync() {
    return new Promise<void>((resolve) => {
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

  class QRGenerator extends HTMLElement {
    constructor() {
      super();
      // let template = document.getElementById('qr-generator-template').content;
      let template = (document.getElementById('qr-generator-template') as HTMLTemplateElement).content;
      let shadowRoot = this.attachShadow({mode: 'open'});
      shadowRoot.appendChild(template.cloneNode(true));

      let dappClient;

      let generateButton = shadowRoot.getElementById('generate-btn');
      let welcomeHeader = shadowRoot.getElementById('welcome-title');
      let qrCodeDiv = shadowRoot.getElementById('qr-code');
      let scanQrContainer= shadowRoot.getElementById('scan-qr-container');
      let qrContainer = shadowRoot.getElementById("qr-code-container");
      let scanText = shadowRoot.getElementById('scan-qr-text-container');
      let connectionInfoDiv = shadowRoot.getElementById('connection-info');
      let disconnectBtn = shadowRoot.getElementById('disconnect-btn');
      let backToConnectBtn = shadowRoot.getElementById('qr-back-arrow');
      // let qrDiv = shadowRoot.getElementById("qr-container");
      let inputValue = "";



      generateButton.addEventListener('click', async() => {
        inputValue = accessCredentials.ToUri(); 
       
        scanQrContainer.style.display = 'block';
        qrContainer.style.display = 'flex';
        scanText.style.display = 'block';
        generateButton.style.display = 'none';
        welcomeHeader.style.display = 'none';
        if (inputValue.trim() !== '') {
          // Generar el código QR
          // new QRCode(qrCodeDiv, {
          //   text: inputValue,
          //   width: 200,
          //   height: 200,
          // });
        } else {
          console.log("Error generating QR Code");
        }
        await connectToServerAndListen();
        
      });

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
        });
    }
  };

  customElements.define('qr-generator', QRGenerator);
  export default QRGenerator;