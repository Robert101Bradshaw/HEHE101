"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();
  if (status === "loading") return <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">Loading…</div>;
  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <button className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 hover:bg-white/10" onClick={() => signIn("github")}>Sign in with GitHub</button>
        <button className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 hover:bg-white/10" onClick={() => signIn("google")}>Sign in with Google</button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <div className="hidden text-sm text-zinc-300 sm:block">Hi, {session.user?.name}</div>
      <button className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 hover:bg-white/10" onClick={() => signOut({ redirect: false })}>Sign out</button>
    </div>
  );
}
