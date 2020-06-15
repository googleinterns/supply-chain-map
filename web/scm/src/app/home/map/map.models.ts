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

export interface RouteLayer {
    name: string;
    data?: any;
    legend?: {
        name: string,
        icon: string
    }[];
}

export interface AdditionalLayer {
    name: string;
    markers: {
        latitude: number;
        longitude: number;
        icon: string;
        data?: any;
    }[];
    legend?: {
        name: string,
        icon: string
    }[];
}
