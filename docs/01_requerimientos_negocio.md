# Documento de Requerimientos de Negocio y Sistema (BRD / SRS)

> **Proyecto:** Strata ERP — SaaS Enterprise Business Intelligence & Inventory Engine  
> **Autora & Arquitecta de Software:** Jhamile Macavilca (Desarrolladora Web y Sistemas con Análisis de Negocio)  
> **Versión:** 1.0.0  
> **Fecha:** Octubre 2026  

---

## 1. Introducción y Problema de Negocio

### 1.1 Contexto
Las empresas que gestionan infraestructura tecnológica, licencias SaaS y servicios en la nube a gran escala enfrentan dificultades críticas para mantener visibilidad sobre el costo real de sus activos, el margen de ganancia neto y los niveles mínimos de seguridad en su inventario.

### 1.2 Declaración del Problema
* **Falta de visibilidad financiera en tiempo real:** Los reportes de métricas ejecutivas (MRR, ARR, Churn Rate) suelen procesarse con días de retraso.
* **Riesgo de desabastecimiento:** La falta de alertas automatizadas de stock provoca interrupciones operativas cuando las licencias o servicios críticos caducan o se agotan.
* **Fugas de datos por falta de RBAC:** Usuarios con perfiles operativos tienen acceso no restringido a costos unitarios y márgenes de ganancia confidenciales.

### 1.3 Solución Propuesta (Strata ERP)
Un sistema web SaaS inteligente que centraliza la analítica de negocio, automatiza el cálculo de métricas financieras recurrentes, emite alertas preventivas de reorden de inventario y restringe la información sensible mediante un control estricto de roles (RBAC).

---

## 2. Requerimientos Funcionales (RF)

| Código | Módulo | Descripción del Requerimiento | Prioridad |
| :--- | :--- | :--- | :--- |
| **RF-01** | **Analítica Financiera** | El sistema debe calcular automáticamente en tiempo real el MRR (Monthly Recurring Revenue), Valoración Total de Inventario y Tasa de Rotación. | **Alta (Must Have)** |
| **RF-02** | **Gráficos de Negocio** | El sistema debe presentar gráficos interactivos de crecimiento de ingresos mensuales y proyecciones de gasto. | **Alta (Must Have)** |
| **RF-03** | **Gestión de Inventario** | El sistema debe permitir listar, buscar, filtrar y registrar activos/servicios con SKU único, categoría, existencias, costo y precio de venta. | **Alta (Must Have)** |
| **RF-04** | **Alertas de Reorden** | El sistema debe calcular automáticamente el margen de ganancia (%) y marcar ítems con estado Normal, Reorden o Crítico según el stock mínimo. | **Alta (Must Have)** |
| **RF-05** | **Control de Acceso (RBAC)** | El sistema debe soportar 3 niveles de roles: *Administradora General*, *Analista de Negocios* y *Gerente de Almacén*, ocultando costos unitarios a perfiles sin autorización. | **Alta (Must Have)** |
| **RF-06** | **Exportación de Reportes** | El sistema debe permitir la exportación inmediata del catálogo e inventario filtrado a archivo de datos CSV. | **Media (Should Have)** |
| **RF-07** | **Gestión de Productos** | El sistema debe incluir un formulario modal interactivo para la creación inmediata de nuevos productos con validación de entradas. | **Media (Should Have)** |

---

## 3. Requerimientos No Funcionales (RNF)

| Código | Criterio | Especificación Técnica |
| :--- | :--- | :--- |
| **RNF-01** | **Rendimiento & Latencia** | Las consultas de tablero e inventario deben responder en menos de 100ms utilizando almacenamiento en memoria / caché Redis. |
| **RNF-02** | **Seguridad** | Autenticación basada en JWT (JSON Web Tokens) y aislamiento de datos por roles RBAC. |
| **RNF-03** | **Usabilidad & UI** | Interfaz en modo oscuro empresarial (Obsidian Theme) con contraste WCAG AA, accesible en navegadores desktop y móviles. |
| **RNF-04** | **Escalabilidad** | Arquitectura modular desacoplada lista para contenedorización en Docker. |

---

© 2026 Jhamile Macavilca — Documentación de Requerimientos de Negocio.
