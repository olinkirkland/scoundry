export type Action = 'hunt' | 'study' | 'survey' | 'tinker' | 'finesse' | 'prowl' | 'skirmish' | 'wreck' | 'attune' | 'command' | 'consort' | 'sway';

export type Playbook = {
    name: string;
    slug: string;
    tagline: string;
    description: string;
    actions: Record<Action, number>;
};

export type Background = {
    name: string;
    slug: string;
    description: string;
}

export type SpecificBackground = {
    category: string;
    name: string;
    description: string;
    actions: Record<Action, number>;
}