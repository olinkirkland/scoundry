import rough from 'roughjs';
import { Action } from './assets/data/data-types';
import { Scoundrel } from './scoundrel';
import { getActionValue } from './util/action-util';

import dataBackgrounds from './assets/data/background-details.json';
import dataHeritages from './assets/data/heritage-details.json';

const data = {
    name: { x: 100, y: 235 },
    alias: { x: 704, y: 235 },
    look: { x: 100, y: 316 },
    heritages: {
        akoros: { x: 272, y: 428, w: 110 },
        'dagger-isles': { x: 460, y: 428, w: 260 },
        iruvia: { x: 138, y: 453, w: 95 },
        severos: { x: 240, y: 453, w: 110 },
        skovlan: { x: 136, y: 453, w: 95 },
        tycheros: { x: 480, y: 453, w: 135 },
    },
    backgrounds: {
        academic: { x: 826, y: 428, w: 140 },
        labor: { x: 942, y: 428, w: 90 },
        law: { x: 1026, y: 428, w: 75 },
        trade: { x: 636, y: 453, w: 95 },
        military: { x: 742, y: 453, w: 120 },
        noble: { x: 848, y: 453, w: 90 },
        underworld: { x: 976, y: 453, w: 160 },
    },
    heritageText: { x: 105, y: 400 },
    backgroundText: { x: 605, y: 400 },
    actions: {
        // The vertical offset between bubbles is 28.6px
        // The x values represent where a row of bubbles starts
        hunt: { x: 1838.5, y: 325.5 },
        study: { x: 1838.5, y: 354.1 },
        survey: { x: 1838.5, y: 382.7 },
        tinker: { x: 1838.5, y: 411.3 },
        finesse: { x: 1838.5, y: 488 },
        prowl: { x: 1838.5, y: 516.6 },
        skirmish: { x: 1838.5, y: 545.2 },
        wreck: { x: 1838.5, y: 573.8 },
        attune: { x: 1838.5, y: 650.5 },
        command: { x: 1838.5, y: 679.1 },
        consort: { x: 1838.5, y: 707.7 },
        sway: { x: 1838.5, y: 736.3 },
    },
    abilities: {
        // Cutter
        battleborn: { x: 1097, y: 271 },
        bodyguard: { x: 1097, y: 337.5 },
        'ghost-fighter': { x: 1097, y: 431.5 },
        leader: { x: 1097, y: 525 },
        mule: { x: 1097, y: 619 },
        'not-to-be-trifled-with': { x: 1097, y: 654 },
        savage: { x: 1097, y: 745 },
        vigorous: { x: 1097, y: 809 },
        // Hound
        sharpshooter: { x: 1097, y: 269 },
        focused: { x: 1097, y: 355 },
        'ghost-hunter': { x: 1097, y: 440.5 },
        'ghost-hunter-2': { x: 1122, y: 440.5 },
        scout: { x: 1097, y: 553 },
        survivor: { x: 1097, y: 638.5 },
        'tough-as-nails': { x: 1097, y: 724 },
        vengeful: { x: 1097, y: 783 },
        // Leech
        alchemist: { x: 1097, y: 269 },
        analyst: { x: 1097, y: 350 },
        artificer: { x: 1097, y: 431 },
        fortitude: { x: 1097, y: 512 },
        'ghost-ward': { x: 1097, y: 593.5 },
        physicker: { x: 1097, y: 649.5 },
        saboteur: { x: 1097, y: 730 },
        venomous: { x: 1097, y: 787 },
        // Lurk
        infiltrator: { x: 1097, y: 269 },
        ambush: { x: 1097, y: 323 },
        daredevil: { x: 1097, y: 353 },
        'the-devils-footsteps': { x: 1097, y: 430 },
        expertise: { x: 1097, y: 532 },
        'ghost-veil': { x: 1097, y: 610 },
        reflexes: { x: 1097, y: 735.5 },
        shadow: { x: 1097, y: 790 },
        // Slide
        'rooks-gambit': { x: 1097, y: 269 },
        'cloak-and-dagger': { x: 1097, y: 330.5 },
        'ghost-voice': { x: 1097, y: 444.5 },
        'like-looking-into-a-mirror': { x: 1097, y: 532 },
        'a-little-something-on-the-side': { x: 1097, y: 594 },
        mesmerism: { x: 1097, y: 656 },
        subterfuge: { x: 1097, y: 718 },
        'trust-in-me': { x: 1097, y: 805.5 },
        // Spider
        foresight: { x: 1097, y: 269 },
        calculating: { x: 1097, y: 327 },
        connected: { x: 1097, y: 389 },
        'functioning-vice': { x: 1097, y: 449.5 },
        'ghost-contract': { x: 1097, y: 533 },
        'jail-bird': { x: 1097, y: 617 },
        mastermind: { x: 1097, y: 700 },
        'weaving-the-web': { x: 1097, y: 784 },
        // Whisper
        compel: { x: 1097, y: 269 },
        'ghost-mind': { x: 1097, y: 353 },
        'iron-will': { x: 1097, y: 412 },
        occultist: { x: 1097, y: 471 },
        ritual: { x: 1097, y: 555 },
        'strange-methods': { x: 1097, y: 640 },
        tempest: { x: 1097, y: 724.5 },
        warded: { x: 1097, y: 808.5 },
    },
    friends: {
        // Cutter: marlane, chael, mercy, grace, sawtooth
        marlane: { x: 1110, y: 958 },
        chael: { x: 1110, y: 1000 },
        mercy: { x: 1110, y: 1042 },
        grace: { x: 1110, y: 1084 },
        sawtooth: { x: 1110, y: 1126 },
        // Hound: steiner, celene, melvir, veleris, casta
        steiner: { x: 1110, y: 958 },
        celene: { x: 1110, y: 1000 },
        melvir: { x: 1110, y: 1042 },
        veleris: { x: 1110, y: 1084 },
        casta: { x: 1110, y: 1126 },
        // Leech: stazia, velren, eckerd, jul, malista
        stazia: { x: 1110, y: 958 },
        veldren: { x: 1110, y: 1000 },
        eckerd: { x: 1110, y: 1042 },
        jul: { x: 1110, y: 1084 },
        malista: { x: 1110, y: 1126 },
        // Lurk: telda, darmot, frake, 'roslyn-kellis', petra
        telda: { x: 1110, y: 958 },
        darmot: { x: 1110, y: 1000 },
        frake: { x: 1110, y: 1042 },
        'roslyn-kellis': { x: 1110, y: 1084 },
        petra: { x: 1110, y: 1126 },
        // Slide: bryl, 'bazso-baz', khyra, nyryx, harker
        bryl: { x: 1110, y: 958 },
        'bazso-baz': { x: 1110, y: 1000 },
        khyra: { x: 1110, y: 1042 },
        nyryx: { x: 1110, y: 1084 },
        harker: { x: 1110, y: 1126 },
        // Spider: salia, augus, jennah, riven, jeren
        salia: { x: 1110, y: 958 },
        augus: { x: 1110, y: 1000 },
        jennah: { x: 1110, y: 1042 },
        riven: { x: 1110, y: 1084 },
        jeren: { x: 1110, y: 1126 },
        // Whisper: 'nyryx-2', scurlock, setarra, quellyn, flynn
        'nyryx-2': { x: 1110, y: 958 },
        scurlock: { x: 1110, y: 1000 },
        setarra: { x: 1110, y: 1042 },
        quellyn: { x: 1110, y: 1084 },
        flynn: { x: 1110, y: 1126 },
    },
    vices: {
        faith: { x: 320, y: 542, w: 75 },
        gambling: { x: 430, y: 542, w: 130 },
        luxury: { x: 547, y: 542, w: 105 },
        obligation: { x: 672, y: 542, w: 145 },
        pleasure: { x: 808, y: 542, w: 125 },
        stupor: { x: 920, y: 542, w: 100 },
        weird: { x: 1015, y: 542, w: 95 },
    },
    viceText: { x: 100, y: 515 },
};

