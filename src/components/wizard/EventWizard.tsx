'use client'

import React from 'react'
import { EventBrief } from '@/lib/domain/types'
import { WizardStepHeader } from './WizardStepHeader'
import { WizardStep1General } from './WizardStep1General'
import { WizardStep2Budget } from './WizardStep2Budget'
import { WizardStep3Details } from './WizardStep3Details'
import { WizardStep4Review } from './WizardStep4Review'
import { WizardFooterNav } from './WizardFooterNav'
import { useWizardState } from './useWizardState'

interface EventWizardProps {
  onPlanCreated: (brief: EventBrief) => void
  onCancel?: () => void
}

export function EventWizard({ onPlanCreated, onCancel }: EventWizardProps) {
  const wizard = useWizardState(onPlanCreated)

  return (
    <article className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <WizardStepHeader step={wizard.step} onCancel={onCancel} />

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
        {wizard.step === 1 && (
          <WizardStep1General
            eventType={wizard.eventType}
            setEventType={wizard.setEventType}
            eventName={wizard.eventName}
            setEventName={wizard.setEventName}
            error={wizard.errors.eventName}
          />
        )}
        {wizard.step === 2 && (
          <WizardStep2Budget
            eventDate={wizard.eventDate}
            setEventDate={wizard.setEventDate}
            hasNoDateYet={wizard.hasNoDateYet}
            setHasNoDateYet={wizard.setHasNoDateYet}
            guestCount={wizard.guestCount}
            setGuestCount={wizard.setGuestCount}
            budgetAmountMajor={wizard.budgetAmountMajor}
            setBudgetAmountMajor={wizard.setBudgetAmountMajor}
            currencyCode={wizard.currencyCode}
            setCurrencyCode={wizard.setCurrencyCode}
            planningUrgency={wizard.planningUrgency}
            setPlanningUrgency={wizard.setPlanningUrgency}
            errors={wizard.errors}
          />
        )}
        {wizard.step === 3 && (
          <WizardStep3Details
            location={wizard.location}
            setLocation={wizard.setLocation}
            atmosphere={wizard.atmosphere}
            setAtmosphere={wizard.setAtmosphere}
            venuePreference={wizard.venuePreference}
            setVenuePreference={wizard.setVenuePreference}
            diyPreference={wizard.diyPreference}
            setDiyPreference={wizard.setDiyPreference}
            audienceAgeGroup={wizard.audienceAgeGroup}
            setAudienceAgeGroup={wizard.setAudienceAgeGroup}
            accessibilityInput={wizard.accessibilityInput}
            setAccessibilityInput={wizard.setAccessibilityInput}
            accessibilityRequirements={wizard.accessibilityRequirements}
            setAccessibilityRequirements={wizard.setAccessibilityRequirements}
            dietaryInput={wizard.dietaryInput}
            setDietaryInput={wizard.setDietaryInput}
            dietaryRequirements={wizard.dietaryRequirements}
            setDietaryRequirements={wizard.setDietaryRequirements}
            goalsInput={wizard.goalsInput}
            setGoalsInput={wizard.setGoalsInput}
            primaryGoals={wizard.primaryGoals}
            setPrimaryGoals={wizard.setPrimaryGoals}
            constraintsInput={wizard.constraintsInput}
            setConstraintsInput={wizard.setConstraintsInput}
            importantConstraints={wizard.importantConstraints}
            setImportantConstraints={wizard.setImportantConstraints}
            addTag={wizard.addTag}
            removeTag={wizard.removeTag}
          />
        )}
        {wizard.step === 4 && (
          <WizardStep4Review
            eventName={wizard.eventName}
            eventType={wizard.eventType}
            eventDate={wizard.eventDate}
            hasNoDateYet={wizard.hasNoDateYet}
            guestCount={wizard.guestCount}
            currencyCode={wizard.currencyCode}
            budgetAmountMajor={wizard.budgetAmountMajor}
            planningUrgency={wizard.planningUrgency}
            atmosphere={wizard.atmosphere}
            accessibilityRequirements={wizard.accessibilityRequirements}
            dietaryRequirements={wizard.dietaryRequirements}
          />
        )}

        <WizardFooterNav
          step={wizard.step}
          onBack={() => wizard.setStep((s) => Math.max(s - 1, 1))}
          onNext={() => {
            if (wizard.validateStep(wizard.step)) wizard.setStep((s) => Math.min(s + 1, 4))
          }}
          onFinish={wizard.handleFinish}
        />
      </div>
    </article>
  )
}
