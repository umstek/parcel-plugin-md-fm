# parcel-transformer-md-fm

Parcel v2 transformer for loading markdown with parsed front-matter.

This is the parcel v2 successor of the parcel v1 plugin `parcel-plugin-md-fm`
(see [Migrating from v1](#migrating-from-v1)).

> [!WARNING]
> **Renamed package and repository.** This project was previously published to npm as
> `parcel-plugin-md-fm` (repository: `umstek/parcel-plugin-md-fm`). The old npm package is
> **deprecated** and will not receive further updates — switch to `parcel-transformer-md-fm`
> via [Migrating from v1](#migrating-from-v1). Old GitHub links redirect to this repository
> automatically.

## Requirements

- [Parcel](https://parceljs.org/) v2
- Node.js >= 20

## Install

With pnpm:

```bash
pnpm add -D parcel-transformer-md-fm
```

With npm:

```bash
npm install parcel-transformer-md-fm --save-dev
```

With yarn:

```bash
yarn add --dev parcel-transformer-md-fm
```

## Configure

Parcel v2 has no automatic plugin discovery; wire the transformer into a
[`.parcelrc`](https://parceljs.org/features/plugins/) in your project root:

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.md": ["parcel-transformer-md-fm"],
    "*.mdown": ["parcel-transformer-md-fm"],
    "*.markdown": ["parcel-transformer-md-fm"]
  }
}
```

## Use

Importing a markdown file gives you an object with the markdown `content`
(without the front-matter block) and the parsed front-matter as `data`:

```js
import { content, data } from "./file.md";
```

or as a default import:

```js
import frontMatter from "./file.md";
console.log(frontMatter.content, frontMatter.data);
```

If you get errors or red underlines in editors, add a `markdown.d.ts` file declaring
the extensions you import (shown for `*.md`; repeat for `*.mdown` and `*.markdown`):

```ts
declare module "*.md" {
  export const content: string;
  export const data: Record<string, unknown>;
  const frontMatter: {
    content: string;
    data: Record<string, unknown>;
    isEmpty: boolean;
    excerpt: string;
  };
  export default frontMatter;
}
```

## Test

```bash
pnpm install
pnpm test
```

The suite includes unit tests for the transformer and an integration test that
runs a real `parcel build` in a scratch consumer project
([test/integration/fixture](test/integration/fixture)) and asserts on the
bundle output. The [example](example) directory contains a small browser app
using the transformer.

## About

This uses the excellent `gray-matter` library under the hood which separates
and then translates `yaml` or other front-matter from a markdown file. See
[jonschlinkert/gray-matter](https://github.com/jonschlinkert/gray-matter#returned-object)
for the exact result format.

Markdown is returned as a string (`content`) without further parsing so that you can use it with a parser/formatter of your choice like [markdown-to-jsx](https://github.com/probablyup/markdown-to-jsx) (if you're using react).

## Migrating from v1

If you used the parcel v1 plugin `parcel-plugin-md-fm`:

1. Upgrade your project to [parcel v2](https://parceljs.org/getting-started/migration/)
   (v1 plugins do not work with parcel v2).
2. Remove `parcel-plugin-md-fm` and install `parcel-transformer-md-fm`.
   Parcel v2 validates the `parcel-transformer-*` naming for transformers
   referenced from `.parcelrc`, so the package was renamed as part of the
   migration.
3. Add the [`.parcelrc` wiring](#configure) shown above. Parcel v1 discovered
   `parcel-plugin-*` packages automatically; parcel v2 requires explicit
   configuration.
4. Markdown imports keep the same shape: the exported object still contains
   `content`, `data`, `isEmpty` and `excerpt`. The one deliberate change: the
   `orig` field (a JSON-serialized Buffer of the whole source file) is no
   longer embedded in the bundle output.

The renamed package restarts versioning at `0.1.0`; there is no semver
continuity with `parcel-plugin-md-fm` releases.
