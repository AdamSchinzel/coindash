import create from "zustand";
import { persist } from "zustand/middleware";

interface WalletsState {
  wallets: string[];
  addWallet: (wallet: string) => void;
  deleteWallet: (wallet: string) => void;
}

/**
 * State management store for connected wallets
 * @method addWallet - A function that enables a new wallet to be added to the wallet array on the state
 * @method deleteWallet - A function that enables a wallet to be deleted from the wallet array on the state
 * @returns {Object} - An object containing the current state, along with `addWallet` and `deleteWallet` function
 */
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
