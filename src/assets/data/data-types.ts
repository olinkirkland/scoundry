export type Action =
    | 'hunt'
    | 'study'
    | 'survey'
    | 'tinker'
    | 'finesse'
    | 'prowl'
    | 'skirmish'
    | 'wreck'
    | 'attune'
    | 'command'
    | 'consort'
    | 'sway';

export type Trait = {
    id: string;
    label: string;
    description: string;
    category: string;
    image?: string;
    color?: string;
};

export type TraitDetail = {
    id: string;
    trait: string;
    label: string;
    suggestedActions: Action[];
};

export type Address = {
    id: string;
    trait?: string | string[];
    label: string;
    name: string;
    description?: string;
    district: string;
};

export type ActionRating = {
    id: Action;
    attribute: string;
    label: string;
    description: string;
};
