import SidebarSwitcher from "@/components/SidebarSwitcher";
import HehePanel from "@/components/HehePanel";

export default function Page() {
  return (
    <main className="bg-[#0b0e14] text-zinc-100">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold">HEHE — Agentic AI Video Studio</h1>
        <p className="text-zinc-300">Create agentic AI video, end‑to‑end, in one canvas.</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <h2 className="mb-3 text-2xl font-semibold">Editor + Copilot</h2>
        <SidebarSwitcher mainUrl="/hehe" />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <h2 className="mb-3 text-2xl font-semibold">HEHE API</h2>
        <HehePanel />
      </section>
    </main>
  );
}
