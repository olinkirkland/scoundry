import { Scoundrel } from "@/scoundrel";

export function save(scoundrel: Scoundrel) {
    // Save each scoundrel to their own key 'scoundrel-<id>'
    // Add their id to the save-list

    const savedScoundrels = localStorage.getItem('save-id-list');

    const key = scoundrel.id;
    localStorage.setItem(`scoundrel-${key}`, JSON.stringify(scoundrel));
}

export function load(id: string): Scoundrel | null {
    const scoundrel = localStorage.getItem(`scoundrel-${id}`);
    if (!scoundrel) return null;

    return JSON.parse(scoundrel);
}

export function getSavedScoundrels() {
    try {
        const savedScoundrelsIdsString = localStorage.getItem('save-id-list') || '[]';
        const savedScoundrelsIds = JSON.parse(savedScoundrelsIdsString);

        // For each id, load the scoundrel
        return savedScoundrelsIds.map((id: string) => load(id));
    } catch (e) {
        console.error(e);
        return [];
    }
}