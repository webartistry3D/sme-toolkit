import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import InvoiceGenerator from "@/pages/InvoiceGenerator";
import WhatsAppBuilder from "@/pages/WhatsAppBuilder";
import ProfitCalculator from "@/pages/ProfitCalculator";
import SpendBreakdownCalculator from "@/pages/SpendBreakdownCalculator";
import NotFound from "@/pages/not-found";
import SocialScheduler from "@/pages/SocialScheduler";
import DeliveryEstimator from "@/pages/DeliveryEstimator";
import BookingScheduler from "./pages/BookingScheduler";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/invoice-generator" component={InvoiceGenerator} />
      <Route path="/social-scheduler" component={SocialScheduler} />
      <Route path="/whatsapp-builder" component={WhatsAppBuilder} />
      <Route path="/profit-calculator" component={ProfitCalculator} />
      <Route path="/spend-breakdown" component={SpendBreakdownCalculator} />
      <Route path="/delivery-estimator" component={DeliveryEstimator} />
      <Route path="/booking-scheduler" component={BookingScheduler} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
