export type Trait = {
    id: string;
    category: string;
    image?: string;
    color?: string;
};

export type TraitDetail = {
    id: string;
    trait: string | string[];
    suggestedActions?: string[];
};
