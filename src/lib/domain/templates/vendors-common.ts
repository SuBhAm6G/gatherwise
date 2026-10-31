import { VendorCategory } from '@/lib/domain/types'

export type VendorTemplate = Omit<
  VendorCategory,
  | 'id'
  | 'allocatedBudget'
  | 'userQuote'
  | 'notes'
  | 'relatedDeadlineTaskId'
  | 'relatedBudgetCategoryId'
>
