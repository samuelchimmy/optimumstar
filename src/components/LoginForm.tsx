
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaDiscord, FaGoogle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export default function LoginForm() {
  const { signInWithDiscord, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<{discord: boolean, google: boolean}>({
    discord: false,
    google: false
  });

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

  return (
    <Card className="w-[350px] shadow-lg border border-secondary/30">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome to SuccinctStar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-center text-gray-600 mb-4">
          Sign in to track your quiz progress and compete on the leaderboard!
        </p>
        
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
      </CardContent>
    </Card>
  );
}
