
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaDiscord, FaGoogle, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LoginForm() {
  const { signInWithDiscord, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<{discord: boolean, google: boolean, email: boolean}>({
    discord: false,
    google: false,
    email: false
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleDiscordSignIn = async () => {
    try {
      setIsLoading(prev => ({ ...prev, discord: true }));
      await signInWithDiscord();
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Failed to sign in with Discord. Please try again.",
        variant: "destructive",
      });
      console.error("Discord auth error:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, discord: false }));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(prev => ({ ...prev, google: true }));
      await signInWithGoogle();
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
      console.error("Google auth error:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, google: false }));
    }
  };

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
        <CardTitle className="text-2xl font-bold">Welcome to SuccinctStar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-center text-gray-600 mb-4">
          Sign in to track your quiz progress and compete on the leaderboard!
        </p>
        
        <Tabs defaultValue="social" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="social">Social Login</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
          
          <TabsContent value="social" className="space-y-4">
            <Button 
              onClick={handleDiscordSignIn}
              disabled={isLoading.discord}
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white flex items-center justify-center gap-2 w-full"
            >
              <FaDiscord className="h-5 w-5" />
              {isLoading.discord ? "Connecting..." : "Sign in with Discord"}
            </Button>

            <Button 
              onClick={handleGoogleSignIn}
              disabled={isLoading.google}
              className="bg-[#4285F4] hover:bg-[#3367D6] text-white flex items-center justify-center gap-2 w-full"
            >
              <FaGoogle className="h-5 w-5" />
              {isLoading.google ? "Connecting..." : "Sign in with Google"}
            </Button>
          </TabsContent>
          
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
        </Tabs>
      </CardContent>
    </Card>
  );
}
