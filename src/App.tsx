import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Settings from "./pages/Settings.tsx";
import Flags from "./pages/Flags.tsx";
import About from "./pages/About.tsx";
import Downloads from "./pages/Downloads.tsx";
import Passwords from "./pages/Passwords.tsx";
import Incognito from "./pages/Incognito.tsx";
import Extensions from "./pages/Extensions.tsx";
import { useSettings } from "@/lib/settings-store";

const queryClient = new QueryClient();

const App = () => {
  const [settings] = useSettings();

  // Apply dark mode based on the user's "force dark" setting.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.forceDark);
  }, [settings.forceDark]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/flags" element={<Flags />} />
            <Route path="/about" element={<About />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/passwords" element={<Passwords />} />
            <Route path="/incognito" element={<Incognito />} />
            <Route path="/extensions" element={<Extensions />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
