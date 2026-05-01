# Theme setting types — validation rules

Use this document when validating a value against the setting’s `type` in `config/settings_schema.json`. Every value written to `config/settings_data.json` must satisfy these rules.

## `range`

```json
{"type": "range", "id": "example", "min": 10, "max": 200, "step": 5, "default": 60}
```

- Value must be a **number** (not a string)
- Value must be **>= min** and **<= max**
- Value must be **exactly on a step**: `(value - min) % step == 0`
- If the desired value doesn't land on a step, snap to the **nearest valid step**:
  `round((value - min) / step) * step + min`, then clamp to [min, max]

Example: schema has min=10, max=200, step=5. Value 64 is invalid (not on a step).
Nearest valid: 65. Value 7 is invalid (below min). Nearest valid: 10.

## `select`

```json
{"type": "select", "id": "example", "options": [{"value": "sm"}, {"value": "md"}, {"value": "lg"}]}
```

- Value must be a **string**
- Value must **exactly match** one of the `options[].value` entries
- If the value doesn't match any option, report the error and list valid options

## `radio`

Same rules as `select` — value must match one of `options[].value`.

## `checkbox`

- Value must be a **boolean** (`true` or `false`)
- Not a string, not 0/1

## `number`

- Value must be a **number** (not a string)
- `null` / `nil` is valid (clears the field)

## `text`

- Value must be a **string**

## `textarea`

- Value must be a **string**

## `color`

- Value must be a **string**
- Must be a valid CSS color value (hex like `#ff0000` or `#ff000080` with alpha)
- Empty string `""` is valid (clears the color)

## `color_background`

- Value must be a **string**
- Must be a valid CSS background value (no `url()` or image properties)

## `color_scheme`

- Value must be a **string** matching a scheme ID (e.g., `"scheme-default"`)
- Empty string `""` is valid (uses default/no scheme)

## `font_picker`

- Value must be a **string** in `fontname_nW` or `fontname_iW` format
  (e.g., `figtree_n4`, `playfair_display_n5`)

## `image_picker`

- Value must be a valid Shopify image reference string (e.g., `shopify://shop_images/file.jpg`)
- Does not support default values

## `url`

- Value must be a **string** — a URL or relative path

## `richtext`

- Value must be a **string** wrapped in `<p>` or `<ul>` tags
- Example: `"<p>Hello world</p>"`

## `inline_richtext`

- Value must be a **string** (HTML without block-level tags)
- Example: `"Hello <strong>world</strong>"`

## `html`

- Value must be a **string**

## `liquid`

- Value must be a **string** (max 50kb)

## `text_alignment`

- Value must be one of: `"left"`, `"center"`, `"right"`

## `video_url`

- Value must be a YouTube or Vimeo URL string
- Check the `accept` array in the schema for which providers are allowed

## Resource pickers (`product`, `collection`, `page`, `blog`, `article`)

- These are set by handle/reference, not arbitrary values
- `product` and `collection` values use **handles** (e.g., `"my-product"`, `"summer-sale"`)
- Don't support `default` in schema

## List types (`product_list`, `collection_list`, `article_list`, `metaobject_list`)

- Value must be an **array**
- `product_list` and `collection_list` values are arrays of **handles** (e.g., `["product-one", "product-two"]`)
- Respect the `limit` property if present (default/max 50)
