export interface RouteLayerMarker {
    lat: number;
    long: number;
    iconUrl: string;
    type: string[];
    data: {
        product: string[];
        sku: string[];
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
        lat: number;
        long: number;
        city: string;
        state: string;
        country: string
    };
    to: {
        lat: number;
        long: number;
        city: string;
        state: string;
        country: string;
    };
    type: 'UPSTREAM' | 'DOWNSTREAM';
    color?: string;
}

export interface Layer {
    name: string;
    legend?: {
        name: string,
        icon: string
    }[];
}

export interface RouteLayer extends Layer {
    markers: RouteLayerMarker[];
    lines: RouteLayerLine[];
}

export interface HeatMapLayer extends Layer {
    hotspots: {
        latitude: number;
        longitude: number;
        weight: number;
        icon: string;
        data?: any;
    }[];
}
