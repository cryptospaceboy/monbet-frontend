import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./index.css";
import logo from "./assets/dice.svg";

const CONTRACT_ADDRESS = "0x2A271145ca0a9D1A381726830B03616E3F7fe047";
const ABI = [
  "function createMatch(uint8 _choice) public payable",
  "function getMyStats() public view returns (uint256 wins, uint256 losses)"
];

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [choice, setChoice] = useState(null);
  const [amountType, setAmountType] = useState(null);
  const [error, setError] = useState("");
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask not detected");
        return;
      }
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const _accounts = await _provider.send("eth_requestAccounts", []);
      const _signer = await _provider.getSigner();
      const _contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, _signer);

      setProvider(_provider);
      setSigner(_signer);
      setContract(_contract);
      setAccount(_accounts[0]);
    } catch (err) {
      console.error(err);
      setError("Wallet connection failed");
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAccount(null);
    setBalance(null);
    setChoice(null);
    setAmountType(null);
    setError("");
    setWins(0);
    setLosses(0);
  };

  const refreshBalance = async () => {
    if (provider && account) {
      const bal = await provider.getBalance(account);
      setBalance(ethers.formatEther(bal));
    }
  };

  const fetchStats = async () => {
    if (contract) {
      try {
        const [w, l] = await contract.getMyStats();
        setWins(Number(w));
        setLosses(Number(l));
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
  };

  const placeBet = async () => {
    if (choice === null || amountType === null) {
      setError("Select heads/tails and amount");
      return;
    }
    setError("");

    const amount = amountType === 0 ? "0.05" : "0.1";

    try {
      const tx = await contract.createMatch(choice, {
        value: ethers.parseEther(amount.toString())
      });
      await tx.wait();
      await refreshBalance();
      await fetchStats();
    } catch (err) {
      console.error("Bet error:", err);
      if (err.reason) {
        setError(err.reason);
      } else {
        setError("Bet failed");
      }
    }
  };

  useEffect(() => {
    if (provider && account) {
      refreshBalance();
      fetchStats();
    }
  }, [provider, account]);

  return (
    <div className="app">
      <img src={logo} alt="Logo" className="logo" />

      {!account ? (
        <button className="connect-btn" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <>
          <div className="wallet-info">Wallet: {account}</div>
          <div className="wallet-info">Balance: {balance} MON</div>
          <div className="wallet-info">Wins: {wins} | Losses: {losses}</div>
          <button className="disconnect-btn" onClick={disconnectWallet}>
            Disconnect
          </button>
          <button className="disconnect-btn" onClick={refreshBalance}>
            Refresh Balance
          </button>
        </>
      )}

      {account && (
        <div className="bet-box">
          <div className="bet-title">Choose Heads or Tails:</div>
          <div className="buttons">
            <button
              className={`bet-button ${choice === 0 ? "selected" : ""}`}
              onClick={() => setChoice(0)}
            >
              Heads
            </button>
            <button
              className={`bet-button ${choice === 1 ? "selected" : ""}`}
              onClick={() => setChoice(1)}
            >
              Tails
            </button>
          </div>

          <div className="bet-title">Select Amount to Bet:</div>
          <div className="buttons">
            <button
              className={`bet-button ${amountType === 0 ? "selected-bet" : ""}`}
              onClick={() => setAmountType(0)}
            >
              0.05 MON
            </button>
            <button
              className={`bet-button ${amountType === 1 ? "selected-bet" : ""}`}
              onClick={() => setAmountType(1)}
            >
              0.1 MON
            </button>
          </div>

          <button className="connect-btn" onClick={placeBet}>
            Place Bet
          </button>

          {error && <div className="error">{error}</div>}
        </div>
      )}
    </div>
  );
}

export default App;
