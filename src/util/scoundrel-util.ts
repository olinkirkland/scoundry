import { Scoundrel } from "@/scoundrel";
import dataPlaybooks from "@/assets/data/playbooks.json";

export function getSemanticScoundrelName(scoundrel: Scoundrel) {
    if (scoundrel.name) return scoundrel.name;
    if (!scoundrel.playbook) return 'Unnamed Scoundrel';
    const playbook = dataPlaybooks.find((playbook) => playbook.slug === scoundrel.playbook);
    return playbook ? `Unnamed ${playbook.name}` : 'Unnamed Scoundrel';
}   