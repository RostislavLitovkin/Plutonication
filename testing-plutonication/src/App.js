import logo from './logo.svg';
import './App.css';


function App() {
  const accessCredentials = new AccessCredentials(
    "wss://plutonication-acnha.ondigitalocean.app/",
    "1",
    "Galaxy Logic Game",
    "https://rostislavlitovkin.pythonanywhere.com/logo"
  );

  console.log(accessCredentials.ToUri());

  const connect = async() => {
    const initialize = await initializePlutonicationDAppClientWithModal(accessCredentials, (receivedPubkey) => {
      console.log("receivedPubkey", receivedPubkey);
    });

    console.log("initialize", initialize);
  }

  return (
    <div className="App">
      <button onClick={connect}>Connect</button>
    </div>
  );
}

export default App;