export async function paintSheet(
    scoundrel: Scoundrel,
    color: string
): Promise<HTMLCanvasElement> {
    console.log('painting a sheet for a', scoundrel.playbook);

    if (!document.fonts.check('32px Gochi Hand'))
        await new Promise((resolve) => setTimeout(resolve, 2000));

    return new Promise((resolve, reject) => {
        const template = new Image();
        template.src = `/assets/sheets/sheet-images/${scoundrel.playbook}.png`;

        template.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = template.width;
            canvas.height = template.height;
            const roughCanvas = rough.canvas(canvas);
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(template, 0, 0);
            ctx.font = '32px Gochi Hand';
            ctx.fillStyle = color;
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;

            // Circle Heritage
            const heritageBoxHeight = 36;
            const heritage =
                data.heritages[
                    scoundrel.heritage as keyof typeof data.heritages
                ];
            if (heritage) {
                // Use roughjs to draw the oval
                // No fill; thick, colored stroke
                roughCanvas.rectangle(
                    heritage.x - heritage.w / 2,
                    heritage.y - heritageBoxHeight / 2,
                    heritage.w,
                    heritageBoxHeight,
                    {
                        roughness: 2,
                        stroke: color,
                        strokeWidth: 4,
                    }
                );
            }

            // Circle Background
            const backgroundBoxHeight = 36;
            const background =
                data.backgrounds[
                    scoundrel.background as keyof typeof data.backgrounds
                ];
            if (background) {
                // Use roughjs to draw the oval
                // No fill; thick, colored stroke
                roughCanvas.rectangle(
                    background.x - background.w / 2,
                    background.y - backgroundBoxHeight / 2,
                    background.w,
                    backgroundBoxHeight,
                    {
                        roughness: 2,
                        stroke: color,
                        strokeWidth: 4,
                    }
                );
            }

            // Write Heritage Detail
            const heritageDetail = dataHeritages.find(
                (h) => h.id === scoundrel.heritageDetail
            );
            if (scoundrel.backgroundDetail)
                ctx.fillText(
                    heritageDetail?.label || scoundrel.heritageDetail,
                    data.heritageText.x,
                    data.heritageText.y
                );

            // Write Background Detail
            const backgroundDetail = dataBackgrounds.find(
                (bg) => bg.id === scoundrel.backgroundDetail
            );
            if (scoundrel.backgroundDetail)
                ctx.fillText(
                    backgroundDetail?.label || scoundrel.backgroundDetail,
                    data.backgroundText.x,
                    data.backgroundText.y
                );

            // Fill in Action bubbles
            [
                'hunt',
                'study',
                'survey',
                'tinker',
                'finesse',
                'prowl',
                'skirmish',
                'wreck',
                'attune',
                'command',
                'consort',
                'sway',
            ].forEach((action, i) => {
                drawActionBubbleRow(ctx, scoundrel, action as Action);
            });

            // Fill in Abilities bubbles
            scoundrel.abilities.forEach((ability) => {
                // Draw one bubble for each ability
                if (data.abilities.hasOwnProperty(ability)) {
                    const point =
                        data.abilities[ability as keyof typeof data.abilities];
                    drawBubble(ctx, point);
                }
            });

            // Fill in Friends triangles
            scoundrel.friends.forEach((f) => {
                console.log('drawing a triangle for', f);
                const point = data.friends[f as keyof typeof data.friends];
                if (!point) return console.error('No point for', f);
                drawTriangleUp(ctx, point);
            });

            // Fill in Rivals triangles
            scoundrel.rivals.forEach((r) => {
                console.log('drawing a triangle for', r);
                const point = data.friends[r as keyof typeof data.friends];
                if (!point) return console.error('No point for', r);
                const offset = { x: 28, y: -14 };
                if (scoundrel.playbook === 'whisper') offset.x = 24.5; // Misprint in the Whisper playbook

                drawTriangleDown(ctx, {
                    x: point.x + offset.x,
                    y: point.y + offset.y,
                });
            });

            // Circle Vice
            const viceBoxHeight = 36;
            const vice = data.vices[scoundrel.vice as keyof typeof data.vices];
            if (vice) {
                // Use roughjs to draw the oval
                // No fill; thick, colored stroke
                roughCanvas.rectangle(
                    vice.x - vice.w / 2,
                    vice.y - viceBoxHeight / 2,
                    vice.w,
                    viceBoxHeight,
                    {
                        roughness: 2,
                        stroke: color,
                        strokeWidth: 4,
                    }
                );
            }

            // Write Vice Detail
            if (scoundrel.viceDetail)
                fillMultilineText(
                    ctx,
                    scoundrel.viceDetail,
                    data.viceText.x,
                    data.viceText.y,
                    940
                );

            // Name
            if (scoundrel.name)
                ctx.fillText(scoundrel.name, data.name.x, data.name.y);

            // Alias
            if (scoundrel.alias)
                ctx.fillText(scoundrel.alias, data.alias.x, data.alias.y);

            // Look
            if (scoundrel.look)
                fillMultilineText(
                    ctx,
                    scoundrel.look,
                    data.look.x,
                    data.look.y,
                    940
                );

            resolve(canvas);
        };

        template.onerror = (error) => {
            reject(new Error(`Failed to load image: ${template.src}`));
        };
    });
}

