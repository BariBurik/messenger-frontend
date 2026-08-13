declare module '*.module.scss' {
    interface IClassNames {
        [className: string]: string
    }
    const className: IClassNames;
    export = className
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';

declare module '*.svg' {
    import React from "react";
    const SVG: React.FC<React.SVGProps<SVGSVGElement>>
    export default SVG;
}

declare const __PLATFORM__: 'desktop' | 'mobile';

declare const __BACKEND_URL__: string;
declare const __GRAPHENE_URL__: string;
declare const __STRAWBERRY_URL__: string;
declare const __WEBSOCKET_URL__: string;