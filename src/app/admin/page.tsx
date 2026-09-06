export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card p-6 bg-white">
          <h3 className="text-muted font-bold uppercase tracking-wider text-sm mb-2">Total Projects</h3>
          <p className="text-4xl font-bold">12</p>
        </div>
        <div className="card p-6 bg-white">
          <h3 className="text-muted font-bold uppercase tracking-wider text-sm mb-2">Messages</h3>
          <p className="text-4xl font-bold">5</p>
        </div>
        <div className="card p-6 bg-white">
          <h3 className="text-muted font-bold uppercase tracking-wider text-sm mb-2">Profile Views</h3>
          <p className="text-4xl font-bold">1,248</p>
        </div>
      </div>

      <div className="card p-8 bg-white">
        <h2 className="text-xl font-bold mb-4">Welcome to your Portfolio System</h2>
        <p className="text-muted">
          Use the sidebar to navigate to different management areas. 
          Currently, you can manage your Projects. Profile and Messages management can be added in the future.
        </p>
      </div>
    </div>
  );
}
