import actionRatingsData from '@/assets/data/action-ratings.json';
import { Action, ActionRating } from '@/assets/data/data-types';

const ATTRIBUTE_COLORS = {
    insight: '#1fa87f',
    prowess: '#f03e3e',
    resolve: '#7950f2'
}

export function getAttributeColor(attribute: string): string {
    if (!(attribute in ATTRIBUTE_COLORS)) {
        console.error(`Attribute ${attribute} not found in colors.`);
        return '#000000';
    }
    return ATTRIBUTE_COLORS[attribute as keyof typeof ATTRIBUTE_COLORS];
}

export function getActionRating(action: Action): ActionRating | undefined {
    return (actionRatingsData as ActionRating[]).find(
        (a) => a.id === action
    );
}

export function getActionValue(
    actions: Record<string, Record<string, number>>,
    action: Action
): number {
    if (!actions) return 0;
    const actionRating = actions[action];
    return Object.values(actionRating).reduce((acc, val) => acc + val, 0);
}
