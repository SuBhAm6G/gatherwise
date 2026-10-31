import { ConnectivityState } from '@/lib/domain/types'

type ConnectivityListener = (state: ConnectivityState) => void

class ConnectivityManager {
  private state: ConnectivityState = 'online'
  private listeners = new Set<ConnectivityListener>()

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline())
      window.addEventListener('offline', () => this.setState('offline'))
      this.handleOnline()
    }
  }

  private handleOnline(): void {
    this.setState(navigator.onLine ? 'online' : 'offline')
  }

  setState(state: ConnectivityState): void {
    if (this.state === state) return
    this.state = state
    this.listeners.forEach((l) => l(state))
  }

  getState(): ConnectivityState {
    return this.state
  }

  subscribe(listener: ConnectivityListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
}

export const connectivityManager = new ConnectivityManager()
