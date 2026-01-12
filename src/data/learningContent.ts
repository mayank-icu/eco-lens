export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number; // index of the correct option
}

export interface Lesson {
    id: string;
    title: string;
    duration: string;
    icon: string;
    color: string;
    category: 'Lesson' | 'Article' | 'Topic' | 'Guide';
    content: string;
    sections?: { title: string; content: string }[];
    quiz?: QuizQuestion[];
    relatedIds?: string[];
}

// Softer, premium colors
const COLORS = {
    sage: '#8FB996',
    mint: '#A2E3C4',
    sky: '#95D5E8',
    lavender: '#BFA6D9',
    peach: '#FFCBA4',
    coral: '#FFB7B2',
    sand: '#E6D5B8',
    teal: '#88CDC4'
};

export const featuredLessons: Lesson[] = [
    {
        id: '1',
        title: 'Understanding Recycling Symbols',
        duration: '5 min',
        icon: 'recycle',
        color: COLORS.sage,
        category: 'Lesson',
        content: 'Recycling symbols can be confusing. This guide breaks down the most common symbols you\'ll see on packaging.',
        sections: [
            {
                title: 'The Mobius Loop',
                content: 'The universal recycling symbol, known as the Mobius Loop, indicates that an item is capable of being recycled. However, it does not guarantee that your local recycling center accepts it. Always check local guidelines.'
            },
            {
                title: 'Plastic Resin Codes',
                content: 'Inside the triangle, you often see a number from 1 to 7. This identifies the type of plastic resin used. \n\n#1 PET (Polyethylene Terephthalate): Widely recycled (water bottles).\n#2 HDPE (High-Density Polyethylene): Widely recycled (milk jugs).\n#3 PVC (Polyvinyl Chloride): Difficult to recycle.\n#4 LDPE (Low-Density Polyethylene): Sometimes recycled (grocery bags).\n#5 PP (Polypropylene): Increasingly recycled (yogurt cups).\n#6 PS (Polystyrene): Difficult to recycle (styrofoam).\n#7 Other: Miscellaneous plastics.'
            },
            {
                title: 'Green Dot',
                content: 'The Green Dot symbol (two intertwining arrows) does NOT mean the item is recyclable. It signifies that the manufacturer has made a financial contribution to a national packaging recovery organization.'
            }
        ],
        quiz: [
            { question: "What does the Mobius Loop symbol guarantee?", options: ["Made of recycled material", "Capable of being recycled", "Accepted locally", "Biodegradable"], correctAnswer: 1 },
            { question: "Which plastic type is commonly used for water bottles?", options: ["#1 PET", "#3 PVC", "#6 PS", "#7 Other"], correctAnswer: 0 },
            { question: "Does the Green Dot symbol mean an item is recyclable?", options: ["Yes, always", "No, it means financial contribution", "Only in Europe", "Only for plastics"], correctAnswer: 1 },
            { question: "What is plastic type #2?", options: ["PET", "HDPE", "PVC", "LDPE"], correctAnswer: 1 },
            { question: "Which plastic is used for styrofoam?", options: ["#1", "#5", "#6", "#3"], correctAnswer: 2 },
            { question: "Is the Mobius Loop a guarantee of acceptance?", options: ["Yes", "No"], correctAnswer: 1 },
            { question: "What does #5 stand for?", options: ["Polystyrene", "Polypropylene", "Polyester", "Polyvinyl"], correctAnswer: 1 },
            { question: "Which symbol has a number inside a triangle?", options: ["Green Dot", "Resin Identification Code", "Tidyman", "Mobius Loop"], correctAnswer: 1 },
            { question: "What is #3 plastic?", options: ["PVC", "PET", "HDPE", "PP"], correctAnswer: 0 },
            { question: "Check local guidelines because:", options: ["Symbols are always right", "Acceptance varies by location", "It's fun", "No reason"], correctAnswer: 1 }
        ],
        relatedIds: ['2', '4']
    },
    {
        id: '2',
        title: 'Complete Plastic Types Guide',
        duration: '8 min',
        icon: 'flask',
        color: COLORS.mint,
        category: 'Lesson',
        content: 'A deep dive into the 7 types of plastic, their properties, and their environmental impact.',
        sections: [
            {
                title: 'Why it Matters',
                content: 'Not all plastics are created equal. Mixing different types of plastics can contaminate the recycling stream, making the entire batch unusable. Understanding these types helps you sort correctly.'
            },
            {
                title: 'Type 1: PETE',
                content: 'Clear, strong, and lightweight plastic used for food and beverage packaging. It is fully recyclable and can be turned into fiber for carpet, fleece jackets, or new containers.'
            },
            {
                title: 'Type 2: HDPE',
                content: 'Stiffer plastic used for milk jugs, detergent bottles, and some toys. It is very durable and does not break down under exposure to sunlight or freezing or heating.'
            },
            {
                title: 'The Problematic Plastics',
                content: 'Types 3 (PVC), 6 (PS), and 7 (Other) are often not accepted in curbside programs because they are expensive or difficult to process. Reducing consumption of these types is the best strategy.'
            }
        ],
        quiz: [
            { question: "Why shouldn't you mix different plastic types?", options: ["It looks messy", "It contaminates the recycling stream", "It makes the bin too heavy", "It is illegal"], correctAnswer: 1 },
            { question: "Which plastic type is used for milk jugs?", options: ["PETE", "HDPE", "PVC", "LDPE"], correctAnswer: 1 },
            { question: "Which types are often NOT accepted curbside?", options: ["1 and 2", "2 and 5", "3, 6, and 7", "All plastics are accepted"], correctAnswer: 2 },
            { question: "What is Type 1 plastic?", options: ["HDPE", "PETE", "PVC", "PP"], correctAnswer: 1 },
            { question: "Which plastic is clear and lightweight?", options: ["Type 1", "Type 3", "Type 5", "Type 7"], correctAnswer: 0 },
            { question: "Type 2 plastic is known for being:", options: ["Flexible", "Stiff and durable", "Brittle", "Transparent"], correctAnswer: 1 },
            { question: "What can recycled PETE become?", options: ["New bottles or fiber", "Fuel", "Glass", "Metal"], correctAnswer: 0 },
            { question: "Why is PVC problematic?", options: ["It's too heavy", "It's expensive/difficult to process", "It smells", "It's rare"], correctAnswer: 1 },
            { question: "What is the best strategy for problematic plastics?", options: ["Burn them", "Reduce consumption", "Hide them", "Paint them"], correctAnswer: 1 },
            { question: "Contamination makes the batch:", options: ["Better", "Unusable", "Heavier", "Cleaner"], correctAnswer: 1 }
        ],
        relatedIds: ['1', 'a2']
    },
    {
        id: '3',
        title: 'Ocean Plastic Pollution',
        duration: '6 min',
        icon: 'water',
        color: COLORS.sky,
        category: 'Lesson',
        content: 'How plastic ends up in our oceans and what we can do to stop it.',
        sections: [
            {
                title: 'The Scale of the Problem',
                content: 'Every year, 8 million metric tons of plastic enter our ocean on top of the estimated 150 million metric tons that currently circulate our marine environments.'
            },
            {
                title: 'Microplastics',
                content: 'Large plastics degrade into smaller fragments called microplastics. These are ingested by marine life, entering the food chain and eventually reaching humans.'
            },
            {
                title: 'The Great Pacific Garbage Patch',
                content: 'A massive accumulation of floating debris in the North Pacific Ocean, covering an area twice the size of Texas. It is mostly composed of microplastics.'
            }
        ],
        quiz: [
            { question: "How much plastic enters the ocean annually?", options: ["1 million tons", "8 million metric tons", "500,000 tons", "100 tons"], correctAnswer: 1 },
            { question: "What are microplastics?", options: ["Small toys", "Tiny fragments of degraded plastic", "Bacteria", "Sand"], correctAnswer: 1 },
            { question: "Where is the Great Pacific Garbage Patch?", options: ["Atlantic", "Indian", "North Pacific", "Arctic"], correctAnswer: 2 },
            { question: "How big is the Garbage Patch?", options: ["Size of Texas", "Twice the size of Texas", "Size of NYC", "Size of a pool"], correctAnswer: 1 },
            { question: "Who ingests microplastics?", options: ["Only fish", "Marine life", "Rocks", "Plants"], correctAnswer: 1 },
            { question: "Do microplastics reach humans?", options: ["No", "Yes, via food chain", "Only if you swim", "Impossible"], correctAnswer: 1 },
            { question: "What is the patch mostly made of?", options: ["Bottles", "Microplastics", "Nets", "Boats"], correctAnswer: 1 },
            { question: "How much plastic is already in the ocean?", options: ["150 million tons", "1 million tons", "None", "10 tons"], correctAnswer: 0 },
            { question: "What causes plastics to degrade?", options: ["Sunlight/Waves", "Fish", "Salt", "Magic"], correctAnswer: 0 },
            { question: "Can we stop it?", options: ["No", "Yes, by reducing waste", "Maybe", "It's natural"], correctAnswer: 1 }
        ],
        relatedIds: ['4', 'a3']
    },
    {
        id: '4',
        title: 'Reduce, Reuse, Recycle',
        duration: '4 min',
        icon: 'leaf',
        color: COLORS.lavender,
        category: 'Lesson',
        content: 'The 3 Rs of waste management: a hierarchy for a sustainable lifestyle.',
        sections: [
            {
                title: 'Reduce',
                content: 'The most effective way to reduce waste is to not create it in the first place. Buy less, choose products with less packaging, and avoid single-use items.'
            },
            {
                title: 'Reuse',
                content: 'Find new ways to use things that otherwise would have been thrown out. Use reusable bags, bottles, and containers. Repair broken items instead of replacing them.'
            },
            {
                title: 'Recycle',
                content: 'The last resort. Turn materials that would otherwise become waste into valuable resources. Recycling saves energy, reduces greenhouse gas emissions, and conserves natural resources.'
            }
        ],
        quiz: [
            { question: "Which of the 3 Rs is most effective?", options: ["Recycle", "Reuse", "Reduce", "Equal"], correctAnswer: 2 },
            { question: "What is an example of Reuse?", options: ["New phone", "Reusable bottle", "Trash", "Burning"], correctAnswer: 1 },
            { question: "Recycling should be:", options: ["First step", "Only step", "Last resort", "Ignored"], correctAnswer: 2 },
            { question: "What does Reduce mean?", options: ["Buy less", "Buy more", "Recycle more", "Sleep more"], correctAnswer: 0 },
            { question: "Repairing items is part of:", options: ["Reduce", "Reuse", "Recycle", "Rot"], correctAnswer: 1 },
            { question: "Recycling saves:", options: ["Money only", "Energy and resources", "Time", "Nothing"], correctAnswer: 1 },
            { question: "Single-use items should be:", options: ["Avoided", "Collected", "Hoarded", "Loved"], correctAnswer: 0 },
            { question: "What is the hierarchy?", options: ["Recycle, Reuse, Reduce", "Reduce, Reuse, Recycle", "Reuse, Reduce, Recycle", "Random"], correctAnswer: 1 },
            { question: "Buying in bulk helps:", options: ["Reduce packaging", "Increase waste", "Spend more", "None"], correctAnswer: 0 },
            { question: "Is recycling the solution to everything?", options: ["Yes", "No, it's part of a system", "Maybe", "I don't know"], correctAnswer: 1 }
        ],
        relatedIds: ['1', 'a1']
    }
];

