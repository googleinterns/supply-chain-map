export interface SidePanel {
    product: Product;
    upstream: Upstream;
    downstream: Downstream;
}

export interface Product {
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

export interface Downstream {
    countries: string[];
    states: string[];
    cities: string[];
}
