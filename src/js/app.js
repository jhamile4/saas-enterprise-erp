/**
 * STRATA ERP — SAAS ENTERPRISE BUSINESS ANALYTICS & INVENTORY ENGINE
 * Conectado a la Base de Datos Relacional mediante Express API & Prisma ORM
 * Desarrollado por Jhamile Macavilca (Desarrolladora Web y Sistemas con Análisis de Negocio)
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentRole = "admin";

  // Elementos DOM
  const inventoryTableBody = document.getElementById('inventoryTableBody');
  const searchInput = document.getElementById('searchInput');
  const rbacSelect = document.getElementById('rbacSelect');
  const roleBadge = document.getElementById('roleBadge');
  const exportBtn = document.getElementById('exportBtn');
  const addProductBtn = document.getElementById('addProductBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const productForm = document.getElementById('productForm');

  // Elementos KPI
  const mrrValue = document.getElementById('mrrValue');
  const revenueValue = document.getElementById('revenueValue');
  const activeClientsValue = document.getElementById('activeClientsValue');
  const turnoverValue = document.getElementById('turnoverValue');

  // 1. Cargar KPIs desde la API / Base de Datos
  async function loadKPIs() {
    try {
      const response = await fetch('/api/v1/analytics/kpis');
      const result = await response.json();

      if (result.success) {
        const data = result.data;
        if (mrrValue) mrrValue.textContent = `$${data.mrr.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
        if (revenueValue) revenueValue.textContent = `$${data.totalInventoryValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
        if (activeClientsValue) activeClientsValue.textContent = `${data.activeAccounts.toLocaleString()}`;
        if (turnoverValue) turnoverValue.textContent = `${data.turnoverRate.toFixed(1)}x`;
      }
    } catch (err) {
      console.error('Error cargando KPIs desde el backend:', err);
    }
  }

  // 2. Cargar Inventario desde la Base de Datos con RBAC
  async function loadInventory(filterText = '') {
    if (!inventoryTableBody) return;

    try {
      const response = await fetch(`/api/v1/inventory?role=${currentRole}&search=${encodeURIComponent(filterText)}`);
      const result = await response.json();

      if (!result.success) return;

      const products = result.data;
      inventoryTableBody.innerHTML = '';

      // Actualizar botones de acción según permisos RBAC retornados por el backend
      if (addProductBtn) addProductBtn.style.display = result.canAdd ? 'flex' : 'none';
      if (exportBtn) exportBtn.style.display = result.canExport ? 'flex' : 'none';

      products.forEach(item => {
        let statusClass = "status-normal";
        let statusText = "Normal";

        if (item.status === 'CRITICAL') {
          statusClass = "status-critical";
          statusText = "Crítico";
        } else if (item.status === 'REORDER') {
          statusClass = "status-reorder";
          statusText = "Reorden";
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="font-family: monospace; font-weight:700; color: var(--accent-cyan);">${item.id}</td>
          <td style="font-weight: 700;">${item.name}</td>
          <td>${item.category}</td>
          <td style="font-weight:800;">${item.stock} unidades</td>
          ${item.unitCost !== null ? `<td>$${item.unitCost.toFixed(2)}</td>` : `<td>—</td>`}
          <td style="font-weight:700;">$${item.unitPrice.toFixed(2)}</td>
          ${item.marginPercentage !== null ? `<td style="color: var(--accent-green); font-weight:700;">${item.marginPercentage}%</td>` : `<td>—</td>`}
          <td><span class="status-pill ${statusClass}">${statusText}</span></td>
        `;
        inventoryTableBody.appendChild(tr);
      });
    } catch (err) {
      console.error('Error cargando catálogo desde la Base de Datos:', err);
    }
  }

  // 3. Dibujar Gráfico de Ingresos Recurrentes (Canvas)
  function drawChart() {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 250;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const data = [65, 78, 92, 88, 105, 125.4];
    const labels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];

    const padding = 40;
    const graphWidth = width - (padding * 2);
    const graphHeight = height - (padding * 2);

    const maxVal = 140;
    const minVal = 40;

    // Líneas de grilla
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      let y = padding + (graphHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Dibujar Curva y Gradiente
    ctx.beginPath();
    let points = [];
    data.forEach((val, i) => {
      let x = padding + (graphWidth / (data.length - 1)) * i;
      let y = padding + graphHeight - ((val - minVal) / (maxVal - minVal)) * graphHeight;
      points.push({ x, y });
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = "#c9a063";
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.lineTo(points[0].x, height - padding);
    ctx.closePath();

    let gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, "rgba(201, 160, 99, 0.35)");
    gradient.addColorStop(1, "rgba(201, 160, 99, 0.0)");
    ctx.fillStyle = gradient;
    ctx.fill();

    // Puntos brillantes y etiquetas
    points.forEach((pt, i) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#c9a063";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#a1a1aa";
      ctx.font = "12px Plus Jakarta Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(labels[i], pt.x, height - 12);
    });
  }

  // 4. Selector de Roles RBAC
  if (rbacSelect) {
    rbacSelect.addEventListener('change', (e) => {
      currentRole = e.target.value;
      const roleNames = {
        admin: "Administradora General",
        analyst: "Analista de Negocios",
        warehouse: "Gerente de Almacén"
      };
      if (roleBadge) roleBadge.textContent = roleNames[currentRole] || "Administradora General";
      loadInventory(searchInput ? searchInput.value : '');
    });
  }

  // 5. Búsqueda en tiempo real
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      loadInventory(e.target.value);
    });
  }

  // 6. Exportación a CSV
  if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
      const response = await fetch(`/api/v1/inventory?role=${currentRole}`);
      const result = await response.json();
      if (!result.success) return;

      let csvContent = "data:text/csv;charset=utf-8,ID,Nombre,Categoria,Stock,PrecioVenta,Estado\n";
      result.data.forEach(item => {
        csvContent += `${item.id},"${item.name}",${item.category},${item.stock},${item.unitPrice},${item.status}\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Strata_ERP_Inventario_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // 7. Modal y Registro de Productos en Base de Datos
  if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
      if (modalBackdrop) modalBackdrop.classList.add('active');
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (modalBackdrop) modalBackdrop.classList.remove('active');
    });
  }

  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        name: document.getElementById('prodName').value,
        categoryName: document.getElementById('prodCategory').value,
        stock: parseInt(document.getElementById('prodStock').value),
        minStock: parseInt(document.getElementById('prodMinStock').value) || 10,
        unitCost: parseFloat(document.getElementById('prodCost').value),
        unitPrice: parseFloat(document.getElementById('prodPrice').value)
      };

      try {
        const response = await fetch('/api/v1/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.success) {
          await loadKPIs();
          await loadInventory();
          modalBackdrop.classList.remove('active');
          productForm.reset();
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (err) {
        console.error('Error al registrar producto en base de datos:', err);
      }
    });
  }

  // Evento resize para gráfico
  window.addEventListener('resize', drawChart);

  // Inicialización
  loadKPIs();
  loadInventory();
  drawChart();
});
