/**
 * PRODUCTS VIEW (Ürün Listesi Sayfası)
 *
 * Bu komponet /products sayfasında ürünleri ızgarada gösterir.
 *
 * Temel Görevler:
 * - Ürün kartlarını 4 sütunlu ızgarada göstermek (responsive: xs=1, sm=2, md=3, lg=4)
 * - Sunucudan (SSR) veya API'den ürünleri yüklemek
 * - Sayfalama ile ürünleri bölümlere ayırmak
 * - Arama sorgusuyla ürünleri filtrelemek
 * - Sepete ürün ekleme işlevselliği sunmak
 * - Yükleniyor ve hata durumlarını yönetmek
 */

"use client"; // Client-side rendering (Redux, useEffect vs. gerekli, SSR verilerini işlemek için)

import React, { useEffect } from "react";
import Link from "next/link";
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Box,
  Pagination,
  Rating,
  Button,
  IconButton,
} from "@mui/material";
import { ShoppingCart, Favorite, FavoriteBorder } from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProductsAsync, setProducts } from "@/store/slices/productSlice";
import { setPage } from "@/store/slices/uiSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleFavorite, selectFavorites } from "@/store/slices/favoriteSlice";
import { ProductsViewProps } from "@/types";

/**
 * ProductsView Bileşeni
 * Bu fonksiyona dışarıdan bir veri girişi yapılacak, şimdi onu tarif ediyorum
 * @param {ProductsViewProps} props - Prop'lar
 * @param {Product[]} props.initialData - Sunucudan (SSR) gelen başlangıç ürün verileri
 *
 * Render Sırası:
 * 1. Başlık ve açıklama
 * 2. Ürün kartlarının grid'i (4 sütun)
 * 3. Sayfalama kontrolü
 */ //paketinin içinden sadece initialData kısmını çek
