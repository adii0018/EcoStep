import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get("ecostep_token");

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white dark selection:bg-emerald-500/30 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <Sidebar />
      {/* Main content — offset by sidebar width on desktop */}
      <main className="flex-1 md:ml-60 pb-20 md:pb-0 relative z-10">
        <div className="max-w-6xl mx-auto p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
