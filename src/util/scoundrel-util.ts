import dataPlaybooks from '@/assets/data/playbooks.json';
import { Scoundrel } from '@/scoundrel';
import { getActionValue } from './action-util';
import { makeSemanticId } from './id-util';

export function getSemanticScoundrelName(scoundrel: Scoundrel) {
    if (scoundrel.name) return scoundrel.name;
    if (!scoundrel.playbook) return 'Unnamed Scoundrel';
    const playbook = dataPlaybooks.find(
        (playbook) => playbook.id === scoundrel.playbook
    );
    return playbook ? `Unnamed ${playbook.label}` : 'Unnamed Scoundrel';
}

export function getAttributeValue(
    scoundrel: Scoundrel,
    attribute: 'prowess' | 'insight' | 'resolve'
): number {
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
        }
    }

    return attributeValue;
}

export function encodeJsonToUrl(jsonObject: any) {
    // Convert JSON object to a string
    const copy = { ...jsonObject };
    copy.id = makeSemanticId();
    const jsonString = JSON.stringify(jsonObject);

    // Encode the string to UTF-8 and then Base64
    const base64String = btoa(
        new TextEncoder()
            .encode(jsonString)
            .reduce((acc, byte) => acc + String.fromCharCode(byte), '')
    );

    // Make the Base64 URL-safe
    const urlSafeBase64 = base64String
        .replace(/\+/g, '-') // Replace '+' with '-'
        .replace(/\//g, '_') // Replace '/' with '_'
        .replace(/=+$/, ''); // Remove trailing '='

    return urlSafeBase64;
}

export function decodeUrlToJson(urlSafeBase64: string) {
    // Convert URL-safe Base64 back to standard Base64
    const base64String = urlSafeBase64
        .replace(/-/g, '+') // Replace '-' with '+'
        .replace(/_/g, '/'); // Replace '_' with '/'

    // Decode Base64 to UTF-8 string
    const jsonString = new TextDecoder().decode(
        Uint8Array.from(atob(base64String), (char) => char.charCodeAt(0))
    );

    // Parse JSON string to object
    return JSON.parse(jsonString);
}
