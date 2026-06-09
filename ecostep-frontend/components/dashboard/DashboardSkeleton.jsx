export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="h-8 w-64 bg-zinc-900 rounded-lg mb-2" />
          <div className="h-4 w-96 bg-zinc-900/50 rounded-lg" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-zinc-900 rounded-xl" />
          <div className="h-10 w-32 bg-emerald-500/10 rounded-xl" />
        </div>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 w-24 bg-zinc-800 rounded-lg" />
              <div className="h-10 w-10 bg-zinc-800 rounded-full" />
            </div>
            <div className="h-6 w-32 bg-zinc-800/50 rounded-lg mb-2" />
            <div className="h-4 w-full bg-zinc-800/30 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Row 3: Breakdown + Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 h-[300px] bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6">
          <div className="h-6 w-48 bg-zinc-800 rounded-lg mb-8" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-full bg-zinc-800/50 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 h-[300px] bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-center items-center">
          <div className="h-32 w-32 bg-zinc-800 rounded-full mb-6" />
          <div className="h-6 w-40 bg-zinc-800 rounded-lg mb-2" />
          <div className="h-4 w-56 bg-zinc-800/50 rounded-lg" />
        </div>
      </div>

      {/* Row 4: Compare + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 h-[350px] bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6">
          <div className="h-6 w-40 bg-zinc-800 rounded-lg mb-8" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-zinc-800 rounded-lg" />
                  <div className="h-4 w-12 bg-zinc-800 rounded-lg" />
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3 h-[350px] bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6">
          <div className="h-6 w-48 bg-zinc-800 rounded-lg mb-8" />
          <div className="h-[200px] w-full bg-zinc-800/30 rounded-lg" />
        </div>
      </div>
      
      {/* Row 5: Recent Activity */}
      <div className="h-[400px] bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6">
         <div className="h-6 w-40 bg-zinc-800 rounded-lg mb-6" />
         <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 w-full bg-zinc-800/40 rounded-xl" />
            ))}
         </div>
      </div>
    </div>
  );
}
