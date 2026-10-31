import { EventType } from './types'

export interface BudgetCategoryDefault {
  name: string
  percent: number
  isFixed: boolean
  isPerGuest: boolean
  isContingency?: boolean
}

export const BUDGET_DEFAULTS: Record<EventType, BudgetCategoryDefault[]> = {
  wedding: [
    { name: 'Venue', percent: 30, isFixed: true, isPerGuest: false },
    { name: 'Catering & Bar', percent: 35, isFixed: false, isPerGuest: true },
    { name: 'Photography & Video', percent: 12, isFixed: true, isPerGuest: false },
    { name: 'Flowers & Décor', percent: 8, isFixed: true, isPerGuest: false },
    { name: 'Music & Entertainment', percent: 7, isFixed: true, isPerGuest: false },
    { name: 'Attire & Beauty', percent: 5, isFixed: true, isPerGuest: false },
    { name: 'Contingency Reserve', percent: 3, isFixed: true, isPerGuest: false, isContingency: true },
  ],
  birthday: [
    { name: 'Venue', percent: 25, isFixed: true, isPerGuest: false },
    { name: 'Food & Drinks', percent: 35, isFixed: false, isPerGuest: true },
    { name: 'Entertainment & Activities', percent: 15, isFixed: true, isPerGuest: false },
    { name: 'Cake & Desserts', percent: 10, isFixed: false, isPerGuest: true },
    { name: 'Decorations', percent: 10, isFixed: true, isPerGuest: false },
    { name: 'Contingency Reserve', percent: 5, isFixed: true, isPerGuest: false, isContingency: true },
  ],
  community: [
    { name: 'Venue & Permits', percent: 25, isFixed: true, isPerGuest: false },
    { name: 'Food & Refreshments', percent: 30, isFixed: false, isPerGuest: true },
    { name: 'Equipment & AV', percent: 20, isFixed: true, isPerGuest: false },
    { name: 'Marketing & Communications', percent: 10, isFixed: true, isPerGuest: false },
    { name: 'Accessibility Services', percent: 5, isFixed: true, isPerGuest: false },
    { name: 'Safety & First Aid', percent: 5, isFixed: true, isPerGuest: false },
    { name: 'Contingency Reserve', percent: 5, isFixed: true, isPerGuest: false, isContingency: true },
  ],
}

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', minorUnits: 2 },
  { code: 'GBP', symbol: '£', name: 'British Pound', minorUnits: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', minorUnits: 2 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', minorUnits: 2 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', minorUnits: 2 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', minorUnits: 2 },
]

export const EVENT_TYPE_OPTIONS: { id: EventType; label: string; icon: string; description: string }[] = [
  {
    id: 'wedding',
    label: 'Wedding',
    icon: 'Heart',
    description: 'Ceremony, reception, banquet, rehearsal, and multi-vendor coordination.',
  },
  {
    id: 'birthday',
    label: 'Birthday Party',
    icon: 'Cake',
    description: 'Milestone celebrations, kids parties, family gatherings, and theme events.',
  },
  {
    id: 'community',
    label: 'Community Gathering',
    icon: 'Users',
    description: 'Block parties, cultural festivals, charity fundraisers, and neighborhood events.',
  },
]
