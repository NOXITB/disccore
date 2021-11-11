import { CanvasRenderingContext2D as ctx2D } from 'canvas';
import { join } from 'path';

declare global {
    interface CanvasRenderingContext2D {
        width: number; w: number;
        height: number; h: number;
        theme: Theme;

        roundRect(x: number, y: number, w: number, h: number, r: number): this
        changeFont(font: string): this
        changeFontSize(size: string): this
        blur(strength: number): this
    }
}

ctx2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
}

ctx2D.prototype.changeFont = function (font) {
    var fontArgs = this.font.split(' ');
    this.font = fontArgs[0] + ' ' + font; /// using the first part
    return this;
}

ctx2D.prototype.changeFontSize = function (size) {
    var fontArgs = this.font.split(' ');
    this.font = size + ' ' + fontArgs.slice(1).join(' '); /// using the last part
    return this;
}

ctx2D.prototype.blur = function (strength = 1) {
    this.globalAlpha = 0.5; // Higher alpha made it more smooth
    // Add blur layers by strength to x and y
    // 2 made it a bit faster without noticeable quality loss
    for (var y = -strength; y <= strength; y += 2) {
        for (var x = -strength; x <= strength; x += 2) {
            // Apply layers
            this.drawImage(this.canvas, x, y);
            // Add an extra layer, prevents it from rendering lines
            // on top of the images (does makes it slower though)
            if (x >= 0 && y >= 0) {
                this.drawImage(this.canvas, -(x - 1), -(y - 1));
            }
        }
    }
    this.globalAlpha = 1.0;


    return this;
}





export type Theme = {
    color: string | Gradient;
    image: string | Buffer;
    font?: string;
}

type GradientStop = { offset: number; color: string; } | { off: number; col: string; } | [number | string];
export class Gradient {
    type: 'linear' | 'radial';
    colors: { offset: number; color: string; }[];
    grad: CanvasGradient;

    constructor(type: 'linear' | 'radial' = 'linear', ...colors: GradientStop[]) {
        this.type = type;
        const arr = colors ?? [];
        this.colors = [];
        for (const stop of arr) {
            if (typeof stop['offset'] === 'number') {
                this.colors.push(stop as any);
            } else if (typeof stop['off'] === 'number') {
                this.colors.push({
                    offset: stop['off'],
                    color: stop['col']
                });
            } else {
                this.colors.push({
                    offset: stop[0],
                    color: stop[1]
                });
            }
        }
    }

    addColorStop(offset: number, color: string) {
        this.colors.push({ offset, color });
    }

    toString(ctx: ctx2D) {
        var grad = this.type === 'linear' ?
            ctx.createLinearGradient(0, 0, ctx.w, ctx.h)
            : ctx.createRadialGradient(ctx.w / 2, ctx.h / 2, ctx.w / 2, ctx.w / 2, ctx.h / 2, ctx.w / 2);

        for (const v of this.colors) grad.addColorStop(v.offset, v.color)

        return grad;
    }
}

export type ThemeType = (keyof typeof themes) | Theme;


const root = join(__dirname, 'images')
export var themes = {
    'dark': { color: '#ffffff', image: join(root, 'dark.png') },
    'sakura': { color: '#7d0b2b', image: join(root, 'sakura.png') },
    'blue': { color: '#040f57', image: join(root, 'blue.png') },
    'bamboo': { color: '#137a0d', image: join(root, 'bamboo.png') },
    'desert': { color: '#000000', image: join(root, 'desert.png'), font: 'Segoe Print' },
    'code': { color: '#ffffff', image: join(root, 'code.png'), font: 'Source Sans Pro' },
}