# parcel-plugin-md-fm

Parcel plugin for loading markdown with parsed frontmatter.

## Install

With npm:

```bash
npm install parcel-plugin-md-fm --save-dev
```

With yarn:

```bash
yarn add --dev parcel-plugin-md-fm
```

## Use

Importing:

```js
import { markdown, frontmatter } from "./file.md";
```

If you get errors or red underlines in editors, add a `typings.d.ts` containing:

```ts
declare module "*.md" {
  const markdown: string;
  const frontmatter: object;
}
```

## Test

Tests not implemented yet.

## About

This uses the excellent `front-matter` library under the hood which separates and then translates `yaml` frontmatter from a markdown file. See `jxson/front-matter` for the exact `json` result format.

Markdown is returned as a string without further parsing so that you can use it with a parser/formatter of your choice like `markdown-to-jsx` (if you're using react).
