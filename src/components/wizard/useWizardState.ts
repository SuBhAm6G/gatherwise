'use client'

import { useState } from 'react'
import {
  EventBrief,
  EventType,
  PlanningUrgency,
  VenuePreference,
  DiyPreference,
  AudienceAgeGroup,
} from '@/lib/domain/types'
import { SUPPORTED_CURRENCIES } from '@/lib/domain/constants'

export function useWizardState(onPlanCreated: (brief: EventBrief) => void) {
  const [step, setStep] = useState<number>(1)

  // Form State
  const [eventType, setEventType] = useState<EventType>('birthday')
  const [eventName, setEventName] = useState<string>('')
  const [eventDate, setEventDate] = useState<string>('')
  const [hasNoDateYet, setHasNoDateYet] = useState<boolean>(false)
  const [budgetAmountMajor, setBudgetAmountMajor] = useState<string>('2500')
  const [currencyCode, setCurrencyCode] = useState<string>('USD')
  const [guestCount, setGuestCount] = useState<string>('30')
  const [location, setLocation] = useState<string>('')
  const [atmosphere, setAtmosphere] = useState<string>('')
  const [venuePreference, setVenuePreference] = useState<VenuePreference>('undecided')
  const [diyPreference, setDiyPreference] = useState<DiyPreference>('mixed')
  const [audienceAgeGroup, setAudienceAgeGroup] = useState<AudienceAgeGroup>('mixed')
  const [planningUrgency, setPlanningUrgency] = useState<PlanningUrgency>('normal')

  // Lists
  const [goalsInput, setGoalsInput] = useState<string>('')
  const [primaryGoals, setPrimaryGoals] = useState<string[]>([])
  const [constraintsInput, setConstraintsInput] = useState<string>('')
  const [importantConstraints, setImportantConstraints] = useState<string[]>([])
  const [dietaryInput, setDietaryInput] = useState<string>('')
  const [dietaryRequirements, setDietaryRequirements] = useState<string[]>([])
  const [accessibilityInput, setAccessibilityInput] = useState<string>('')
  const [accessibilityRequirements, setAccessibilityRequirements] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const addTag = (
    val: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    clearSetter: () => void,
  ) => {
    const trimmed = val.trim()
    if (trimmed) {
      setter((prev) => [...prev, trimmed])
      clearSetter()
    }
  }

  const removeTag = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => prev.filter((_, i) => i !== index))
  }

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {}
    if (currentStep === 1 && !eventName.trim()) {
      newErrors.eventName = 'Event name is required'
    }
    if (currentStep === 2) {
      const budgetNum = parseFloat(budgetAmountMajor)
      if (isNaN(budgetNum) || budgetNum < 0) {
        newErrors.budgetAmount = 'Please enter a valid budget amount (0 or more)'
      }
      const guests = parseInt(guestCount, 10)
      if (isNaN(guests) || guests < 1) {
        newErrors.guestCount = 'Guest count must be at least 1'
      }
      if (!hasNoDateYet && !eventDate) {
        newErrors.eventDate = 'Please select a date or check "Decide date later"'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFinish = () => {
    if (!validateStep(1) || !validateStep(2)) {
      setStep(1)
      return
    }

    const currMeta =
      SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) ?? SUPPORTED_CURRENCIES[0]
    const precision = currMeta?.minorUnits ?? 2
    const parsedBudget = Math.round(parseFloat(budgetAmountMajor) * Math.pow(10, precision))

    const brief: EventBrief = {
      eventType,
      eventName: eventName.trim(),
      eventDate: hasNoDateYet || !eventDate ? null : eventDate,
      budgetAmount: parsedBudget,
      currencyCode,
      currencyMinorUnits: precision,
      guestCount: parseInt(guestCount, 10) || 20,
      location: location.trim(),
      atmosphere: atmosphere.trim(),
      primaryGoals,
      importantConstraints,
      planningUrgency,
      startTime: null,
      endTime: null,
      venuePreference,
      dietaryRequirements,
      accessibilityRequirements,
      diyPreference,
      audienceAgeGroup,
      culturalPreferences: [],
      mustHaveItems: [],
      mustAvoidItems: [],
      existingBookings: [],
    }

    onPlanCreated(brief)
  }

  return {
    step,
    setStep,
    eventType,
    setEventType,
    eventName,
    setEventName,
    eventDate,
    setEventDate,
    hasNoDateYet,
    setHasNoDateYet,
    budgetAmountMajor,
    setBudgetAmountMajor,
    currencyCode,
    setCurrencyCode,
    guestCount,
    setGuestCount,
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
    planningUrgency,
    setPlanningUrgency,
    goalsInput,
    setGoalsInput,
    primaryGoals,
    setPrimaryGoals,
    constraintsInput,
    setConstraintsInput,
    importantConstraints,
    setImportantConstraints,
    dietaryInput,
    setDietaryInput,
    dietaryRequirements,
    setDietaryRequirements,
    accessibilityInput,
    setAccessibilityInput,
    accessibilityRequirements,
    setAccessibilityRequirements,
    errors,
    addTag,
    removeTag,
    validateStep,
    handleFinish,
  }
}
