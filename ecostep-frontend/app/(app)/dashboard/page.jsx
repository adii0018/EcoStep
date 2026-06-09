import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard | EcoStep",
  description: "Track your weekly carbon footprint and get AI-powered tips",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