export default function ProductsView({ initialData }: ProductsViewProps) {
  // Redux Dispatch: Aksiyon'ları Redux'a göndermek için (setProducts, fetchProductsAsync, setPage)
  const dispatch = useAppDispatch();

  // Redux State - Ürün Verileri
  // - items: Geçerli sayfadaki ürün dizisi
  // - total: Toplam ürün sayısı (tüm sayfalardan)
  // - loading: API isteği yapılırken true olur (yükleniyor göstergesi için)
  // - error: API hata mesajı (varsa)
  // Redux store’daki products state’ini al, içindeki items, total, loading, error değerlerini component içinde kullanmak için değişkenlere ayır.
  const { items, total, loading, error } = useAppSelector(
    (state) => state.products,
  );

  // Redux State - UI Verileri
  // - currentPage: Şu anda gösterilen sayfa numarası (1, 2, 3 vs.)
  // - itemsPerPage: Bir sayfada kaç ürün gösterilecek (genellikle 20)
  // - searchQuery: Arama input'undan gelen arama sorgusu (boş = filtreleme yok)
  // Redux store’daki ui state’ini alır ve pagination + arama için kullanılan değerleri component içinde kullanılabilir hale getirir.
  const { currentPage, itemsPerPage, searchQuery } = useAppSelector(
    (state) => state.ui,
  );

  /**
   * useEffect: Veri Yükleme Mantığı
   *
   * Amaç: Sayfa açıldığında veya parametreler değiştiğinde ürünleri yüklemek
   *
   * Şu Adımlar İzlenir:
   * 1. Sayfa açıldığında SSR'dan initialData varsa ve Redux'ta ürün yoksa → onu kullan (fast)
   * 2. Sayfa numarası, sayfa boyutu veya arama sorgusu değişirse → API'den çek
   *
   * Bağımlılıklar (dependency array):
   * - dispatch: Redux dispatch fonksiyonu
   * - currentPage: Sayfa numarası değişirse tetiklenir (sayfalama)
   * - itemsPerPage: Sayfa boyutu değişirse tetiklenir
   * - searchQuery: Arama sorgusu değişirse tetiklenir (filtreleme)
   * - initialData: SSR verisi değişirse tetiklenir
   * - items.length: Ürün listesi boşsa tetiklenir
   *
   * Not: Sonsuz döngü olmaması için sadece gerekli bağımlılıklar include edilmiştir
   */

  const favItems = useAppSelector(selectFavorites);

  useEffect(() => {
    // STEP 1: Eğer SSR'dan initialData varsa ve henüz ürün yoksa, onu Redux'a kaydet
    // İlk açılışta bu block çalışır, API çağrısını gerekli kılar
    // Serverda render edildi initialData prop olarak geldi
    if (initialData && items.length === 0 && !searchQuery) {
      // Eğer Redux içinde zaten ürün varsa, bu sayfa zaten "canlı" hale gelmiştir; veriyi tekrar üzerine yazmaya gerek yoktur.
      // ? Eğer kullanıcı bir arama yapmışsa, sunucudan gelen genel (initial) veriler artık geçersizdir;
      // initialData'yı Redux state'e koy → items arrayına eklenir
      dispatch(setProducts(initialData));
      //Veriyi Redux state'ine "enjekte" eder.
      // Fonksiyondan çık, aşağıdaki API çağrısını yapma
      return;
    }

    // STEP 2: Sayfa numarası, arama sorgusu değişirse veya ilk açılışta API çağrısı yap
    // skip: Kaç ürünü atlayacağımızı hesapla
    // Örnek: page=1 → skip=0 (0. üründen başla)
    //        page=2 → skip=20 (20. üründen başla)
    //        page=3 → skip=40 (40. üründen başla)
    const skip = (currentPage - 1) * itemsPerPage; // (2-1)*20=20 21.üründen başla

    // API'ye istek gönder: limit, skip (pagination) ve search parametreleriyle
    dispatch(
      fetchProductsAsync({ limit: itemsPerPage, skip, search: searchQuery }),
    );
  }, [
    dispatch,
    currentPage,
    itemsPerPage,
    initialData,
    items.length,
    searchQuery,
  ]);

  /**
   * Sayfalama Butonlarında Sayfa Değiştir
   *
   * @param _ - Değişim olayı (kullanılmıyor)
   * @param page - Kullanıcı tıkladığı hedef sayfa numarası (1, 2, 3 vs.)
   *
   * Flow:
   * 1. setPage(page) Redux'a aktion gönder
   * 2. Redux state güncellenir: currentPage = page
   * 3. useEffect bağımlılığı tetiklenir → API çağrısı yapılır
   * 4. Yeni ürünler yüklenir ve gösterilir
   */ //React.ChangeEvent<unknown> ifadesi, bu fonksiyonun bir değişim olayından tetiklendiğini belirten tip tanımlamasıdır.
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    //{_}bu parametreyi alıyorum ama kullanmayacağım" anlamına gelir
    // Redux'a eylem gönder: currentPage'i güncelle
    dispatch(setPage(page)); //hang' sayfa numarasına tıklandığını bize otomatik olarak gönderir
  };

  // ═══════════════════════════════════════════════════════════
  // LOADING STATE (Sayfa açılırken, API isteği yapılırken)
  // ═══════════════════════════════════════════════════════════
  // API isteği devam ediyor mu? Eğer yükleniyor ve henüz ürün yoksa, yükleniyor göstergesi göster
  if (loading && items.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        {/* MUI CircularProgress: Dönen yükleniyor ikonu */}
        <CircularProgress />
      </Box>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // ERROR STATE (API isteği başarısızsa)
  // ═══════════════════════════════════════════════════════════
  // Eğer hata varsa, kırmızı hata mesajı göster
  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // RENDER BAŞLANGICI
  // ═══════════════════════════════════════════════════════════
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* BAŞLIK BÖLÜMÜ */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        fontWeight="bold"
        color="primary"
      >
        Discover Products
      </Typography>

      {/* AÇIKLAMA: Kaç ürün bulundu? */}
      <Typography variant="subtitle1" gutterBottom color="text.secondary">
        {total} products found
      </Typography>

      {/* ═══════════════════════════════════════════════════════════
               ÜRÜN KART GRID'İ (Responsive Düzen)
               ═══════════════════════════════════════════════════════════

               Grid Yapısı (breakpoint'lere göre sütun sayısı):
               - xs (mobil, 0px+): 1 sütun
               - sm (tablet, 600px+): 2 sütun
               - md (masa üstü, 900px+): 3 sütun
               - lg (geniş ekran, 1200px+): 4 sütun

               gap: 3 → bütün kartlar arasında 24px boşluk
            */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)", // Mobil: 1 sütun
            sm: "repeat(2, 1fr)", // Tablet: 2 sütun
            md: "repeat(3, 1fr)", // Masa üstü: 3 sütun
            lg: "repeat(4, 1fr)", // Geniş ekran: 4 sütun
          },
          gap: 3, // Kartlar arasında 24px boşluk
          mt: 2, // Üst boşluk
        }}
      >
        {/* items array'inin her ürünü için bir kart render et */}
        {items.map((product) => {
          const isFav = favItems.some((i) => i.productId === product.id);
          return (
            // Box wrapper: Her kartın ID'sini unique key olarak kullan (React re-render optimization) silindiğini veya eklendiğini bu kimlik (ID) sayesinde anlar.
            <Box key={String(product.id)} sx={{ height: "100%" }}>
              {/* Link: Ürün detay sayfasına gitme (/products/[id])  */}
              <Link
                href={`/products/${product.id}`}
                style={{ textDecoration: "none" }}
              >
                {/* ÜRÜN KARTI - MUI Card Bileşeni */}
                <Card
                  sx={{
                    position: "relative",
                    height: "420px", // Sabit yükseklik (tüm kartlar aynı boyut)
                    display: "flex", // Flex container
                    flexDirection: "column", // İçerik dikey dizilim

                    // Hover Efektleri (fare üzerindeyk animation)
                    transition: "transform 0.2s, box-shadow 0.2s", // Smooth animasyon
                    "&:hover": {
                      transform: "translateY(-4px)", // 4px yukarı kaldır
                      boxShadow: 4, // Gölgeyi artır (3D efekti)
                      cursor: "pointer", // Tıklanabilir olduğunu göster
                    },
                  }}
                >
                  {/* 1. ÜRÜN RESMİ BÖLÜMÜ */}
                  <CardMedia
                    component="img" // HTML <img> tag'ı olarak render et
                    height="180" // Görsel yüksekliği 180px
                    image={product.thumbnail} // Ürün resmi URL'i (API'den)
                    alt={product.title} // Alternatif metin (SEO, erişilebilirlik)
                    sx={{
                      objectFit: "contain", // Resmi uzat/sıkıştırma olmadan göster
                      p: 2, // İçeride 8px padding
                      bgcolor: "#f5f5f5", // Açık gri arka plan
                      minHeight: "180px", // Minimum yükseklik
                      maxHeight: "180px", // Maximum yükseklik (sabit)
                    }}
                  />

                  {/* 2. KART İÇERİĞİ BÖLÜMÜ */}
                  <CardContent sx={{ flexGrow: 1 }}>
                    {" "}
                    {/* flexGrow: Boş alan var ise bu bölüm genişlet her zaman aynı hizada, en altta görünür. */}
                    {/* ÜRÜN BAŞLIĞI (2 satırla sınırlı, taşan metni ... ile kıs) */}
                    <Typography
                      gutterBottom
                      variant="h6" // h6 heading (daha küçük)
                      component="div" // SEO veya HTML yapısı açısından bu başlığın bir <div> etiketi olarak işlenmesini sağlar.
                      sx={{
                        overflow: "hidden", // Taşan içeriği gizle
                        textOverflow: "ellipsis", // Taşan metni ... ile bitir
                        display: "-webkit-box", // Webkit (Chrome, Safari) box model ben bu metni dikey bir kutu gibi yönetmek istiyorum
                        WebkitLineClamp: 2, // Ürün ismi ne kadar uzun olursa olsun, sadece 2 satır gösterir.
                        WebkitBoxOrient: "vertical", // Dikey yönelim
                        minHeight: "64px", // Minimum yükseklik (2 satır kadar)Böylece yan yana duran iki kartın boyu bozulmaz, biri kısa biri uzun görünmez.
                      }}
                    >
                      {product.title}
                    </Typography>
                    {/* KATEGORİ */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {" "}
                      {/* ufak bir alt boşluk ekle */}
                      {product.category}
                    </Typography>
                    {/* PUANLAMA: Yıldızlar ve Puan Numarası */}
                    <Box display="flex" alignItems="center" mb={1}>
                      {/* Rating: 0-5 yıldız göstergesi */}
                      <Rating
                        value={product.rating}
                        readOnly
                        size="small"
                        precision={0.5}
                      />
                      {/* Puan numarası (metin) {0.5 ile dolu yıldızlar} */}
                      <Typography variant="caption" ml={1}>
                        ({product.rating})
                      </Typography>
                    </Box>
                    {/* FİYAT (Yeşil renk, yazı kalın) */}
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ${product.price}
                    </Typography>
                    {/* SEPETE EKLE BUTONU */}
                    <Button
                      variant="outlined" // Boş buton (outline style) içi boş gözükür
                      size="small" // Küçük boyut
                      fullWidth // Tam genişlik (kart genişliğine kadar) kaplar
                      startIcon={<ShoppingCart />} // Sepet ikonu sola
                      disabled={product.stock <= 0} // Stok yoksa tıklanamaz
                      onClick={(e) => {
                        // TIKLAMA DAVRANIŞI
                        e.preventDefault(); // Sayfaya gitme (Link davranışı) engelle sadece sepete ekleme işleminin yapılmasını sağla.
                        e.stopPropagation(); // Event bubbling durur sadece butona tıkla, kartın tıklama özelliğini çalıştırma

                        // Redux'a sepete ekleme eylemi gönder
                        dispatch(
                          addToCart({
                            productId: product.id,
                            quantity: 1, // 1 adet ekle
                            title: product.title,
                            price: product.price,
                            thumbnail: product.thumbnail,
                          }),
                        );
                      }}
                      sx={{ mt: 1 }} // Üst boşluk
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault(); // karta tıklayıp sayfa değiştirmesini engelle
                      e.stopPropagation(); // balonu patlat sadece butonu tıkla
                      // Redux komutunu yolla!
                      dispatch(
                        toggleFavorite({
                          productId: product.id,
                          title: product.title,
                          price: product.price,
                          thumbnail: product.thumbnail,
                        }),
                      );
                    }}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {/* isFav true ise KIRMIZI DOLU kalp, false ise BOŞ GRİ kalp çiz */}
                    {isFav ? <Favorite color="error" /> : <FavoriteBorder />}
                  </IconButton>
                </Card>
              </Link>
            </Box>
          );
        })}
      </Box>

      {/* ═══════════════════════════════════════════════════════════
               SAYFALAMA KONTROL BÖLÜMÜ
               ═══════════════════════════════════════════════════════════

               Kullanıcı sayfa numaralarını tıklayarak farklı ürün setleri görebilir.

               Math.ceil(total / itemsPerPage):
               - total = 100 ürün
               - itemsPerPage = 20
               - 100 / 20 = 5 sayfa
            */}
      <Box display="flex" justifyContent="center" mt={4}>
        {/* Pagination Bileşeni: Sayfa numarası butonları göster */}
        <Pagination //MUI ile gelen 1 2 3 sayfa sayılarını iler/geri tuşları ekler
          count={Math.ceil(total / itemsPerPage)} // Toplam sayfa sayısı hesapla bölme işlemine göre sayfa sayısını yuvarla 10.5 ~ 11
          page={currentPage} // Şu anda seçili sayfa numarası aktif sayfayı temsil eder
          onChange={handlePageChange} // Sayfa düğmesine tıklandıkça çalış state günceller yeni sayfayı yükler
          color="primary" // Mavi renk (tema rengine göre)
          size="large" // Daha büyük butonlar
        />
      </Box>
    </Container>
  );
}
