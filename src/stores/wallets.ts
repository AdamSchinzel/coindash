import create from "zustand";
import { persist } from "zustand/middleware";

interface WalletsState {
  wallets: string[];
  addWallet: (wallet: string) => void;
  deleteWallet: (wallet: string) => void;
}

const useWalletsStore = create<WalletsState>()(
  persist(
    (set) => ({
      wallets: [],
      addWallet: (wallet) =>
        set((state) => ({
          wallets: [...state.wallets, wallet],
        })),
      deleteWallet: (wallet) =>
        set((state) => ({
          wallets: state.wallets.filter((w) => w !== wallet),
        })),
    }),
    {
      name: "wallets",
    }
  )
);

export default useWalletsStore;
