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

export type Playbook = {
    id: string;
    label: string;
    tagline: string;
    description: string;
    actions: Record<Action, number>;
};

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

export type ActionRating = {
    id: Action;
    attribute: string;
    label: string;
    description: string;
};