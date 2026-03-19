# 🚀 Quanta Landing Pages

Repositorio oficial de landing pages para campañas digitales de **Quanta by QPAlliance**.

---

## 📁 Estructura del Repositorio

```
quanta-landings/
│
├── campaigns/                        # Una carpeta por campaña
│   └── manufactura-general/          # Campaña: Manufactura General
│       ├── index.html                # Landing page (autónoma)
│       └── campaign.json            # Metadatos de la campaña
│
├── shared/                           # Recursos compartidos entre campañas
│   ├── css/
│   │   └── tokens.css               # Variables de marca (design tokens)
│   ├── js/
│   │   ├── form-handler.js          # Lógica del formulario (UTMs, payload, estados)
│   │   └── utils.js                 # Utilidades generales
│   └── data/
│       └── form-data.json           # Base de datos de opciones para dropdowns
│
├── assets/                           # Assets globales (logos, íconos, fuentes)
│   ├── fonts/                        # Fuentes locales (si aplica)
│   └── icons/                        # Íconos SVG
│
├── docs/                             # Documentación del proyecto
│   ├── ARCHITECTURE.md              # Decisiones de arquitectura
│   ├── BRAND.md                     # Guía de tokens de marca
│   ├── DEPLOY.md                    # Guía de despliegue
│   └── NEW_CAMPAIGN.md              # Checklist para nueva campaña
│
├── .github/
│   ├── workflows/
│   │   └── deploy.yml               # CI/CD — deploy automático a GitHub Pages
│   └── ISSUE_TEMPLATE/
│       └── nueva-campana.md         # Template para crear issues de nueva campaña
│
├── .gitignore
└── README.md
```

---

## ⚡ Inicio Rápido

### Clonar el repositorio
```bash
git clone https://github.com/qpalliance/quanta-landings.git
cd quanta-landings
```

### Ver una landing localmente
```bash
# Opción 1 — Live Server (VS Code extension recomendada)
# Opción 2 — Python
python3 -m http.server 8080
# Abrir: http://localhost:8080/campaigns/manufactura-general/
```

### Crear una nueva campaña
Ver [`docs/NEW_CAMPAIGN.md`](docs/NEW_CAMPAIGN.md) para el checklist completo.

---

## 🗂️ Campañas Activas

| Campaña | Slug | Estado | URL |
|---|---|---|---|
| Manufactura General | `manufactura-general` | ✅ Activa | `/campaigns/manufactura-general/` |

---

## 🛠️ Stack Técnico

- **HTML5 / CSS3 / JS Vanilla** — sin frameworks, máxima velocidad
- **Google Fonts** — Poppins (400 / 600 / 700 / 800)
- **GitHub Pages** — hosting estático con CI/CD automático
- **form-data.json** — dropdowns editables sin tocar el HTML

---

## 📐 Convenciones

- **Branches:** `main` (producción) · `dev` (desarrollo) · `campaign/[slug]` (nueva campaña)
- **Commits:** seguir [Conventional Commits](https://www.conventionalcommits.org/)
  ```
  feat(manufactura): agregar sección testimonios
  fix(form): corregir validación de email
  style(navbar): ajustar altura del logo
  docs: actualizar checklist de nueva campaña
  ```
- **Cada campaña** vive en su propia carpeta bajo `campaigns/`
- **Nada de secrets** en el código — usar variables de entorno o GitHub Secrets

---

## 👥 Equipo

**QPAlliance Digital Team** · [quantapro.com.co](https://quantapro.com.co)

© 2026 Quanta by QPAlliance. Todos los derechos reservados.
