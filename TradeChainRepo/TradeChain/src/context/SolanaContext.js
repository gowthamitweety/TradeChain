import { createContext, useContext } from "react";

const solanaContext = createContext();
const host = "http://localhost:5000";
let companyWalletPubKey = "AVstKHC3tC84ZUXjGY4zjdX9tq7aG8YVb4w15dPta1zB";
let companyWalletSecretKey =
  "2GvUUywsmh3kuubsv28pmfkrP4esKnjVhmUUdzRUHw15Kh6jfm4i2hJiEdpYcbZhy4oW1mK2zvLTFAqr7WyFqVBy";

export function SolanaContextProvider({ children }) {
  //Create Solana wallet for user
  async function createSolanaWallet() {
    try {
      const response = await fetch(`${host}/solana/createSolanaWallet`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data;
    } catch (e) {
      alert("Error " + e);
    }
  }
  //get exchange rate of SOL vs any base currency(USD, INR..)
  async function getSolanaPrice(baseCurrency, destCurrency) {
    try {
      const response = await fetch(
        `${host}/solana/getSOLPrice?baseCurrency=${baseCurrency}&destCurrency=${destCurrency}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (e) {
      alert("Error " + e);
    }
  }
  //get Solana wallet balance
  async function getSolanaWalletBalance(address) {
    try {
      const response = await fetch(
        `${host}/solana/getSolanaWalletBalance?bs58PublicKey=${address}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.text();
      return data;
    } catch (e) {
      alert("Error " + e);
    }
  }
  //get all transactions of Solana wallet
  async function listSolanaWalletTransactions(address) {
    try {
      const response = await fetch(
        `${host}/solana/listSolanaWalletTransactions?sourcePubKey=${address}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (e) {
      alert("Error " + e);
    }
  }

  //SOL Wallet to wallet transfer
  async function companyToUserSOLTransfer(destPubKey, amount) {
    try {
      const response = await fetch(
        `${host}/solana/walletSOLTransfer?sourcePubKey=${companyWalletPubKey}&amount=${amount}&sourceSecKey=${companyWalletSecretKey}&destPubKey=${destPubKey}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (e) {
      alert("Error " + e);
    }
  }
  //SOL Wallet to wallet transfer
  async function userToCompanySOLTransfer(sourcePubKey, sourceSecKey, amount) {
    try {
      const response = await fetch(
        `${host}/solana/walletSOLTransfer?sourcePubKey=${sourcePubKey}&amount=${amount}&sourceSecKey=${sourceSecKey}&destPubKey=${companyWalletPubKey}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (e) {
      alert("Error " + e);
    }
  }
  return (
    <solanaContext.Provider
      value={{
        createSolanaWallet,
        getSolanaPrice,
        getSolanaWalletBalance,
        listSolanaWalletTransactions,
        companyToUserSOLTransfer,
        userToCompanySOLTransfer,
      }}
    >
      {children}
    </solanaContext.Provider>
  );
}

export function useSolana() {
  return useContext(solanaContext);
}
