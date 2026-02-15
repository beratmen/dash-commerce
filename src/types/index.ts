export interface Product {
    id: number; //Burda her bir ürünün id'sini tutar.
    title: string; //Burda her bir ürünün adını tutar.
    description: string; //Burda her bir ürünün açıklamasını tutar.
    price: number; //Burda her bir ürünün fiyatı tutar.
    discountPercentage: number; //Burda her bir ürünün indirim oranını tutar.
    rating: number; //Burda her bir ürünün ratingini tutar.
    stock: number; //Burda her bir ürünün stok sayısını tutar.
    brand: string; //Burda her bir ürünün markasını tutar.
    category: string; //Burda her bir ürünün kategorisini tutar.
    thumbnail: string; //Burda her bir ürünün thumbnail resmini tutar.
    images: string[]; //Burda her bir ürünün resimlerini tutar.
}

export interface ProductResponse {
    products: Product[]; //Burda her bir ürünün detaylarını tutar.
    total: number; //Burda toplam ürün sayısını tutar.
    skip: number; //Burda atlanan ürün sayısını tutar.
    limit: number; //Burda limit sayısını tutar.
}

export interface ProductsViewProps {
    initialData: ProductResponse; //Burda her bir ürünün detaylarını tutar.
}

/** Sepetteki tek bir kalem: gösterim için gerekli alanlar snapshot olarak tutulur. */
export interface CartItem {
    productId: number;
    quantity: number;
    title: string;
    price: number;
    thumbnail: string;
}
