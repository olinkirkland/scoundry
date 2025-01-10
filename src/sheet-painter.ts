import rough from 'roughjs';
import { Scoundrel } from './scoundrel';
import { getActionValue } from './util/action-util';

export async function paintSheet(
    scoundrel: Scoundrel
): Promise<HTMLCanvasElement> {
    const color = scoundrel.preferredInkColor;
    const sheetType = scoundrel.preferredSheetType;
    const font = await getFont(scoundrel.preferredFont);

    console.log('preferredFont:', scoundrel.preferredFont);
    console.log(`painting a ${sheetType} sheet for a ${scoundrel.playbook}`);
    console.log(`using ${font} in ${color}`);

    if (!document.fonts.check(`32px ${font}`))
        await new Promise((resolve) => setTimeout(resolve, 2000));

    if (sheetType === 'classic')
        return paintClassicSheet(scoundrel, color, font);
    if (sheetType === 'deep-cuts')
        return paintDeepCutsSheet(scoundrel, color, font);

    return new Promise((resolve, reject) => {
        reject(new Error(`Invalid sheet type ${sheetType}`));
    });
}

async function paintClassicSheet(
    scoundrel: Scoundrel,
    color: string,
    font: string
): Promise<HTMLCanvasElement> {
    const data = await fetchSheetData(scoundrel.language || 'en', 'classic');
    return new Promise((resolve, reject) => {
        const template = new Image();
        template.src = `/assets/sheets/${scoundrel.language || 'en'}/${scoundrel.playbook}.png`; // en is the default language and fallback for previous app versions

        template.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = template.width;
            canvas.height = template.height;
            const roughCanvas = rough.canvas(canvas);
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(template, 0, 0);
            ctx.font = `24px ${font}`;
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
                        strokeWidth: 4
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
                        strokeWidth: 4
                    }
                );
            }

            // Write Heritage Detail
            if (scoundrel.heritageDetail)
                ctx.fillText(
                    scoundrel.heritageDetail,
                    data.heritageText.x,
                    data.heritageText.y
                );

            // Write Background Detail
            if (scoundrel.backgroundDetail)
                ctx.fillText(
                    scoundrel.backgroundDetail,
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
                'sway'
            ].forEach((action, i) => {
                drawActionBubbleRow(
                    ctx,
                    scoundrel,
                    action,
                    data.actions,
                    27,
                    8
                );
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
                const point =
                    data.friends[f as keyof typeof data.friends].friend;
                if (!point) return console.error('No point for', f);
                drawTriangleUp(ctx, point);
            });

            // Fill in Rivals triangles
            scoundrel.rivals.forEach((r) => {
                const point =
                    data.friends[r as keyof typeof data.friends].rival;
                if (!point) return console.error('No point for', r);
                drawTriangleDown(ctx, {
                    x: point.x,
                    y: point.y
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
                        strokeWidth: 4
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
                    940,
                    24
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
                    940,
                    24
                );

            resolve(canvas);
        };

        template.onerror = (error) => {
            reject(new Error(`Failed to load image: ${template.src}`));
        };
    });
}

