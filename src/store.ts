import { useState } from "react";
import { Teknisi, KasMasukEntry, PengeluaranEntry } from "./types";

const DETAIL_KATEGORI = ["Konsumsi", "Dana Sosial", "Dana Darurat"];
const DISTRIBUSI = [0.4, 0.4, 0.2]; // 40%, 40%, 20%

export function useAppStore() {
  const [teknisiList, setTeknisiList] = useState<Teknisi[]>([
    { id: "1", nama: "Dillah" },
    { id: "2", nama: "Hardian" },
    { id: "3", nama: "Alfinas" },
    { id: "4", nama: "Wihadi" },
    { id: "5", nama: "Adit" },
  ]);

  const [kasMasukEntries, setKasMasukEntries] = useState<KasMasukEntry[]>([
    { teknisiId: "2", bulan: 0, jumlah: 41000 },
    { teknisiId: "2", bulan: 1, jumlah: 41000 },
    { teknisiId: "3", bulan: 0, jumlah: 41000 },
    { teknisiId: "3", bulan: 1, jumlah: 59000 },
    { teknisiId: "5", bulan: 0, jumlah: 41000 },
    { teknisiId: "5", bulan: 1, jumlah: 41000 },
    // Maret - tidak ada GC
    { teknisiId: "2", bulan: 2, jumlah: 0, tidakAdaGC: true },
    { teknisiId: "3", bulan: 2, jumlah: 0, tidakAdaGC: true },
    { teknisiId: "5", bulan: 2, jumlah: 0, tidakAdaGC: true },
  ]);

  const [pengeluaranEntries, setPengeluaranEntries] = useState<PengeluaranEntry[]>([
    // All zero initially as per Excel
  ]);

  // Computed: total bulanan per bulan
  const getTotalBulanan = (bulan: number) => {
    return kasMasukEntries
      .filter((e) => e.bulan === bulan && !e.tidakAdaGC)
      .reduce((sum, e) => sum + e.jumlah, 0);
  };

  // Get kas masuk for a teknisi+bulan
  const getKasMasuk = (teknisiId: string, bulan: number) => {
    return kasMasukEntries.find((e) => e.teknisiId === teknisiId && e.bulan === bulan);
  };

  // Computed detail kas per kategori per bulan (distributed from total)
  const getDetailKas = (kategoriIndex: number, bulan: number) => {
    const total = getTotalBulanan(bulan);
    return Math.round(total * DISTRIBUSI[kategoriIndex]);
  };

  // Total saldo per kategori (sum across all months)
  const getTotalSaldoKategori = (kategoriIndex: number) => {
    let total = 0;
    for (let b = 0; b < 12; b++) {
      total += getDetailKas(kategoriIndex, b);
    }
    return total;
  };

  // Get pengeluaran for a kategori+bulan
  const getPengeluaran = (kategori: string, bulan: number) => {
    const entry = pengeluaranEntries.find((e) => e.kategori === kategori && e.bulan === bulan);
    return entry ? entry.jumlah : 0;
  };

  // Total pengeluaran per kategori
  const getTotalPengeluaranKategori = (kategori: string) => {
    let total = 0;
    for (let b = 0; b < 12; b++) {
      total += getPengeluaran(kategori, b);
    }
    return total;
  };

  // Sisa saldo per kategori
  const getSisaSaldo = (kategoriIndex: number) => {
    const kategori = DETAIL_KATEGORI[kategoriIndex];
    return getTotalSaldoKategori(kategoriIndex) - getTotalPengeluaranKategori(kategori);
  };

  // Total saldo kas teknisi keseluruhan
  const getTotalSaldoKeseluruhan = () => {
    let total = 0;
    for (let i = 0; i < DETAIL_KATEGORI.length; i++) {
      total += getSisaSaldo(i);
    }
    return total;
  };

  // Update kas masuk
  const updateKasMasuk = (teknisiId: string, bulan: number, jumlah: number, tidakAdaGC?: boolean) => {
    setKasMasukEntries((prev) => {
      const existing = prev.findIndex((e) => e.teknisiId === teknisiId && e.bulan === bulan);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { teknisiId, bulan, jumlah, tidakAdaGC };
        return updated;
      }
      return [...prev, { teknisiId, bulan, jumlah, tidakAdaGC }];
    });
  };

  // Update pengeluaran
  const updatePengeluaran = (kategori: string, bulan: number, jumlah: number) => {
    setPengeluaranEntries((prev) => {
      const existing = prev.findIndex((e) => e.kategori === kategori && e.bulan === bulan);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { kategori, bulan, jumlah };
        return updated;
      }
      return [...prev, { kategori, bulan, jumlah }];
    });
  };

  // Add teknisi
  const addTeknisi = (nama: string) => {
    const id = Date.now().toString();
    setTeknisiList((prev) => [...prev, { id, nama }]);
  };

  // Remove teknisi
  const removeTeknisi = (id: string) => {
    setTeknisiList((prev) => prev.filter((t) => t.id !== id));
    setKasMasukEntries((prev) => prev.filter((e) => e.teknisiId !== id));
  };

  return {
    teknisiList,
    kasMasukEntries,
    pengeluaranEntries,
    DETAIL_KATEGORI,
    getKasMasuk,
    getTotalBulanan,
    getDetailKas,
    getTotalSaldoKategori,
    getPengeluaran,
    getTotalPengeluaranKategori,
    getSisaSaldo,
    getTotalSaldoKeseluruhan,
    updateKasMasuk,
    updatePengeluaran,
    addTeknisi,
    removeTeknisi,
  };
}
