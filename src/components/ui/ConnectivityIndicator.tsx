'use client'

import { useEffect, useState } from 'react'
import { connectivityManager } from '@/lib/storage/connectivity'
import { ConnectivityState } from '@/lib/domain/types'
import { Wifi, WifiOff, RefreshCw, AlertTriangle, Database } from 'lucide-react'

const LABELS: Record<ConnectivityState, string> = {
  online: 'Online',
  offline: 'Offline — local storage active',
  reconnecting: 'Reconnecting…',
  'ai-unavailable': 'AI temporarily unavailable',
  'storage-degraded': 'Unable to save — local storage issue',
}

const STATUS_ICONS: Record<ConnectivityState, typeof Wifi> = {
  online: Wifi,
  offline: WifiOff,
  reconnecting: RefreshCw,
  'ai-unavailable': AlertTriangle,
  'storage-degraded': Database,
}

const STATUS_COLORS: Record<ConnectivityState, string> = {
  online: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  offline: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  reconnecting: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'ai-unavailable': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'storage-degraded': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
}

export function ConnectivityIndicator() {
  const [state, setState] = useState<ConnectivityState>(() => connectivityManager.getState())

  useEffect(() => {
    const unsub = connectivityManager.subscribe((newState) => {
      setState(newState)
    })
    return unsub
  }, [])

  const visible = state !== 'online'
  if (!visible) return null

  const Icon = STATUS_ICONS[state]

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-semibold backdrop-blur-md border shadow-xl transition-all duration-300 ${STATUS_COLORS[state]}`}
    >
      <Icon className={`w-3.5 h-3.5 ${state === 'reconnecting' ? 'animate-spin' : ''}`} />
      <span>{LABELS[state]}</span>
    </div>
  )
}
