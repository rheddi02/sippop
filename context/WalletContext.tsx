import React, { createContext, useState, ReactNode, useContext } from "react";

interface WalletContextType {
  balance: number;
  addFunds: (amount: number) => void;
  deduct: (amount: number) => void;
}

export const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(0);

  const addFunds = (amount: number) => setBalance((prev) => prev + amount);
  const deduct = (amount: number) =>
    setBalance((prev) => (prev - amount >= 0 ? prev - amount : prev));

  return (
    <WalletContext.Provider value={{ balance, addFunds, deduct }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}