import { Action } from "./assets/data/data-types";
import { Scoundrel } from "./scoundrel";
import { getActionValueBySlug } from "./util/action-util";

import dataHeritages from './assets/data/heritages-specific.json';
import dataBackgrounds from './assets/data/backgrounds-specific.json';

const data = {
    name: { x: 100, y: 100 },
    heritage: { x: 105, y: 400 },
    background: { x: 605, y: 400 },
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
};


export async function paintSheet(scoundrel: Scoundrel): Promise<HTMLCanvasElement> {
    console.log('painting a sheet for a', scoundrel.playbook);
    const color: string = 'red';

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
            const heritage = dataHeritages.find(h => h.slug === scoundrel.heritageSpecialization);
            if (scoundrel.heritageSpecialization)
                ctx.fillText(heritage?.name || scoundrel.heritageSpecialization, data.heritage.x, data.heritage.y);

            // Background
            const background = dataBackgrounds.find(bg => bg.slug === scoundrel.backgroundSpecialization);
            if (scoundrel.backgroundSpecialization)
                ctx.fillText(background?.name || scoundrel.backgroundSpecialization, data.background.x, data.background.y);

            // Fill in Action bubbles
            ['hunt', 'study', 'survey', 'tinker', 'finesse', 'prowl', 'skirmish', 'wreck', 'attune', 'command', 'consort', 'sway'
            ].forEach((action, i) => {
                drawActionBubbleRow(ctx, scoundrel, action as Action);
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
    const bubbleCount = getActionValueBySlug(scoundrel.actions, action);
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