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
    startZIndex?: number;
    autoSize?: boolean;
    drawShadow?: boolean;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
  }

  export interface FlipEvent {
    data: any;
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

declare module 'react-pageflip' {
  import React from 'react';

  export interface HTMLFlipBookProps {
    width?: number;
    height?: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
    startPage?: number;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
    renderOnlyPageLengthChange?: boolean;
    onFlip?: (flipEvent: { data: number; object: any }) => void;
    onChangeOrientation?: (flipEvent: any) => void;
    onChangeState?: (flipEvent: any) => void;
    onInit?: (flipEvent: any) => void;
    onUpdate?: (flipEvent: any) => void;
  }

  const HTMLFlipBook: React.ForwardRefExoticComponent<HTMLFlipBookProps & React.RefAttributes<any>>;
  export default HTMLFlipBook;
}

