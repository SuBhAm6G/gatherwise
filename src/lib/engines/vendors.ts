import { v4 as uuidv4 } from 'uuid'
import { VendorCategory, EventBrief, EventType } from '@/lib/domain/types'

type VendorTemplate = Omit<
  VendorCategory,
  'id' | 'allocatedBudget' | 'userQuote' | 'notes' | 'relatedDeadlineTaskId' | 'relatedBudgetCategoryId'
>

const WEDDING_VENDORS: VendorTemplate[] = [
  {
    name: 'Wedding Venue',
    description: 'The space for your ceremony and/or reception.',
    essentiality: 'essential',
    bookingPriority: 1,
    suggestedBookingDaysBeforeEvent: 300,
    status: 'not-started',
    questionsToAsk: [
      'What is the capacity for seated dinner and standing reception?',
      'Is the venue accessible for guests with mobility needs?',
      'What is included in the hire fee (tables, chairs, AV)?',
      'Are there noise restrictions or curfews?',
      'What are setup and teardown access times?',
      'What is the cancellation policy and refund timeline?',
      'Is exclusive use guaranteed on the day?',
    ],
    contractItemsToConfirm: [
      'Exact hire period including setup and breakdown',
      'Deposit amount and payment schedule',
      'Cancellation and postponement terms',
      'Noise and decor restrictions',
      'Liability and insurance requirements',
    ],
    nextAction: 'Research and shortlist 3–5 venues matching your guest count and style',
  },
  {
    name: 'Catering and Bar',
    description: 'Food, beverages, and service for your wedding reception.',
    essentiality: 'essential',
    bookingPriority: 2,
    suggestedBookingDaysBeforeEvent: 270,
    status: 'not-started',
    questionsToAsk: [
      'What menu options and service styles are available?',
      'How do you handle dietary requirements (vegan, halal, allergies)?',
      'What is the per-head cost and minimum guest count?',
      'Is a bar included or separately priced?',
      'Can we do a tasting before confirming?',
    ],
    contractItemsToConfirm: [
      'Final menu confirmed in writing',
      'Dietary requirement handling procedure',
      'Final headcount deadline',
      'Service ratio (staff per guest)',
    ],
    nextAction: 'Request quotes from 3 caterers and arrange tastings',
  },
  {
    name: 'Photographer',
    description: 'Professional photography coverage of your wedding day.',
    essentiality: 'essential',
    bookingPriority: 3,
    suggestedBookingDaysBeforeEvent: 270,
    status: 'not-started',
    questionsToAsk: [
      'How many hours are included in the package?',
      'Do you offer a second shooter?',
      'What is your editing style and typical turnaround time?',
      'What happens if you cannot attend due to illness?',
    ],
    contractItemsToConfirm: [
      'Coverage hours and start time',
      'Deliverable timeline and file format',
      'Backup plan if photographer cannot attend',
      'Image usage rights',
    ],
    nextAction: 'Review 3–5 photographer portfolios and schedule consultations',
  },
  {
    name: 'Florist and Décor',
    description: 'Floral arrangements, centrepieces, and decorative styling.',
    essentiality: 'optional',
    bookingPriority: 4,
    suggestedBookingDaysBeforeEvent: 180,
    status: 'not-started',
    questionsToAsk: [
      'What flowers are in season on our event date?',
      'Can you work within our budget with seasonal alternatives?',
      'Do you handle setup and teardown at the venue?',
    ],
    contractItemsToConfirm: [
      'Itemised quote with substitution policy',
      'Setup and collection times',
    ],
    nextAction: 'Share your theme and budget with 2–3 florists for quotes',
  },
  {
    name: 'Music and Entertainment',
    description: 'DJ, band, or other live entertainment.',
    essentiality: 'optional',
    bookingPriority: 5,
    suggestedBookingDaysBeforeEvent: 240,
    status: 'not-started',
    questionsToAsk: [
      'Do you have experience at weddings?',
      'What equipment do you bring (PA, lighting)?',
      'Do you have public liability insurance?',
      'What is your backup plan if a band member is ill?',
    ],
    contractItemsToConfirm: [
      'Performance hours and break schedule',
      'Equipment setup times',
      'Music style and requests policy',
    ],
    nextAction: 'Listen to recordings or attend a live performance before booking',
  },
]

const BIRTHDAY_VENDORS: VendorTemplate[] = [
  {
    name: 'Venue',
    description: 'Party location — hall, activity centre, park, or home.',
    essentiality: 'conditional',
    bookingPriority: 1,
    suggestedBookingDaysBeforeEvent: 45,
    status: 'not-started',
    questionsToAsk: [
      'What is the maximum capacity?',
      'Is there a kitchen or food prep area?',
      'What is the setup and cleanup time allowance?',
      'Can we bring our own catering?',
    ],
    contractItemsToConfirm: [
      'Hire period including setup and cleanup',
      'Facilities included',
      'Cancellation policy',
    ],
    nextAction: 'Compare home party vs hired venue based on guest count and activities',
  },
  {
    name: 'Entertainment and Activities',
    description: 'Party entertainer, activity provider, or game coordinator.',
    essentiality: 'optional',
    bookingPriority: 2,
    suggestedBookingDaysBeforeEvent: 30,
    status: 'not-started',
    questionsToAsk: [
      'What age group do you specialise in?',
      'How long is the performance or activity?',
      'Do you have public liability insurance?',
    ],
    contractItemsToConfirm: [
      'Duration and schedule',
      'Equipment and space requirements',
      'Insurance confirmation',
    ],
    nextAction: 'Search for entertainers matching the age group and theme',
  },
  {
    name: 'Bakery and Cake Maker',
    description: 'Custom celebration cake or dessert catering.',
    essentiality: 'optional',
    bookingPriority: 3,
    suggestedBookingDaysBeforeEvent: 14,
    status: 'not-started',
    questionsToAsk: [
      'Can you accommodate allergens (nut-free, gluten-free)?',
      'What designs and flavours are available?',
      'What is the collection or delivery arrangement?',
    ],
    contractItemsToConfirm: [
      'Design and flavour confirmed in writing',
      'Allergen handling confirmed',
      'Collection or delivery time',
    ],
    nextAction: 'Order the cake at least 2 weeks in advance for custom designs',
  },
  {
    name: 'Food and Catering',
    description: 'Catering company, restaurant delivery, or food prep.',
    essentiality: 'optional',
    bookingPriority: 4,
    suggestedBookingDaysBeforeEvent: 14,
    status: 'not-started',
    questionsToAsk: [
      'Can you cater for dietary requirements?',
      'What is the minimum order quantity?',
      'What is the delivery or setup window?',
    ],
    contractItemsToConfirm: [
      'Menu and dietary accommodations confirmed',
      'Delivery or setup time confirmed',
    ],
    nextAction: 'Decide between home cooking, delivery, or professional catering',
  },
]