export const exploreTopics = [
    { id: '1', title: 'Environment', icon: 'earth', color: COLORS.sage, description: 'Learn about the natural world and our impact on it.' },
    { id: '2', title: 'Recycling', icon: 'recycle', color: COLORS.mint, description: 'Master the art of sorting and processing waste.' },
    { id: '3', title: 'Ocean Life', icon: 'water', color: COLORS.sky, description: 'Discover the marine ecosystems threatened by pollution.' },
    { id: '4', title: 'Sustainability', icon: 'leaf', color: COLORS.lavender, description: 'Practices that meet our needs without compromising future generations.' },
];

export const trendingArticles: Lesson[] = [
    {
        id: 'a1',
        title: 'How to Reduce Plastic Waste at Home',
        duration: '3 min',
        icon: 'home',
        color: COLORS.peach,
        category: 'Article',
        content: 'Practical tips for a plastic-free household.',
        sections: [
            {
                title: 'Kitchen Swaps',
                content: '1. Replace plastic wrap with beeswax wraps.\n2. Use glass jars for storage.\n3. Switch to a bamboo dish brush.\n4. Buy in bulk to reduce packaging.'
            },
            {
                title: 'Bathroom Swaps',
                content: '1. Use bar soap and shampoo bars.\n2. Switch to a bamboo toothbrush.\n3. Try a safety razor instead of disposable ones.'
            },
            {
                title: 'On the Go',
                content: 'Always carry a reusable water bottle, coffee cup, and shopping bag. Say no to plastic straws and cutlery.'
            }
        ],
        quiz: [
            { question: "Alternative to plastic wrap?", options: ["Foil", "Beeswax wraps", "Paper", "None"], correctAnswer: 1 },
            { question: "Replace liquid shampoo with:", options: ["Shampoo bars", "Water", "Soap", "Air"], correctAnswer: 0 },
            { question: "Carry this to avoid waste:", options: ["Reusable bottle", "Cash", "Bag", "Nothing"], correctAnswer: 0 },
            { question: "For storage use:", options: ["Glass jars", "Plastic bags", "Paper", "Hands"], correctAnswer: 0 },
            { question: "Bamboo is better for:", options: ["Toothbrushes", "Cars", "Phones", "Computers"], correctAnswer: 0 },
            { question: "Safety razors replace:", options: ["Disposable ones", "Electric ones", "Scissors", "Knives"], correctAnswer: 0 },
            { question: "Say no to:", options: ["Plastic straws", "Water", "Food", "Air"], correctAnswer: 0 },
            { question: "Buying in bulk:", options: ["Reduces packaging", "Increases cost", "Is harder", "Is bad"], correctAnswer: 0 },
            { question: "Dish brush alternative:", options: ["Bamboo", "Plastic", "Steel", "Iron"], correctAnswer: 0 },
            { question: "Is it easy?", options: ["Yes, with small steps", "No", "Maybe", "Impossible"], correctAnswer: 0 }
        ],
        relatedIds: ['4', 'a2']
    },
    {
        id: 'a2',
        title: 'The Journey of a Plastic Bottle',
        duration: '5 min',
        icon: 'map',
        color: COLORS.sky,
        category: 'Article',
        content: 'Follow the lifecycle of a plastic bottle from production to recycling.',
        sections: [
            {
                title: 'Extraction & Production',
                content: 'Oil and gas are extracted from the earth and processed into plastic pellets. These pellets are melted and molded into bottles.'
            },
            {
                title: 'Consumption',
                content: 'The bottle is filled, shipped, sold, and consumed. This phase is often very short, sometimes lasting only minutes.'
            },
            {
                title: 'Disposal',
                content: 'If thrown in the trash, it ends up in a landfill or the environment, taking 450 years to decompose. If recycled, it is shredded, melted, and spun into new fibers.'
            }
        ],
        quiz: [
            { question: "Raw materials for plastic?", options: ["Wood", "Oil and gas", "Sand", "Cotton"], correctAnswer: 1 },
            { question: "Decomposition time?", options: ["10 yrs", "50 yrs", "100 yrs", "450 yrs"], correctAnswer: 3 },
            { question: "Recycled bottle becomes?", options: ["Burned", "Buried", "New fibers", "Gas"], correctAnswer: 2 },
            { question: "First phase?", options: ["Extraction", "Disposal", "Consumption", "Sales"], correctAnswer: 0 },
            { question: "Consumption phase is:", options: ["Long", "Short", "Forever", "Never"], correctAnswer: 1 },
            { question: "Plastic pellets are:", options: ["Melted", "Frozen", "Eaten", "Buried"], correctAnswer: 0 },
            { question: "Landfill impact?", options: ["Good", "Bad/Long lasting", "Neutral", "Great"], correctAnswer: 1 },
            { question: "Can it be recycled?", options: ["Yes", "No", "Maybe", "Sometimes"], correctAnswer: 0 },
            { question: "What are fibers used for?", options: ["Clothing/Carpets", "Food", "Fuel", "Roads"], correctAnswer: 0 },
            { question: "Best disposal method?", options: ["Recycle", "Trash", "Litter", "Burn"], correctAnswer: 0 }
        ],
        relatedIds: ['2', 'a3']
    },
    {
        id: 'a3',
        title: 'Innovative Recycling Technologies',
        duration: '4 min',
        icon: 'rocket',
        color: COLORS.lavender,
        category: 'Article',
        content: 'New technologies are changing how we process waste.',
        sections: [
            {
                title: 'Chemical Recycling',
                content: 'Unlike mechanical recycling, which degrades plastic quality, chemical recycling breaks plastics down into their original monomers, allowing them to be recycled infinitely.'
            },
            {
                title: 'AI Sorting',
                content: 'Advanced robots with computer vision (like PlastiSort!) can sort waste faster and more accurately than humans, increasing recycling rates.'
            },
            {
                title: 'Bioplastics',
                content: 'Scientists are developing plastics made from plants, algae, and bacteria that are fully biodegradable and compostable.'
            }
        ],
        quiz: [
            { question: "Benefit of chemical recycling?", options: ["Cheaper", "Infinite recycling", "Less energy", "Faster"], correctAnswer: 1 },
            { question: "AI helps by:", options: ["Melting", "Sorting accurately", "Collecting", "Designing"], correctAnswer: 1 },
            { question: "Bioplastics source?", options: ["Oil", "Plants/Algae", "Metal", "Glass"], correctAnswer: 1 },
            { question: "Mechanical recycling:", options: ["Degrades quality", "Improves quality", "Is perfect", "Is new"], correctAnswer: 0 },
            { question: "Monomers are:", options: ["Building blocks", "Waste", "Fuel", "Food"], correctAnswer: 0 },
            { question: "PlastiSort uses:", options: ["AI/Computer Vision", "Magic", "Water", "Fire"], correctAnswer: 0 },
            { question: "Biodegradable means:", options: ["Breaks down naturally", "Lasts forever", "Is toxic", "Is metal"], correctAnswer: 0 },
            { question: "Can robots sort?", options: ["Yes", "No", "Maybe", "Only metal"], correctAnswer: 0 },
            { question: "Is innovation important?", options: ["Yes", "No", "Maybe", "I don't know"], correctAnswer: 0 },
            { question: "Future of recycling?", options: ["Bright", "Dark", "Same", "None"], correctAnswer: 0 }
        ],
        relatedIds: ['3', 'a2']
    }
];

