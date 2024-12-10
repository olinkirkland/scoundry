import { Action } from "./assets/data/data-types";
import { Scoundrel } from "./scoundrel";
import { getActionValue } from "./util/action-util";

import dataBackgrounds from './assets/data/background-details.json';
import dataHeritages from './assets/data/heritage-details.json';

const data = {
    name: { x: 100, y: 100 },
    heritages: {},
    backgrounds: {},
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
    }
};


export async function paintSheet(scoundrel: Scoundrel, color: string): Promise<HTMLCanvasElement> {
    console.log('painting a sheet for a', scoundrel.playbook);

    if (!document.fonts.check('40px Gochi Hand'))
        await new Promise(resolve => setTimeout(resolve, 2000));


    return new Promise((resolve, reject) => {
        const template = new Image();
        template.src = `/assets/sheets/sheet-images/${scoundrel.playbook}.png`;

        template.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = template.width;
            canvas.height = template.height;

            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(template, 0, 0);

            // Font and color
            // Use Gochi Hand
            ctx.font = '40px Gochi Hand';
            ctx.fillStyle = color;
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;

            // Heritage
            const heritage = dataHeritages.find(h => h.id === scoundrel.heritageDetail);
            if (scoundrel.backgroundDetail)
                ctx.fillText(heritage?.label || scoundrel.heritageDetail, data.heritageText.x, data.heritageText.y);

            // Background
            const background = dataBackgrounds.find(bg => bg.id === scoundrel.backgroundDetail);
            if (scoundrel.backgroundDetail)
                ctx.fillText(background?.label || scoundrel.backgroundDetail, data.backgroundText.x, data.backgroundText.y);

            // Fill in Action bubbles
            ['hunt', 'study', 'survey', 'tinker', 'finesse', 'prowl', 'skirmish', 'wreck', 'attune', 'command', 'consort', 'sway'
            ].forEach((action, i) => {
                drawActionBubbleRow(ctx, scoundrel, action as Action);
            });

            // Fill in Abilities bubbles
            scoundrel.abilities.forEach((ability) => {
                // Draw one bubble for each ability
                if (data.abilities.hasOwnProperty(ability)) {
                    const point = data.abilities[ability as keyof typeof data.abilities];
                    drawBubble(ctx, point);
                }
            });

            resolve(canvas);
        };

        template.onerror = (error) => {
            reject(new Error(`Failed to load image: ${template.src}`));
        };
    });
}

function drawActionBubbleRow(ctx: CanvasRenderingContext2D, scoundrel: Scoundrel, action: Action) {
    // The horizontal offset between bubbles is 27px
    const bubbleCount = getActionValue(scoundrel.actions, action);
    // @ts-ignore
    const point = data.actions[action] as { x: number, y: number };
    for (let i = 0; i < bubbleCount; i++)
        drawBubble(ctx, { x: point.x + i * 27, y: point.y });
}

function drawBubble(ctx: CanvasRenderingContext2D, point: { x: number, y: number }) {
    const radius = 8;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
    ctx.fill();
}