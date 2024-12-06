import dataPlaybooks from "@/assets/data/playbooks.json";
import { Scoundrel } from "@/scoundrel";
import { getActionValueBySlug } from "./action-util";

export function getSemanticScoundrelName(scoundrel: Scoundrel) {
    if (scoundrel.name) return scoundrel.name;
    if (!scoundrel.playbook) return 'Unnamed Scoundrel';
    const playbook = dataPlaybooks.find((playbook) => playbook.slug === scoundrel.playbook);
    return playbook ? `Unnamed ${playbook.name}` : 'Unnamed Scoundrel';
}

export function getAttributeValue(scoundrel: Scoundrel, attribute: 'prowess' | 'insight' | 'resolve'): number {
    let attributeValue = 0;
    switch (attribute) {
        case 'insight': {
            attributeValue += getActionValueBySlug(scoundrel.actions, 'hunt');
            attributeValue += getActionValueBySlug(scoundrel.actions, 'study');
            attributeValue += getActionValueBySlug(scoundrel.actions, 'survey');
            attributeValue += getActionValueBySlug(scoundrel.actions, 'tinker');
        }
        case 'prowess': {
            attributeValue += getActionValueBySlug(scoundrel.actions, 'finesse');
            attributeValue += getActionValueBySlug(scoundrel.actions, 'prowl');
            attributeValue += getActionValueBySlug(scoundrel.actions, 'skirmish');
            attributeValue += getActionValueBySlug(scoundrel.actions, 'wreck');
        }

        case 'resolve': {
            attributeValue += getActionValueBySlug(scoundrel.actions, 'attune');
            attributeValue += getActionValueBySlug(scoundrel.actions, 'command');
            attributeValue += getActionValueBySlug(scoundrel.actions, 'consort');
            attributeValue += getActionValueBySlug(scoundrel.actions, 'sway');
        };
    }

    return attributeValue;
}