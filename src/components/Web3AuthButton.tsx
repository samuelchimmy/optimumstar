
import { Button } from '@/components/ui/button';
import { useCombinedAuth } from '../contexts/CivicAuthContext';
import { Wallet } from 'lucide-react';
import { useState } from 'react';
import { UserButton } from '@civic/auth-web3/react';
import { useAccount } from 'wagmi';

interface Web3AuthButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export default function Web3AuthButton({ 
  variant = 'default',
  size = 'default',
  className = ''
}: Web3AuthButtonProps) {
  const { 
    isCivicAuthenticated, 
    hasWallet, 
    walletAddress, 
    walletBalance,
    walletBalanceSymbol,
    createWallet, 
    connectWallet,
    isWalletCreating
  } = useCombinedAuth();
  
  // Use Wagmi hook for up-to-date connection status
  const { isConnected } = useAccount();
  
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Truncate wallet address for display
  const truncatedAddress = walletAddress 
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null;
  
  if (!isCivicAuthenticated) {
    return (
      <div className="relative inline-block">
        <UserButton />
      </div>
    );
  }
  
  if (!hasWallet) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled={isWalletCreating}
        onClick={() => createWallet()}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isWalletCreating ? "Creating Wallet..." : "Create Web3 Wallet"}
      </Button>
    );
  }
  
  if (!isConnected) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => connectWallet()}
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }
  
  return (
    <div className="relative inline-block">
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {truncatedAddress}
      </Button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-background border border-border z-10">
          <div className="rounded-md ring-1 ring-black ring-opacity-5 p-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Wallet Address:</p>
              <p className="text-xs text-muted-foreground break-all">{walletAddress}</p>
              
              {walletBalance && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Balance:</p>
                  <p className="text-lg font-bold">
                    {walletBalance} {walletBalanceSymbol}
                  </p>
                </div>
              )}
              
              <div className="mt-2 pt-2 border-t">
                <UserButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
