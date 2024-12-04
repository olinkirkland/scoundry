export type Scoundrel = {
    id: string,
    playbook: string,
    name: string,
    portrait: string,
    heritage: string,
    background: string,
    lookAndStyle: string,
    abilities: string[],
    contactFriendly: string,
    contactUnfriendly: string,
    actions: {
        // Insight
        hunt: number,
        study: number,
        survey: number,
        tinker: number,
        // Prowess
        finesse: number,
        prowl: number,
        skirmish: number,
        wreck: number,
        // Resolve
        attune: number,
        command: number,
        consort: number,
        sway: number
    },
    hullOnly?: {
        frame: string,
        functions: string[]
    },
    vampireOnly?: {
        strictures: string[],
    }
}
