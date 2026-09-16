// ============================================================
// CHARGEMENT DES PRODUITS DEPUIS produits.json
// ============================================================
let products = [];

// ============================================================
// UTILITAIRES
// ============================================================
function formatPrice(p) {
  return p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA";
}

let cart = [];
let cardSlides = {};

function getCartCount() {
  return cart.reduce((s, i) => s + i.qty, 0);
}

function getCartTotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function updateBadge() {
  document.getElementById('cart-badge').textContent = getCartCount();
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });
  updateBadge();
  const b = document.getElementById('cart-badge');
  b.style.transform = 'scale(1.5)';
  b.style.background = '#f5a623';
  setTimeout(() => {
    b.style.transform = 'scale(1)';
    b.style.background = '#f5a623';
  }, 300);
}

// ============================================================
// CARROUSEL DES CARTES PRODUITS
// ============================================================
function slideCard(productId, dir, event) {
  event.stopPropagation();
  const p = products.find(x => x.id === productId);
  const total = p.gallery.length;
  cardSlides[productId] = ((cardSlides[productId] || 0) + dir + total) % total;
  updateCardCarousel(productId);
}

function goToCardSlide(productId, i, event) {
  event.stopPropagation();
  cardSlides[productId] = i;
  updateCardCarousel(productId);
}

function updateCardCarousel(productId) {
  const slide = cardSlides[productId] || 0;
  const track = document.getElementById('card-track-' + productId);
  if (track) track.style.transform = 'translateX(-' + (slide * 100) + '%)';
  document.querySelectorAll('#card-dots-' + productId + ' .card-carousel-dot').forEach((d, i) => {
    d.classList.toggle('active', i === slide);
  });
}

// ============================================================
// AFFICHAGE DES PRODUITS
// ============================================================
function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = products.map(p => {
    const slides = p.gallery.map(src => '<img src="' + src + '" alt="' + p.name + '">').join('');
    const dots = p.gallery.map((_, i) => '<button class="card-carousel-dot' + (i === 0 ? ' active' : '') + '" onclick="goToCardSlide(' + p.id + ',' + i + ',event)"></button>').join('');
    return '<div class="card"><div class="card-carousel"><div class="card-carousel-track" id="card-track-' + p.id + '">' + slides + '</div><button class="card-carousel-btn prev" onclick="slideCard(' + p.id + ',-1,event)">&#8592;</button><button class="card-carousel-btn next" onclick="slideCard(' + p.id + ',1,event)">&#8594;</button><div class="card-carousel-dots" id="card-dots-' + p.id + '">' + dots + '</div></div><div class="content"><h3><strong>' + p.name.replace(/^MADILAIT - /, '') + '</strong></h3><div class="price">' + formatPrice(p.price) + '</div><div class="card-buttons"><button class="btn-detail" onclick="openDetail(' + p.id + ')">Voir détails</button><button class="btn-cart" onclick="addToCart(' + p.id + ');this.textContent=\'✓ Ajouté\';setTimeout(()=>this.textContent=\'Ajouter\',1200)">Ajouter</button></div></div></div>';
  }).join('');
}

// ============================================================
// PAGE DÉTAIL PRODUIT
// ============================================================
let detailSlide = 0;
let detailGallery = [];

