import { EventType } from '@/lib/domain/types'
import { VendorTemplate } from './vendors-common'
import { WEDDING_VENDORS } from './vendors-wedding'
import { BIRTHDAY_VENDORS } from './vendors-birthday'
import { COMMUNITY_VENDORS } from './vendors-community'

export type { VendorTemplate }
export { WEDDING_VENDORS, BIRTHDAY_VENDORS, COMMUNITY_VENDORS }

export const VENDOR_TEMPLATES: Record<EventType, VendorTemplate[]> = {
  wedding: WEDDING_VENDORS,
  birthday: BIRTHDAY_VENDORS,
  community: COMMUNITY_VENDORS,
}
