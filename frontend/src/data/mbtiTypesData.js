// Enhanced MBTI Types Data with detailed information in both English and Chinese
// Based on the user-provided INFJ sample and comprehensive MBTI research

const mbtiTypesData = {
  'INFJ': {
    name: {
      en: 'The Advocate',
      zh: '提倡者'
    },
    shortDescription: {
      en: 'Creative and insightful, inspired and independent.',
      zh: '富有創造力和洞察力，富有靈感且獨立自主。'
    },
    traits: {
      en: [
        {
          title: 'Empathy and Compassion',
          description: 'INFJs tend to be highly empathetic and compassionate individuals with a strong ability to understand and connect with others\' emotions. They may be highly sensitive to the needs of those around them and have a motivation to help and support others.'
        },
        {
          title: 'Idealism and Vision', 
          description: 'INFJs tend to be highly idealistic and visionary individuals with a strong sense of purpose and mission. They may be deeply committed to making a positive impact on the world and may be driven by a desire to help others or create a better future.'
        },
        {
          title: 'Intuition and Insight',
          description: 'INFJs tend to be highly intuitive and insightful individuals with a strong ability to read between the lines and perceive things that others may miss. They may be highly sensitive to subtle cues and able to anticipate the needs or desires of others before they are expressed.'
        },
        {
          title: 'Creativity and Imagination',
          description: 'INFJs tend to be highly creative and imaginative individuals with a strong ability to think outside the box and come up with novel and innovative ideas. They may be drawn to creative fields such as writing, art, or music, or may be able to apply their creative skills to other areas of their lives.'
        },
        {
          title: 'Introversion and Reflection',
          description: 'INFJs tend to be quite introverted and reflective individuals who may not readily share their thoughts and feelings with others. They may have a rich inner life and enjoy spending time alone to reflect and recharge. They may be highly self-aware and able to clearly recognize their own strengths and weaknesses.'
        },
        {
          title: 'Perfectionism and Idealism',
          description: 'Like INTJs, INFJs tend to be very perfectionistic and may have high standards for themselves and others. They may be driven to pursue excellence and may become frustrated or disappointed if things do not meet their high expectations. They may also be strongly idealistic and may be motivated to help make the world a better place.'
        },
        {
          title: 'Diplomacy and Harmony',
          description: 'INFJs tend to be highly diplomatic and harmony-seeking individuals with a strong ability to mediate and resolve conflicts. They may be able to see multiple perspectives and may be skilled at finding common ground and building bridges between different parties.'
        },
        {
          title: 'Sensitivity and Emotionality',
          description: 'INFJ personalities tend to be highly sensitive and emotional individuals with a strong ability to deeply experience a wide range of emotions. They may be deeply affected by the emotions of others and may be easily overwhelmed by intense or negative emotions. They may also be very empathetic and able to provide comfort and support to those who are struggling.'
        },
        {
          title: 'Strategic and Analytical',
          description: 'Although INFJ personalities tend to be more intuitive than analytical, they can still be strategic and analytical individuals when needed. They may be able to analyze complex problems, come up with innovative solutions, and may be skilled at planning and organizing complex projects.'
        }
      ],
      zh: [
        {
          title: '共情和同情心',
          description: 'INFJ 傾向於是高度共情和同情心的人，具有強大的理解和連接他人情感的能力。他們可能高度敏感地感知周圍人的需求，並有幫助和支持他人的動機。'
        },
        {
          title: '理想主義和願景',
          description: 'INFJ 傾向於是高度理想主義和願景的人，具有強烈的目的和使命感。他們可能深深致力於對世界產生積極的影響，並可能受到幫助他人或創造更好未來的渴望的推動。'
        },
        {
          title: '直覺和洞察力',
          description: 'INFJ 傾向於是高度直覺和洞察力的人，具有強大的能力，能夠閱讀行間細節，感知他人可能忽略的事物。他們可能高度敏感地感知微妙的提示，能夠在表達之前預測他人的需求或慾望。'
        },
        {
          title: '創造性和想象力',
          description: 'INFJ 傾向於是高度創造性和想象力的人，具有突破傳統思維、提出新穎創新思路的強大能力。他們可能會被創意領域，如寫作、藝術或音樂所吸引，或者能夠將其創造性技能應用於其生活的其他方面。'
        },
        {
          title: '內向和反思',
          description: 'INFJ 傾向於是相當內向和反思的人，可能不容易與他人分享自己的思想和情感。他們可能有豐富的內心生活，喜歡獨處反思和充電。他們可能高度自我意識，能夠清楚地認識到自己的優點和缺點。'
        },
        {
          title: '完美主義和理想主義',
          description: '與 INTJ 一樣，INFJ 傾向於非常完美主義，可能對自己和他人有高標準。他們可能有追求卓越的動力，如果事情不能達到他們的高期望，可能會感到沮喪或失望。他們可能也有強烈的理想主義，並可能有幫助世界變得更好的動機。'
        },
        {
          title: '外交和和諧',
          description: 'INFJ 傾向於是高度外交和和諧的人，具有強大的調解和解決衝突的能力。他們可能能夠從多個角度看待問題，並可能擅長找到共同點和在不同方面之間建立橋樑。'
        },
        {
          title: '敏感而情感化',
          description: 'INFJ個性傾向於是高度敏感和情感化的個體，有強烈的深刻體驗各種情感的能力。他們可能會被他人的情緒深深影響，並可能很容易被強烈或負面情緒淹沒。他們也可能非常具有共情能力，並能夠為那些正在掙扎的人提供安慰和支持。'
        },
        {
          title: '策略性和分析性',
          description: '儘管INFJ個性傾向於比較直覺而非分析性，但當需要時他們仍然能夠是具有策略性和分析性的人。他們可能能夠分析複雜的問題，提出創新的解決方案，並可能擅長計畫和組織複雜的專案。'
        }
      ]
    },
    summary: {
      en: 'Overall, the INFJ personality type is generally considered to be empathetic, idealistic, and insightful individuals with a strong focus on caring for others and making a positive impact on the world. While INFJs may struggle with perfectionism and may be quite private in social situations, they are typically highly creative and imaginative individuals who can bring a unique perspective to any situation.',
      zh: '總體而言，INFJ個性類型通常被認為是具有共情、理想化和洞察力的個體，具有強烈的關注他人並對世界產生積極的影響力。儘管INFJ可能會在完美主義上掙扎，並且在社交場合中可能非常隱私，但他們通常是高度具有創造性和想像力的個體，可以為任何情況帶來獨特的觀點。'
    },
    quotes: {
      en: [
        '"I have a vision of how things could be, and I\'m working toward that."',
        '"I\'m good at sensing others\' emotions and perceiving their needs."',
        '"I have a deep connection to my values and beliefs."',
        '"I\'m always searching for meaning and purpose in life."',
        '"I can sense when someone is being fake or insincere."',
        '"I find it hard to let go of negative experiences and emotions."',
        '"I enjoy deep, meaningful conversations about life and philosophy."',
        '"I believe in the power of empathy and understanding to create positive change."'
      ],
      zh: [
        '「我對事物可能的發展有一個願景，而我正在為之努力。」',
        '「我擅長察覺他人的情感，並感知他們的需求。」',
        '「我與我的價值觀和信念有深刻的聯繫。」',
        '「我一直在尋找生命中的意義和目的。」',
        '「我能感覺到某人是否虛偽或不真誠。」',
        '「我很難釋懷負面經歷和情感。」',
        '「我喜歡有關生命和哲學的深入有意義的交談。」',
        '「我相信同理心和理解力量能夠創造積極的改變。」'
      ]
    },
    strengths: {
      en: ['Creative', 'Insightful', 'Inspiring and convincing', 'Decisive', 'Determined and passionate', 'Altruistic'],
      zh: ['富有創造力', '具有洞察力', '鼓舞人心且有說服力', '果斷', '堅定而充滿熱情', '利他主義']
    },
    challenges: {
      en: ['Sensitive', 'Extremely private', 'Perfectionistic', 'Always need to have a cause', 'Can burn out easily'],
      zh: ['敏感', '極度隱私', '完美主義', '總是需要有事業', '容易倦怠']
    },
    careers: {
      en: ['Counselor', 'Writer', 'Artist', 'Photographer', 'Psychologist', 'Teacher', 'Religious worker'],
      zh: ['諮詢師', '作家', '藝術家', '攝影師', '心理學家', '教師', '宗教工作者']
    },
    relationships: {
      en: 'INFJs seek deep, meaningful connections and are incredibly loyal and devoted partners.',
      zh: 'INFJ尋求深刻、有意義的關係，是非常忠誠和專注的伴侶。'
    },
    percentage: 1.5
  },

  'INTJ': {
    name: {
      en: 'The Architect',
      zh: '建築師'
    },
    shortDescription: {
      en: 'Imaginative and strategic thinkers, with a plan for everything.',
      zh: '富有想象力和戰略思維的思考者，對一切都有計劃。'
    },
    traits: {
      en: [
        {
          title: 'Strategic Vision',
          description: 'INTJs are natural planners who can see the big picture and develop comprehensive strategies to achieve their goals.'
        },
        {
          title: 'Independence',
          description: 'They prefer to work autonomously and value their intellectual independence above conventional thinking.'
        },
        {
          title: 'Analytical Thinking',
          description: 'INTJs excel at breaking down complex problems and finding logical, efficient solutions.'
        },
        {
          title: 'Perfectionism',
          description: 'They have high standards for themselves and others, always striving for excellence in their work.'
        }
      ],
      zh: [
        {
          title: '戰略眼光',
          description: 'INTJ是天生的規劃者，能夠看到大局並制定全面的戰略來實現目標。'
        },
        {
          title: '獨立性',
          description: '他們更喜歡自主工作，重視自己的智力獨立性，超越傳統思維。'
        },
        {
          title: '分析思維',
          description: 'INTJ擅長分解複雜問題並找到邏輯、高效的解決方案。'
        },
        {
          title: '完美主義',
          description: '他們對自己和他人都有很高的標準，總是在工作中追求卓越。'
        }
      ]
    },
    summary: {
      en: 'INTJs are systematic thinkers who approach life with a strategic mindset. They are highly independent and prefer to work alone, using their strong analytical skills to solve complex problems.',
      zh: 'INTJ是系統性思考者，以戰略思維方式對待生活。他們非常獨立，喜歡獨自工作，運用強大的分析技能解決複雜問題。'
    },
    quotes: {
      en: [
        '"I see patterns and connections others miss."',
        '"Efficiency and competence are my top priorities."',
        '"I prefer to work independently toward my vision."',
        '"Logic guides my decision-making process."'
      ],
      zh: [
        '「我看到別人錯過的模式和聯繫。」',
        '「效率和能力是我的首要任務。」',
        '「我更喜歡獨立朝著我的願景努力。」',
        '「邏輯指導我的決策過程。」'
      ]
    },
    strengths: {
      en: ['Strategic thinking', 'Independent', 'Decisive', 'Hard-working', 'Determined', 'Open-minded'],
      zh: ['戰略思維', '獨立', '果斷', '勤奮', '堅定', '開放思維']
    },
    challenges: {
      en: ['Arrogant', 'Judgmental', 'Overly analytical', 'Loathe highly structured environments', 'Clueless in romance'],
      zh: ['傲慢', '武斷', '過度分析', '厭惡高度結構化環境', '在戀愛中迷茫']
    },
    careers: {
      en: ['Scientist', 'Engineer', 'Professor', 'Lawyer', 'Judge', 'Computer programmer', 'Architect'],
      zh: ['科學家', '工程師', '教授', '律師', '法官', '電腦程式設計師', '建築師']
    },
    relationships: {
      en: 'INTJs are devoted partners who appreciate intellectual stimulation and deep conversation.',
      zh: 'INTJ是忠誠的伴侶，欣賞智力刺激和深入對話。'
    },
    percentage: 2.1
  },

  'INTP': {
    name: {
      en: 'The Thinker',
      zh: '思考者'
    },
    shortDescription: {
      en: 'Innovative inventors with an unquenchable thirst for knowledge.',
      zh: '創新的發明家，對知識有著無法熄滅的渴望。'
    },
    traits: {
      en: [
        {
          title: 'Analytical Excellence',
          description: 'INTPs are exceptional at breaking down complex theories and systems into understandable components.'
        },
        {
          title: 'Creative Problem Solving',
          description: 'They approach problems from unique angles and often find innovative solutions others miss.'
        },
        {
          title: 'Intellectual Curiosity',
          description: 'INTPs have an insatiable desire to understand how things work and why they work that way.'
        },
        {
          title: 'Independent Thinking',
          description: 'They value their intellectual autonomy and resist conforming to conventional wisdom.'
        }
      ],
      zh: [
        {
          title: '分析卓越',
          description: 'INTP擅長將複雜的理論和系統分解為可理解的組件。'
        },
        {
          title: '創造性解決問題',
          description: '他們從獨特的角度處理問題，經常找到別人錯過的創新解決方案。'
        },
        {
          title: '智力好奇心',
          description: 'INTP對理解事物如何運作以及為什麼這樣運作有著無法滿足的渴望。'
        },
        {
          title: '獨立思考',
          description: '他們重視自己的智力自主性，抗拒服從傳統智慧。'
        }
      ]
    },
    summary: {
      en: 'INTPs are philosophical innovators who love exploring theoretical possibilities. They combine logical analysis with creative thinking to understand complex systems and generate new ideas.',
      zh: 'INTP是喜歡探索理論可能性的哲學創新者。他們將邏輯分析與創造性思維相結合，以理解複雜系統並產生新想法。'
    },
    quotes: {
      en: [
        '"I need to understand the underlying principles."',
        '"There must be a more elegant solution."',
        '"I question everything, even my own assumptions."',
        '"Knowledge for its own sake is valuable."'
      ],
      zh: [
        '「我需要理解基本原理。」',
        '「必須有更優雅的解決方案。」',
        '「我質疑一切，甚至是我自己的假設。」',
        '「知識本身就是有價值的。」'
      ]
    },
    strengths: {
      en: ['Great analysts and abstract thinkers', 'Imaginative and original', 'Open-minded', 'Enthusiastic', 'Objective', 'Honest and straightforward'],
      zh: ['偉大的分析師和抽象思考者', '富有想像力和原創性', '開放思維', '熱情', '客觀', '誠實直接']
    },
    challenges: {
      en: ['Very private and withdrawn', 'Insensitive', 'Absent-minded', 'Condescending', 'Loathe rules and guidelines', 'Second-guess themselves'],
      zh: ['非常私人和退縮', '不敏感', '心不在焉', '居高臨下', '厭惡規則和指導方針', '懷疑自己']
    },
    careers: {
      en: ['Mathematician', 'Physicist', 'Computer scientist', 'Chemist', 'Biologist', 'Photographer', 'Strategic planner'],
      zh: ['數學家', '物理學家', '電腦科學家', '化學家', '生物學家', '攝影師', '戰略規劃師']
    },
    relationships: {
      en: 'INTPs value intellectual connection and need partners who can engage in meaningful discussions.',
      zh: 'INTP重視智力連結，需要能夠參與有意義討論的伴侶。'
    },
    percentage: 3.3
  },

  'ENTJ': {
    name: {
      en: 'The Commander',
      zh: '指揮官'
    },
    shortDescription: {
      en: 'Bold, imaginative and strong-willed leaders.',
      zh: '大膽、富有想像力和意志堅強的領導者。'
    },
    traits: {
      en: [
        {
          title: 'Natural Leadership',
          description: 'ENTJs have an innate ability to inspire and organize people toward common goals.'
        },
        {
          title: 'Strategic Planning',
          description: 'They excel at long-term planning and can see the big picture while managing details.'
        },
        {
          title: 'Decisive Action',
          description: 'ENTJs make decisions quickly and confidently, even in complex situations.'
        },
        {
          title: 'Goal-Oriented',
          description: 'They are driven by achievement and have a strong desire to accomplish meaningful objectives.'
        }
      ],
      zh: [
        {
          title: '天生的領導力',
          description: 'ENTJ具有激勵和組織人們朝著共同目標努力的天生能力。'
        },
        {
          title: '戰略規劃',
          description: '他們擅長長期規劃，能夠在管理細節的同時看到大局。'
        },
        {
          title: '果斷行動',
          description: 'ENTJ即使在複雜情況下也能快速而自信地做出決策。'
        },
        {
          title: '目標導向',
          description: '他們受成就驅動，有強烈的願望去完成有意義的目標。'
        }
      ]
    },
    summary: {
      en: 'ENTJs are natural-born leaders who embody charisma and confidence. They project authority and draw people together behind common goals, making them effective executives and entrepreneurs.',
      zh: 'ENTJ是天生的領導者，體現了魅力和自信。他們展現權威，將人們團結在共同目標後面，使他們成為有效的高管和企業家。'
    },
    quotes: {
      en: [
        '"I see the potential in every situation."',
        '"Efficiency and results drive my decisions."',
        '"I take charge when leadership is needed."',
        '"I\'m focused on long-term success."'
      ],
      zh: [
        '「我看到每種情況的潛力。」',
        '「效率和結果驅動我的決定。」',
        '「當需要領導時，我會主動承擔。」',
        '「我專注於長期成功。」'
      ]
    },
    strengths: {
      en: ['Efficient', 'Energetic', 'Self-confident', 'Strong-willed', 'Strategic thinkers', 'Charismatic and inspiring'],
      zh: ['高效', '精力充沛', '自信', '意志堅強', '戰略思考者', '富有魅力和鼓舞人心']
    },
    challenges: {
      en: ['Stubborn and dominant', 'Intolerant', 'Impatient', 'Arrogant', 'Poor handling of emotions', 'Cold and ruthless'],
      zh: ['固執和專橫', '不寬容', '不耐煩', '傲慢', '情感處理能力差', '冷酷無情']
    },
    careers: {
      en: ['Executive', 'Entrepreneur', 'Judge', 'Lawyer', 'Investment banker', 'Management consultant', 'University professor'],
      zh: ['高管', '企業家', '法官', '律師', '投資銀行家', '管理顧問', '大學教授']
    },
    relationships: {
      en: 'ENTJs are committed partners who enjoy engaging in intellectual discussions and working toward mutual goals.',
      zh: 'ENTJ是忠誠的伴侶，喜歡參與智力討論並為共同目標而努力。'
    },
    percentage: 1.8
  },

  'ENTP': {
    name: {
      en: 'The Debater',
      zh: '辯論家'
    },
    shortDescription: {
      en: 'Smart and curious thinkers who cannot resist an intellectual challenge.',
      zh: '聰明而好奇的思考者，無法抗拒智力挑戰。'
    },
    traits: {
      en: [
        {
          title: 'Intellectual Agility',
          description: 'ENTPs can quickly grasp complex concepts and make connections between seemingly unrelated ideas.'
        },
        {
          title: 'Creative Innovation',
          description: 'They excel at generating novel ideas and finding unique solutions to problems.'
        },
        {
          title: 'Persuasive Communication',
          description: 'ENTPs are skilled debaters who can present compelling arguments from multiple perspectives.'
        },
        {
          title: 'Adaptability',
          description: 'They thrive in changing environments and can quickly adjust their approach as needed.'
        }
      ],
      zh: [
        {
          title: '智力敏捷性',
          description: 'ENTP能夠快速掌握複雜概念，並在看似不相關的想法之間建立聯繫。'
        },
        {
          title: '創新創造',
          description: '他們擅長產生新穎的想法並找到解決問題的獨特方案。'
        },
        {
          title: '說服性溝通',
          description: 'ENTP是熟練的辯論者，能夠從多個角度提出令人信服的論點。'
        },
        {
          title: '適應性',
          description: '他們在變化的環境中茁壯成長，能夠根據需要快速調整方法。'
        }
      ]
    },
    summary: {
      en: 'ENTPs are the ultimate devil\'s advocates, thriving on intellectual discourse and creative problem-solving. They bring energy and innovation to any discussion or project.',
      zh: 'ENTP是終極的惡魔辯護者，在智力交流和創造性解決問題中茁壯成長。他們為任何討論或項目帶來活力和創新。'
    },
    quotes: {
      en: [
        '"There\'s always another way to look at it."',
        '"I love exploring new possibilities."',
        '"Debate sharpens my thinking."',
        '"Innovation comes from questioning assumptions."'
      ],
      zh: [
        '「總有另一種看待問題的方式。」',
        '「我喜歡探索新的可能性。」',
        '「辯論讓我的思維更敏銳。」',
        '「創新來自質疑假設。」'
      ]
    },
    strengths: {
      en: ['Knowledgeable', 'Quick thinkers', 'Original', 'Excellent brainstormers', 'Charismatic', 'Energetic'],
      zh: ['知識淵博', '思維敏捷', '原創', '優秀的頭腦風暴者', '富有魅力', '精力充沛']
    },
    challenges: {
      en: ['Very argumentative', 'Insensitive', 'Intolerant', 'Can find it difficult to focus', 'Dislike practical matters'],
      zh: ['非常愛爭論', '不敏感', '不寬容', '很難專注', '不喜歡實際問題']
    },
    careers: {
      en: ['Inventor', 'Journalist', 'Lawyer', 'Psychologist', 'Entrepreneur', 'Photographer', 'Consultant'],
      zh: ['發明家', '記者', '律師', '心理學家', '企業家', '攝影師', '顧問']
    },
    relationships: {
      en: 'ENTPs seek partners who can keep up with their intellectual energy and share their love of debate.',
      zh: 'ENTP尋求能夠跟上他們智力活力並分享辯論愛好的伴侶。'
    },
    percentage: 2.0
  },

  // Adding more types with simplified data structure for brevity
  'INFP': {
    name: { en: 'The Mediator', zh: '調停者' },
    shortDescription: { en: 'Poetic, kind and altruistic people, always eager to help.', zh: '詩意、善良和利他的人，總是渴望幫助他人。' },
    traits: {
      en: [
        { title: 'Idealistic Nature', description: 'INFPs are driven by their values and seek to make the world a better place.' },
        { title: 'Creative Expression', description: 'They have a natural talent for creative and artistic pursuits.' },
        { title: 'Empathetic Understanding', description: 'INFPs deeply understand and care about others\' feelings.' },
        { title: 'Authentic Living', description: 'They strive to live in accordance with their personal values.' }
      ],
      zh: [
        { title: '理想主義本質', description: 'INFP受價值觀驅動，尋求讓世界變得更美好。' },
        { title: '創意表達', description: '他們對創意和藝術追求有天然的才能。' },
        { title: '共情理解', description: 'INFP深深理解和關心他人的感受。' },
        { title: '真實生活', description: '他們努力按照個人價值觀生活。' }
      ]
    },
    summary: {
      en: 'INFPs are idealistic and caring individuals who value authenticity and personal growth.',
      zh: 'INFP是理想主義和關懷的個體，重視真實性和個人成長。'
    },
    quotes: {
      en: ['"I want to make a meaningful difference."', '"Authenticity is more important than popularity."'],
      zh: ['"我想要產生有意義的改變。"', '"真實性比受歡迎更重要。"']
    },
    strengths: { en: ['Idealistic', 'Loyal and devoted', 'Hard-working', 'Flexible', 'Passionate', 'Creative'], zh: ['理想主義', '忠誠和奉獻', '勤奮', '靈活', '熱情', '創造性'] },
    challenges: { en: ['Too idealistic', 'Too altruistic', 'Impractical', 'Dislike dealing with data', 'Take things personally'], zh: ['過於理想主義', '過於利他', '不實際', '不喜歡處理數據', '把事情個人化'] },
    careers: { en: ['Writer', 'Artist', 'Counselor', 'Psychologist', 'Teacher'], zh: ['作家', '藝術家', '諮詢師', '心理學家', '教師'] },
    relationships: { en: 'INFPs are deeply caring partners who value authenticity and emotional connection.', zh: 'INFP是深度關懷的伴侶，重視真實性和情感聯繫。' },
    percentage: 4.4
  },

  'ENFJ': {
    name: { en: 'The Protagonist', zh: '主角' },
    shortDescription: { en: 'Charismatic and inspiring leaders, able to mesmerize listeners.', zh: '富有魅力和鼓舞人心的領導者，能夠吸引聽眾。' },
    traits: {
      en: [
        { title: 'Natural Leadership', description: 'ENFJs inspire and motivate others toward positive change.' },
        { title: 'Empathetic Communication', description: 'They excel at understanding and responding to others\' emotional needs.' },
        { title: 'Visionary Thinking', description: 'ENFJs can see potential in people and situations.' },
        { title: 'Collaborative Spirit', description: 'They work well with others and build strong teams.' }
      ],
      zh: [
        { title: '天然領導力', description: 'ENFJ激勵和推動他人朝著積極變化前進。' },
        { title: '共情溝通', description: '他們擅長理解和回應他人的情感需求。' },
        { title: '遠見思維', description: 'ENFJ能看到人和情況的潛力。' },
        { title: '合作精神', description: '他們與他人合作良好並建立強大的團隊。' }
      ]
    },
    summary: {
      en: 'ENFJs are natural-born leaders who inspire others through their passion and charisma.',
      zh: 'ENFJ是天生的領導者，通過激情和魅力激勵他人。'
    },
    quotes: {
      en: ['"I see the best in everyone."', '"Together we can achieve anything."'],
      zh: ['"我看到每個人最好的一面。"', '"我們一起可以實現任何事情。"']
    },
    strengths: { en: ['Tolerant', 'Reliable', 'Charismatic', 'Altruistic', 'Natural leaders'], zh: ['寬容', '可靠', '富有魅力', '利他主義', '天生的領導者'] },
    challenges: { en: ['Overly idealistic', 'Too selfless', 'Too sensitive', 'Fluctuating self-esteem'], zh: ['過於理想主義', '過於無私', '過於敏感', '自尊心波動'] },
    careers: { en: ['Teacher', 'Counselor', 'Politician', 'Coach', 'HR director'], zh: ['教師', '諮詢師', '政治家', '教練', '人力資源總監'] },
    relationships: { en: 'ENFJs are warm, caring partners who prioritize their loved ones\' emotional well-being.', zh: 'ENFJ是溫暖、關懷的伴侶，優先考慮所愛之人的情感健康。' },
    percentage: 2.5
  },

  'ENFP': {
    name: { en: 'The Campaigner', zh: '競選者' },
    shortDescription: { en: 'Enthusiastic, creative and sociable free spirits.', zh: '熱情、創意和善於交際的自由精神。' },
    traits: {
      en: [
        { title: 'Infectious Enthusiasm', description: 'ENFPs bring energy and excitement to everything they do.' },
        { title: 'Creative Innovation', description: 'They excel at generating new ideas and possibilities.' },
        { title: 'People-Focused', description: 'ENFPs genuinely care about others and their potential.' },
        { title: 'Adaptable Nature', description: 'They thrive in dynamic, changing environments.' }
      ],
      zh: [
        { title: '感染性熱情', description: 'ENFP為他們所做的一切帶來活力和興奮。' },
        { title: '創新創造', description: '他們擅長產生新想法和可能性。' },
        { title: '以人為本', description: 'ENFP真誠關心他人及其潛力。' },
        { title: '適應性本質', description: '他們在動態、變化的環境中茁壯成長。' }
      ]
    },
    summary: {
      en: 'ENFPs are enthusiastic and creative individuals who inspire others with their passion and optimism.',
      zh: 'ENFP是熱情和創意的個體，用激情和樂觀激勵他人。'
    },
    quotes: {
      en: ['"Life is full of possibilities!"', '"I love connecting with people."'],
      zh: ['"生活充滿可能性！"', '"我喜歡與人建立聯繫。"']
    },
    strengths: { en: ['Enthusiastic', 'Creative', 'Sociable', 'Energetic', 'Independent'], zh: ['熱情', '創造性', '善於交際', '精力充沛', '獨立'] },
    challenges: { en: ['Poor practical skills', 'Find it difficult to focus', 'Overthink things', 'Get stressed easily'], zh: ['實際技能差', '很難專注', '過度思考', '容易有壓力'] },
    careers: { en: ['Journalist', 'Actor', 'Counselor', 'Social worker', 'Politician'], zh: ['記者', '演員', '諮詢師', '社會工作者', '政治家'] },
    relationships: { en: 'ENFPs are enthusiastic partners who bring energy and creativity to their relationships.', zh: 'ENFP是熱情的伴侶，為關係帶來活力和創造力。' },
    percentage: 8.1
  },

  // Sensor types
  'ISTJ': {
    name: { en: 'The Logistician', zh: '物流師' },
    shortDescription: { en: 'Practical and fact-minded, reliable and responsible.', zh: '實用和注重事實，可靠和負責任。' },
    traits: {
      en: [
        { title: 'Methodical Approach', description: 'ISTJs prefer systematic, organized ways of working.' },
        { title: 'Reliability', description: 'They consistently follow through on commitments and obligations.' },
        { title: 'Practical Focus', description: 'ISTJs value real-world applications over theoretical concepts.' },
        { title: 'Traditional Values', description: 'They respect established systems and proven methods.' }
      ],
      zh: [
        { title: '有條理的方法', description: 'ISTJ喜歡系統化、有組織的工作方式。' },
        { title: '可靠性', description: '他們始終如一地履行承諾和義務。' },
        { title: '實用焦點', description: 'ISTJ重視現實世界的應用勝過理論概念。' },
        { title: '傳統價值觀', description: '他們尊重既定系統和經過驗證的方法。' }
      ]
    },
    summary: {
      en: 'ISTJs are dependable individuals who value tradition, order, and practical solutions.',
      zh: 'ISTJ是可靠的個體，重視傳統、秩序和實用解決方案。'
    },
    quotes: {
      en: ['"Duty comes first."', '"I prefer proven methods."'],
      zh: ['"責任第一。"', '"我更喜歡經過驗證的方法。"']
    },
    strengths: { en: ['Honest and direct', 'Strong-willed and dutiful', 'Very responsible', 'Calm and practical'], zh: ['誠實直接', '意志堅強和盡職', '非常負責', '冷靜實用'] },
    challenges: { en: ['Stubborn', 'Insensitive', 'Always by the book', 'Judgmental'], zh: ['固執', '不敏感', '總是按規矩辦事', '判斷性'] },
    careers: { en: ['Military officer', 'Lawyer', 'Judge', 'Police officer', 'Accountant'], zh: ['軍官', '律師', '法官', '警察', '會計師'] },
    relationships: { en: 'ISTJs are reliable, committed partners who value stability and traditional values.', zh: 'ISTJ是可靠、忠誠的伴侶，重視穩定和傳統價值觀。' },
    percentage: 11.6
  },

  'ISFJ': {
    name: { en: 'The Protector', zh: '保護者' },
    shortDescription: { en: 'Warm-hearted and dedicated, always ready to protect loved ones.', zh: '熱心和專注，總是準備保護所愛的人。' },
    traits: {
      en: [
        { title: 'Nurturing Care', description: 'ISFJs naturally care for and support others\' well-being.' },
        { title: 'Loyal Dedication', description: 'They are deeply committed to their relationships and responsibilities.' },
        { title: 'Practical Service', description: 'ISFJs prefer to help others through concrete, practical actions.' },
        { title: 'Harmonious Environment', description: 'They work to maintain peace and stability in their surroundings.' }
      ],
      zh: [
        { title: '養育關懷', description: 'ISFJ自然地關心和支持他人的福祉。' },
        { title: '忠誠奉獻', description: '他們深深致力於關係和責任。' },
        { title: '實用服務', description: 'ISFJ更喜歡通過具體、實用的行動幫助他人。' },
        { title: '和諧環境', description: '他們努力在周圍環境中維持和平與穩定。' }
      ]
    },
    summary: {
      en: 'ISFJs are caring protectors who dedicate themselves to helping and supporting others.',
      zh: 'ISFJ是關懷的保護者，致力於幫助和支持他人。'
    },
    quotes: {
      en: ['"I want to help others feel secure."', '"Harmony is important to me."'],
      zh: ['"我想幫助他人感到安全。"', '"和諧對我很重要。"']
    },
    strengths: { en: ['Supportive', 'Reliable and patient', 'Imaginative and observant', 'Enthusiastic', 'Loyal and hard-working'], zh: ['支持性', '可靠和耐心', '富有想像力和觀察力', '熱情', '忠誠和勤奮'] },
    challenges: { en: ['Humble and shy', 'Take things too personally', 'Repress their feelings', 'Overload themselves'], zh: ['謙虛和害羞', '把事情太個人化', '壓抑情感', '讓自己負擔過重'] },
    careers: { en: ['Social worker', 'Counselor', 'Teacher', 'Medical doctor', 'Nurse'], zh: ['社會工作者', '諮詢師', '教師', '醫生', '護士'] },
    relationships: { en: 'ISFJs are caring, devoted partners who prioritize their loved ones\' happiness and well-being.', zh: 'ISFJ是關懷、專注的伴侶，優先考慮所愛之人的幸福和福祉。' },
    percentage: 13.8
  },

  'ESTJ': {
    name: { en: 'The Executive', zh: '總經理' },
    shortDescription: { en: 'Excellent administrators, unsurpassed at managing things or people.', zh: '優秀的管理者，在管理事物或人員方面無與倫比。' },
    traits: {
      en: [
        { title: 'Natural Organization', description: 'ESTJs excel at creating and maintaining efficient systems.' },
        { title: 'Direct Leadership', description: 'They lead with confidence and clear communication.' },
        { title: 'Results-Oriented', description: 'ESTJs focus on achieving concrete, measurable outcomes.' },
        { title: 'Traditional Approach', description: 'They value proven methods and established procedures.' }
      ],
      zh: [
        { title: '天然組織力', description: 'ESTJ擅長創建和維護高效系統。' },
        { title: '直接領導', description: '他們以自信和清晰的溝通進行領導。' },
        { title: '結果導向', description: 'ESTJ專注於實現具體、可衡量的結果。' },
        { title: '傳統方法', description: '他們重視經過驗證的方法和既定程序。' }
      ]
    },
    summary: {
      en: 'ESTJs are natural organizers and leaders who excel at managing people and processes.',
      zh: 'ESTJ是天然的組織者和領導者，擅長管理人員和流程。'
    },
    quotes: {
      en: ['"Let\'s get this done efficiently."', '"I believe in proven systems."'],
      zh: ['"讓我們高效地完成這項工作。"', '"我相信經過驗證的系統。"']
    },
    strengths: { en: ['Dedicated', 'Strong-willed', 'Direct and honest', 'Loyal, patient and reliable'], zh: ['專注', '意志堅強', '直接誠實', '忠誠、耐心和可靠'] },
    challenges: { en: ['Inflexible and stubborn', 'Uncomfortable with unconventional situations', 'Judgmental', 'Too focused on social status'], zh: ['不靈活和固執', '對非傳統情況感到不舒服', '判斷性', '過於關注社會地位'] },
    careers: { en: ['Judge', 'Lawyer', 'Business executive', 'Police officer', 'Finance manager'], zh: ['法官', '律師', '企業高管', '警察', '財務經理'] },
    relationships: { en: 'ESTJs are dependable partners who value tradition and work hard to provide stability.', zh: 'ESTJ是可靠的伴侶，重視傳統並努力提供穩定性。' },
    percentage: 8.7
  },

  'ESFJ': {
    name: { en: 'The Consul', zh: '執政官' },
    shortDescription: { en: 'Extraordinarily caring, social and popular people, always eager to help.', zh: '非常關懷、社交和受歡迎的人，總是渴望幫助他人。' },
    traits: {
      en: [
        { title: 'Social Harmony', description: 'ESFJs work to maintain positive relationships and group cohesion.' },
        { title: 'Practical Support', description: 'They help others through concrete actions and emotional support.' },
        { title: 'Community Focus', description: 'ESFJs are deeply involved in their communities and social groups.' },
        { title: 'Traditional Values', description: 'They respect and uphold established social norms and customs.' }
      ],
      zh: [
        { title: '社會和諧', description: 'ESFJ努力維持積極的關係和群體凝聚力。' },
        { title: '實用支持', description: '他們通過具體行動和情感支持幫助他人。' },
        { title: '社區焦點', description: 'ESFJ深度參與他們的社區和社會群體。' },
        { title: '傳統價值觀', description: '他們尊重和維護既定的社會規範和習俗。' }
      ]
    },
    summary: {
      en: 'ESFJs are caring individuals who dedicate themselves to helping others and maintaining social harmony.',
      zh: 'ESFJ是關懷的個體，致力於幫助他人並維持社會和諧。'
    },
    quotes: {
      en: ['"I want everyone to feel included."', '"Community matters to me."'],
      zh: ['"我希望每個人都感到被包容。"', '"社區對我很重要。"']
    },
    strengths: { en: ['Strong practical skills', 'Loyal', 'Sensitive and warm', 'Good at connecting with others'], zh: ['強大的實用技能', '忠誠', '敏感和溫暖', '善於與他人聯繫'] },
    challenges: { en: ['Worried about their social status', 'Inflexible', 'Reluctant to innovate', 'Vulnerable to criticism'], zh: ['擔心社會地位', '不靈活', '不願創新', '容易受到批評'] },
    careers: { en: ['Elementary teacher', 'Child care provider', 'Family physician', 'Nurse', 'Social worker'], zh: ['小學教師', '兒童保育提供者', '家庭醫生', '護士', '社會工作者'] },
    relationships: { en: 'ESFJs are warm, supportive partners who go above and beyond to make their loved ones happy.', zh: 'ESFJ是溫暖、支持的伴侶，竭盡全力讓所愛的人快樂。' },
    percentage: 12.3
  },

  'ISTP': {
    name: { en: 'The Virtuoso', zh: '鑑賞家' },
    shortDescription: { en: 'Bold and practical experimenters, masters of all kinds of tools.', zh: '大膽和實用的實驗者，各種工具的大師。' },
    traits: {
      en: [
        { title: 'Hands-On Learning', description: 'ISTPs learn best through direct experience and experimentation.' },
        { title: 'Practical Problem-Solving', description: 'They excel at finding efficient solutions to immediate problems.' },
        { title: 'Independent Nature', description: 'ISTPs value their freedom and prefer to work autonomously.' },
        { title: 'Crisis Management', description: 'They remain calm and effective under pressure.' }
      ],
      zh: [
        { title: '動手學習', description: 'ISTP通過直接經驗和實驗學習效果最佳。' },
        { title: '實用解決問題', description: '他們擅長為直接問題找到高效解決方案。' },
        { title: '獨立本質', description: 'ISTP重視自由，更喜歡自主工作。' },
        { title: '危機管理', description: '他們在壓力下保持冷靜和有效。' }
      ]
    },
    summary: {
      en: 'ISTPs are practical problem-solvers who excel at understanding how things work.',
      zh: 'ISTP是實用的問題解決者，擅長理解事物如何運作。'
    },
    quotes: {
      en: ['"Let me figure this out myself."', '"I learn by doing."'],
      zh: ['"讓我自己弄清楚這個。"', '"我通過實踐學習。"']
    },
    strengths: { en: ['Optimistic and energetic', 'Creative and practical', 'Spontaneous and rational', 'Great in a crisis'], zh: ['樂觀和精力充沛', '創造性和實用', '自發和理性', '在危機中表現出色'] },
    challenges: { en: ['Stubborn', 'Insensitive', 'Private and reserved', 'Easily bored'], zh: ['固執', '不敏感', '私人和保守', '容易感到無聊'] },
    careers: { en: ['Mechanic', 'Engineer', 'Graphic designer', 'Pilot', 'Chef'], zh: ['機械師', '工程師', '平面設計師', '飛行員', '廚師'] },
    relationships: { en: 'ISTPs are independent partners who value personal space and practical support.', zh: 'ISTP是獨立的伴侶，重視個人空間和實用支持。' },
    percentage: 5.4
  },

  'ISFP': {
    name: { en: 'The Adventurer', zh: '探險家' },
    shortDescription: { en: 'Flexible and charming artists, always ready to explore new possibilities.', zh: '靈活和迷人的藝術家，總是準備探索新的可能性。' },
    traits: {
      en: [
        { title: 'Artistic Sensitivity', description: 'ISFPs have a natural appreciation for beauty and artistic expression.' },
        { title: 'Flexible Adaptation', description: 'They adapt well to changing circumstances and new experiences.' },
        { title: 'Personal Values', description: 'ISFPs are guided by strong personal values and principles.' },
        { title: 'Gentle Approach', description: 'They prefer gentle, non-confrontational ways of interacting.' }
      ],
      zh: [
        { title: '藝術敏感性', description: 'ISFP對美和藝術表達有天然的欣賞能力。' },
        { title: '靈活適應', description: '他們很好地適應變化的環境和新體驗。' },
        { title: '個人價值觀', description: 'ISFP受強烈的個人價值觀和原則指導。' },
        { title: '溫和方法', description: '他們更喜歡溫和、非對抗性的互動方式。' }
      ]
    },
    summary: {
      en: 'ISFPs are gentle, artistic individuals who value personal expression and authentic living.',
      zh: 'ISFP是溫和、藝術性的個體，重視個人表達和真實生活。'
    },
    quotes: {
      en: ['"I express myself through my art."', '"I value personal freedom."'],
      zh: ['"我通過藝術表達自己。"', '"我重視個人自由。"']
    },
    strengths: { en: ['Charming', 'Sensitive to others', 'Imaginative', 'Passionate', 'Curious'], zh: ['迷人', '對他人敏感', '富有想像力', '熱情', '好奇'] },
    challenges: { en: ['Fiercely independent', 'Unpredictable', 'Easily stressed', 'Overly competitive'], zh: ['極度獨立', '不可預測', '容易有壓力', '過度競爭'] },
    careers: { en: ['Artist', 'Musician', 'Photographer', 'Psychologist', 'Social worker'], zh: ['藝術家', '音樂家', '攝影師', '心理學家', '社會工作者'] },
    relationships: { en: 'ISFPs are gentle, caring partners who value harmony and emotional connection.', zh: 'ISFP是溫和、關懷的伴侶，重視和諧和情感聯繫。' },
    percentage: 8.8
  },

  'ESTP': {
    name: { en: 'The Entrepreneur', zh: '企業家' },
    shortDescription: { en: 'Smart, energetic and perceptive people, truly enjoy living on the edge.', zh: '聰明、精力充沛和敏銳的人，真正享受在邊緣生活。' },
    traits: {
      en: [
        { title: 'Action-Oriented', description: 'ESTPs prefer to learn through action and real-world experience.' },
        { title: 'Social Energy', description: 'They thrive in social situations and enjoy being around people.' },
        { title: 'Adaptable Response', description: 'ESTPs can quickly adapt to changing situations and opportunities.' },
        { title: 'Present Focus', description: 'They focus on immediate realities rather than future possibilities.' }
      ],
      zh: [
        { title: '行動導向', description: 'ESTP更喜歡通過行動和現實世界經驗學習。' },
        { title: '社交能量', description: '他們在社交場合中茁壯成長，喜歡與人在一起。' },
        { title: '適應性回應', description: 'ESTP能夠快速適應變化的情況和機會。' },
        { title: '當下焦點', description: '他們專注於直接現實而不是未來可能性。' }
      ]
    },
    summary: {
      en: 'ESTPs are energetic, action-oriented individuals who excel in dynamic environments.',
      zh: 'ESTP是精力充沛、行動導向的個體，在動態環境中表現出色。'
    },
    quotes: {
      en: ['"Let\'s make it happen!"', '"I live in the moment."'],
      zh: ['"讓我們實現它！"', '"我活在當下。"']
    },
    strengths: { en: ['Tolerant', 'Energetic', 'Very perceptive', 'Excellent people skills'], zh: ['寬容', '精力充沛', '非常敏銳', '優秀的人際技能'] },
    challenges: { en: ['Insensitive', 'Impatient', 'Risk-prone', 'Unstructured'], zh: ['不敏感', '不耐煩', '容易冒險', '無結構'] },
    careers: { en: ['Sales representative', 'Marketing manager', 'Police officer', 'Coach', 'Entrepreneur'], zh: ['銷售代表', '營銷經理', '警察', '教練', '企業家'] },
    relationships: { en: 'ESTPs are fun-loving partners who bring excitement and spontaneity to relationships.', zh: 'ESTP是愛好樂趣的伴侶，為關係帶來興奮和自發性。' },
    percentage: 4.3
  },

  'ESFP': {
    name: { en: 'The Entertainer', zh: '演員' },
    shortDescription: { en: 'Spontaneous, energetic and enthusiastic people - life is never boring.', zh: '自發、精力充沛和熱情的人 - 生活永遠不會無聊。' },
    traits: {
      en: [
        { title: 'Enthusiastic Energy', description: 'ESFPs bring excitement and positive energy to every situation.' },
        { title: 'People-Centered', description: 'They genuinely care about others and seek to make them happy.' },
        { title: 'Spontaneous Nature', description: 'ESFPs embrace spontaneity and enjoy new experiences.' },
        { title: 'Aesthetic Appreciation', description: 'They have a natural eye for beauty and style.' }
      ],
      zh: [
        { title: '熱情能量', description: 'ESFP為每種情況帶來興奮和積極能量。' },
        { title: '以人為中心', description: '他們真誠關心他人並尋求讓他們快樂。' },
        { title: '自發本質', description: 'ESFP擁抱自發性並享受新體驗。' },
        { title: '美學欣賞', description: '他們對美和風格有天然的眼光。' }
      ]
    },
    summary: {
      en: 'ESFPs are enthusiastic entertainers who bring joy and excitement to the lives of others.',
      zh: 'ESFP是熱情的演員，為他人的生活帶來歡樂和興奮。'
    },
    quotes: {
      en: ['"Let\'s have fun!"', '"I want to make everyone smile."'],
      zh: ['"讓我們玩得開心！"', '"我想讓每個人都微笑。"']
    },
    strengths: { en: ['Bold', 'Original', 'Aesthetics and showcase', 'Practical', 'Observant'], zh: ['大膽', '原創', '美學和展示', '實用', '觀察力強'] },
    challenges: { en: ['Sensitive', 'Conflict-averse', 'Easily bored', 'Poor long-term planners'], zh: ['敏感', '避免衝突', '容易感到無聊', '長期規劃能力差'] },
    careers: { en: ['Artist', 'Entertainer', 'Social worker', 'Counselor', 'Event coordinator'], zh: ['藝術家', '演員', '社會工作者', '諮詢師', '活動協調員'] },
    relationships: { en: 'ESFPs are enthusiastic partners who bring joy and spontaneity to their relationships.', zh: 'ESFP是熱情的伴侶，為關係帶來歡樂和自發性。' },
    percentage: 8.5
  }
};

export default mbtiTypesData; 
