// CoreVault — Filtro e ordenação de produtos (frontend puro)
// Lê os cards já presentes no DOM e os reordena/filtra conforme seleção.

function initProductFilter() {
  const grid = document.querySelector('.products-grid');
  if (!grid) return;

  // Monta a barra de filtros antes do grid
  const filterBar = document.createElement('div');
  filterBar.className = 'filter-bar';
  filterBar.innerHTML = `
    <label for="sort-select">Ordenar por</label>
    <select id="sort-select" class="filter-select">
      <option value="default">Padrão</option>
      <option value="price-asc">Menor preço</option>
      <option value="price-desc">Maior preço</option>
      <option value="name-asc">Nome A–Z</option>
    </select>
    <label for="brand-select" style="margin-left: 0.5rem;">Marca</label>
    <select id="brand-select" class="filter-select">
      <option value="all">Todas</option>
    </select>
    <span class="filter-count" id="filter-count"></span>
  `;
  grid.insertAdjacentElement('beforebegin', filterBar);

  // Coleta dados dos cards existentes
  const cards = Array.from(grid.querySelectorAll('.product-card'));
  const data = cards.map(card => {
    const priceText = card.querySelector('.price-value')?.textContent || 'R$ 0,00';
    const price = parseFloat(
      priceText.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
    );
    const name = card.querySelector('.product-name')?.textContent.trim() || '';
    const brand = card.querySelector('.product-brand')?.textContent.trim() || '';
    return { card, price, name, brand };
  });

  // Popula marcas únicas
  const brands = [...new Set(data.map(d => d.brand))].sort();
  const brandSelect = document.getElementById('brand-select');
  brands.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = b;
    brandSelect.appendChild(opt);
  });

  // Guarda ordem original
  const originalOrder = [...data];

  function applyFilters() {
    const sort = document.getElementById('sort-select').value;
    const brand = document.getElementById('brand-select').value;

    let filtered = [...data];

    // Filtra por marca
    if (brand !== 'all') {
      filtered = filtered.filter(d => d.brand === brand);
    }

    // Ordena
    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Padrão: restaura ordem original entre os filtrados
      filtered.sort((a, b) => originalOrder.indexOf(a) - originalOrder.indexOf(b));
    }

    // Oculta todos, mostra e reordena os filtrados
    data.forEach(d => { d.card.style.display = 'none'; });
    filtered.forEach(d => {
      d.card.style.display = '';
      grid.appendChild(d.card); // move para o final = reordena
    });

    // Atualiza contador
    const count = document.getElementById('filter-count');
    if (count) {
      count.textContent = filtered.length === data.length
        ? `${data.length} produto${data.length !== 1 ? 's' : ''}`
        : `${filtered.length} de ${data.length} produto${data.length !== 1 ? 's' : ''}`;
    }
  }

  document.getElementById('sort-select').addEventListener('change', applyFilters);
  document.getElementById('brand-select').addEventListener('change', applyFilters);

  // Inicializa o contador
  applyFilters();
}

document.addEventListener('DOMContentLoaded', initProductFilter);
