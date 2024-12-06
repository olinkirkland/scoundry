import { Scoundrel } from "@/scoundrel";

export type Metadata = {
    id: string,
    lastUpdated: number,
};

export function saveScoundrel(scoundrel: Scoundrel) {
    const key = scoundrel.id;
    localStorage.setItem(`scoundrel-${key}`, JSON.stringify(scoundrel));

    const savedScoundrelsIndexString = localStorage.getItem('save-index') || '[]';
    const savedScoundrelsIndex = JSON.parse(savedScoundrelsIndexString);

    const metadata: Metadata = {
        id: key,
        lastUpdated: new Date().getTime(),
    };

    // Ensure the id is not already in the list, if it is, remove it
    const newSavedScoundrelsIndex = savedScoundrelsIndex.filter((saved: any) => saved.id !== key);
    newSavedScoundrelsIndex.push(metadata);

    // Sort the list by last updated
    newSavedScoundrelsIndex.sort((a: any, b: any) => b.lastUpdated - a.lastUpdated);

    localStorage.setItem('save-index', JSON.stringify(newSavedScoundrelsIndex));
}

export function loadScoundrel(id: string): Scoundrel | null {
    const scoundrel = localStorage.getItem(`scoundrel-${id}`);
    if (!scoundrel) return null;

    return JSON.parse(scoundrel);
}

export function getSavedScoundrels() {
    try {
        const savedScoundrelsIndexString = localStorage.getItem('save-index') || '[]';
        const savedScoundrelsIndex = JSON.parse(savedScoundrelsIndexString);

        // For each id, load the scoundrel
        return savedScoundrelsIndex.map((metadata: Metadata) => loadScoundrel(metadata.id));
    } catch (e) {
        console.error(e);
        return [];
    }
}

export function getSavedMetadata(): Metadata[] {
    try {
        const savedScoundrelsIndexString = localStorage.getItem('save-index') || '[]';
        return JSON.parse(savedScoundrelsIndexString);
    } catch (e) {
        console.error(e);
        return [];
    }
}

export function deleteScoundrel(id: string) {
    localStorage.removeItem(`scoundrel-${id}`);
    const savedScoundrelsIndexString = localStorage.getItem('save-index') || '[]';
    const savedScoundrelsIndex = JSON.parse(savedScoundrelsIndexString);

    const newSavedScoundrelsIndex
        = savedScoundrelsIndex.filter((metadata: Metadata) => metadata.id !== id);
    localStorage.setItem('save-index', JSON.stringify(newSavedScoundrelsIndex));
}