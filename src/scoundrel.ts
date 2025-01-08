export type Scoundrel = {
    id: string;
    language: string; // en, es, de
    preferredInkColor: string;
    preferredSheetType: string;
    preferredFont: string;
    playbook: string;
    name?: string;
    alias?: string;
    look?: string;
    portrait: string;
    heritage: string;
    heritageDetail: string;
    background: string;
    backgroundDetail: string;
    abilities: string[];
    friends: string[];
    rivals: string[];
    actions: {
        [key: string]: Record<string, number>;
        // hunt: Record<string, number>;
        // study: Record<string, number>;
        // survey: Record<string, number>;
        // tinker: Record<string, number>;
        // finesse: Record<string, number>;
        // prowl: Record<string, number>;
        // skirmish: Record<string, number>;
        // wreck: Record<string, number>;
        // attune: Record<string, number>;
        // command: Record<string, number>;
        // consort: Record<string, number>;
        // sway: Record<string, number>;
    };
    optionActionsCreatingCharacter: boolean;
    optionActionsMasteryAdvance: boolean;
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