async function paintDeepCutsSheet(
    scoundrel: Scoundrel,
    color: string,
    font: string
): Promise<HTMLCanvasElement> {
    const data = await fetchSheetData(scoundrel.language || 'en', 'deep-cuts');
    return new Promise((resolve, reject) => {
        const template = new Image();
        template.src = `/assets/sheets/sheet-images/dc-${scoundrel.playbook}.png`;

        template.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = template.width;
            canvas.height = template.height;
            const roughCanvas = rough.canvas(canvas);
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(template, 0, 0);
            ctx.font = `40px ${font}`;
            ctx.fillStyle = color;
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;

            let heritageAndBackground = '';

            // Write Heritage Detail
            if (scoundrel.heritageDetail)
                heritageAndBackground += scoundrel.heritageDetail;
            if (scoundrel.heritageDetail && scoundrel.heritage)
                heritageAndBackground += ` (${scoundrel.heritage})`;

            // Write Background Detail
            if (scoundrel.backgroundDetail) {
                if (heritageAndBackground.length > 0)
                    heritageAndBackground += ' / ';
                heritageAndBackground += scoundrel.backgroundDetail;
                if (scoundrel.background)
                    heritageAndBackground += ` (${scoundrel.background})`;
            }
            fillMultilineText(
                ctx,
                heritageAndBackground,
                data.heritageAndBackground.x,
                data.heritageAndBackground.y,
                800,
                40
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
                'sway'
            ].forEach((action, i) => {
                drawActionBubbleRow(
                    ctx,
                    scoundrel,
                    action,
                    data.actions,
                    29,
                    9.5
                );
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
                const point = data.friends[f as keyof typeof data.friends];
                if (!point) return console.error('No point for', f);
                drawTriangleUp(ctx, point, 0.85);
            });

            // Fill in Rivals triangles
            scoundrel.rivals.forEach((r) => {
                const point = data.friends[r as keyof typeof data.friends];
                if (!point) return console.error('No point for', r);
                const offset = { x: 0, y: 11 };

                drawTriangleDown(
                    ctx,
                    {
                        x: point.x + offset.x,
                        y: point.y + offset.y
                    },
                    0.85
                );
            });

            // Write Vice
            if (scoundrel.vice)
                ctx.fillText(scoundrel.vice, data.vice.x, data.vice.y);

            // Write Vice Detail
            if (scoundrel.viceDetail)
                fillMultilineText(
                    ctx,
                    scoundrel.viceDetail,
                    data.viceText.x,
                    data.viceText.y,
                    400,
                    40,
                    false
                );

            // Name
            if (scoundrel.name || scoundrel.alias) {
                let nameAndAlias = '';
                if (scoundrel.name) nameAndAlias += scoundrel.name;
                if (scoundrel.alias) {
                    if (nameAndAlias.length > 0) nameAndAlias += ' / ';
                    nameAndAlias += scoundrel.alias;
                }
                ctx.fillText(
                    nameAndAlias,
                    data.nameAndAlias.x,
                    data.nameAndAlias.y
                );
            }

            // Look
            if (scoundrel.look)
                fillMultilineText(
                    ctx,
                    scoundrel.look,
                    data.look.x,
                    data.look.y,
                    800,
                    40
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
    maxWidth: number,
    lineHeight: number,
    directionUp = true
) {
    // Fill a text box with a maximum width and a maximum number of lines
    // Use an ellipsis to cut off the text if it's too long
    const lines: { text: string; x: number; y: number }[] = [];
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
            y += lineHeight;
            lineCount++;
        } else {
            line = testLine;
        }
    }
    lines.push({ text: line, x, y });
    // Move the text up by line count * line height
    if (!directionUp)
        lines.forEach((line) => (line.y -= lineCount * lineHeight));
    else lines.forEach((line) => (line.y -= lineCount * lineHeight));
    lines.forEach((line) => ctx.fillText(line.text, line.x, line.y));
}

function drawTriangleUp(
    ctx: CanvasRenderingContext2D,
    point: { x: number; y: number },
    size: number = 1
) {
    const width = 12.5 * size;
    const height = 21 * size;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y - height);
    ctx.lineTo(point.x + width, point.y);
    ctx.lineTo(point.x - width, point.y);
    ctx.fill();
}

function drawTriangleDown(
    ctx: CanvasRenderingContext2D,
    point: { x: number; y: number },
    size: number = 1
) {
    const width = 12.5 * size;
    const height = 21 * size;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y + height);
    ctx.lineTo(point.x + width, point.y);
    ctx.lineTo(point.x - width, point.y);
    ctx.fill();
}

function drawActionBubbleRow(
    ctx: CanvasRenderingContext2D,
    scoundrel: Scoundrel,
    action: string,
    actions: { [key: string]: { x: number; y: number } },
    offset: number,
    radius: number
) {
    const bubbleCount = getActionValue(scoundrel.actions, action);
    // @ts-ignore
    const point = actions[action];
    for (let i = 0; i < bubbleCount; i++)
        drawBubble(ctx, { x: point.x + i * offset, y: point.y }, radius);
}

function drawBubble(
    ctx: CanvasRenderingContext2D,
    point: { x: number; y: number },
    radius = 8
) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

async function getFont(variableName: string) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const fontVariable = getComputedStyle(
        document.documentElement
    ).getPropertyValue(`--${variableName}`);
    if (!fontVariable)
        console.error(`No font variable found for ${variableName}`);

    return fontVariable.replace(/"/g, '');
}

async function fetchSheetData(
    language: string,
    variation: 'classic' | 'deep-cuts'
) {
    console.log(`fetching sheet data for ${language}/${variation}`);
    const response = await fetch(
        `/assets/sheets/${language}/data/${variation}.json`
    );
    return response.json();
}
