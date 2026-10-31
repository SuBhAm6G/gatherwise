'use client'

import { VendorCategory } from '@/lib/domain/types'
import { HelpCircle, FileText } from 'lucide-react'

interface VendorChecklistDrawerProps {
  vendor: VendorCategory
  onUpdateVendorNotes: (vendorId: string, notes: string) => void
}

export function VendorChecklistDrawer({ vendor, onUpdateVendorNotes }: VendorChecklistDrawerProps) {
  return (
    <div className="px-5 pb-6 pt-2 border-t border-white/5 bg-white/[0.01] grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
      {/* Left Column: Questions to Ask */}
      <section aria-label="Questions to ask candidates" className="space-y-2">
        <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
          Critical Questions to Ask Candidates:
        </h4>
        <ul className="space-y-1.5 pl-1">
          {vendor.questionsToAsk.map((q, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-300">
              <span className="text-indigo-400 mt-0.5" aria-hidden="true">
                •
              </span>
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Right Column: Contract Items to Confirm & Notes */}
      <div className="space-y-4">
        <section aria-label="Contract protection checklist" className="space-y-2">
          <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
            <FileText className="w-3.5 h-3.5 text-pink-400" aria-hidden="true" />
            Contract Protection Checklist:
          </h4>
          <ul className="space-y-1.5 pl-1">
            {vendor.contractItemsToConfirm.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300">
                <span className="text-pink-400 mt-0.5" aria-hidden="true">
                  ✓
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Notes Field */}
        <div>
          <label
            htmlFor={`vendor-notes-${vendor.id}`}
            className="font-semibold text-slate-400 block mb-1"
          >
            Personal Vendor Notes & Contacts:
          </label>
          <textarea
            id={`vendor-notes-${vendor.id}`}
            rows={2}
            value={vendor.notes}
            onChange={(e) => onUpdateVendorNotes(vendor.id, e.target.value)}
            placeholder="e.g. Contact: Mark (07123456789), deposit £200 due on Friday"
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  )
}
