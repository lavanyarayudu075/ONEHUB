import DashboardSidebar from "../components/DashboardSidebar";
import DashboardTopbar from "../components/DashboardTopbar";
import DashboardStats from "../components/DashboardStats";
import AiInsightsChat from "../components/AiInsightsChat";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-white">

      <DashboardSidebar />

      <DashboardTopbar />

      <main className="px-6 py-8 lg:ml-64">

        {/* Welcome */}
        <div className="mb-8">

          <p className="text-sm text-cyan-600 dark:text-cyan-400">
            {today}
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Good morning, {user?.name?.split(" ")[0] || "Admin"} 👋
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Here's what's happening across your organisation today.
          </p>

        </div>

        {/* Statistics */}
        <DashboardStats />

        {/* Lower Section */}
        <div className="mt-6 grid gap-6 xl:grid-cols-3">

          {/* Activity */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03] xl:col-span-2">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold">
                  Recent Activity
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Latest updates from your organisation
                </p>
              </div>

              <button className="text-sm text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300">
                View all
              </button>

            </div>

            <div className="mt-6 space-y-4">

              {[
                "New member joined the organisation",
                "Finance department completed a task",
                "Monthly analytics report generated",
                "New department was created",
              ].map((activity, index) => (

                <div
                  key={index}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/[0.02]"
                >

                  <div className="h-2 w-2 rounded-full bg-cyan-400" />

                  <div className="flex-1">

                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {activity}
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-600">
                      {index + 1} hour{index !== 0 ? "s" : ""} ago
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* AI Insights Chatbot */}
          <AiInsightsChat />

        </div>

      </main>

    </div>
  );
}

export default Dashboard;