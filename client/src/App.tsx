// ═══════════════════════════════════════════════════════════
// APP — Tarot Showcase
// Victorian Occultism / Art Nouveau Theme
// Dark theme by default (deep indigo background)
// ═══════════════════════════════════════════════════════════

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster
            toastOptions={{
              style: {
                background: "oklch(0.15 0.07 290)",
                border: "1px solid oklch(0.30 0.12 295 / 50%)",
                color: "oklch(0.92 0.04 80)",
                fontFamily: "var(--font-garamond)",
              },
            }}
          />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
