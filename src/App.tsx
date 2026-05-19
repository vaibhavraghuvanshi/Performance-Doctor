import { Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AuthScreen } from "./components/Auth/AuthScreen";
import { DashboardApp } from "./components/Dashboard/DashboardApp";

function AuthGate() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-3 bg-background-main">
        <Loader2 className="h-10 w-10 animate-spin text-calm-400" aria-hidden />
        <p className="text-text-muted text-sm">Loading session…</p>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <DashboardApp />;
}

export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
