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
import { content, data } from "./file.md";
```

If you get errors or red underlines in editors, add a `markdown.d.ts` file containing:

```ts
declare module "*.md" {
  const content: string;
  const data: object;
}
```

## Test

Tests not implemented yet.

## About

This uses the excellent `gray-matter` library under the hood which separates and then translates `yaml` or other frontmatter from a markdown file. See [jonschlinkert/gray-matter](https://github.com/jonschlinkert/gray-matter#returned-object) for the exact result format.

Markdown is returned as a string (`content`) without further parsing so that you can use it with a parser/formatter of your choice like [markdown-to-jsx](https://github.com/probablyup/markdown-to-jsx) (if you're using react).
