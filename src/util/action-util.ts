import { Action } from '@/assets/data/data-types';
import { Scoundrel } from '@/scoundrel';

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

export const insightColor = '#20c997';
export const prowessColor = '#f03e3e';
export const resolveColor = '#7950f2';

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

export function getActionValueBySlug(
    actions: Record<string, Record<string, number>>,
    slug: Action
): number {
    if (!actions) return 0;
    const actionRating = actions[slug];
    return Object.values(actionRating).reduce((acc, val) => acc + val, 0);
}
