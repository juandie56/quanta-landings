# 📁 assets/icons/

Carpeta para íconos SVG reutilizables entre campañas.

## Convenciones

- Formato: **SVG** únicamente
- Nombrado: `kebab-case.svg` (ej: `check-circle.svg`, `arrow-right.svg`)
- Tamaño viewBox: `0 0 24 24` (estándar)
- Sin colores hardcodeados — usar `currentColor` para heredar el color del contexto CSS

## Uso en HTML

```html
<!-- Inline (para poder controlar color con CSS) -->
<svg class="icon" aria-hidden="true">
  <use href="../../assets/icons/check-circle.svg#icon"></use>
</svg>

<!-- O simplemente copiar el SVG inline en el HTML de la campaña -->
```
