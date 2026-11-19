declare module 'page-flip' {
  export interface PageFlipSettings {
    width?: number;
    height?: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    startPage?: number;
    flippingTime?: number;
    usePortrait?: boolean;
    autoSize?: boolean;
    drawShadow?: boolean;
  }

  export interface FlipEvent {
    data: number;
    object: any;
  }

  export class PageFlip {
    constructor(element: HTMLElement, setting?: PageFlipSettings);
    destroy(): void;
    update(): void;
    loadFromHTML(items: NodeListOf<Element> | HTMLElement[]): void;
    turnToPrevPage(): void;
    turnToNextPage(): void;
    turnToPage(pageNum: number): void;
    flipNext(corner?: string): void;
    flipPrev(corner?: string): void;
    flip(pageNum: number, corner?: string): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    on(event: string, callback: (e: FlipEvent) => void): this;
    off(event: string): this;
  }
}

