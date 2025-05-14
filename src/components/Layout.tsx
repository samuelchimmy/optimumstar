
import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const [copied, setCopied] = useState(false);
  
  const walletAddress = "0xfa2B8eD012f756E22E780B772d604af4575d5fcf";
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-dark text-light p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="font-bold text-xl">
            <span className="text-primary">Succinct</span>
            <span className="text-secondary">Star</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link to="/leaderboard" className="hover:text-secondary transition-colors">
              Leaderboard
            </Link>
            <a 
              href="https://docs.succinct.xyz/docs/network/whitepapers" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-secondary transition-colors"
            >
              Succinct Whitepaper
            </a>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="hover:text-secondary transition-colors">
                  Profile
                </Link>
                <Button 
                  variant="outline" 
                  onClick={signOut}
                  className="text-light border-light hover:bg-primary hover:text-light"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button className="bg-primary text-light hover:bg-primary/90">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="bg-dark text-light p-4">
        <div className="container mx-auto space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>Built with ❤️ by <a href="https://x.com/MetisCharter" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition-colors">jadeofwallstreet</a></p>
            
            <div className="flex flex-col items-center md:items-end">
              <p className="text-sm mb-2">Donate to this project</p>
              <div className="flex items-center space-x-2 bg-gray-800 rounded-md px-3 py-2 text-sm">
                <span className="truncate max-w-[200px] sm:max-w-xs">{walletAddress}</span>
                <button 
                  onClick={copyToClipboard}
                  className="text-primary hover:text-secondary transition-colors"
                  aria-label="Copy wallet address"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
