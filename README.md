# GraphQL Shield Generator

<div align="center">

<p align="center">
  <a href="https://www.npmjs.com/package/graphql-shield-generator">
    <img src="https://img.shields.io/npm/v/graphql-shield-generator?style=flat-square" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/graphql-shield-generator">
    <img src="https://img.shields.io/npm/dm/graphql-shield-generator?style=flat-square" alt="npm downloads">
  </a>
  <a href="https://github.com/omar-dulaimi/graphql-shield-generator/stargazers">
    <img src="https://img.shields.io/github/stars/omar-dulaimi/graphql-shield-generator?style=flat-square" alt="GitHub stars">
  </a>
  <a href="https://github.com/omar-dulaimi/graphql-shield-generator/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/omar-dulaimi/graphql-shield-generator?style=flat-square" alt="GitHub license">
  </a>
</p>

**Automatically generate GraphQL Shield permissions from your GraphQL schema**

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#features">Features</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#examples">Examples</a>
</p>

<p align="center">
  <strong><a href="https://github.com/omar-dulaimi/graphql-shield-generator">⭐ Star us on GitHub</a></strong> if this project helped you!
</p>

<a href="https://github.com/sponsors/omar-dulaimi">
  <img src="https://img.shields.io/github/sponsors/omar-dulaimi?style=for-the-badge&logo=github&logoColor=white&labelColor=000000" alt="Sponsor on GitHub">
</a>

</div>

## Why GraphQL Shield Generator?

Transform your GraphQL schema into a complete permission system in seconds. No more manually writing repetitive shield configurations—let the generator handle it while you focus on your business logic.

```typescript
// ✨ From this schema...
type User {
  id: ID!
  email: String!
  posts: [Post!]!
}

type Query {
  users: [User!]!
  me: User
}

// 🚀 To this shield instantly
export const permissions = shield({
  Query: {
    users: hasAuth,
    me: hasAuth,
  },
  User: {
    posts: hasAuth,
  },
});
```

## Installation

```bash
# npm
npm install graphql-shield-generator

# yarn
yarn add graphql-shield-generator

# pnpm
pnpm add graphql-shield-generator

# bun
bun add graphql-shield-generator
```

## Quick Start

### Basic Usage

```typescript
import { generateGraphqlShield } from 'graphql-shield-generator';

await generateGraphqlShield({
  schema: mySchema, // or { typeDefs, resolvers }
  options: {
    outputDir: './permissions',
    fileName: 'shield',
    extension: 'ts',
    moduleSystem: 'ES modules',
  },
});
```

### Advanced Configuration

```typescript
await generateGraphqlShield({
  schema: { typeDefs, resolvers },
  options: {
    outputDir: './permissions',
    fileName: 'shield',
    extension: 'ts',
    moduleSystem: 'ES modules',
    
    // 🔐 Use custom authentication rules
    customrule: 'hasAuth',
    customrulepath: './auth/rules',
    
    // 🛡️ Security-first approach
    fallbackRule: 'deny', // Deny by default, allow explicitly
    
    // 📊 Organized output
    groupbyobjects: true, // Order by Query → Mutation → Subscription
    
    // ⚙️ Shield configuration
    shieldoptions: '{ allowExternalErrors: true }',
  },
});
```

## Features

### 🔐 **Custom Authentication Rules**
Replace default `allow` with your custom rules:
```typescript
customrule: 'hasAuth',
customrulepath: './auth/hasAuth'
```

### 🛡️ **Security-First Fallbacks**
Configure default permissions for unlisted fields:
```typescript
fallbackRule: 'deny'    // '*': deny (secure by default)
fallbackRule: 'allow'   // '*': allow (permissive)
fallbackRule: false     // No fallback (clean output)
```

### 📊 **Smart Type Ordering**
Organize your shield with logical type priority:
```typescript
groupbyobjects: true  // Query → Mutation → Subscription → Custom Types
```

### ⚙️ **Shield Configuration**
Pass options directly to the GraphQL Shield constructor:
```typescript
shieldoptions: '{ allowExternalErrors: true, debug: true }'
```

### 🎯 **Perfect TypeScript Support**
Generate `.ts` files with proper imports and types.

### 📦 **Multiple Module Systems**
Support for both ES modules and CommonJS.

## Generated Output Examples

### With Custom Rules + Security Fallback
```typescript
import { shield, deny } from 'graphql-shield';
import { hasAuth } from './auth/hasAuth';

export const permissions = shield({
  Query: {
    '*': deny,
    users: hasAuth,
    me: hasAuth,
  },
  Mutation: {
    '*': deny,
    createUser: hasAuth,
    updateUser: hasAuth,
  },
  User: {
    '*': deny,
    posts: hasAuth,
  },
}, { allowExternalErrors: true });
```

### Clean Output (No Fallback)
```typescript
import { shield } from 'graphql-shield';
import { hasAuth } from './auth/hasAuth';

export const permissions = shield({
  Query: {
    users: hasAuth,
    me: hasAuth,
  },
  User: {
    posts: hasAuth,
  },
});
```

## API Reference

### `generateGraphqlShield(config)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `schema` | `GraphQLSchema \| { typeDefs, resolvers }` | - | Your GraphQL schema |
| `options.outputDir` | `string` | `'.'` | Output directory |
| `options.fileName` | `string` | `'shield'` | Generated file name |
| `options.extension` | `'js' \| 'ts'` | `'js'` | File extension |
| `options.moduleSystem` | `'CommonJS' \| 'ES modules'` | `'CommonJS'` | Module system |
| `options.customrule` | `string` | `'allow'` | Custom rule function name |
| `options.customrulepath` | `string` | - | Import path for custom rule |
| `options.fallbackRule` | `'allow' \| 'deny' \| false` | `false` | Default rule for unspecified fields |
| `options.groupbyobjects` | `boolean` | `false` | Order types by priority |
| `options.shieldoptions` | `string` | - | Options passed to shield constructor |

## Examples

Check out the [`/example`](./example) directory for comprehensive examples including:

- Basic shield generation
- Custom authentication rules  
- Security-first configurations
- All feature combinations
- CommonJS and ES modules examples

Run the examples:
```bash
cd example
npm install
npm run test-fixes
```

## Use Cases

### 🏢 **Enterprise Applications**
- Secure by default with `fallbackRule: 'deny'`
- Custom authentication rules
- Organized type structure

### 🚀 **Rapid Prototyping**  
- Quick shield generation
- Permissive defaults for development
- Easy customization as you grow

### 🔄 **Schema Evolution**
- Automatic shield updates when schema changes
- Consistent permission structure
- No manual maintenance

## Contributing

We welcome contributions! Please see our [Contributing Guide](.github/CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/omar-dulaimi/graphql-shield-generator.git
cd graphql-shield-generator
npm install
npm run build
```

## License

[MIT](LICENSE) © [Omar Dulaimi](https://github.com/omar-dulaimi)

---

<div align="center">

Made with ❤️ by [Omar Dulaimi](https://github.com/omar-dulaimi)

</div>