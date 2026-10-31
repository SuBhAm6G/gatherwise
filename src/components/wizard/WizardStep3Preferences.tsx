'use client'

import React from 'react'
import { VenuePreference, DiyPreference, AudienceAgeGroup } from '@/lib/domain/types'

interface WizardStep3PreferencesProps {
  venuePreference: VenuePreference
  setVenuePreference: (v: VenuePreference) => void
  diyPreference: DiyPreference
  setDiyPreference: (d: DiyPreference) => void
  audienceAgeGroup: AudienceAgeGroup
  setAudienceAgeGroup: (a: AudienceAgeGroup) => void
}

export function WizardStep3Preferences({
  venuePreference,
  setVenuePreference,
  diyPreference,
  setDiyPreference,
  audienceAgeGroup,
  setAudienceAgeGroup,
}: WizardStep3PreferencesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label htmlFor="venuePref" className="block text-sm font-semibold text-slate-200 mb-1">
          Venue Preference
        </label>
        <select
          id="venuePref"
          value={venuePreference}
          onChange={(e) => setVenuePreference(e.target.value as VenuePreference)}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option value="undecided">Undecided / Flexible</option>
          <option value="indoor">Indoor space</option>
          <option value="outdoor">Outdoor / Garden</option>
        </select>
      </div>

      <div>
        <label htmlFor="diyPref" className="block text-sm font-semibold text-slate-200 mb-1">
          DIY vs Vendor Preference
        </label>
        <select
          id="diyPref"
          value={diyPreference}
          onChange={(e) => setDiyPreference(e.target.value as DiyPreference)}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option value="balanced">Balanced approach</option>
          <option value="mostly-diy">Mostly DIY (cost conscious)</option>
          <option value="mostly-vendors">Mostly booked vendors</option>
        </select>
      </div>

      <div>
        <label htmlFor="ageGroup" className="block text-sm font-semibold text-slate-200 mb-1">
          Audience Age Group
        </label>
        <select
          id="ageGroup"
          value={audienceAgeGroup}
          onChange={(e) => setAudienceAgeGroup(e.target.value as AudienceAgeGroup)}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option value="mixed">Mixed ages (family friendly)</option>
          <option value="adults">Adults only</option>
          <option value="children">Children & Teens focus</option>
          <option value="seniors">Seniors focus</option>
        </select>
      </div>
    </div>
  )
}
