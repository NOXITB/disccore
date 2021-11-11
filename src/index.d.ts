/// <reference types="node" />
import { CanvasRenderingContext2D as ctx2D } from 'canvas';
declare global {
    interface CanvasRenderingContext2D {
        width: number;
        w: number;
        height: number;
        h: number;
        theme: Theme;
        roundRect(x: number, y: number, w: number, h: number, r: number): this;
        changeFont(font: string): this;
        changeFontSize(size: string): this;
        blur(strength: number): this;
    }
}
export declare type Theme = {
    color: string | Gradient;
    image: string | Buffer;
    font?: string;
};
declare type GradientStop = {
    offset: number;
    color: string;
} | {
    off: number;
    col: string;
} | [number | string];
export declare class Gradient {
    type: 'linear' | 'radial';
    colors: {
        offset: number;
        color: string;
    }[];
    grad: CanvasGradient;
    constructor(type?: 'linear' | 'radial', ...colors: GradientStop[]);
    addColorStop(offset: number, color: string): void;
    toString(ctx: ctx2D): import("canvas").CanvasGradient;
}
export declare type ThemeType = (keyof typeof themes) | Theme;
export declare var themes: {
    dark: {
        color: string;
        image: string;
    };
    sakura: {
        color: string;
        image: string;
    };
    blue: {
        color: string;
        image: string;
    };
    bamboo: {
        color: string;
        image: string;
    };
    desert: {
        color: string;
        image: string;
        font: string;
    };
    code: {
        color: string;
        image: string;
        font: string;
    };
};
export {};
