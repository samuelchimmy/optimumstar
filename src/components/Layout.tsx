
import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import BubbleBackground from './BubbleBackground';
import Web3AuthButton from './Web3AuthButton';

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
      <BubbleBackground />
      
      <header className="bg-dark text-light dark:bg-gray-900 p-4 shadow-md relative z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="font-bold text-xl flex items-center">
            <img 
              src="/lovable-uploads/38b19256-c906-457a-b514-f74388554713.png" 
              alt="Optimum Logo" 
              className="h-8 w-auto mr-2" 
            />
            <span className="text-primary">Optimum</span>
            <span className="text-secondary dark:text-secondary-dark">Star</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link to="/leaderboard" className="hover:text-secondary transition-colors">
              Leaderboard
            </Link>
            <a 
              href="https://docs.getoptimum.xyz/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-secondary transition-colors"
            >
              Optimum Whitepaper
            </a>
            
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="hover:text-secondary transition-colors">
                  Profile
                </Link>
                <Web3AuthButton 
                  variant="outline" 
                  className="text-light border-light hover:bg-primary hover:text-light dark:border-light/70 liquid-button"
                />
                <Button 
                  variant="outline" 
                  onClick={signOut}
                  className="text-light border-light hover:bg-primary hover:text-light dark:border-light/70 liquid-button"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button className="bg-primary text-light hover:bg-primary/90 liquid-button">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6 relative z-10">
        {children}
      </main>
      
      <footer className="bg-dark text-light dark:bg-gray-900 p-4 relative z-10">
        <div className="container mx-auto space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p>Built with ❤️ by <a href="https://x.com/MetisCharter" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition-colors">jadeofwallstreet</a></p>
              <p className="text-sm mt-1">
                <Link to="/terms" className="text-secondary hover:text-primary transition-colors dark:text-secondary-dark">
                  Terms & Conditions
                </Link>
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <p className="text-sm mb-2">Donate to this project</p>
              <div className="flex items-center space-x-2 bg-gray-800 dark:bg-gray-950 rounded-md px-3 py-2 text-sm">
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
