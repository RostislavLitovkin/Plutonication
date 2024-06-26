import "./App.css"
import type { SignerPayloadRaw } from "@polkadot/types/types"
import type { Injected } from "@polkadot/extension-inject/types"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { AccessCredentials, initializePlutonicationDAppClientWithModal } from "@plutonication/plutonication"

function App() {
  let account: Injected
  let publicKey: string
  let api: any

  const connectToApi = async() => {
    api = await ApiPromise.create({ provider: new WsProvider("wss://ws.test.azero.dev") })
  }

  connectToApi()

  const initialize = async () => {

    // Specify your dApp info here
    const accessCredentials = new AccessCredentials(
      // Address of Plutonication server
      // Feel free to use this one
      // Learn more: https://plutonication.com/docs/javascript
      "https://plutonication.com/",

      // dApp name
      "Plutonication test",

      // dApp icon
      "https://rostislavlitovkin.pythonanywhere.com/plutowalleticonwhite",
    )

    account = await initializePlutonicationDAppClientWithModal(
      accessCredentials,
      (receivedPubkey: string) => {
        publicKey = receivedPubkey
        console.log("receivedPubkey", receivedPubkey)
      }
    )

    console.log("injected", account)
  }

  const signMessage = async () => {

    // Check that the account is connected
    if (account == null) {
      console.warn("Account has not connected yet.")
      return
    }

    // Check that the account can sign messages
    if (account.signer.signRaw == null){
      console.warn("Signer property is not present.")
      return
    }

    const rawMessage: SignerPayloadRaw = {
      address: publicKey,
      data: "0x3c42797465733e48656c6c6f20537562737472617465206d6573736167653c2f42797465733e",
      type: "bytes",
    }

    const rawSignatureResult = await account.signer.signRaw(rawMessage)

    console.log("Signature received: ", rawSignatureResult)
  }

  const signBalancesTransfer = async () => {

    // Check that the account is connected
    if (account == null) {
      console.warn("Account has not connected yet.")
      return
    }

    // Check that the account can sign messages
    if (account.signer.signPayload == null){
      console.warn("Signer property is not present.")
      return
    }

    // The actuall balance transfer.
    // Part of the code taken from: https://polkadot.js.org/docs/extension/usage
    api.tx.balances
      .transferKeepAlive("5C5555yEXUcmEJ5kkcCMvdZjUo7NGJiQJMS7vZXEeoMhj3VQ", 10**12)
      .signAndSend(publicKey, { signer: account.signer })
  }

  return (
    <div>
      {/* You need to include the <plutonication-modal /> in order to display the QR code popup. */}
      <plutonication-modal />
      <button onClick={initialize}>Connect</button>
      <button onClick={signMessage}>Sign message</button>
      <button onClick={signBalancesTransfer}>Sign balances_transfer</button>
    </div>
  )
}

export default App
