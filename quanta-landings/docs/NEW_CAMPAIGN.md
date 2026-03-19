# ✅ Checklist — Nueva Campaña Quanta Landing

Sigue este checklist cada vez que vayas a crear una landing para una nueva campaña.
Tiempo estimado: **45–90 minutos** desde cero.

---

## 1. Preparación (antes de tocar código)

- [ ] Definir el **slug** de la campaña (ej: `textil-bogota-q2`)
- [ ] Tener claro el **segmento** y los 3 pain points principales
- [ ] Redactar el **H1** orientado al dolor del segmento
- [ ] Confirmar el **módulo Quanta protagonista** de la campaña
- [ ] Tener el **FORM_ENDPOINT** listo (Fase 2) o placeholder documentado
- [ ] Crear la **rama** del repositorio:
  ```bash
  git checkout dev
  git pull origin dev
  git checkout -b campaign/[slug]
  # Ejemplo: git checkout -b campaign/textil-bogota-q2
  ```

---

## 2. Crear la carpeta de campaña

```bash
# Desde la raíz del repo
cp -r campaigns/manufactura-general campaigns/[slug]
cd campaigns/[slug]
```

### Archivos a generar:
- [ ] `index.html` — copiar desde `manufactura-general` como base
- [ ] `campaign.json` — completar con los metadatos de la nueva campaña

---

## 3. Personalizar `campaign.json`

```json
{
  "slug":    "[slug]",
  "name":    "[Nombre descriptivo]",
  "segment": "[Industria objetivo]",
  "status":  "draft",
  ...
}
```

- [ ] Actualizar `slug`, `name`, `segment`
- [ ] Actualizar `seo.title` y `seo.description`
- [ ] Actualizar `copy.badge`, `copy.headline`, `copy.subheadline`
- [ ] Actualizar `tracking.campaign_name` y `tracking.utm_campaign`
- [ ] Marcar `status: "draft"` hasta que esté aprobada

---

## 4. Personalizar `index.html`

### En el `<head>`:
- [ ] `<title>` — orientado al segmento
- [ ] `<meta name="description">` — máx. 160 chars
- [ ] `<link rel="canonical">` — URL correcta
- [ ] `og:title`, `og:description`, `og:image`, `og:url`

### En `CONFIG` (inicio del `<script>`):
- [ ] `CAMPAIGN_NAME` — igual al `tracking.campaign_name` del campaign.json
- [ ] `FORM_ENDPOINT` — URL real del endpoint o `'#PENDIENTE'`
- [ ] `DEBUG_MODE: true` en desarrollo, `false` en producción

### En el `<body>`:
- [ ] Badge del hero — texto del segmento
- [ ] `<h1>` — headline personalizado
- [ ] Subheadline de apoyo
- [ ] Pain points (sección [3]) — 3 dolores específicos del segmento
- [ ] Módulos destacados (sección [4]) — ordenar por relevancia

---

## 5. Actualizar `shared/data/form-data.json` (si es necesario)

- [ ] ¿Se necesita agregar una nueva industria al dropdown? → Editar `form-data.json`
- [ ] ¿Se necesita preseleccionar una industria específica? → Marcar `"default": true`

---

## 6. Control de calidad antes del deploy

### Checklist visual (abrir en navegador):
- [ ] Logo visible y bien dimensionado en navbar
- [ ] Hero se ve bien en mobile (375px) y desktop (1440px)
- [ ] Todos los dropdowns cargan correctamente (depende de `form-data.json`)
- [ ] Formulario valida todos los campos correctamente
- [ ] Formulario muestra estado loading al enviar
- [ ] Links "Agenda..." anclan al `#formulario`
- [ ] Footer muestra teléfono y RRSS

### Checklist técnico:
- [ ] `noindex, nofollow` presente en `<meta name="robots">`
- [ ] `DEBUG_MODE: false` en producción
- [ ] `FORM_ENDPOINT` apunta al endpoint real (no placeholder)
- [ ] Sin `console.log` manuales fuera del bloque `DEBUG_MODE`
- [ ] Validar HTML en [validator.w3.org](https://validator.w3.org/)

---

## 7. Deploy

```bash
# Commit en la rama de campaña
git add campaigns/[slug]/
git commit -m "feat([slug]): landing page inicial"

# PR hacia dev
git push origin campaign/[slug]
# Crear Pull Request en GitHub: campaign/[slug] → dev

# Una vez aprobado y mergeado a dev → merge a main → deploy automático
```

---

## 8. Post-deploy

- [ ] Verificar URL en producción
- [ ] Probar el formulario end-to-end (enviar un lead de prueba)
- [ ] Verificar que el lead llega al endpoint / Dapta / n8n
- [ ] Cambiar `status: "active"` en `campaign.json`
- [ ] Agregar la campaña a la tabla del `README.md` principal
- [ ] Compartir URL con el equipo de pauta

---

## Variables Pendientes por Campaña

| Variable | Descripción | Ejemplo |
|---|---|---|
| `[slug]` | URL slug único | `textil-bogota-q2` |
| `HEADLINE_PRINCIPAL` | H1 orientado al dolor | `"Tu planta textil pierde..."` |
| `PAIN_POINTS[3]` | 3 dolores del segmento | Ver briefing de campaña |
| `MODULO_DESTACADO` | Módulo Quanta protagonista | `"Producción + Inventarios"` |
| `FORM_ENDPOINT` | URL webhook receptor | `https://api.xxx.com/leads` |
| `UTM_CAMPAIGN` | Nombre de campaña en UTM | `textil-bogota-q2-2026` |
