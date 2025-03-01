import { useState } from "react";
import { generateMnemonic } from "bip39";
import SolanaWallet from "./SolanaWallet";
import EthWallet from "./EthWallet";
import "./App.css";

function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [showMnemonic, setShowMnemonic] = useState(false);

  const handleGenerateMnemonic = () => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
    setShowMnemonic(true);
  };

  return (
    <div className="app-container">
      <h1>Web Wallet Generator</h1>
      <button onClick={handleGenerateMnemonic}>Create Seed Phrase</button>
      {mnemonic && (
        <div className="mnemonic-section">
          <h3>Your Seed Phrase</h3>
          <p className="mnemonic-text">
            {showMnemonic ? mnemonic : "•••• •••• •••• •••• •••• •••• •••• •••• •••• •••• •••• ••••"}
          </p>
          <button onClick={() => setShowMnemonic(!showMnemonic)}>
            {showMnemonic ? "Hide" : "Show"}
          </button>
        </div>
      )}
      {mnemonic && (
        <div className="wallets">
          <EthWallet mnemonic={mnemonic} />
          <SolanaWallet mnemonic={mnemonic} />
        </div>
      )}
    </div>
  );
}

export default App;