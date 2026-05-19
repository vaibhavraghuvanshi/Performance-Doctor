import React from "react";
import { LogOut, Settings, UserRound } from "lucide-react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { useAuth } from "../../contexts/AuthContext";

interface SettingsScreenProps {
  onBackToEditor: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBackToEditor,
}) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex-1 p-5 lg:p-10 max-w-2xl mx-auto w-full animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-calm-500/15 border border-calm-500/30">
          <Settings className="h-6 w-6 text-calm-400" aria-hidden />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Settings</h2>
          <p className="text-sm text-text-muted">Account and session</p>
        </div>
      </div>

      <Card className="border-background-border ring-1 ring-white/5 space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background-soft border border-background-border">
            <UserRound className="h-6 w-6 text-text-muted" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Signed in as
            </p>
            <p className="text-lg font-semibold text-text-primary mt-1">{user?.displayName}</p>
            <p className="text-sm text-text-secondary mt-0.5">{user?.email}</p>
            <p className="text-xs text-text-muted mt-3 leading-relaxed">
              Password and profile are stored on the API server in a local data file (see server{" "}
              <code className="text-calm-400">data/</code> and <code className="text-calm-400">JWT_SECRET</code> in
              production).
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2 border-t border-background-border">
          <Button variant="secondary" size="md" onClick={onBackToEditor}>
            Back to editor
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              logout();
            }}
            icon={<LogOut className="h-4 w-4" aria-hidden />}
          >
            Sign out
          </Button>
        </div>
      </Card>
    </div>
  );
};
