export const metadata = {
  title: "Admin Panel - SwapGate",
  description: "Administrative dashboard for managing USDT exchange settings",
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}