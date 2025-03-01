import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";

export default function EthWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);

  const addEthWallet = async () => {
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(derivationPath);
      const privateKey = child.privateKey;
      const wallet = new Wallet(privateKey);
      setCurrentIndex(currentIndex + 1);
      setAddresses([...addresses, wallet.address]);
    } catch (error) {
      console.error("Error adding ETH wallet:", error);
      alert("Failed to generate Ethereum wallet!");
    }
  };

  return (
    <div className="wallet-section">
      <h3>Ethereum Wallets</h3>
      <button onClick={addEthWallet} className="add-btn">
        Add ETH Wallet
      </button>
      {addresses.map((address, index) => (
        <div key={index} className="wallet-key">
          Eth - {address}
        </div>
      ))}
    </div>
  );
}