# 🎨 Guía de Marca — Quanta

> Tokens extraídos directamente de quantapro.com.co · Versión 1.0 · Marzo 2026
> La única fuente de verdad es `shared/css/tokens.css`

---

## Paleta de Colores

| Token | Hex | Uso |
|---|---|---|
| `--q-pink` | `#E91E8C` | Color de marca principal · botones · CTAs |
| `--q-pink-alt` | `#FF1B8D` | Variante vibrante · glows · partículas |
| `--q-pink-dark` | `#C91A78` | Extremo oscuro del gradiente CTA |
| `--q-bg` | `#0A0A0A` | Fondo global del body |
| `--q-surface` | `#1A1A1A` | Fondo de tarjetas y paneles |
| `--q-text` | `#FFFFFF` | Texto principal |
| `--q-text-2` | `rgba(255,255,255,0.70)` | Texto secundario · subtítulos |
| `--q-text-3` | `rgba(255,255,255,0.40)` | Texto terciario · placeholders |

## Tipografía

**Fuente única:** Poppins (Google Fonts)

| Uso | Peso | Tamaño |
|---|---|---|
| H1 Hero | 800 | clamp(36px, 5vw, 64px) |
| H2 Sección | 800 | clamp(28px, 4vw, 44px) |
| H3 Card | 700 | 18–24px |
| Body | 400 | 16px |
| CTA Button | 600 | 15–17px |
| Tag/Chip | 600 | 13px |

## Componentes Firma

- **Botones:** `border-radius: 50px` — pills (nunca rectangulares)
- **Cards:** `border-radius: 16px` + `border: 1px solid rgba(233,30,140,0.30)`
- **Tags:** fondo `rgba(233,30,140,0.15)` + texto `#E91E8C`
- **Gradiente CTA:** `linear-gradient(135deg, #E91E8C 0%, #C91A78 100%)`

## Efectos Visuales

1. **Grid de puntos en hero** — `radial-gradient` de 1px repetido cada 32px
2. **Glow interactivo** — sigue el cursor en la sección hero
3. **Orbe animado** — pulsa con `box-shadow` usando `@keyframes`
4. **Glassmorphism navbar** — `backdrop-filter: blur(20px)`
5. **Partículas** — puntos de `var(--q-pink)` que aparecen/desaparecen
