[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Graphql Shield Generator</h3>

  <p align="center">
    <a href="https://github.com/omar-dulaimi/graphql-shield-generator"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/omar-dulaimi/graphql-shield-generator/issues">Report Bug</a>
    ·
    <a href="https://github.com/omar-dulaimi/graphql-shield-generator/issues">Request Feature</a>
  </p>
</div>

<p align="center">
  <a href="https://www.buymeacoffee.com/omardulaimi">
    <img src="https://cdn.buymeacoffee.com/buttons/default-yellow.png" alt="Buy Me A Coffee" height="41" width="174">
  </a>
</p>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#overview">Overview</a>
    </li>
    <li>
      <a href="#installation">Installation</a>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#documentation">Documentation</a></li>
    <li><a href="#contributing">Contributing</a></li>
  </ol>
</details>

## Overview

Automatically generate a GraphQL Shield from your GraphQL Schema(or type definitions and resolvers).

<!-- GETTING STARTED -->

## Installation

#### Using npm

```sh
npm install graphql-shield-generator
```

#### Using yarn

```sh
yarn add graphql-shield-generator
```

## Usage

- Don't forget to star this repo 😉

```ts
import { generateGraphqlShield } from 'graphql-shield-generator';

await generateGraphqlShield({
  schema,
  options: {
    outputDir: './permissions',
    fileName: 'shield',
    extension: 'js',
    moduleSystem: "CommonJS"
  },
});

// or

await generateGraphqlShield({
  schema: { typeDefs, resolvers },
  options: {
    outputDir: './permissions',
    fileName: 'shield',
    extension: 'ts',
    moduleSystem: "ES modules"
  },
});

// or optional override of custom rule

await generateGraphqlShield({
  schema: { typeDefs, resolvers },
  options: {
    outputDir: './permissions',
    fileName: 'shield',
    extension: 'ts',
    moduleSystem: "ES modules",
		customrule: 'hasAuth',
		customrulepath: '../../src/graphql-shield/hasAuth',
  },
});

```

## Documentation

### `generateGraphqlShield(schema | { typeDefs, resolvers }, options)`

> Generates a GraphQL Shield.

#### `options`

| Property     | Required | Default           | Description                             |
| ------------ | -------- | ----------------- | --------------------------------------- |
| outputDir    | false    | current directory | Directory that shield will be placed in |
| fileName     | false    | 'shield'          | File name of the generated shield       |
| extension    | false    | 'js'              | File extension of the generated shield  |
| moduleSystem | false    | 'CommonJS'        | Module system of the generated shield   |

## Contributing

We are always looking for people to help us grow `graphql-shield-generator`! If you have an issue, feature request, or pull request, let us know!

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/omar-dulaimi/graphql-shield-generator.svg?style=for-the-badge
[contributors-url]: https://github.com/omar-dulaimi/graphql-shield-generator/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/omar-dulaimi/graphql-shield-generator.svg?style=for-the-badge
[forks-url]: https://github.com/omar-dulaimi/graphql-shield-generator/network/members
[stars-shield]: https://img.shields.io/github/stars/omar-dulaimi/graphql-shield-generator.svg?style=for-the-badge
[stars-url]: https://github.com/omar-dulaimi/graphql-shield-generator/stargazers
[issues-shield]: https://img.shields.io/github/issues/omar-dulaimi/graphql-shield-generator.svg?style=for-the-badge
[issues-url]: https://github.com/omar-dulaimi/graphql-shield-generator/issues
[license-shield]: https://img.shields.io/github/license/omar-dulaimi/graphql-shield-generator?style=for-the-badge
[license-url]: https://github.com/omar-dulaimi/graphql-shield-generator/blob/master/LICENSE
