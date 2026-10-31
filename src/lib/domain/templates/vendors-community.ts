import { VendorTemplate } from './vendors-common'

export const COMMUNITY_VENDORS: VendorTemplate[] = [
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

