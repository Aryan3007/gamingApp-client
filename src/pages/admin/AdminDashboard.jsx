export default function AdminDashboard() {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-[rgb(var(--color-border))] bg-white p-6 shadow-sm">
          <div className="flex flex-col space-y-1.5 pb-2">
            <h3 className="text-lg font-semibold leading-none tracking-tight text-[rgb(var(--color-text-primary))]">
              Total Users
            </h3>
            <p className="text-sm text-[rgb(var(--color-text-muted))]">Users under your management</p>
          </div>
          <div className="pt-0">
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">+28 from last month</p>
          </div>
        </div>
  
        <div className="rounded-lg border border-[rgb(var(--color-border))] bg-white p-6 shadow-sm">
          <div className="flex flex-col space-y-1.5 pb-2">
            <h3 className="text-lg font-semibold leading-none tracking-tight text-[rgb(var(--color-text-primary))]">
              Active Tickets
            </h3>
            <p className="text-sm text-[rgb(var(--color-text-muted))]">Support tickets requiring attention</p>
          </div>
          <div className="pt-0">
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">-3 from last week</p>
          </div>
        </div>
  
        <div className="rounded-lg border border-[rgb(var(--color-border))] bg-white p-6 shadow-sm">
          <div className="flex flex-col space-y-1.5 pb-2">
            <h3 className="text-lg font-semibold leading-none tracking-tight text-[rgb(var(--color-text-primary))]">
              Notifications
            </h3>
            <p className="text-sm text-[rgb(var(--color-text-muted))]">Pending system notifications</p>
          </div>
          <div className="pt-0">
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">2 require immediate action</p>
          </div>
        </div>
      </div>
    )
  }
  
  