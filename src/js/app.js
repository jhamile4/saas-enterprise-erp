/**
 * STRATA ERP — SAAS ENTERPRISE BUSINESS ANALYTICS & INVENTORY
 * Application Engine & Business Logic
 * Developed by Jhamile Macavilca (Desarrolladora Web y Sistemas con Análisis de Negocio)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inventory Dataset
  let inventoryData = [
    { id: "SKU-9021", name: "AWS Cloud Server Instances (m5.2xlarge)", category: "Infraestructura Cloud", stock: 45, minStock: 20, unitCost: 320, unitPrice: 580, status: "Normal" },
    { id: "SKU-8812", name: "Licencias SaaS Enterprise (Per Seat)", category: "Licencias Software", stock: 12, minStock: 15, unitCost: 45, unitPrice: 99, status: "Reorden" },
    { id: "SKU-7734", name: "Cisco Core Gateway Router 9000", category: "Hardware Redes", stock: 4, minStock: 5, unitCost: 2400, unitPrice: 4200, status: "Reorden" },
    { id: "SKU-6120", name: "PostgreSQL High-Availability Node", category: "Infraestructura Cloud", stock: 28, minStock: 10, unitCost: 180, unitPrice: 390, status: "Normal" },
    { id: "SKU-5409", name: "Wildcard SSL/TLS Security Certificates", category: "Seguridad", stock: 2, minStock: 8, unitCost: 120, unitPrice: 299, status: "Crítico" },
    { id: "SKU-4115", name: "Redis Enterprise Cache Cluster", category: "Infraestructura Cloud", stock: 19, minStock: 10, unitCost: 150, unitPrice: 320, status: "Normal" }
  ];

  // RBAC Roles & Permissions Schema
  const rolePermissions = {
    admin: { name: "Administradora General", showCost: true, canAdd: true, canExport: true },
    analyst: { name: "Analista de Negocios", showCost: true, canAdd: false, canExport: true },
    warehouse: { name: "Gerente de Almacén", showCost: false, canAdd: true, canExport: false }
  };

  let currentRole = "admin";

  // Elements
  const inventoryTableBody = document.getElementById('inventoryTableBody');
  const searchInput = document.getElementById('searchInput');
  const rbacSelect = document.getElementById('rbacSelect');
  const roleBadge = document.getElementById('roleBadge');
  const exportBtn = document.getElementById('exportBtn');
  const addProductBtn = document.getElementById('addProductBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const productForm = document.getElementById('productForm');

  // KPI Elements
  const mrrValue = document.getElementById('mrrValue');
  const revenueValue = document.getElementById('revenueValue');
  const activeClientsValue = document.getElementById('activeClientsValue');
  const turnoverValue = document.getElementById('turnoverValue');

  // Render KPIs
  function renderKPIs() {
    let totalInventoryValue = inventoryData.reduce((acc, item) => acc + (item.stock * item.unitPrice), 0);
    let totalStock = inventoryData.reduce((acc, item) => acc + item.stock, 0);

    if (mrrValue) mrrValue.textContent = `$${(totalInventoryValue * 0.18).toLocaleString('en-US', {maximumFractionDigits: 0})}`;
    if (revenueValue) revenueValue.textContent = `$${(totalInventoryValue).toLocaleString('en-US', {maximumFractionDigits: 0})}`;
    if (activeClientsValue) activeClientsValue.textContent = `${(totalStock * 14).toLocaleString()}`;
    if (turnoverValue) turnoverValue.textContent = `${(4.8).toFixed(1)}x`;
  }

  // Render Inventory Data Table
  function renderTable(filterText = '') {
    if (!inventoryTableBody) return;
    inventoryTableBody.innerHTML = '';

    const permissions = rolePermissions[currentRole];

    const filtered = inventoryData.filter(item => 
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.category.toLowerCase().includes(filterText.toLowerCase()) ||
      item.id.toLowerCase().includes(filterText.toLowerCase())
    );

    filtered.forEach(item => {
      // Calculate Margin
      const margin = (((item.unitPrice - item.unitCost) / item.unitPrice) * 100).toFixed(1);
      
      // Determine Status Pill
      let statusClass = "status-normal";
      if (item.stock <= item.minStock / 2) {
        statusClass = "status-critical";
        item.status = "Crítico";
      } else if (item.stock <= item.minStock) {
        statusClass = "status-reorder";
        item.status = "Reorden";
      } else {
        statusClass = "status-normal";
        item.status = "Normal";
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-family: monospace; font-weight:700; color: var(--accent-cyan);">${item.id}</td>
        <td style="font-weight: 700;">${item.name}</td>
        <td>${item.category}</td>
        <td style="font-weight:800;">${item.stock} unidades</td>
        ${permissions.showCost ? `<td>$${item.unitCost}</td>` : `<td>—</td>`}
        <td style="font-weight:700;">$${item.unitPrice}</td>
        ${permissions.showCost ? `<td style="color: var(--accent-green); font-weight:700;">${margin}%</td>` : `<td>—</td>`}
        <td><span class="status-pill ${statusClass}">${item.status}</span></td>
      `;
      inventoryTableBody.appendChild(tr);
    });

    // Update Action Buttons based on RBAC
    if (addProductBtn) addProductBtn.style.display = permissions.canAdd ? 'flex' : 'none';
    if (exportBtn) exportBtn.style.display = permissions.canExport ? 'flex' : 'none';
  }

  // Draw Revenue Chart Canvas
  function drawChart() {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 250;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Data Points (Monthly Revenue in Thousands)
    const data = [65, 78, 92, 88, 105, 125.4];
    const labels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];

    const padding = 40;
    const graphWidth = width - (padding * 2);
    const graphHeight = height - (padding * 2);

    const maxVal = 140;
    const minVal = 40;

    // Draw Grid Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      let y = padding + (graphHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw Line & Gradient
    ctx.beginPath();
    let points = [];
    data.forEach((val, i) => {
      let x = padding + (graphWidth / (data.length - 1)) * i;
      let y = padding + graphHeight - ((val - minVal) / (maxVal - minVal)) * graphHeight;
      points.push({x, y});
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    // Stroke Line
    ctx.strokeStyle = "#c9a063";
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Fill Gradient under curve
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.lineTo(points[0].x, height - padding);
    ctx.closePath();

    let gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, "rgba(201, 160, 99, 0.35)");
    gradient.addColorStop(1, "rgba(201, 160, 99, 0.0)");
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw Glowing Points & Labels
    points.forEach((pt, i) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#c9a063";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Labels
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "12px Plus Jakarta Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(labels[i], pt.x, height - 12);
    });
  }

  // RBAC Select Listener
  if (rbacSelect) {
    rbacSelect.addEventListener('change', (e) => {
      currentRole = e.target.value;
      if (roleBadge) roleBadge.textContent = rolePermissions[currentRole].name;
      renderTable(searchInput ? searchInput.value : '');
    });
  }

  // Search Input Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderTable(e.target.value);
    });
  }

  // Export CSV Handler
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      let csvContent = "data:text/csv;charset=utf-8,ID,Nombre,Categoria,Stock,PrecioVenta,Estado\n";
      inventoryData.forEach(item => {
        csvContent += `${item.id},"${item.name}",${item.category},${item.stock},${item.unitPrice},${item.status}\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Strata_ERP_Inventario_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Modal Handlers
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
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newId = `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
      const newItem = {
        id: newId,
        name: document.getElementById('prodName').value,
        category: document.getElementById('prodCategory').value,
        stock: parseInt(document.getElementById('prodStock').value),
        minStock: parseInt(document.getElementById('prodMinStock').value) || 10,
        unitCost: parseFloat(document.getElementById('prodCost').value),
        unitPrice: parseFloat(document.getElementById('prodPrice').value),
        status: "Normal"
      };

      inventoryData.unshift(newItem);
      renderKPIs();
      renderTable();
      drawChart();
      modalBackdrop.classList.remove('active');
      productForm.reset();
    });
  }

  // Window Resize Redraw Chart
  window.addEventListener('resize', drawChart);

  // Init
  renderKPIs();
  renderTable();
  drawChart();
});
