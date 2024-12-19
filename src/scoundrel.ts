export type Scoundrel = {
    id: string;
    playbook: string;
    name: string;
    portrait: string;
    heritage: string;
    heritageDetail: string;
    background: string;
    backgroundDetail: string;
    lookAndStyle: string;
    abilities: string[];
    friends: string[];
    rivals: string[];
    actions: {
        hunt: Record<string, number>;
        study: Record<string, number>;
        survey: Record<string, number>;
        tinker: Record<string, number>;
        finesse: Record<string, number>;
        prowl: Record<string, number>;
        skirmish: Record<string, number>;
        wreck: Record<string, number>;
        attune: Record<string, number>;
        command: Record<string, number>;
        consort: Record<string, number>;
        sway: Record<string, number>;
    };
    vice: string;
    viceDetail: string;
    hullOnly?: {
        frame: string;
        functions: string[];
    };
    vampireOnly?: {
        strictures: string[];
    };
};
