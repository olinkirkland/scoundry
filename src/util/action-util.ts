import attributesData from '@/assets/data/attributes.json';

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

export function getAttribute(action: string): string | undefined {
    if (attributesData.resolve.includes(action)) return 'resolve';
    if (attributesData.insight.includes(action)) return 'insight';
    if (attributesData.prowess.includes(action)) return 'prowess';
    console.error(`Action ${action} not found in attributes.`);
}

export function getActionValue(
    actions: Record<string, Record<string, number>>,
    action: string
): number {
    if (!actions) return 0;
    const actionRating = actions[action];
    return Object.values(actionRating).reduce((acc, val) => acc + val, 0);
}
