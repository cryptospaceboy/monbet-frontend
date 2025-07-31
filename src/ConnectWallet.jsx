import { useState } from 'react';
import { ethers } from 'ethers';

function ConnectWallet({ onConnect }) {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        onConnect(accounts[0]);
      } catch (error) {
        console.error('User rejected wallet connection', error);
      }
    } else {
      alert('MetaMask not found. Please install it.');
    }
  };

  return (
    <div>
      {walletAddress ? (
        <p>Connected: {walletAddress}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

export default ConnectWallet;