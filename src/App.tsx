
import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import QuizPage from "./pages/QuizPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import UserProfilePage from "./pages/UserProfilePage";
import TermsPage from "./pages/TermsPage";
import NotFound from "./pages/NotFound";
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, optimism } from 'wagmi/chains';
import { embeddedWallet } from '@civic/auth-web3';
import { CivicAuthProvider as CivicProviderOriginal } from '@civic/auth-web3/react';
import { CivicAuthProvider } from './contexts/CivicAuthContext';

// Document title
document.title = "OptimumStar - Web3 Memory Quiz";

const CIVIC_CLIENT_ID = "civic-client-id"; // Replace with your actual Civic client ID

// Create Wagmi config
const wagmiConfig = createConfig({
  chains: [mainnet, optimism],
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(), // Optimum is on Optimism chain
  },
  connectors: [
    embeddedWallet(),
  ],
});

function App() {
  // Create a client for the React Query context
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WagmiProvider config={wagmiConfig}>
          <CivicProviderOriginal clientId={CIVIC_CLIENT_ID}>
            <AuthProvider>
              <CivicAuthProvider>
                <BrowserRouter>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/quiz" element={<QuizPage />} />
                      <Route path="/leaderboard" element={<LeaderboardPage />} />
                      <Route path="/user/:userId" element={<UserProfilePage />} />
                      <Route path="/terms" element={<TermsPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </TooltipProvider>
                </BrowserRouter>
              </CivicAuthProvider>
            </AuthProvider>
          </CivicProviderOriginal>
        </WagmiProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
