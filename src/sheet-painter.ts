import rough from 'roughjs';
import { Action } from './assets/data/data-types';
import { Scoundrel } from './scoundrel';
import { getActionValue } from './util/action-util';

import dataBackgrounds from './assets/data/background-details.json';
import dataHeritages from './assets/data/heritage-details.json';

const dataClassic = {
    name: { x: 100, y: 235 },
    alias: { x: 704, y: 235 },
    look: { x: 100, y: 316 },
    heritages: {
        akoros: { x: 272, y: 428, w: 110 },
        'dagger-isles': { x: 460, y: 428, w: 260 },
        iruvia: { x: 138, y: 453, w: 95 },
        severos: { x: 240, y: 453, w: 110 },
        skovlan: { x: 356, y: 453, w: 120 },
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
        // Whisper: 'nyryx-2', scurlock, setarra, quellyn, flint
        'nyryx-2': { x: 1110, y: 958 },
        scurlock: { x: 1110, y: 1000 },
        setarra: { x: 1110, y: 1042 },
        quellyn: { x: 1110, y: 1084 },
        flint: { x: 1110, y: 1126 },
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

const dataDeepCuts = {
    nameAndAlias: { x: 225, y: 190 },
    look: { x: 225, y: 410 },
    heritageAndBackground: { x: 225, y: 302 },
    actions: {
        // The vertical offset between bubbles (of the same attribute) is 34.5px
        // The x values represent where a row of bubbles starts
        hunt: { x: 1852, y: 165.5 },
        study: { x: 1852, y: 200 },
        survey: { x: 1852, y: 235 },
        tinker: { x: 1852, y: 270 },
        finesse: { x: 1852, y: 365.5 },
        prowl: { x: 1852, y: 400 },
        skirmish: { x: 1852, y: 435 },
        wreck: { x: 1852, y: 470 },
        attune: { x: 1852, y: 565.5 },
        command: { x: 1852, y: 600 },
        consort: { x: 1852, y: 635 },
        sway: { x: 1852, y: 670 },
    },
    abilities: {
        // Cutter
        battleborn: { x: 1049, y: 271 },
        bodyguard: { x: 1049, y: 337.5 },
        'ghost-fighter': { x: 1049, y: 431.5 },
        leader: { x: 1049, y: 525 },
        mule: { x: 1049, y: 619 },
        'not-to-be-trifled-with': { x: 1049, y: 654 },
        savage: { x: 1049, y: 745 },
        vigorous: { x: 1049, y: 809 },
        // Hound
        sharpshooter: { x: 1049, y: 232 },
        focused: { x: 1049, y: 349 },
        'ghost-hunter': { x: 1049, y: 440.5 },
        'ghost-hunter-2': { x: 1122, y: 440.5 },
        scout: { x: 1049, y: 553 },
        survivor: { x: 1049, y: 638.5 },
        'tough-as-nails': { x: 1049, y: 724 },
        vengeful: { x: 1049, y: 783 },
        // Leech
        alchemist: { x: 1049, y: 269 },
        analyst: { x: 1049, y: 350 },
        artificer: { x: 1049, y: 431 },
        fortitude: { x: 1049, y: 512 },
        'ghost-ward': { x: 1049, y: 593.5 },
        physicker: { x: 1049, y: 649.5 },
        saboteur: { x: 1049, y: 730 },
        venomous: { x: 1049, y: 787 },
        // Lurk
        infiltrator: { x: 1049, y: 269 },
        ambush: { x: 1049, y: 323 },
        daredevil: { x: 1049, y: 353 },
        'the-devils-footsteps': { x: 1049, y: 430 },
        expertise: { x: 1049, y: 532 },
        'ghost-veil': { x: 1049, y: 610 },
        reflexes: { x: 1049, y: 735.5 },
        shadow: { x: 1049, y: 790 },
        // Slide
        'rooks-gambit': { x: 1049, y: 269 },
        'cloak-and-dagger': { x: 1049, y: 330.5 },
        'ghost-voice': { x: 1049, y: 444.5 },
        'like-looking-into-a-mirror': { x: 1049, y: 532 },
        'a-little-something-on-the-side': { x: 1049, y: 594 },
        mesmerism: { x: 1049, y: 656 },
        subterfuge: { x: 1049, y: 718 },
        'trust-in-me': { x: 1049, y: 805.5 },
        // Spider
        foresight: { x: 1049, y: 269 },
        calculating: { x: 1049, y: 327 },
        connected: { x: 1049, y: 389 },
        'functioning-vice': { x: 1049, y: 449.5 },
        'ghost-contract': { x: 1049, y: 533 },
        'jail-bird': { x: 1049, y: 617 },
        mastermind: { x: 1049, y: 700 },
        'weaving-the-web': { x: 1049, y: 784 },
        // Whisper
        compel: { x: 1049, y: 269 },
        'ghost-mind': { x: 1049, y: 353 },
        'iron-will': { x: 1049, y: 412 },
        occultist: { x: 1049, y: 471 },
        ritual: { x: 1049, y: 555 },
        'strange-methods': { x: 1049, y: 640 },
        tempest: { x: 1049, y: 724.5 },
        warded: { x: 1049, y: 808.5 },
    },
    friends: {
        // Cutter: marlane, chael, mercy, grace, sawtooth
        marlane: { x: 2075, y: 773 },
        chael: { x: 2075, y: 854 },
        mercy: { x: 2075, y: 935 },
        grace: { x: 2075, y: 1018 },
        sawtooth: { x: 2075, y: 1102 },
        // Hound: steiner, celene, melvir, veleris, casta
        steiner: { x: 2075, y: 773 },
        celene: { x: 2075, y: 854 },
        melvir: { x: 2075, y: 935 },
        veleris: { x: 2075, y: 1018 },
        casta: { x: 2075, y: 1102 },
        // Leech: stazia, velren, eckerd, jul, malista
        stazia: { x: 2075, y: 773 },
        veldren: { x: 2075, y: 854 },
        eckerd: { x: 2075, y: 935 },
        jul: { x: 2075, y: 1018 },
        malista: { x: 2075, y: 1102 },
        // Lurk: telda, darmot, frake, 'roslyn-kellis', petra
        telda: { x: 2075, y: 773 },
        darmot: { x: 2075, y: 854 },
        frake: { x: 2075, y: 935 },
        'roslyn-kellis': { x: 2075, y: 1018 },
        petra: { x: 2075, y: 1102 },
        // Slide: bryl, 'bazso-baz', khyra, nyryx, harker
        bryl: { x: 2075, y: 773 },
        'bazso-baz': { x: 2075, y: 854 },
        khyra: { x: 2075, y: 935 },
        nyryx: { x: 2075, y: 1018 },
        harker: { x: 2075, y: 1102 },
        // Spider: salia, augus, jennah, riven, jeren
        salia: { x: 2075, y: 773 },
        augus: { x: 2075, y: 854 },
        jennah: { x: 2075, y: 935 },
        riven: { x: 2075, y: 1018 },
        jeren: { x: 2075, y: 1102 },
        // Whisper: 'nyryx-2', scurlock, setarra, quellyn, flint
        'nyryx-2': { x: 2075, y: 773 },
        scurlock: { x: 2075, y: 854 },
        setarra: { x: 2075, y: 935 },
        quellyn: { x: 2075, y: 1018 },
        flint: { x: 2075, y: 1102 },
    },
    vice: { x: 520, y: 1505 },
    viceText: { x: 520, y: 1615 },
};

export async function paintSheet(
    scoundrel: Scoundrel,
): Promise<HTMLCanvasElement> {

    const color = scoundrel.preferredInkColor;
    const sheetType = scoundrel.preferredSheetType;

    console.log(`painting a ${sheetType} sheet for a ${scoundrel.playbook}`);

    if (!document.fonts.check('32px Gochi Hand'))
        await new Promise((resolve) => setTimeout(resolve, 2000));

    if (sheetType === 'classic') {
        const data = dataClassic;
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
                if (scoundrel.heritageDetail)
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
                    drawActionBubbleRow(ctx, scoundrel, action as Action, data.actions, 27, 8);
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
                    // console.log('drawing a triangle for', f);
                    const point = data.friends[f as keyof typeof data.friends];
                    if (!point) return console.error('No point for', f);
                    drawTriangleUp(ctx, point);
                });

                // Fill in Rivals triangles
                scoundrel.rivals.forEach((r) => {
                    // console.log('drawing a triangle for', r);
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
                        940, 32
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
                        940, 32
                    );

                resolve(canvas);
            };

            template.onerror = (error) => {
                reject(new Error(`Failed to load image: ${template.src}`));
            };
        });
    }
    if (sheetType === 'deep-cuts') {
        const data = dataDeepCuts;
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
                ctx.font = '40px Gochi Hand';
                ctx.fillStyle = color;
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;

                let heritageAndBackground = '';

                // Write Heritage Detail
                const heritageDetail = dataHeritages.find(
                    (h) => h.id === scoundrel.heritageDetail
                );
                if (scoundrel.heritageDetail)
                    heritageAndBackground += heritageDetail?.label || scoundrel.heritageDetail;
                if (scoundrel.heritageDetail && scoundrel.heritage)
                    heritageAndBackground += ` (${scoundrel.heritage})`;

                // Write Background Detail
                const backgroundDetail = dataBackgrounds.find(
                    (bg) => bg.id === scoundrel.backgroundDetail
                );
                if (scoundrel.backgroundDetail) {
                    if (heritageAndBackground.length > 0) heritageAndBackground += ' / ';
                    heritageAndBackground += backgroundDetail?.label || scoundrel.backgroundDetail;
                    if (scoundrel.background) heritageAndBackground += ` (${scoundrel.background})`;
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
                    'sway',
                ].forEach((action, i) => {
                    drawActionBubbleRow(ctx, scoundrel, action as Action, data.actions, 29, 9.5);
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
                    drawTriangleUp(ctx, point, .85);
                });

                // Fill in Rivals triangles
                scoundrel.rivals.forEach((r) => {
                    const point = data.friends[r as keyof typeof data.friends];
                    if (!point) return console.error('No point for', r);
                    const offset = { x: 0, y: 11 };

                    drawTriangleDown(ctx, {
                        x: point.x + offset.x,
                        y: point.y + offset.y,
                    }, .85);
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
                    ctx.fillText(nameAndAlias, data.nameAndAlias.x, data.nameAndAlias.y);
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

    return new Promise((resolve, reject) => {
        reject(new Error(`Invalid sheet type ${sheetType}`));
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
    if (!directionUp) lines.forEach((line) => (line.y -= lineCount * lineHeight));
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
    action: Action,
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