export const plasticTypes = [
    {
        id: 'PET',
        name: 'PET (PETE)',
        number: '1',
        recyclable: true,
        description: 'Polyethylene Terephthalate',
        examples: 'Water bottles, soda bottles',
        info: 'Most commonly recycled plastic. Clear and lightweight.',
    },
    {
        id: 'HDPE',
        name: 'HDPE',
        number: '2',
        recyclable: true,
        description: 'High-Density Polyethylene',
        examples: 'Milk jugs, shampoo bottles',
        info: 'Very recyclable. Durable and chemical-resistant.',
    },
    {
        id: 'PVC',
        name: 'PVC',
        number: '3',
        recyclable: false,
        description: 'Polyvinyl Chloride',
        examples: 'Pipes, window frames',
        info: 'Rarely recycled. Contains harmful chemicals.',
    },
    {
        id: 'LDPE',
        name: 'LDPE',
        number: '4',
        recyclable: false,
        description: 'Low-Density Polyethylene',
        examples: 'Plastic bags, food wraps',
        info: 'Not commonly recycled. Flexible and soft.',
    },
    {
        id: 'PP',
        name: 'PP',
        number: '5',
        recyclable: true,
        description: 'Polypropylene',
        examples: 'Yogurt containers, bottle caps',
        info: 'Recyclable in many areas. Heat-resistant.',
    },
    {
        id: 'PS',
        name: 'PS',
        number: '6',
        recyclable: false,
        description: 'Polystyrene',
        examples: 'Styrofoam cups, egg cartons',
        info: 'Difficult to recycle. Often ends up in landfills.',
    },
];
