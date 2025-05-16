
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserButton } from '@civic/auth-web3/react';
import { Wallet } from 'lucide-react';

export default function LoginForm() {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<{email: boolean}>({
    email: false
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authMethod, setAuthMethod] = useState<'email' | 'web3'>('email');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(prev => ({ ...prev, email: true }));
      
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      if (authMode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
        toast({
          title: "Sign up successful",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to authenticate. Please try again.",
        variant: "destructive",
      });
      console.error("Email auth error:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, email: false }));
    }
  };

  return (
    <Card className="w-[350px] shadow-lg border border-secondary/30">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome to OptimumStar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-center text-gray-600 mb-4">
          Sign in to track your quiz progress and compete on the leaderboard!
        </p>
        
        <Tabs defaultValue="email" className="w-full" onValueChange={(value) => setAuthMethod(value as 'email' | 'web3')}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="web3">Web3</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                />
              </div>
              <div className="flex justify-between text-sm">
                <button 
                  type="button" 
                  onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                  className="text-primary hover:underline"
                >
                  {authMode === 'signin' ? 'Need an account?' : 'Already have an account?'}
                </button>
              </div>
              <Button 
                type="submit" 
                disabled={isLoading.email}
                className="w-full"
              >
                <FaEnvelope className="mr-2 h-4 w-4" />
                {isLoading.email 
                  ? "Processing..." 
                  : authMode === 'signin' 
                    ? "Sign In with Email" 
                    : "Sign Up with Email"
                }
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="web3" className="flex flex-col items-center space-y-4">
            <div className="p-4 border border-dashed rounded-md bg-muted/50 w-full flex flex-col items-center space-y-4">
              <Wallet className="h-12 w-12 text-primary" />
              <h3 className="text-lg font-semibold">Web3 Authentication</h3>
              <p className="text-sm text-center text-muted-foreground">
                Sign in with your Web3 wallet for a passwordless experience
              </p>
              <div className="my-4">
                <UserButton />
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Powered by Civic Auth
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
