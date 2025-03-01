import { useEffect, useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { clusterApiUrl, Keypair, Connection } from "@solana/web3.js";
import nacl from "tweetnacl";

function SolanaWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [wallets, setWallets] = useState([]);

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const addSolanaWallet = async () => {
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      console.log("derivedSeed:", derivedSeed);

      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const keypair = Keypair.fromSecretKey(secret);
      console.log(keypair);

      const publicKey = keypair.publicKey.toBase58();
      const balance = await connection.getBalance(keypair.publicKey);
      const wallet = { publicKey, balance: balance / 1e9 };
      setCurrentIndex(currentIndex + 1);
      setWallets([...wallets, wallet]);
    } catch (error) {
      console.error("Error adding Solana wallet:", error);
      alert("Failed to generate Solana wallet!");
    }
  };

  useEffect(() => {
    const updateBalances = async () => {
      const updatedWallets = await Promise.all(wallets.map(async (wallet) => {
        const balance = await connection.getBalance(
          new Keypair({ publicKey: new Uint8Array(Buffer.from(wallet.publicKey, "base58")) }).publicKey
        );
        return { ...wallet, balance: balance / 1e9 };
      })
      );
      setWallets(updatedWallets);
    };
    if (wallets.length > 0) {
      updateBalances();
      const interval = setInterval(updateBalances, 30000);
      return () => clearInterval(interval);
    }
  }, [wallets.length]);



  return (
    <div className="wallet-section">
      <h3>Solana Wallets</h3>
      <button onClick={addSolanaWallet}>Add Solana Wallet</button>
      {wallets.map((wallet, i) => (
        <div key={i} className="wallet-key">
          Sol - {wallet.publicKey} (Balance: {wallet.balance} SOL)
        </div>
      ))}
    </div>
  );

}
export default SolanaWallet;