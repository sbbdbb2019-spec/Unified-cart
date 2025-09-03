const CATALOG = [
  { id: 'c1', name: 'Kirkland Tortilla Chips', store: 'Costco', category: 'Snacks', price: 5.99, tags: ['gluten-free'] },
  { id: 'c2', name: 'La Croix Variety (24)', store: 'Costco', category: 'Beverages', price: 9.49, tags: ['keto'] },
  { id: 'a1', name: 'Smartfood Popcorn', store: 'Amazon', category: 'Snacks', price: 6.49, tags: [] },
  { id: 't1', name: 'Good & Gather Trail Mix', store: 'Target', category: 'Snacks', price: 7.49, tags: [] }
];

const qs = (s, el=document) => el.querySelector(s);
const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));
const tpl = qs('#productTpl');
const productsEl = qs('#products');
const storeSel = qs('#storeFilter');
const cartItemsEl = qs('#cartItems');
const breakdownEl = qs('#storeBreakdown');
const grandTotalEl = qs('#grandTotal');

let state = { cart: {}, filters: { store: 'all', search: '' } };

function init(){
  populateStores();
  renderCatalog();
  bind();
  loadFromURL();
  renderCart();
}

function populateStores(){
  const stores = [...new Set(CATALOG.map(p=>p.store))];
  stores.forEach(s=>{
    const o = document.createElement('option'); o.value = s; o.textContent = s; storeSel.appendChild(o);
  });
}

function bind(){
  storeSel.addEventListener('change', e=> { state.filters.store = e.target.value; renderCatalog(); });
  qs('#searchInput').addEventListener('input', e=> { state.filters.search = e.target.value.toLowerCase(); renderCatalog(); });
  qs('#checkoutBtn').addEventListener('click', ()=> alert('Simulated checkout — per store orders will be created.'));
  qs('#shareBtn').addEventListener('click', shareCart);
}

function applyFilters(){
  return CATALOG.filter(p=>{
    if (state.filters.store !== 'all' && p.store !== state.filters.store) return false;
    if (state.filters.search && !(p.name.toLowerCase().includes(state.filters.search))) return false;
    return true;
  });
}

function renderCatalog(){
  productsEl.innerHTML = '';
  const products = applyFilters();
  products.forEach(p=>{
    const node = tpl.content.cloneNode(true);
    node.querySelector('.name').textContent = p.name;
    const badges = node.querySelector('.badges');
    const b = document.createElement('span'); b.className='badge'; b.textContent = p.store; badges.appendChild(b);
    node.querySelector('.price').textContent = `$${p.price.toFixed(2)}`;
    const addBtn = node.querySelector('.add');
    addBtn.addEventListener('click', ()=> addToCart(p.id));
    productsEl.appendChild(node);
  });
}

function addToCart(id){
  state.cart[id] = (state.cart[id]||0) + 1;
  renderCart();
}

function renderCart(){
  cartItemsEl.innerHTML = '';
  const items = Object.entries(state.cart).map(([id,qty])=>{
    const p = CATALOG.find(x=>x.id===id);
    return {...p, qty, lineTotal: p.price*qty};
  });
  items.forEach(i=>{
    const el = document.createElement('div'); el.textContent = `${i.qty} x ${i.name} — $${i.lineTotal.toFixed(2)}`;
    cartItemsEl.appendChild(el);
  });
  const byStore = {};
  items.forEach(i=> byStore[i.store] = (byStore[i.store]||0) + i.lineTotal);
  breakdownEl.innerHTML = Object.entries(byStore).map(([s,t])=> `${s}: $${t.toFixed(2)}`).join('<br>') || 'No items';
  const grand = items.reduce((s,i)=> s+i.lineTotal, 0);
  grandTotalEl.textContent = `$${grand.toFixed(2)}`;
}

function shareCart(){
  const q = new URLSearchParams();
  const arr = Object.entries(state.cart).map(([id,q])=> `${id}:${q}`);
  if (arr.length) q.set('cart', arr.join(','));
  const url = `${location.origin}${location.pathname}?${q.toString()}`;
  navigator.clipboard.writeText(url).then(()=> alert('Cart link copied to clipboard!'));
}

function loadFromURL(){
  const u = new URL(location.href);
  const c = u.searchParams.get('cart');
  if (!c) return;
  c.split(',').forEach(pair=>{
    const [id,qty] = pair.split(':');
    if (id) state.cart[id] = parseInt(qty||'1',10);
  });
}

document.addEventListener('DOMContentLoaded', init);
