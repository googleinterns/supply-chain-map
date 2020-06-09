export interface SidePanel {
    basic: Basic;
    upstream: Upstream;
    cm: Cm;
    downstream: Downstream;
}

export interface Basic {
    products: string[];
    isUnique?: boolean;
    isDrawPath?: boolean;
    isSingleSource?: boolean;
}

export interface Upstream {
    categories: string[];
    suppliers: string[];
    countries: string[];
    states: string[];
    cities: string[];
}

export interface Cm {
    countries: string[];
    states: string[];
    cities: string[];
}

export interface Downstream {
    countries: string[];
    states: string[];
    cities: string[];
}
