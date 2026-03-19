# 🏗️ Arquitectura — Quanta Landing Pages

## Decisiones de Diseño

### ¿Por qué HTML/CSS/JS vanilla?

- **Velocidad de carga máxima** — sin bundle JS, sin runtime framework
- **LCP < 2.5s** alcanzable sin optimizaciones complejas
- **Cero dependencias** — nada que desactualizar o parchear
- **Curva de entrada mínima** para el equipo de marketing

### ¿Por qué una carpeta por campaña?

- Cada campaña es **completamente autónoma** — se puede desplegar de forma independiente
- Facilita el **A/B testing** entre versiones
- Permite **archivar** campañas sin afectar las activas
- El equipo de pauta puede revisar su campaña específica sin confusión

### ¿Por qué form-data.json separado?

- Los dropdowns del formulario **cambian con frecuencia** (nuevos países, industrias)
- El equipo no-técnico puede editar opciones **sin tocar HTML**
- En Fase 2, esta URL apuntará a un endpoint real (`/api/form-options`) que sirve datos desde base de datos

---

## Flujo de Datos

```
[Usuario llega a la landing]
        │
        ▼
[Carga de página]
  ├── Captura UTMs → sessionStorage
  ├── Genera/recupera session_id → sessionStorage
  └── fetch(form-data.json) → puebla dropdowns

        │
        ▼
[Usuario completa el formulario]
  └── Validación client-side (HTML5 + JS custom)

        │
        ▼
[Submit]
  └── Construye payload v1.0
  └── POST → FORM_ENDPOINT
        ├── 200 OK → estado "success" + pixels de conversión
        └── Error  → estado "error" + respaldo localStorage
```

---

## Payload Estandarizado (Contrato v1.0)

```json
{
  "schema_version": "1.0",
  "timestamp":      "ISO 8601",
  "source":         "landing_quanta",
  "campaign": {
    "name":         "manufactura-general-2026",
    "utm_source":   "facebook",
    "utm_medium":   "cpc",
    "utm_campaign": "manufactura-bogota-q1",
    "utm_content":  "",
    "utm_term":     "",
    "gclid":        "",
    "fbclid":       ""
  },
  "lead": {
    "nombre":         "Juan Pérez",
    "empresa":        "Industrias XYZ",
    "indicativo":     "+57",
    "telefono":       "+57 310 000 0000",
    "email":          "juan@xyz.com",
    "industria":      "manufactura-general",
    "tamano_empresa": "51-200",
    "operarios":      "31-100"
  },
  "metadata": {
    "landing_url":  "https://quantapro.com.co/landing/manufactura-general",
    "referrer":     "https://www.facebook.com/",
    "user_agent":   "Mozilla/5.0...",
    "session_id":   "qs_1234567890_abc123",
    "ip_hash":      ""
  }
}
```

> ⚠️ **Este contrato NO debe cambiar** sin coordinación con el equipo de backend (Fase 2) y automatizaciones (Fase 3 — Dapta/n8n). Cambios de estructura requieren bumping de `schema_version`.

---

## Roadmap Técnico

| Fase | Descripción | Estado |
|------|-------------|--------|
| **1** | Landing page HTML/CSS/JS · Formulario con UTMs | ✅ Completo |
| **2** | Endpoint serverless · Base de datos (Supabase/Airtable) · Dispatcher webhooks | 🔜 Pendiente |
| **3** | Automatizaciones Dapta + n8n · Nurturing · CRM | 🔜 Pendiente |

---

## Convenciones de Código

- **CSS:** BEM-light — `.bloque__elemento--modificador`
- **JS:** vanilla ES2020+, `'use strict'`, funciones nombradas (no arrow functions en el top level)
- **Comentarios:** en español, secciones delimitadas con `// ====`
- **IDs de formulario:** kebab-case en español (`nombre`, `tamano_empresa`, `operarios`)
- **Variables CSS:** prefijo `--q-` para todos los tokens de marca
