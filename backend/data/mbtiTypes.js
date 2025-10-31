// MBTI Type Information Database
// Complete descriptions, strengths, challenges, and characteristics for all 16 types

const mbtiTypes = {
  'INTJ': {
    name: 'The Architect',
    shortDescription: 'Imaginative and strategic thinkers, with a plan for everything.',
    description: 'Architects are the ultimate perfectionists. They possess intricate minds that can perceive patterns where others cannot, and they have the drive to turn their visions into reality. INTJs are naturally curious and have an insatiable thirst for knowledge.',
    strengths: [
      'Strategic thinking',
      'Independent',
      'Decisive',
      'Hard-working',
      'Determined',
      'Open-minded',
      'Jack-of-all-trades'
    ],
    challenges: [
      'Arrogant',
      'Judgmental',
      'Overly analytical',
      'Loathe highly structured environments',
      'Clueless in romance'
    ],
    careers: [
      'Scientist',
      'Engineer',
      'Professor',
      'Lawyer',
      'Judge',
      'Computer programmer',
      'Architect'
    ],
    relationships: 'INTJs are devoted partners who appreciate intellectual stimulation and deep conversation.',
    percentage: 2.1
  },

  'INTP': {
    name: 'The Thinker',
    shortDescription: 'Innovative inventors with an unquenchable thirst for knowledge.',
    description: 'Thinkers are philosophical innovators, fascinated by logical analysis, systems, and design. They are talented at spotting patterns and are particularly drawn to theory and abstract thinking.',
    strengths: [
      'Great analysts and abstract thinkers',
      'Imaginative and original',
      'Open-minded',
      'Enthusiastic',
      'Objective',
      'Honest and straightforward'
    ],
    challenges: [
      'Very private and withdrawn',
      'Insensitive',
      'Absent-minded',
      'Condescending',
      'Loathe rules and guidelines',
      'Second-guess themselves'
    ],
    careers: [
      'Mathematician',
      'Physicist',
      'Computer scientist',
      'Chemist',
      'Biologist',
      'Photographer',
      'Strategic planner'
    ],
    relationships: 'INTPs value intellectual connection and need partners who can engage in meaningful discussions.',
    percentage: 3.3
  },

  'ENTJ': {
    name: 'The Commander',
    shortDescription: 'Bold, imaginative and strong-willed leaders.',
    description: 'Commanders are natural-born leaders. People with this personality type embody the gifts of charisma and confidence, projecting authority in a way that draws crowds together behind a common goal.',
    strengths: [
      'Efficient',
      'Energetic',
      'Self-confident',
      'Strong-willed',
      'Strategic thinkers',
      'Charismatic and inspiring'
    ],
    challenges: [
      'Stubborn and dominant',
      'Intolerant',
      'Impatient',
      'Arrogant',
      'Poor handling of emotions',
      'Cold and ruthless'
    ],
    careers: [
      'Executive',
      'Entrepreneur',
      'Judge',
      'Lawyer',
      'Investment banker',
      'Management consultant',
      'University professor'
    ],
    relationships: 'ENTJs are committed partners who enjoy engaging in intellectual discussions and working toward mutual goals.',
    percentage: 1.8
  },

  'ENTP': {
    name: 'The Debater',
    shortDescription: 'Smart and curious thinkers who cannot resist an intellectual challenge.',
    description: 'Debaters are the ultimate devils advocate, thriving on the process of shredding arguments and beliefs and letting the ribbons drift in the wind for all to see.',
    strengths: [
      'Knowledgeable',
      'Quick thinkers',
      'Original',
      'Excellent brainstormers',
      'Charismatic',
      'Energetic'
    ],
    challenges: [
      'Very argumentative',
      'Insensitive',
      'Intolerant',
      'Can find it difficult to focus',
      'Dislike practical matters'
    ],
    careers: [
      'Inventor',
      'Journalist',
      'Lawyer',
      'Psychologist',
      'Entrepreneur',
      'Photographer',
      'Consultant'
    ],
    relationships: 'ENTPs seek partners who can keep up with their intellectual energy and share their love of debate.',
    percentage: 2.0
  },

  'INFJ': {
    name: 'The Advocate',
    shortDescription: 'Creative and insightful, inspired and independent.',
    description: 'Advocates are creative and insightful, inspired and independent. They are principled and passionate, Advocates are able to speak to others conscience in ways that are both compelling and deeply personal.',
    strengths: [
      'Creative',
      'Insightful',
      'Inspiring and convincing',
      'Decisive',
      'Determined and passionate',
      'Altruistic'
    ],
    challenges: [
      'Sensitive',
      'Extremely private',
      'Perfectionistic',
      'Always need to have a cause',
      'Can burn out easily'
    ],
    careers: [
      'Counselor',
      'Writer',
      'Artist',
      'Photographer',
      'Psychologist',
      'Teacher',
      'Religious worker'
    ],
    relationships: 'INFJs seek deep, meaningful connections and are incredibly loyal and devoted partners.',
    percentage: 1.5
  },

  'INFP': {
    name: 'The Mediator',
    shortDescription: 'Poetic, kind and altruistic people, always eager to help.',
    description: 'Mediators are true idealists, always looking for the hint of good in even the worst of people and events, searching for ways to make things better.',
    strengths: [
      'Idealistic',
      'Loyal and devoted',
      'Hard-working',
      'Flexible',
      'Passionate',
      'Creative'
    ],
    challenges: [
      'Too idealistic',
      'Too altruistic',
      'Impractical',
      'Dislike dealing with data',
      'Take things personally',
      'Difficult to get to know'
    ],
    careers: [
      'Writer',
      'Artist',
      'Counselor',
      'Psychologist',
      'Teacher',
      'Physical therapist',
      'Massage therapist'
    ],
    relationships: 'INFPs are deeply caring partners who value authenticity and emotional connection.',
    percentage: 4.4
  },

  'ENFJ': {
    name: 'The Protagonist',
    shortDescription: 'Charismatic and inspiring leaders, able to mesmerize listeners.',
    description: 'Protagonists are natural-born leaders, full of passion and charisma. They are often found speaking up for what is right and pushing others to be the best that they can be.',
    strengths: [
      'Tolerant',
      'Reliable',
      'Charismatic',
      'Altruistic',
      'Natural leaders'
    ],
    challenges: [
      'Overly idealistic',
      'Too selfless',
      'Too sensitive',
      'Fluctuating self-esteem',
      'Struggle to make tough decisions'
    ],
    careers: [
      'Teacher',
      'Counselor',
      'Politician',
      'Coach',
      'Facilitator',
      'Sales representative',
      'HR director'
    ],
    relationships: 'ENFJs are warm, caring partners who prioritize their loved ones emotional well-being.',
    percentage: 2.5
  },

  'ENFP': {
    name: 'The Campaigner',
    shortDescription: 'Enthusiastic, creative and sociable free spirits.',
    description: 'Campaigners are true free spirits - outgoing, openhearted, and open-minded. They approach life, love, and work with energy and upbeat attitudes.',
    strengths: [
      'Enthusiastic',
      'Creative',
      'Sociable',
      'Energetic',
      'Independent',
      'Good communication skills'
    ],
    challenges: [
      'Poor practical skills',
      'Find it difficult to focus',
      'Overthink things',
      'Get stressed easily',
      'Highly emotional',
      'Independent to a fault'
    ],
    careers: [
      'Journalist',
      'Actor',
      'TV anchor',
      'Counselor',
      'Social worker',
      'Politician',
      'Restaurateur'
    ],
    relationships: 'ENFPs are enthusiastic partners who bring energy and creativity to their relationships.',
    percentage: 8.1
  },

  'ISTJ': {
    name: 'The Logistician',
    shortDescription: 'Practical and fact-minded, reliable and responsible.',
    description: 'Logisticians are often called the backbone of society because they can rely on completing tasks and their word is honor-bound.',
    strengths: [
      'Honest and direct',
      'Strong-willed and dutiful',
      'Very responsible',
      'Calm and practical',
      'Create and enforce order',
      'Jacks-of-all-trades'
    ],
    challenges: [
      'Stubborn',
      'Insensitive',
      'Always by the book',
      'Judgmental',
      'Often unreasonably blame themselves'
    ],
    careers: [
      'Military officer',
      'Lawyer',
      'Judge',
      'Police officer',
      'Detective',
      'Accountant',
      'Financial officer'
    ],
    relationships: 'ISTJs are reliable, committed partners who value stability and traditional values.',
    percentage: 11.6
  },

  'ISFJ': {
    name: 'The Protector',
    shortDescription: 'Warm-hearted and dedicated, always ready to protect loved ones.',
    description: 'Protectors are true altruists, meeting kindness with kindness-in-excess and engaging with the work and people they believe in with enthusiasm and generosity.',
    strengths: [
      'Supportive',
      'Reliable and patient',
      'Imaginative and observant',
      'Enthusiastic',
      'Loyal and hard-working',
      'Good practical skills'
    ],
    challenges: [
      'Humble and shy',
      'Take things too personally',
      'Repress their feelings',
      'Overload themselves',
      'Reluctant to change',
      'Too altruistic'
    ],
    careers: [
      'Social worker',
      'Counselor',
      'Teacher',
      'Medical doctor',
      'Nurse',
      'Paralegal',
      'Administrative assistant'
    ],
    relationships: 'ISFJs are caring, devoted partners who prioritize their loved ones happiness and well-being.',
    percentage: 13.8
  },

  'ESTJ': {
    name: 'The Executive',
    shortDescription: 'Excellent administrators, unsurpassed at managing things or people.',
    description: 'Executives are excellent organizers, great at managing tasks and people. Executives are aware of their surroundings and live in a world of clear, verifiable facts.',
    strengths: [
      'Dedicated',
      'Strong-willed',
      'Direct and honest',
      'Loyal, patient and reliable',
      'Enjoy creating order',
      'Excellent organizers'
    ],
    challenges: [
      'Inflexible and stubborn',
      'Uncomfortable with unconventional situations',
      'Judgmental',
      'Too focused on social status',
      'Difficult to relax'
    ],
    careers: [
      'Judge',
      'Lawyer',
      'Business executive',
      'Police officer',
      'Detective',
      'Finance manager',
      'Teacher'
    ],
    relationships: 'ESTJs are dependable partners who value tradition and work hard to provide stability.',
    percentage: 8.7
  },

  'ESFJ': {
    name: 'The Consul',
    shortDescription: 'Extraordinarily caring, social and popular people, always eager to help.',
    description: 'Consuls are altruistic people, and they take seriously their responsibility to help and to do the right thing, even when it is difficult.',
    strengths: [
      'Strong practical skills',
      'Loyal',
      'Sensitive and warm',
      'Good at connecting with others',
      'Dutiful'
    ],
    challenges: [
      'Worried about their social status',
      'Inflexible',
      'Reluctant to innovate or improvise',
      'Vulnerable to criticism',
      'Often too needy',
      'Too selfless'
    ],
    careers: [
      'Elementary teacher',
      'Child care provider',
      'Family physician',
      'Nurse',
      'Social worker',
      'Counselor',
      'Paralegal'
    ],
    relationships: 'ESFJs are warm, supportive partners who go above and beyond to make their loved ones happy.',
    percentage: 12.3
  },

  'ISTP': {
    name: 'The Virtuoso',
    shortDescription: 'Bold and practical experimenters, masters of all kinds of tools.',
    description: 'Virtuosos love to explore with their hands and their eyes, touching and examining the world around them with cool rationalism and spirited curiosity.',
    strengths: [
      'Optimistic and energetic',
      'Creative and practical',
      'Spontaneous and rational',
      'Know how to prioritize',
      'Great in a crisis',
      'Relaxed'
    ],
    challenges: [
      'Stubborn',
      'Insensitive',
      'Private and reserved',
      'Easily bored',
      'Dislike commitment',
      'Risky behavior'
    ],
    careers: [
      'Mechanic',
      'Engineer',
      'Graphic designer',
      'Pilot',
      'Chef',
      'Artist',
      'Police officer'
    ],
    relationships: 'ISTPs are independent partners who value personal space and practical support.',
    percentage: 5.4
  },

  'ISFP': {
    name: 'The Adventurer',
    shortDescription: 'Flexible and charming artists, always ready to explore new possibilities.',
    description: 'Adventurers are true artists, but not necessarily in the typical sense where theyre out painting happy little trees. They live in a world of sensory possibilities.',
    strengths: [
      'Charming',
      'Sensitive to others',
      'Imaginative',
      'Passionate',
      'Curious',
      'Artistic'
    ],
    challenges: [
      'Fiercely independent',
      'Unpredictable',
      'Easily stressed',
      'Overly competitive',
      'Fluctuating self-esteem'
    ],
    careers: [
      'Artist',
      'Musician',
      'Photographer',
      'Psychologist',
      'Social worker',
      'Teacher',
      'Veterinarian'
    ],
    relationships: 'ISFPs are gentle, caring partners who value harmony and emotional connection.',
    percentage: 8.8
  },

  'ESTP': {
    name: 'The Entrepreneur',
    shortDescription: 'Smart, energetic and perceptive people, truly enjoy living on the edge.',
    description: 'Entrepreneurs always have an impact on their immediate surroundings. They learn best through action, and enjoy working with others to complete tasks.',
    strengths: [
      'Tolerant',
      'Energetic',
      'Very perceptive',
      'Excellent people skills',
      'Popular and friendly'
    ],
    challenges: [
      'Insensitive',
      'Impatient',
      'Risk-prone',
      'Unstructured',
      'May miss the bigger picture',
      'Defiant'
    ],
    careers: [
      'Sales representative',
      'Marketing manager',
      'Police officer',
      'Coach',
      'Real estate agent',
      'Paramedic',
      'Entrepreneur'
    ],
    relationships: 'ESTPs are fun-loving partners who bring excitement and spontaneity to relationships.',
    percentage: 4.3
  },

  'ESFP': {
    name: 'The Entertainer',
    shortDescription: 'Spontaneous, energetic and enthusiastic people - life is never boring.',
    description: 'Entertainers get caught up in the excitement of the moment, and want everyone else to feel that way, too. No other personality type is as generous with their time and energy.',
    strengths: [
      'Bold',
      'Original',
      'Aesthetics and showcase',
      'Practical',
      'Observant',
      'Excellent people skills'
    ],
    challenges: [
      'Sensitive',
      'Conflict-averse',
      'Easily bored',
      'Poor long-term planners',
      'Unfocused'
    ],
    careers: [
      'Artist',
      'Entertainer',
      'Social worker',
      'Counselor',
      'Nurse',
      'Massage therapist',
      'Event coordinator'
    ],
    relationships: 'ESFPs are enthusiastic partners who bring joy and spontaneity to their relationships.',
    percentage: 8.5
  }
};

module.exports = mbtiTypes; 
