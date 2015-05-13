CSS
===

Mobile Devices
--------------

Some styles are designed for mobile devices. Use `window.isMobile` to detect device. Meanwhile, `html` tag has `mobile` or `no-mobile` class names to support css styles.

Grid
----

### Containers

`.container` has a max-width of 1200px, while `.container-full` expands full-width.

### Columns

Responsive design supports 4 types of media queries: xs, sm, md, lg.

Priority: xs > sm > md > lg

Column widths: `.col-xs-@{index}, .col-sm-@{index}, .col-md-@{index}, .col-lg-@{index}`

Offsets will pull the column right: `.col-xs-offset-@{index}, .col-sm-offset-@{index}, .col-md-offset-@{index}, .col-lg-offset-@{index}`

Media Query: Use `.col-@{index}` for browsers don't support media query. This will overwrite other column settings.

Font
----

Uses `OpenSans` as default font for desktop devices.

* Light: 100
* Normal: 400
* Bold: 700

Typography
----------

### List

`.list-unordered` for `ul` and `.list-ordered` for `ol`

### Text

Styled texts: `.text-primary, .text-secondary, .text-muted`

Text alignment: `.text-left, .text-center, .text-right`

Button
------

Use `button` tag.

### Common

Styles: `.btn-primary, .btn-secondary, .btn-gray, .btn-light-gray, .btn-white, .btn-link`

### Sizes

`.btn-sm, .btn-lg`

### Shapes

`.btn-cute, .btn-icon`

### Groups and bars

`.btn-group, .btn-bar`
