import dataPlaybooks from "@/assets/data/playbooks.json";
import { Scoundrel } from "@/scoundrel";
import { getActionValue } from "./action-util";

export function getSemanticScoundrelName(scoundrel: Scoundrel) {
    if (scoundrel.name) return scoundrel.name;
    if (!scoundrel.playbook) return 'Unnamed Scoundrel';
    const playbook = dataPlaybooks.find((playbook) => playbook.id === scoundrel.playbook);
    return playbook ? `Unnamed ${playbook.label}` : 'Unnamed Scoundrel';
}

export function getAttributeValue(scoundrel: Scoundrel, attribute: 'prowess' | 'insight' | 'resolve'): number {
    let attributeValue = 0;
    switch (attribute) {
        case 'insight': {
            attributeValue += getActionValue(scoundrel.actions, 'hunt');
            attributeValue += getActionValue(scoundrel.actions, 'study');
            attributeValue += getActionValue(scoundrel.actions, 'survey');
            attributeValue += getActionValue(scoundrel.actions, 'tinker');
        }
        case 'prowess': {
            attributeValue += getActionValue(scoundrel.actions, 'finesse');
            attributeValue += getActionValue(scoundrel.actions, 'prowl');
            attributeValue += getActionValue(scoundrel.actions, 'skirmish');
            attributeValue += getActionValue(scoundrel.actions, 'wreck');
        }

        case 'resolve': {
            attributeValue += getActionValue(scoundrel.actions, 'attune');
            attributeValue += getActionValue(scoundrel.actions, 'command');
            attributeValue += getActionValue(scoundrel.actions, 'consort');
            attributeValue += getActionValue(scoundrel.actions, 'sway');
        };
    }

    return attributeValue;
}