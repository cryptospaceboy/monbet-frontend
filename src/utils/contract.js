import { ethers } from "ethers";
import BettingP2PABI from "../contracts/BettingP2P.json";

const CONTRACT_ADDRESS = "0x86698F5b6a66783b86Afa91F7f96070ce65D9c51"; // your deployed contract

export const placeBet = async (betAmountInMON) => {
  if (!window.ethereum) throw new Error("MetaMask not found");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, BettingP2PABI, signer);

  const value = ethers.parseEther(betAmountInMON);
  const tx = await contract.placeBet({ value });
  await tx.wait();
};