export interface RouteLayerMarker {
    latitude: number;
    longitude: number;
    iconUrl: string;
    type: string[];
    data: {
        product: string[];
        sku: string[];
        mpn?: string[];
        description: string[];
        category: string[];
        name: string[];
        avgLeadTime: number;
        city: string;
        state: string;
        country: string;
    };
}

export interface RouteLayerLine {
    from: {
        latitude: number;
        longitude: number;
        city: string;
        state: string;
        country: string
    };
    to: {
        latitude: number;
        longitude: number;
        city: string;
        state: string;
        country: string;
    };
    type: 'UPSTREAM' | 'DOWNSTREAM';
    color?: string;
}

export interface Layer {
    name: string;
    legend?: ({
        name: string,
        icon: string,
        type: 'MAT'|'URL'
    }|
    {
        name: string,
        spectrum: {
            gradientColors: string[],
            startLabel: number,
            endLabel: number
        }
    })[];
}

export interface RouteLayer extends Layer {
    markers: RouteLayerMarker[];
    lines: RouteLayerLine[];
}

export interface HeatmapLayer extends Layer {
    hotspots: {
        latitude: number;
        longitude: number;
        magnitude: number;
        data?: any;
    }[];
}

export interface ShapeLayer extends Layer {
    shapes: {
        shapeOpts: google.maps.PolygonOptions,
        magnitude: number,
        data?: any
    }[];
}

export type FilterFunction = (markers: RouteLayerMarker[]) => RouteLayerMarker[];
