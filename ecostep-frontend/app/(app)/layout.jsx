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
    <div className="flex min-h-screen bg-[#f9fafb]">
      <Sidebar />
      {/* Main content — offset by sidebar width on desktop */}
      <main className="flex-1 md:ml-60 pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
