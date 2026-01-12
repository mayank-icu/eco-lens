// Plastic types with examples and detailed information
export const PLASTIC_TYPES_DATA = {
    PET: {
        id: 'PET',
        name: 'PET',
        fullName: 'Polyethylene Terephthalate',
        binColor: 'green',
        recyclable: true,
        recyclingNumber: '1',
        examples: [
            'Water bottles',
            'Soda bottles',
            'Juice bottles',
            'Peanut butter jars',
            'Salad dressing bottles',
        ],
        characteristics: [
            'Clear or colored plastic',
            'Lightweight and strong',
            'Most commonly recycled',
        ],
        tips: 'Rinse before recycling. Remove caps and labels.',
    },
    HDPE: {
        id: 'HDPE',
        name: 'HDPE',
        fullName: 'High-Density Polyethylene',
        binColor: 'green',
        recyclable: true,
        recyclingNumber: '2',
        examples: [
            'Milk jugs',
            'Detergent bottles',
            'Shampoo bottles',
            'Yogurt containers',
            'Butter tubs',
        ],
        characteristics: [
            'Usually opaque',
            'Stiff and durable',
            'Resistant to chemicals',
        ],
        tips: 'Clean thoroughly before recycling.',
    },
    PVC: {
        id: 'PVC',
        name: 'PVC',
        fullName: 'Polyvinyl Chloride',
        binColor: 'red',
        recyclable: false,
        recyclingNumber: '3',
        examples: [
            'Plumbing pipes',
            'Window frames',
            'Credit cards',
            'Some cling wraps',
            'Vinyl flooring',
        ],
        characteristics: [
            'Can be rigid or flexible',
            'Contains harmful chemicals',
            'Difficult to recycle',
        ],
        tips: 'Avoid when possible. Look for alternatives.',
    },
    LDPE: {
        id: 'LDPE',
        name: 'LDPE',
        fullName: 'Low-Density Polyethylene',
        binColor: 'red',
        recyclable: false,
        recyclingNumber: '4',
        examples: [
            'Plastic bags',
            'Bread bags',
            'Frozen food bags',
            'Squeezable bottles',
            'Bubble wrap',
        ],
        characteristics: [
            'Flexible and soft',
            'Resistant to moisture',
            'Not widely recycled',
        ],
        tips: 'Reuse bags when possible. Return to store collection bins.',
    },
    PP: {
        id: 'PP',
        name: 'PP',
        fullName: 'Polypropylene',
        binColor: 'green',
        recyclable: true,
        recyclingNumber: '5',
        examples: [
            'Yogurt containers',
            'Margarine tubs',
            'Bottle caps',
            'Straws',
            'Takeout containers',
        ],
        characteristics: [
            'Heat resistant',
            'Durable and flexible',
            'Increasingly recyclable',
        ],
        tips: 'Check local recycling guidelines.',
    },
    PS: {
        id: 'PS',
        name: 'PS',
        fullName: 'Polystyrene',
        binColor: 'red',
        recyclable: false,
        recyclingNumber: '6',
        examples: [
            'Foam cups',
            'Foam takeout containers',
            'Packing peanuts',
            'CD cases',
            'Disposable cutlery',
        ],
        characteristics: [
            'Lightweight and insulating',
            'Breaks easily',
            'Rarely recycled',
        ],
        tips: 'Avoid styrofoam. Use reusable alternatives.',
    },
};

// Helper function to get plastic type data
export const getPlasticTypeData = (plasticType: string) => {
    return PLASTIC_TYPES_DATA[plasticType as keyof typeof PLASTIC_TYPES_DATA] || null;
};
