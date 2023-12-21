// Small example of how to send the payloads signed back to the dapp 
//using PlutonicationWalletClient function

import { Keyring } from "@polkadot/keyring";
import { cryptoWaitReady, mnemonicGenerate, encodeAddress } from "@polkadot/util-crypto";
import { stringToU8a, u8aToHex } from "@polkadot/util";
import { AccessCredentials, PlutonicationWalletClient } from "../..";



const walletClientUsage = async(): Promise<void> => {
  const accessCredentials = new AccessCredentials(
    "wss://plutonication-acnha.ondigitalocean.app/",
    "1",
    "Galaxy Logic Game",
    "https://rostislavlitovkin.pythonanywhere.com/logo"
  );

  const walletClient = new PlutonicationWalletClient(accessCredentials);

  await cryptoWaitReady();
  const keyring = new Keyring({ type: "sr25519" });

  const mnemonic = mnemonicGenerate();
  const account = keyring.addFromUri(mnemonic, { name: "first pair" }, "ed25519");
  const publicKey = account.publicKey;
  const pubKeySS58Format = encodeAddress(publicKey, 42);
  
  const message = stringToU8a("this is our message");
  const signature = account.sign(message);
  const isValid = account.verify(message, signature, account.publicKey);
  
  console.log(`${u8aToHex(signature)} is ${isValid ? "valid" : "invalid"}`);

  try {

    // Initialize the connection
    await walletClient.initializeAsync();
    // Sending pubKey to the dapp
    await walletClient.sendPublicKeyAsync(pubKeySS58Format);

    // Sending signature to the dapp
    await walletClient.sendSignedPayloadAsync({id: 0, signature: `${u8aToHex(signature)}`});
    await walletClient.sendSignedRawAsync({id: 0, signature: `${u8aToHex(signature)}`});

  } catch (error) {
    console.error("Error:", error);
  }

};

void walletClientUsage();