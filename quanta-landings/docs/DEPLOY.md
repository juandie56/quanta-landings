# 🚀 Guía de Despliegue — Quanta Landing Pages

## Estrategia de Branches

```
main        ← producción (lo que está live)
dev         ← integración (staging)
campaign/*  ← desarrollo de cada campaña
```

**Flujo:**
```
campaign/[slug] → PR → dev → PR → main → deploy automático (GitHub Actions)
```

---

## Opción A — GitHub Pages (Recomendado para empezar)

### Setup inicial (una sola vez)

1. Ir al repo en GitHub → **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / Folder: `/ (root)`
4. Guardar — GitHub asignará una URL tipo `https://qpalliance.github.io/quanta-landings/`

> 💡 Para usar dominio propio (`landing.quantapro.com.co`), agregar un archivo `CNAME` en la raíz con el dominio, y configurar el DNS con un registro CNAME apuntando a `qpalliance.github.io`.

### Deploy automático (CI/CD)

El archivo `.github/workflows/deploy.yml` se activa automáticamente en cada push a `main`. No requiere acción manual.

---

## Opción B — Netlify Drop (más rápido para pruebas)

1. Ir a [app.netlify.com/drop](https://app.netlify.com/drop)
2. Arrastrar la carpeta `campaigns/[slug]/`
3. Netlify genera una URL temporal para revisión del cliente

> ⚠️ Solo usar para reviews, no para campañas activas de pauta.

---

## Variables de Entorno / Secrets

Nunca commitear endpoints ni tokens al repositorio.

Para las campañas activas, los endpoints se manejan de dos formas:

**Opción 1 — Hardcoded en `CONFIG` (actual, Fase 1)**
```javascript
// Solo para desarrollo. En producción reemplazar con URL real.
FORM_ENDPOINT: 'https://tu-endpoint.com/leads',
```

**Opción 2 — GitHub Secrets + GitHub Actions (Fase 2)**
```yaml
# En el workflow de deploy, inyectar como variable de entorno
env:
  FORM_ENDPOINT: ${{ secrets.FORM_ENDPOINT_MANUFACTURA }}
```

---

## Checklist Pre-Deploy

- [ ] `DEBUG_MODE: false` en `CONFIG`
- [ ] `FORM_ENDPOINT` apunta a URL real
- [ ] `noindex, nofollow` presente (landings de pago)
- [ ] Formulario probado end-to-end en staging (`dev`)
- [ ] Responsive verificado en 375px y 1440px
- [ ] `campaign.json` tiene `"status": "active"`

---

## URLs de Producción

| Campaña | URL |
|---|---|
| Manufactura General | `https://quantapro.com.co/landing/manufactura-general/` |

> Actualizar esta tabla con cada nuevo deploy.
