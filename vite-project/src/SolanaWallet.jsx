import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

function SolanaWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);

  const addSolanaWallet = async () => {
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const keypair = Keypair.fromSecretKey(secret);
      setCurrentIndex(currentIndex + 1);
      setPublicKeys([...publicKeys, keypair.publicKey.toBase58()]);
    } catch (error) {
      console.error("Error adding Solana wallet:", error);
      alert("Failed to generate Solana wallet!");
    }
  };

  return (
    <div className="wallet-section">
      <h3>Solana Wallets</h3>
      <button onClick={addSolanaWallet} className="add-btn">
        Add Solana Wallet
      </button>
      {publicKeys.map((key, index) => (
        <div key={index} className="wallet-key">
          Sol - {key}
        </div>
      ))}
    </div>
  );
}

export default SolanaWallet;