const COMMUNITY_VENDORS: VendorTemplate[] = [
  {
    name: 'Venue and Public Space',
    description: 'Community hall, park, or outdoor area for the event.',
    essentiality: 'essential',
    bookingPriority: 1,
    suggestedBookingDaysBeforeEvent: 60,
    status: 'not-started',
    questionsToAsk: [
      'What permits are required for this space?',
      'Is the space accessible for people with disabilities?',
      'What are the noise and timing restrictions?',
      'Are there toilets, including accessible facilities?',
    ],
    contractItemsToConfirm: [
      'Hire agreement and permit documentation',
      'Setup and teardown hours',
      'Accessibility confirmation',
      'Responsibility for site restoration',
    ],
    nextAction: 'Contact local council to check availability and permit requirements',
  },
  {
    name: 'Equipment and AV Hire',
    description: 'Sound system, stage, tents, tables, chairs, and AV equipment.',
    essentiality: 'essential',
    bookingPriority: 2,
    suggestedBookingDaysBeforeEvent: 21,
    status: 'not-started',
    questionsToAsk: [
      'Do you handle delivery, setup, and collection?',
      'What power solutions are available for outdoor sites?',
      'What is the damage and insurance policy?',
    ],
    contractItemsToConfirm: [
      'Equipment list and quantities confirmed',
      'Delivery and collection schedule',
      'Technical support contact',
    ],
    nextAction: 'List all equipment needed and request quotes from 2–3 hire companies',
  },
  {
    name: 'Catering and Food Vendors',
    description: 'Caterers, food trucks, or community potluck coordination.',
    essentiality: 'optional',
    bookingPriority: 3,
    suggestedBookingDaysBeforeEvent: 30,
    status: 'not-started',
    questionsToAsk: [
      'Can you accommodate diverse dietary needs?',
      'Do you have food-safety certification?',
      'What is your setup space and power requirement?',
    ],
    contractItemsToConfirm: [
      'Food safety documentation',
      'Dietary options confirmed',
    ],
    nextAction: 'Decide on catering approach based on budget and community preferences',
  },
  {
    name: 'First Aid and Safety',
    description: 'First aid provider or medical support for the event.',
    essentiality: 'essential',
    bookingPriority: 4,
    suggestedBookingDaysBeforeEvent: 30,
    status: 'not-started',
    questionsToAsk: [
      'What qualifications do your first aiders hold?',
      'What is the coverage ratio for the expected crowd size?',
      'How do you coordinate with emergency services?',
    ],
    contractItemsToConfirm: [
      'Number of qualified first aiders confirmed',
      'Emergency contact and escalation procedure',
    ],
    nextAction: 'Determine if regulations require formal first aid cover for this event size',
  },
  {
    name: 'Entertainment and Performers',
    description: 'Bands, speakers, community performers, or activity providers.',
    essentiality: 'optional',
    bookingPriority: 5,
    suggestedBookingDaysBeforeEvent: 30,
    status: 'not-started',
    questionsToAsk: [
      'Do you have public liability insurance?',
      'What are your technical requirements?',
      'Can content be adjusted to suit a diverse community audience?',
    ],
    contractItemsToConfirm: [
      'Performance schedule confirmed',
      'Technical rider confirmed',
      'Insurance documentation received',
    ],
    nextAction: 'Reach out to local performers for expressions of interest',
  },
]

const VENDOR_TEMPLATES: Record<EventType, VendorTemplate[]> = {
  wedding: WEDDING_VENDORS,
  birthday: BIRTHDAY_VENDORS,
  community: COMMUNITY_VENDORS,
}

/**
 * Generates the event-specific vendor checklist.
 * NEVER fabricates vendor quotes, prices, availability, or real vendor details.
 */
export function generateVendors(brief: EventBrief): VendorCategory[] {
  const templates = VENDOR_TEMPLATES[brief.eventType as EventType] ?? VENDOR_TEMPLATES.birthday

  return templates.map((template) => ({
    ...template,
    id: uuidv4(),
    allocatedBudget: 0,
    userQuote: null,
    notes: '',
    relatedDeadlineTaskId: null,
    relatedBudgetCategoryId: null,
  }))
}

export function updateVendorStatus(
  vendors: VendorCategory[],
  vendorId: string,
  status: VendorCategory['status'],
): VendorCategory[] {
  return vendors.map((v) => (v.id === vendorId ? { ...v, status } : v))
}

export function updateVendorQuote(
  vendors: VendorCategory[],
  vendorId: string,
  quote: number | null,
): VendorCategory[] {
  return vendors.map((v) => (v.id === vendorId ? { ...v, userQuote: quote } : v))
}
