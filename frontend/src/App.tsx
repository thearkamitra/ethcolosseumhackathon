
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import LiveCalls from "./pages/LiveCalls";
import FollowUps from "./pages/FollowUps";
import BotSettings from "./pages/BotSettings";
import Language from "./pages/Language";
import TalkWithAI from "./pages/TalkWithAI";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/live-calls" element={<AppLayout><LiveCalls /></AppLayout>} />
          <Route path="/follow-ups" element={<AppLayout><FollowUps /></AppLayout>} />
          <Route path="/talk-with-ai" element={<AppLayout><TalkWithAI /></AppLayout>} />
          <Route path="/bot-settings" element={<AppLayout><BotSettings /></AppLayout>} />
          <Route path="/language" element={<AppLayout><Language /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
