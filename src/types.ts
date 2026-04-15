export const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export interface Teknisi {
  id: string;
  nama: string;
}

export interface KasMasukEntry {
  teknisiId: string;
  bulan: number; // 0-indexed
  jumlah: number;
  tidakAdaGC?: boolean;
}

export interface DetailKasEntry {
  kategori: string;
  bulan: number;
  jumlah: number;
}

export interface PengeluaranEntry {
  kategori: string;
  bulan: number;
  jumlah: number;
}

export type ActiveTab = "dashboard" | "kas-masuk" | "detail-kas" | "pengeluaran";
