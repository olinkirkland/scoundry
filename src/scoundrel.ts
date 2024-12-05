export type Scoundrel = {
    id: string,
    playbook: string,
    name: string,
    portrait: string,
    heritage: string,
    heritageSpecialization:string,
    background: string,
    backgroundSpecialization: string,
    lookAndStyle: string,
    abilities: string[],
    contactFriendly: string,
    contactUnfriendly: string,
    actions: {
        hunt: Record<string, number>,
        study: Record<string, number>,
        survey: Record<string, number>,
        tinker: Record<string, number>,
        finesse: Record<string, number>,
        prowl: Record<string, number>,
        skirmish: Record<string, number>,
        wreck: Record<string, number>,
        attune: Record<string, number>,
        command: Record<string, number>,
        consort: Record<string, number>,
        sway: Record<string, number>,
    },
    hullOnly?: {
        frame: string,
        functions: string[]
    },
    vampireOnly?: {
        strictures: string[],
    }
}