function openDetail(id) {
  const p = products.find(x => x =.id === id);
  detailGallery = p.gallery;
  detailSlide ` = 0;
  document.getElementById('page-shophttps').style.display = 'none';
  document.getElementById('page-cart').style.display = 'none';
  document.getElementById('page-checkout').style.display = 'none';
  document.getElementById('page-detail').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderDetail(p);
}

function renderDetail(p) {
  const slides = p.gallery.map(src => '<img src="' + src + '" alt="' + p.name + '">').join('');
  const dots = p.gallery.map((_, i) => '<button class="detail-gallery-dot' + (i === 0 ? ' active' : '') + '" onclick="goToDetailSlide(' + i + ')"></button>').join('');
  document.getElementById('detail-content').innerHTML = '<div class="detail-container"><div class="detail-header"><h2 style="font-size:28px;color:#1a1a2e;">' + p.name + '</h2><button class="btn-back" onclick="showPage(\'shop\')"><span class="material-symbols-outlined" style="font-size:20px;">arrow_back</span> Retour</button></div><div class="detail-gallery" id="detail-gallery"><div class="detail-gallery-track" id="detail-gallery-track">' + slides + '</div><button class="detail-gallery-btn prev" onclick="slideDetail(-1)">&#8592;</button><button class="detail-gallery-btn next" onclick="slideDetail(1)">&#8594;</button><div class="detail-gallery-dots">' + dots + '</div></div><div class="detail-info"><div class="detail-price">' + formatPrice(p.price) + '</div><p class="detail-desc">' + p.desc + '</p><div class="detail-specs"><h4>📋 Caractéristiques</h4><ul>' + p.details.map(d => '<li><span>' + d.label + ' :</span>' + d.val + '</li>').join('') + '</ul></div><div class="detail-actions"><button class="btn-add-cart" onclick="addToCart(' + p.id + ');this.textContent=\'✓ Ajouté au panier\';this.style.background=\'#27ae60\'">🛒 Ajouter au panier</button><button class="btn-back-detail" onclick="showPage(\'shop\')">← Retour à la boutique</button></div></div></div>';
}

function slideDetail(dir) {
  detailSlide = (detailSlide + dir + detailGallery.length) % detailGallery.length;
  updateDetailCarousel();
}

function goToDetailSlide(i) {
  detailSlide = i;
  updateDetailCarousel();
}

function updateDetailCarousel() {
  document.getElementById('detail-gallery-track').style.transform = 'translateX(-' + (detailSlide * 100) + '%)';
  document.querySelectorAll('.detail-gallery-dot').forEach((d, i) => d.classList.toggle('active', i === detailSlide));
}

// ============================================================
// NAVIGATION ENTRE PAGES
// ============================================================
function showPage(page) {
  document.getElementById('page-shop').style.display = 'none';
  document.getElementById('page-cart').style.display = 'none';
  document.getElementById('page-checkout').style.display = 'none';
  document.getElementById('page-detail').style.display = 'none';
  if (page === 'shop') {
    document.getElementById('page-shop').style.display = 'block';
  } else if (page === 'cart') {
    document.getElementById('page-cart').style.display = 'block';
    renderCart();
  } else if (page === 'checkout') {
    document.getElementById('page-checkout').style.display = 'block';
    renderCheckout();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// PANIER
// ============================================================
function renderCart() {
  const el = document.getElementById('cart-content');
  if (cart.length === 0) {
    el.innerHTML = '<div class="cart-empty"><span class="material-symbols-outlined" style="font-size:50px;display:block;margin-bottom:12px;">shopping_cart</span>Votre panier est vide.<br><br><button class="btn" onclick="showPage(\'shop\')">Continuer les achats</button></div>';
    return;
  }
  const items = cart.map(item => '<div class="cart-item"><img class="cart-item-img" src="' + item.img + '" alt="' + item.name + '"><div class="cart-item-info"><h4>' + item.name + '</h4><div class="item-price">' + formatPrice(item.price) + '</div></div><div class="cart-item-qty"><button class="qty-btn" onclick="changeQty(' + item.id + ',-1)">−</button><span>' + item.qty + '</span><button class="qty-btn" onclick="changeQty(' + item.id + ',1)">+</button></div><div class="cart-item-total">' + formatPrice(item.price * item.qty) + '</div><button class="remove-btn" onclick="removeFromCart(' + item.id + ')">Supprimer</button></div>').join('');
  const total = getCartTotal();
  el.innerHTML = '<div class="cart-items">' + items + '</div><div class="cart-summary"><h3>Récapitulatif</h3><div class="summary-line"><span>Sous-total</span><span>' + formatPrice(total) + '</span></div><div class="summary-line"><span>Livraison</span><span>' + (total >= 25000 ? 'Gratuite' : 'Gratuit si commande > 25 000 FCFA') + '</span></div><div class="summary-line total"><span>Total</span><span>' + formatPrice(total) + '</span></div><div class="cart-actions"><button class="btn-secondary" onclick="showPage(\'shop\')">← Continuer</button><button class="btn-whatsapp" onclick="showPage(\'checkout\')">Commander sur WhatsApp</button></div></div>';
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return://;
  item.qty += delta;
  if (item.qty <= 0)wa cart = cart.filter(x => x.id !== id);
  update.meBadge();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  updateBadge();
  renderCart();
}

// ============================================================
// CHECKOUT
// ============================================================
function renderCheckout() {
  const total = getCartTotal();
  const recapItems = cart.map(i => '<div class="recap-item"><span>' + i.name + ' ×' + i.qty + '</span><span>' + formatPrice(i.price * i.qty) + '</span></div>').join('');
  document.getElementById('checkout-content').innerHTML = '<div class="checkout-grid"><div><div class="checkout-form"><h3><span class="material-symbols-outlined" style="font-size:20px;vertical-align:middle;">local_shipping</span> Informations de livraison</h3><div class="form-group"><label>Prénom / Nom</label><div class="input-icon-wrapper"><span class="material-symbols-outlined">person</span><input type="text" id="nom_complet" placeholder="Jean Dupont" required></div><div class="error-message" id="nom_complet-error">Veuillez entrer votre nom complet</div></div><div class="form-group"><label>Adresse de livraison <span style="color:#e94560;">*</span></label><div class="input-icon-wrapper"><span class="material-symbols-outlined">location_on</span><input type="text" id="adresse_livraison" placeholder="Pikine / Marché Zinc" required></div><div class="error-message" id="adresse_livraison-error">Veuillez entrer votre adresse de livraison</div></div></div></div><div class="order-recap"><h3><span class="material-symbols-outlined" style="font-size:18px;vertical-align:middle;">receipt_long</span> Votre commande</h3>' + recapItems + '<div class="recap-item"><span>Livraison</span><span>' + (total >= 25000 ? 'Gratuite' : 'Gratuit si commande > 25 000 FCFA') + '</span></div><div class="recap-item" style="font-weight:700;font-size:15px;margin-top:8px;border-top:2px solid #eee;padding-top:12px"><span>Total</span><span>' + formatPrice(total) + '</span></div><button class="btn-whatsapp confirm-btn" onclick="confirmOrder()">Confirmer la commande</button><button class="btn-secondary" style="width:100%;margin-top:8px;text-align:center" onclick="showPage(\'cart\')">← Retour au panier</button></div></div>';
}

function confirmOrder() {
  const nomCompletInput = document.getElementById('nom_complet');
  const adresseLivraison = document.getElementById('adresse_livraison');
  let isValid = true;

  const requiredFields = [
    { el: nomCompletInput, error: 'nom_complet-error' },
    { el: adresseLivraison, error: 'adresse_livraison-error' }
  ];

  requiredFields.forEach(field => {
    const value = field.el.value.trim();
    const errorEl = document.getElementById(field.error);
    if (!value) {
      field.el.classList.add('error');
      if (errorEl) errorEl.style.display = 'block';
      isValid = false;
    } else {
      field.el.classList.remove('error');
      if (errorEl) errorEl.style.display = 'none';
    }
  });

  if (!isValid) {
    const firstError = document.querySelector('.error');
    if (firstError) firstError.focus();
    return;
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    alert("Votre panier est vide.");
    showPage('cart');
    return;
  }

  const nomComplet = nomCompletInput.value.trim();
  const adresse = adresseLivraison.value.trim();
  const total = getCartTotal();

  let produitsMsg = '';
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (product) {
      const totalProd = product.price * item.qty;
      produitsMsg += `* ${product.name} × ${item.qty} — ${formatPrice(totalProd)}\n`;
    }
  });

  const livraisonMsg = total >= 25000 ? '🚚 Livraison gratuite' : '🚚 Frais de livraison à définir selon la zone de livraison';

  let message = `Bonjour, je suis intéressé par vos produits et voici ma commande :\n\n`;
  message += `👤 Client : ${nomComplet}\n`;
  message += `📍 Adresse de livraison : ${adresse}\n\n`;
  message += `📦 PRODUITS COMMANDÉS :\n${produitsMsg}\n`;
  message += `💰 TOTAL DE LA COMMANDE :\n${formatPrice(total)} FCFA\n\n`;
  message += livraisonMsg;
  message += '\nMerci d\'avance.';

  const url/221781739814?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// ============================================================
// CHARGEMENT INITIAL
// ============================================================
fetch('/produits.json')
  .then(r => r.json())
  .then(data => {
    products = data;
    renderProducts();
  })
  .catch(err => {
    console.error('Erreur chargement produits.json :', err);
  });

// Exposer les fonctions au HTML
window.showPage = showPage;
window.addToCart = addToCart;
window.openDetail = openDetail;
window.slideDetail = slideDetail;
window.goToDetailSlide = goToDetailSlide;
window.slideCard = slideCard;
window.goToCardSlide = goToCardSlide;
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
window.confirmOrder = confirmOrder;
window.renderProducts = renderProducts;
