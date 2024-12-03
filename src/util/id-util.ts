const CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyz';

export function makeSemanticId(segments: number = 2) {
    const characters = CHARACTERS.split('');
    let id = '';
    for (let i = 0; i < segments; i++) {
        for (let j = 0; j < 4; j++)
            id += characters[Math.floor(Math.random() * characters.length)];
        if (i < segments - 1)
            id += '-';
    }
    return id;
}