# URL yapısı

Site statik HTML olarak `/tr/...` ve `/en/...` altında yayınlanır. Makale içerikleri `tr/hukuki-alanlar/{alan}/{slug}/` ve `en/legal-areas/{area}/{slug}/` yollarındadır.

`.htaccess` içinde eski düz `.html` dosya adlarına veya var olmayan `makale-detay.html` gibi adreslere özel 301 kuralı **yoktur** (dışarıda yayınlanmış eski link olmadığı için).

Kök istekler: `/` ve `/index.html` → `/tr/` yönlendirmesi `.htaccess` ile tanımlıdır.
