
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  
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
      
      <footer className="bg-dark text-light p-4 text-center">
        <div className="container mx-auto">
          <p>Built with ❤️ by jadeofwallstreet</p>
        </div>
      </footer>
    </div>
  );
}
