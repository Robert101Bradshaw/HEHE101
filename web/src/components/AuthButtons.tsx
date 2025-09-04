"use client";

import { useSession, signOut } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return (
    <div className="rounded-md border border-surface-secondary bg-surface px-3 py-2 text-sm text-muted">
      Loading…
    </div>
  );
  
  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <button 
          disabled 
          className="rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm text-muted cursor-not-allowed opacity-50" 
          title="Authentication coming soon during rebranding"
        >
          Sign in with GitHub
        </button>
        <button 
          disabled 
          className="rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm text-muted cursor-not-allowed opacity-50" 
          title="Authentication coming soon during rebranding"
        >
          Sign in with Google
        </button>
        <span className="text-xs text-muted px-2">🔒 Rebranding in progress</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className="hidden text-sm text-muted sm:block">Hi, {session.user?.name}</div>
      <button 
        className="rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm text-foreground hover:bg-surface transition-colors" 
        onClick={() => signOut({ redirect: false })}
      >
        Sign out
      </button>
    </div>
  );
}
