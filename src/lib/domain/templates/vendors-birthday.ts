import { VendorTemplate } from './vendors-common'

export const BIRTHDAY_VENDORS: VendorTemplate[] = [
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

