import { create } from 'zustand'

interface NetworkState {
  isConnected: boolean
  isInternetReachable: boolean | null
  setNetworkState: (isConnected: boolean, isInternetReachable: boolean | null) => void
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isConnected: true, // Assume connected initially
  isInternetReachable: null,

  setNetworkState: (isConnected, isInternetReachable) => set({ isConnected, isInternetReachable }),
}))
