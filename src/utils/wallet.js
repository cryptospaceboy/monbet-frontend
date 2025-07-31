import { ethers } from "ethers";

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum); // ✅ Correct class name
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      return address;
    } catch (error) {
      console.error("Wallet connection failed:", error);
      return null;
    }
  } else {
    alert("MetaMask not detected. Please install it.");
    return null;
  }
};