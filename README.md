# Plutonication

Plutonication is a TypeScript library for create a communication between dapps and wallets across platforms


## Requirements

- Node.js and npm installed on your system.

## Instalation

```javascript
npm i @plutonication/plutonication
```

## Other versions
- C#:  https://github.com/cisar2218/Plutonication/tree/main
- Kotlin - planned
- Swift - planned

## Usage
The overall structure of Plutonication is designed to be as little intrusive as possible.

If you are building a dApp, you will want to interact with PlutonicationDAppClient static class.

Here is how:

In a react application you can use it like this:

#### Import PlutonicationDAppClient
```javascript
import { PlutonicationDAppClient, AccessCredentials, PlutonicationQrPopUp } from '@plutonication/plutonication';
```

#### Initialize the Connection and send transactions
To access the initializeAsync and SendPayloadAsync methods, you need to instantiate the AccessCredentials with the necessary information and also create an instance of PlutonicationDAppClient
```javascript
const dappClientUsage = async() => {

  //  Access credentials are used to show correct info to the wallet.
  const accessCredentials = new AccessCredentials(
    "wss://plutonication-acnha.ondigitalocean.app/",
    "1",
    "Galaxy Logic Game",
    "https://rostislavlitovkin.pythonanywhere.com/logo"
  );

  // Instantiate the Dapp
  const dappClient = new PlutonicationDAppClient(accessCredentials);
  const payloadRaw: SignerPayloadRaw  = { ... };

  const payloadJson: SignerPayloadJSON  = { ... };

  try {

    // Initialize connection
    await dappClient.initializeAsync();
    // Receive pubKey
    const pubKey = await dappClient.receivePubKeyAsync();

    // Use the pubKey as need it
    console.log("The pubKey is:", pubKey);

    // Send paylaods request to be signed
    await dappClient.sendJsonPayloadAsync(payloadJson);
    await dappClient.sendRawPayloadAsync(payloadRaw);

  } catch (error) {
    console.error("Error:", error);
  }
};

```

After you can send the payloads back to the dapp signed:
```javascript
const walletClientUsage = async() => {

  //  Access credentials are used to show correct info to the wallet.
  const accessCredentials = new AccessCredentials(
    "wss://plutonication-acnha.ondigitalocean.app/",
    "1",
    "Galaxy Logic Game",
    "https://rostislavlitovkin.pythonanywhere.com/logo"
  );

// Instantiate the PlutonicationWalletClient class
const walletClient = new PlutonicationWalletClient(accessCredentials);

  try {

    // Initialize the connection
    await walletClient.initializeAsync();
    // Send public key to the dapp
    await walletClient.sendPublicKeyAsync("5GQWXj...");

  // Send signature to the payload request to the wallet
    await walletClient.sendSignedPayloadAsync("0x3e17cafeb04e69...");
    await walletClient.sendSignedRawAsync("0x3e17cafeb04e69....");

  } catch (error) {
    console.error("Error:", error);
  }
};
```

#### Plutonication Qr PopUp
You can use the Qr PopUp like this in a reactjs application:
```javascript
export default function App() {
  return (
    <PlutonicationQrPopUp />
      // Rest of your app...
  )
}
```

### Problem / Motivation
Currently, there is no way to connect a wallet to more exotic devices, like gaming console and wearables.

## How it works

The private key is always saved in your wallet on your phone and is never sent anywhere. You need to pair the dApp with the wallet. To do so, the wallet needs to receive a special link with information needed to establish the connection. The wallet can receive this link, for example, by scanning a QR code. Once the link is received, the dApp and the wallet will get paired via websockets to establish a stable connection between different platforms. After the connection is established, the wallet is ready to receive any Extrinsics, which it can then sign and send back to the dApp.

## Execution
To run your application, simply execute your TypeScript file containing the usage code. Ensure that Node.js is installed on your system, and if you haven't already, compile your TypeScript code to JavaScript using the TypeScript Compiler (tsc).

establish the connection.

Run your application with:
```javascript
node your_application.js
```

### Plutonication Server
- Used for reliable establishing of connection.
- Passes payloads between Wallets and dApps.

### Mobile Wallet
- Has access to the private key
- signs the payloads and sends them back to the dApp.
- Never exposes the private key

### dApp
- needs to have access to either: Plutonication Native / Plutonication Extension

### Plutonication Native
- A simple package that allows the dApp get connected with the Mobile Wallet.
- Connects the dApp with the Plutonication server.
- Helps to generate a QR code for the Wallet to 

### Plutonication Extension
a polkadot.js extension that works with any existing dApp that supports polkadot.js extension.
Connects the dApp with the Plutonication server.
Generate a QR code for the Wallet to establish the connection.

## Limitations
- both devices need to support internet connection

## dApps utilising Plutonication
- [Plutonication Extension](https://github.com/RostislavLitovkin/PlutonicationExtension)
- [Galaxy Logic Game](https://github.com/RostislavLitovkin/galaxylogicgamemaui)

## Wallets utilising Plutonication
- [PlutoWallet](https://github.com/RostislavLitovkin/PlutoWallet)

Feel free to add your own project by making a PR.

## Inspiration
- [https://walletconnect.com/](https://walletconnect.com/)

## Contributions
Contributions are welcome. If you wish to contribute to the project, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature: git checkout -b feature/new-feature.
3. Make your changes and commit them: git commit -m 'Add new feature'.
4. Push your changes to your fork: git push origin feature/new-feature.
5. Open a Pull Request in the original repository.

## License
This project is licensed under the MIT License. 