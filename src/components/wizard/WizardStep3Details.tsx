'use client'

import { VenuePreference, DiyPreference, AudienceAgeGroup } from '@/lib/domain/types'
import { WizardTagInput } from './WizardTagInput'
import { WizardStep3Preferences } from './WizardStep3Preferences'

interface WizardStep3DetailsProps {
  location: string
  setLocation: (s: string) => void
  atmosphere: string
  setAtmosphere: (s: string) => void
  venuePreference: VenuePreference
  setVenuePreference: (v: VenuePreference) => void
  diyPreference: DiyPreference
  setDiyPreference: (d: DiyPreference) => void
  audienceAgeGroup: AudienceAgeGroup
  setAudienceAgeGroup: (a: AudienceAgeGroup) => void
  accessibilityInput: string
  setAccessibilityInput: (s: string) => void
  accessibilityRequirements: string[]
  setAccessibilityRequirements: React.Dispatch<React.SetStateAction<string[]>>
  dietaryInput: string
  setDietaryInput: (s: string) => void
  dietaryRequirements: string[]
  setDietaryRequirements: React.Dispatch<React.SetStateAction<string[]>>
  goalsInput: string
  setGoalsInput: (s: string) => void
  primaryGoals: string[]
  setPrimaryGoals: React.Dispatch<React.SetStateAction<string[]>>
  constraintsInput: string
  setConstraintsInput: (s: string) => void
  importantConstraints: string[]
  setImportantConstraints: React.Dispatch<React.SetStateAction<string[]>>
  addTag: (
    val: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    clearSetter: () => void,
  ) => void
  removeTag: (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => void
}

export function WizardStep3Details({
  location,
  setLocation,
  atmosphere,
  setAtmosphere,
  venuePreference,
  setVenuePreference,
  diyPreference,
  setDiyPreference,
  audienceAgeGroup,
  setAudienceAgeGroup,
  accessibilityInput,
  setAccessibilityInput,
  accessibilityRequirements,
  setAccessibilityRequirements,
  dietaryInput,
  setDietaryInput,
  dietaryRequirements,
  setDietaryRequirements,
  goalsInput,
  setGoalsInput,
  primaryGoals,
  setPrimaryGoals,
  constraintsInput,
  setConstraintsInput,
  importantConstraints,
  setImportantConstraints,
  addTag,
  removeTag,
}: WizardStep3DetailsProps) {
  return (
    <section aria-labelledby="step3-heading" className="space-y-6">
      <h2 id="step3-heading" className="text-lg font-bold text-white mb-2">
        Step 3: Location, Atmosphere & Preferences
      </h2>

      {/* Location & Atmosphere */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-slate-200 mb-1">
            City or Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. London, UK or Austin, TX"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div>
          <label htmlFor="atmosphere" className="block text-sm font-semibold text-slate-200 mb-1">
            Desired Atmosphere & Theme
          </label>
          <input
            id="atmosphere"
            type="text"
            value={atmosphere}
            onChange={(e) => setAtmosphere(e.target.value)}
            placeholder="e.g. Rustic botanical garden, lively 80s retro"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
      </div>

      {/* Venue, DIY, and Age group */}
      <WizardStep3Preferences
        venuePreference={venuePreference}
        setVenuePreference={setVenuePreference}
        diyPreference={diyPreference}
        setDiyPreference={setDiyPreference}
        audienceAgeGroup={audienceAgeGroup}
        setAudienceAgeGroup={setAudienceAgeGroup}
      />

      {/* Tag Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
        <WizardTagInput
          id="accessibility"
          label="Accessibility Requirements"
          placeholder="e.g. Wheelchair ramp, step-free access"
          value={accessibilityInput}
          onChange={setAccessibilityInput}
          tags={accessibilityRequirements}
          onAdd={() =>
            addTag(accessibilityInput, setAccessibilityRequirements, () =>
              setAccessibilityInput(''),
            )
          }
          onRemove={(idx) => removeTag(idx, setAccessibilityRequirements)}
          colorScheme="indigo"
        />

        <WizardTagInput
          id="dietary"
          label="Dietary Requirements"
          placeholder="e.g. Vegan options, gluten-free, nut allergy"
          value={dietaryInput}
          onChange={setDietaryInput}
          tags={dietaryRequirements}
          onAdd={() => addTag(dietaryInput, setDietaryRequirements, () => setDietaryInput(''))}
          onRemove={(idx) => removeTag(idx, setDietaryRequirements)}
          colorScheme="amber"
        />

        <WizardTagInput
          id="goals"
          label="Primary Event Goals"
          placeholder="e.g. Unforgettable 40th birthday celebration"
          value={goalsInput}
          onChange={setGoalsInput}
          tags={primaryGoals}
          onAdd={() => addTag(goalsInput, setPrimaryGoals, () => setGoalsInput(''))}
          onRemove={(idx) => removeTag(idx, setPrimaryGoals)}
          colorScheme="purple"
        />

        <WizardTagInput
          id="constraints"
          label="Important Constraints & Ground Rules"
          placeholder="e.g. Music must stop by 11 PM, strictly no balloons"
          value={constraintsInput}
          onChange={setConstraintsInput}
          tags={importantConstraints}
          onAdd={() =>
            addTag(constraintsInput, setImportantConstraints, () => setConstraintsInput(''))
          }
          onRemove={(idx) => removeTag(idx, setImportantConstraints)}
          colorScheme="rose"
        />
      </div>
    </section>
  )
}
