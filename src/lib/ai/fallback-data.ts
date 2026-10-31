export interface FallbackIdea {
  title: string
  explanation: string
  whyItFits: string
  effort: 'minimal' | 'low' | 'medium' | 'high'
  costCategory: 'free' | 'budget-friendly' | 'moderate' | 'premium'
}

export const FALLBACK_IDEAS: Record<string, FallbackIdea[]> = {
  wedding: [
    {
      title: 'Potluck-style dessert table',
      explanation:
        'Invite close friends or family to bring a signature homemade dessert or baked specialty.',
      whyItFits:
        'Substantially reduces catering dessert charges while adding a warm, intimate community feeling.',
      effort: 'low',
      costCategory: 'free',
    },
    {
      title: 'Curated digital photo slideshow',
      explanation:
        'Create a looping, elegant photo montage projected during cocktail hour or in the reception lounge.',
      whyItFits:
        'Personalizes the venue without requiring expensive printed signs and custom decor rentals.',
      effort: 'low',
      costCategory: 'budget-friendly',
    },
    {
      title: 'Heirloom family cocktail or mocktail',
      explanation:
        'Feature one or two meaningful drinks honoring family roots or the couple’s story.',
      whyItFits: 'Adds a bespoke element to bar service with standard ingredients.',
      effort: 'medium',
      costCategory: 'budget-friendly',
    },
    {
      title: 'Lawn games during reception transition',
      explanation:
        'Set up classic outdoor games (croquet, cornhole, giant Jenga) for guests during photos.',
      whyItFits: 'Keeps guests engaged and entertained without hiring additional performers.',
      effort: 'low',
      costCategory: 'budget-friendly',
    },
  ],
  birthday: [
    {
      title: 'Chronological photo memory gallery',
      explanation: 'Display candid photos of the guest of honor across each decade or milestone.',
      whyItFits:
        'Creates an immediate conversation focal point with sentimental impact for negligible cost.',
      effort: 'low',
      costCategory: 'budget-friendly',
    },
    {
      title: 'DIY artisan mocktail and soda bar',
      explanation:
        'Set up fresh berries, herbs, syrups, and flavored sparkling waters with reusable glassware.',
      whyItFits: 'Fun, photogenic, and inclusive for guests of all ages and dietary preferences.',
      effort: 'medium',
      costCategory: 'budget-friendly',
    },
    {
      title: 'Milestone trivia contest',
      explanation:
        'Organize a 15-minute trivia round with humorous, heartfelt facts about the celebrant.',
      whyItFits: 'High-energy entertainment that brings everyone together without performer fees.',
      effort: 'minimal',
      costCategory: 'free',
    },
  ],
  community: [
    {
      title: 'Local talent and acoustic showcase',
      explanation:
        'Invite neighborhood musicians, student groups, or storytellers for scheduled micro-performances.',
      whyItFits: 'Zero professional talent cost and deepens neighborhood connection.',
      effort: 'medium',
      costCategory: 'free',
    },
    {
      title: 'Community skill-sharing corner',
      explanation:
        'Host brief 15-minute hands-on demos led by community volunteers (e.g. urban planting, crafting).',
      whyItFits: 'Low-cost interactive engagement that showcases resident talents.',
      effort: 'medium',
      costCategory: 'budget-friendly',
    },
    {
      title: 'DIY polaroid/phone photo zone',
      explanation: 'Create a botanical or themed photo backdrop with fun community props.',
      whyItFits: 'Encourages organic social sharing and preserves vibrant memories.',
      effort: 'low',
      costCategory: 'budget-friendly',
    },
  ],
}
