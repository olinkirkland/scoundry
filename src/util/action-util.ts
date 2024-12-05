const actionLabels: Record<string, string> = {
    hunt: 'Hunt',
    study: 'Study',
    survey: 'Survey',
    tinker: 'Tinker',
    finesse: 'Finesse',
    prowl: 'Prowl',
    skirmish: 'Skirmish',
    wreck: 'Wreck',
    attune: 'Attune',
    command: 'Command',
    consort: 'Consort',
    sway: 'Sway',
};
export function getActionLabelBySlug(slug: string): string {
    return actionLabels[slug] || slug;
}

const insightColor = '#e9417c';
const prowessColor = '#f03e3e';
const resolveColor = '#7950f2';

const actionColors: Record<string, string> = {
    hunt: insightColor,
    study: insightColor,
    survey: insightColor,
    tinker: insightColor,
    finesse: prowessColor,
    prowl: prowessColor,
    skirmish: prowessColor,
    wreck: prowessColor,
    attune: resolveColor,
    command: resolveColor,
    consort: resolveColor,
    sway: resolveColor,
};

export function getActionColorBySlug(slug: string): string {
    return actionColors[slug] || '#ffffff';
}