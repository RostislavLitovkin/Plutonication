import './App.css'
import {AccessCredentials, initializePlutonicationDAppClientWithModal} from "@plutonication/plutonication";

function App() {
  let account;

  const initialize = async () => {
    const accessCredentials = new AccessCredentials(
      "wss://plutonication-acnha.ondigitalocean.app/",
      "1",
      "Plutonication test",
      "https://rostislavlitovkin.pythonanywhere.com/plutowalleticonwhite"
    );

    console.log("accessCredentials:", accessCredentials.ToUri());

    account = await initializePlutonicationDAppClientWithModal(
      accessCredentials,
      (receivedPubkey) => {
        console.log("receivedPubkey", receivedPubkey);
      }
    );

    console.log("injected", account);
  };

  const signMessage = async () => {

    const rawMessage = {
      address: account.address,
      data: "0x3c42797465733e48656c6c6f20537562737472617465206d6573736167653c2f42797465733e",
      type: "bytes",
    }

    const rawSignatureResult = await account.signer.signRaw(rawMessage)

    console.log("Signature received: ", rawSignatureResult)
  };

  return (
    <div>
      <plutonication-modal></plutonication-modal>
      <button onClick={initialize}>Connect</button>
      <button onClick={signMessage}>Sign message</button>
    </div>
  );
};

export default App;