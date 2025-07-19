import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#1A1A1A] text-white">
      <aside className="w-64 bg-[#2A2A2A] p-6">
        <Navbar />
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
