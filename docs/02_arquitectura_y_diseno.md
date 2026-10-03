# Documento de Arquitectura de Software & Especificación de APIs

> **Proyecto:** Strata ERP — SaaS Enterprise Business Intelligence & Inventory Engine  
> **Autora & Arquitecta de Software:** Jhamile Macavilca  

---

## 1. Vista de Arquitectura de Software

El sistema sigue una **Arquitectura de Microservicios Desacoplada / N-Capas** con separación estricta entre el cliente Web de presentación, el servidor de aplicaciones de lógica de negocio y el motor de persistencia de datos con caché Redis.

`mermaid
graph TD
    Client[Cliente Web SPA / Client Layer] -->|HTTP REST / JSON| Gateway[API Gateway & Auth Middleware]
    
    subgraph Backend Application Services
        Gateway --> AuthSvc[Servicio de Autenticación & RBAC]
        Gateway --> AnalyticsSvc[Servicio de Analítica Financiera]
        Gateway --> InventorySvc[Servicio de Inventarios]
    end
    
    subgraph Data Layer
        AnalyticsSvc --> Postgres[(PostgreSQL DB)]
        InventorySvc --> Postgres
        InventorySvc -->|Cache Query <5ms| Redis[(Redis Cache)]
    end
`

---

## 2. Modelo Entidad-Relación de Base de Datos (PostgreSQL)

`sql
-- Tabla de Usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Roles RBAC
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    can_view_costs BOOLEAN DEFAULT FALSE,
    can_manage_inventory BOOLEAN DEFAULT FALSE,
    can_export_reports BOOLEAN DEFAULT FALSE
);

-- Tabla de Productos / Servicios
CREATE TABLE products (
    id VARCHAR(20) PRIMARY KEY, -- SKU-XXXX
    name VARCHAR(150) NOT NULL,
    category_id INT REFERENCES categories(id),
    stock INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 10,
    unit_cost DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT ''Normal'',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`

---

## 3. Especificación de Endpoints REST API

### 3.1 Analítica Financiera (/api/v1/analytics)
* GET /api/v1/analytics/kpis
  * **Respuesta (200 OK):**
    `json
    {
       mrr: 125400,
      totalInventoryValue: 1480000,
      activeAccounts: 24932,
      turnoverRate: 4.8
    }
    `

### 3.2 Gestión de Inventario (/api/v1/inventory)
* GET /api/v1/inventory?search=AWS
* POST /api/v1/inventory
  * **Payload (Body):**
    `json
    {
      name: Servidor NGINX Enterprise Node,
      category: Infraestructura Cloud,
      stock: 30,
      minStock: 10,
      unitCost: 120.00,
      unitPrice: 280.00
    }
    `

---

© 2026 Jhamile Macavilca — Especificación de Arquitectura de Software.
