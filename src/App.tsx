
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Conversations from "./pages/Conversations";
import Agents from "./pages/Agents";
import Knowledge from "./pages/Knowledge";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SignedOut>
            <div className="min-h-screen flex items-center justify-center bg-background">
              <SignIn />
            </div>
          </SignedOut>
          <SignedIn>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/conversations" element={<Conversations />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/knowledge" element={<Knowledge />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SignedIn>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
