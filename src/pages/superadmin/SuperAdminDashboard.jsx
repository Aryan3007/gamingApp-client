export default function SuperAdminDashboard() {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-[rgb(var(--color-border))] bg-white p-6 shadow-sm">
          <div className="flex flex-col space-y-1.5 pb-2">
            <h3 className="text-lg font-semibold leading-none tracking-tight text-[rgb(var(--color-text-primary))]">
              Total Admins
            </h3>
            <p className="text-sm text-[rgb(var(--color-text-muted))]">Number of admin accounts</p>
          </div>
          <div className="pt-0">
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">+2 from last month</p>
          </div>
        </div>
  
        <div className="rounded-lg border border-[rgb(var(--color-border))] bg-white p-6 shadow-sm">
          <div className="flex flex-col space-y-1.5 pb-2">
            <h3 className="text-lg font-semibold leading-none tracking-tight text-[rgb(var(--color-text-primary))]">
              Total Users
            </h3>
            <p className="text-sm text-[rgb(var(--color-text-muted))]">Number of user accounts</p>
          </div>
          <div className="pt-0">
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">+120 from last month</p>
          </div>
        </div>
  
        <div className="rounded-lg border border-[rgb(var(--color-border))] bg-white p-6 shadow-sm">
          <div className="flex flex-col space-y-1.5 pb-2">
            <h3 className="text-lg font-semibold leading-none tracking-tight text-[rgb(var(--color-text-primary))]">
              System Status
            </h3>
            <p className="text-sm text-[rgb(var(--color-text-muted))]">Overall system health</p>
          </div>
          <div className="pt-0">
            <div className="text-2xl font-bold text-green-500">Healthy</div>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">All systems operational</p>
          </div>
        </div>
      </div>
    )
  }
  
  