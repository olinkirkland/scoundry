export type Trait = {
    id: string;
    category: string;
    image?: string;
    color?: string;
};

export type TraitDetail = {
    id: string;
    trait: string;
    suggestedActions: string[];
};

export type Address = {
    id: string;
    trait?: string | string[];
    label: string;
    name: string;
    description?: string;
    district: string;
};