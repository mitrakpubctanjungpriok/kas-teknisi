import { useState } from "react";
import { ActiveTab } from "./types";
import { useAppStore } from "./store";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import KasMasuk from "./components/KasMasuk";
import DetailKas from "./components/DetailKas";
import Pengeluaran from "./components/Pengeluaran";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const store = useAppStore();

  const tabLabels: Record<ActiveTab, string> = {
    dashboard: "Dashboard",
    "kas-masuk": "Kas Masuk",
    "detail-kas": "Detail Kas",
    pengeluaran: "Pengeluaran & Saldo",
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-30 lg:hidden transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false);
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Hamburger - Mobile */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">{tabLabels[activeTab]}</h1>
              <p className="text-xs text-gray-400 hidden sm:block">Sistem Manajemen Kas Teknisi 2025</p>
            </div>
          </div>

          {/* Right side info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-emerald-700">
                Total: {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(store.getTotalSaldoKeseluruhan())}
              </span>
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "dashboard" && (
            <Dashboard
              teknisiList={store.teknisiList}
              getTotalBulanan={store.getTotalBulanan}
              getTotalSaldoKategori={store.getTotalSaldoKategori}
              getSisaSaldo={store.getSisaSaldo}
              getTotalSaldoKeseluruhan={store.getTotalSaldoKeseluruhan}
              DETAIL_KATEGORI={store.DETAIL_KATEGORI}
              getDetailKas={store.getDetailKas}
            />
          )}
          {activeTab === "kas-masuk" && (
            <KasMasuk
              teknisiList={store.teknisiList}
              getKasMasuk={store.getKasMasuk}
              getTotalBulanan={store.getTotalBulanan}
              updateKasMasuk={store.updateKasMasuk}
              addTeknisi={store.addTeknisi}
              removeTeknisi={store.removeTeknisi}
            />
          )}
          {activeTab === "detail-kas" && (
            <DetailKas
              DETAIL_KATEGORI={store.DETAIL_KATEGORI}
              getDetailKas={store.getDetailKas}
              getTotalSaldoKategori={store.getTotalSaldoKategori}
            />
          )}
          {activeTab === "pengeluaran" && (
            <Pengeluaran
              DETAIL_KATEGORI={store.DETAIL_KATEGORI}
              getPengeluaran={store.getPengeluaran}
              getTotalSaldoKategori={store.getTotalSaldoKategori}
              getSisaSaldo={store.getSisaSaldo}
              getTotalSaldoKeseluruhan={store.getTotalSaldoKeseluruhan}
              updatePengeluaran={store.updatePengeluaran}
              getTotalPengeluaranKategori={store.getTotalPengeluaranKategori}
            />
          )}
        </main>
      </div>
    </div>
  );
}
