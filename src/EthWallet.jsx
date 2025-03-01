import { useState, useEffect } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet, ethers } from "ethers";

function EthWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState([]);
  const [error, setError] = useState(null);

  const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/demo");

  const addEthWallet = async () => {
    try {
      console.log("Generating ETH wallet for index:", currentIndex);
      console.log(mnemonic);

      const seed = await mnemonicToSeed(mnemonic);
      console.log("Seed generated", seed);
      const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
      const hdNode = HDNodeWallet.fromSeed(seed);
      console.log(hdNode);

      const child = hdNode.derivePath(derivationPath);
      console.log(child);

      const wallet = new Wallet(child.privateKey);
      console.log("Wallet address:", wallet.address);

      const balance = await provider.getBalance(wallet.address);
      console.log("Raw balance (wei):", balance.toString());
      const formattedBalance = ethers.formatEther(balance);
      console.log("Formatted balance (ETH):", formattedBalance);

      setCurrentIndex(currentIndex + 1);
      setWallets([...wallets, { address: wallet.address, balance: formattedBalance }]);
      setError(null);
    } catch (error) {
      console.error("ETH wallet error:", error.message);
      setError(`Failed to add wallet: ${error.message}`);
    }
  };

  useEffect(() => {
    const updateBalances = async () => {
      try {
        const updatedWallets = await Promise.all(
          wallets.map(async (wallet) => {
            const balance = await provider.getBalance(wallet.address);
            return { ...wallet, balance: ethers.formatEther(balance) };
          })
        );
        setWallets(updatedWallets);
      } catch (error) {
        console.error("Balance update error:", error);
      }
    };
    if (wallets.length > 0) {
      updateBalances();
      const interval = setInterval(updateBalances, 30000);
      return () => clearInterval(interval);
    }
  }, [wallets.length]);

  return (
    <div className="wallet-section">
      <h3>Ethereum Wallets</h3>
      <button onClick={addEthWallet}>Add ETH Wallet</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {wallets.map((wallet, i) => (
        <div key={i} className="wallet-key">
          Eth - {wallet.address} (Balance: {wallet.balance} ETH)
        </div>
      ))}
    </div>
  );
}

export default EthWallet;