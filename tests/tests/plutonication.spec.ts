import { test, expect } from '@playwright/test';
import { AccessCredentials } from '../../src/AccessCredentials';
import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import { cryptoWaitReady } from '@polkadot/util-crypto'
import { initializePlutonicationDAppClient } from '../../src/PlutonicationDAppClient';
import { initializePlutonicationWalletClient } from '../../src/PlutonicationWalletClient';
import type { SignerPayloadJSON, SignerPayloadRaw } from "@polkadot/types/types"
import { u8aToHex, hexToU8a } from '@polkadot/util';

const accessCredentials = new AccessCredentials(
  "wss://plutonication-acnha.ondigitalocean.app/",
  "1",
  "Galaxy Logic Game",
  "https://rostislavlitovkin.pythonanywhere.com/logo"
);

/// Helper method that returns the Alice account
async function getAlice() {
  await cryptoWaitReady()

  // Create an instance of the Keyring
  const keyring = new Keyring({ type: 'sr25519' })

  // Create pair and add Alice to keyring pair dictionary (with account seed)
  const alice = keyring.addFromUri('//Alice')

  return alice
}

test('AccessCredentials to uri', async () => {
  expect(accessCredentials.ToUri()).toBe(accessCredentials.ToUri())
});

test('Communication between dApp and Wallet', async () => {
  const alice = await getAlice()

  const api = await ApiPromise.create({ provider: new WsProvider("wss://ws.test.azero.dev") });

  console.log("Connected to api")

  function onReceivePubkey(pubkey: string) {
    // Ensure that the received key is right
    expect(pubkey).toBe("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY")
  }

  const [dAppClient, _walletClient] = await Promise.all([
    initializePlutonicationDAppClient(accessCredentials, onReceivePubkey),
    new Promise(async (resolve) => {
      // Wait 3 second
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Connect the PlutonicationWalletClient after PlutonicationDAppClient.
      // They need to run in paralel however.
      // Typically, they would run on different devices/apps in paralel.
      const walletClient = await initializePlutonicationWalletClient(
        accessCredentials,
        alice.address,
        async (payload: SignerPayloadJSON) => { 
          expect(payload.address).toBe("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY")
          console.log("Receive payload")

          const signingPayload = api.registry.createType("ExtrinsicPayload", payload, {
            version: payload.version,
          });
        
          console.log(`Payload to Sign ${signingPayload.toHex()}`);
        
          let message = signingPayload.toU8a({ method: true });
          // If the message is too long, hash it
          if (message.length > 256) {
            message = api.registry.hash(message); // blake2b_256
          }
          
          const signature = alice.sign(message)

          walletClient.send_payload_signature({ signature: u8aToHex(signature), id: 0 })
        },
        async (raw: SignerPayloadRaw) => {
          expect(raw.address).toBe("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY")
          console.log("Received raw: " + raw)
          const signature = alice.sign(hexToU8a(raw.data))
          walletClient.send_raw_signature({ signature: u8aToHex(signature), id: 0 })
        })

      resolve(walletClient)
    }),
  ]);

  // Wait 2 second
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Test payload message signing
  const payload: SignerPayloadJSON = {
    address: alice.address,
    blockHash: "0xd12ff783a76a5e07156d2a3ff61745b3a1f892bf6247c1b3bf0fd7ba2085eda6",
    blockNumber: "0x02c539c4",
    era: "0x481c",
    genesisHash: "0x05d5279c52c484cc80396535a316add7d47b1c5b9e0398dd1f584149341460c5",
    method: "0x050700004769bbe59968882c1597ec1151621f0193547285125f1c1337371c013ff61f0f0080c6a47e8d03",
    nonce: "0x00000001",
    signedExtensions: ['CheckNonZeroSender', 'CheckSpecVersion', 'CheckTxVersion', 'CheckGenesis', 'CheckMortality', 'CheckNonce', 'CheckWeight', 'ChargeTransactionPayment'],
    specVersion: "0x00000043",
    tip: "0x00000000000000000000000000000000",
    transactionVersion: "0x00000011",
    version: 4,
  }
  if (dAppClient.signer.signPayload != null) {
    const payloadSignatureResult = await dAppClient.signer.signPayload(payload);

    const signingPayload = api.registry.createType("ExtrinsicPayload", payload, {
      version: payload.version,
    });

    let message = signingPayload.toU8a({ method: true });
    // If the message is too long, hash it
    if (message.length > 256) {
      message = api.registry.hash(message); // blake2b_256
    }

    expect(alice.verify(message, hexToU8a(payloadSignatureResult.signature), alice.publicKey)).toBeTruthy();
  }

  // Wait 2 second
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Test Raw message signing
  const rawMessage: SignerPayloadRaw = {
    address: alice.address,
    data: "0x3c42797465733e48656c6c6f20537562737472617465206d6573736167653c2f42797465733e",
    type: "bytes",
  }

  if (dAppClient.signer.signRaw != null) {
    const rawSignatureResult = await dAppClient.signer.signRaw(rawMessage);


    expect(alice.verify(rawMessage.data, hexToU8a(rawSignatureResult.signature), alice.publicKey)).toBeTruthy();
  }
});