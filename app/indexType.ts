export type fashion = {
    _id: string; // MongoDB ObjectId as string
    categoryId: string; // MongoDB ObjectId as string (reference to category)
    title: string;
    oldPrice: number;
    price: number;
    discountedPrice: number;
    description: string;
    gender: 'men' | 'women' | 'unisex'; // limited to expected values
    type: string; // e.g., 'jacket', 'coat', etc.
    stock: number;
    brand: string;
    size?: string[]; // e.g., ['S', 'M', 'L']
    image: string;
    rating: number; // typically 0 to 5
};

export type electronics = {
    _id: string; // ObjectId as string
    categoryId: string;
    title: string;
    oldPrice: number;
    price: number;
    discountedPrice: number;
    description: string;
    brand: string;
    type: string; // e.g., "smartphone", "laptop", etc.
    stock: number;
    model?: string;
    warranty: string; // e.g., "1 year"
    features: string[];
    image: string;
    rating: number; // 0–5 scale
};

export type home = {
    _id: string;
    categoryId: string;
    title: string;
    oldPrice: number;
    price: number;
    discountedPrice: number;
    description: string;
    brand: string;
    type: string; // e.g., "sofa", "lamp", "kitchen appliance"
    stock: number;
    material?: string;
    dimensions?: string;
    warranty?: string;
    features: string[];
    image: string;
    rating: number; // scale 0–5
};

export type beauty = {
    _id: string;
    categoryId: string;
    title: string;
    oldPrice: number;
    price: number;
    discountedPrice: number;
    description: string;
    brand: string;
    type: string; // e.g., "skincare", "haircare", "makeup", "fragrance"
    stock: number;
    size?: string; // e.g., "100ml", "50g"
    ingredients?: string[];
    features: string[];
    image: string;
    rating: number; // 0–5
    expirationDate?: string; // optional, ISO date string
};

export type users = {
    userName: string;
    email: string;
    password: string;
    cartItems?: object[];
    history?: object[];
    totalAmount?: number | string;
    isDeleted?: boolean;
    isLoggedIn: boolean;
}

export type category = {
    categoryName: string;
    categoryShortName: string;
    productIds?: []
    _id?: string
}