function fillMultilineText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number
) {
    // Fill a text box with a maximum width and a maximum number of lines
    // Use an ellipsis to cut off the text if it's too long
    const lines: { text: string; x: number; y: number }[] = [];
    const LINE_HEIGHT = 32;
    const words = text.split(' ');
    let line = '';
    let lineCount = 0;
    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && i > 0) {
            lines.push({ text: line, x, y });
            line = words[i] + ' ';
            y += LINE_HEIGHT;
            lineCount++;
        } else {
            line = testLine;
        }
    }
    lines.push({ text: line, x, y });
    // Move the text up by line count * line height
    lines.forEach((line) => (line.y -= lineCount * LINE_HEIGHT));

    lines.forEach((line) => ctx.fillText(line.text, line.x, line.y));
}

function drawTriangleUp(
    ctx: CanvasRenderingContext2D,
    point: { x: number; y: number }
) {
    const width = 12.5;
    const height = 21;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y - height);
    ctx.lineTo(point.x + width, point.y);
    ctx.lineTo(point.x - width, point.y);
    ctx.fill();
}

function drawTriangleDown(
    ctx: CanvasRenderingContext2D,
    point: { x: number; y: number }
) {
    const width = 12.5;
    const height = 21;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y + height);
    ctx.lineTo(point.x + width, point.y);
    ctx.lineTo(point.x - width, point.y);
    ctx.fill();
}

function drawActionBubbleRow(
    ctx: CanvasRenderingContext2D,
    scoundrel: Scoundrel,
    action: Action
) {
    // The horizontal offset between bubbles is 27px
    const bubbleCount = getActionValue(scoundrel.actions, action);
    // @ts-ignore
    const point = data.actions[action] as { x: number; y: number };
    for (let i = 0; i < bubbleCount; i++)
        drawBubble(ctx, { x: point.x + i * 27, y: point.y });
}

function drawBubble(
    ctx: CanvasRenderingContext2D,
    point: { x: number; y: number }
) {
    const radius = 8;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
    ctx.fill();
}
