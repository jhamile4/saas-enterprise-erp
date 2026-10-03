# Plan de Implementación, Sprints & Despliegue Cloud

> **Proyecto:** Strata ERP — SaaS Enterprise Business Intelligence & Inventory Engine  
> **Autora:** Jhamile Macavilca  

---

## 1. Plan de Implementación por Sprints (Metodología Ágil / Scrum)

`mermaid
gantt
    title Plan de Implementación por Sprints - Strata ERP
    dateFormat  YYYY-MM-DD
    section Sprint 1: Análisis & BD
    Levantamiento de Requerimientos & Modelo ER :done, s1, 2026-10-01, 3d
    Diseño de Arquitectura & Esquema Postgres  :done, s2, 2026-10-04, 3d
    section Sprint 2: Core Frontend & RBAC
    Diseño de Interfaz Obsidian Dark UI         :done, s3, 2026-10-07, 4d
    Lógica de KPIs Financieros & Roles RBAC     :done, s4, 2026-10-11, 4d
    section Sprint 3: REST API & Docker
    Implementación de Endpoints REST API       :active, s5, 2026-10-15, 5d
    Cacheo con Redis & Contenedores Docker     :s6, 2026-10-20, 4d
    section Sprint 4: QA & Despliegue Cloud
    Pruebas de Carga & Integración Continua    :s7, 2026-10-24, 3d
    Despliegue en Vercel & Render Cloud        :s8, 2026-10-27, 2d
`

---

## 2. Estrategia de Despliegue en la Nube (Cloud Deployment)

1. **Frontend App (SPA):** Desplegado en **Vercel** (https://saas-enterprise-demo.vercel.app).
2. **Backend API REST:** Desplegado en **Render** o **Railway** con Docker Container.
3. **Database & Cache:** Instancia de **PostgreSQL en Supabase** + **Redis Cloud Store**.

---

## 3. Comandos de Despliegue Local & Producción

### Ejecución Local con Docker Compose
`ash
docker-compose up --build -d
`

### Monitoreo de Logs de Producción
`ash
docker-compose logs -f app
`

---

© 2026 Jhamile Macavilca — Plan de Implementación & Despliegue.
