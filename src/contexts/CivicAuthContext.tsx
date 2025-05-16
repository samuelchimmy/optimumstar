
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser as useCivicUser } from '@civic/auth-web3/react';
import { userHasWallet } from '@civic/auth-web3';
import { useAccount, useConnect, useBalance } from 'wagmi';
import { useAuth as useSupabaseAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface CivicAuthContextProps {
  // Supabase auth (existing)
  isSupabaseAuthenticated: boolean;
  supabaseUser: any;
  // Civic auth
  isCivicAuthenticated: boolean;
  civicUser: any;
  // Wallet information
  hasWallet: boolean;
  walletAddress: string | null;
  walletBalance: string | null;
  walletBalanceSymbol: string | null;
  isWalletConnected: boolean;
  // Actions
  createWallet: () => Promise<void>;
  connectWallet: () => Promise<void>;
  isWalletCreating: boolean;
}

const CivicAuthContext = createContext<CivicAuthContextProps | undefined>(undefined);

export function CivicAuthProvider({ children }: { children: React.ReactNode }) {
  const { user: supabaseUser } = useSupabaseAuth();
  const civicUserContext = useCivicUser();
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const [isWalletCreating, setIsWalletCreating] = useState(false);
  
  // Determine if the user has a wallet
  const hasWallet = civicUserContext.user && userHasWallet(civicUserContext);
  
  // Get wallet address if available
  const walletAddress = hasWallet ? civicUserContext.ethereum?.address : null;
  
  // Use Wagmi's useBalance hook
  const { data: balanceData } = useBalance({
    address: address as `0x${string}` | undefined,
    enabled: isConnected && !!address,
  });
  
  // Extract balance values
  const walletBalance = balanceData ? 
    (Number(balanceData.formatted) < 0.0001 ? "0.0000" : balanceData.formatted) : 
    null;
    
  const walletBalanceSymbol = balanceData ? balanceData.symbol : "ETH";
  
  // Action to create a new wallet
  const createWallet = async () => {
    if (!civicUserContext.user || hasWallet) return;
    
    try {
      setIsWalletCreating(true);
      
      // Check if createWallet is available on the context
      if (civicUserContext.createWallet) {
        await civicUserContext.createWallet();
        
        toast({
          title: "Wallet Created",
          description: "Your Web3 wallet has been created successfully!",
        });
        // Auto-connect after creating
        await connectWallet();
      } else {
        throw new Error("Wallet creation function is not available");
      }
    } catch (error: any) {
      toast({
        title: "Wallet Creation Failed",
        description: error.message || "Failed to create wallet. Please try again.",
        variant: "destructive",
      });
      console.error("Wallet creation error:", error);
    } finally {
      setIsWalletCreating(false);
    }
  };
  
  // Action to connect to existing wallet
  const connectWallet = async () => {
    if (!hasWallet) return;
    
    try {
      // Find the Civic embedded wallet connector
      const civicConnector = connectors.find(c => c.id === 'civic');
      
      if (civicConnector) {
        await connect({ connector: civicConnector });
        
        toast({
          title: "Wallet Connected",
          description: "Your Web3 wallet is now connected!",
        });
      } else {
        // Fallback to first connector if civic not found
        await connect({ connector: connectors[0] });
        
        toast({
          title: "Wallet Connected",
          description: "Your Web3 wallet is now connected!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
      console.error("Wallet connection error:", error);
    }
  };

  const value = {
    // Supabase auth
    isSupabaseAuthenticated: !!supabaseUser,
    supabaseUser,
    // Civic auth
    isCivicAuthenticated: !!civicUserContext.user,
    civicUser: civicUserContext.user,
    // Wallet information
    hasWallet,
    walletAddress,
    walletBalance,
    walletBalanceSymbol,
    isWalletConnected: isConnected,
    // Actions
    createWallet,
    connectWallet,
    isWalletCreating,
  };

  return <CivicAuthContext.Provider value={value}>{children}</CivicAuthContext.Provider>;
}

export function useCombinedAuth() {
  const context = useContext(CivicAuthContext);
  if (context === undefined) {
    throw new Error('useCombinedAuth must be used within a CivicAuthProvider');
  }
  return context;
}
