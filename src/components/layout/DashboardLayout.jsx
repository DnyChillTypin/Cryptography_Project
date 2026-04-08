import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[280px] p-8 pb-16 max-w-[1200px]">
        {children}
      </main>
    </div>
  );
}
