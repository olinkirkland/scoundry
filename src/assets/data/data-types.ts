export type Action = 'hunt' | 'study' | 'survey' | 'tinker' | 'finesse' | 'prowl' | 'skirmish' | 'wreck' | 'attune' | 'command' | 'consort' | 'sway';

export type Playbook = {
    name: string;
    slug: string;
    tagline: string;
    description: string;
    actions: Record<Action, number>;
};