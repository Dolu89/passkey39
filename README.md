# Passkey39 🔐

A modern WebAuthn/Passkeys library for browser authentication that generates deterministic private keys from authenticator signatures.

## Features

- ✅ **WebAuthn/Passkeys Authentication**: Full WebAuthn standard support
- 🔑 **Deterministic private keys**: Generate reproducible private keys from passkey signatures
- 🌐 **Browser-first**: Optimized for client-side usage
- 🔒 **Cryptographically secure**: Uses HKDF with SHA-256 for key derivation
- 📱 **Platform authenticators**: Support for Face ID, Touch ID, Windows Hello
- 🎯 **Simple API**: Easy-to-use interface for authentication workflows

## Installation

```bash
bun add passkey39
```

## Quick Start

```typescript
import { Passkey39, isWebAuthnSupported } from 'passkey39'

// Check WebAuthn support
if (!isWebAuthnSupported()) {
  throw new Error('WebAuthn is not supported in this browser')
}

// Initialize with your relying party name
const passkeys = new Passkey39({
  rpName: 'example.com'
})

// Create a new passkey for a user
await passkeys.createPasskeys('user@example.com')

// Authenticate and get deterministic private key
const privateKey = await passkeys.authenticate('user@example.com')

console.log('Private key (hex):', privateKey.hex)
console.log('Private key (bytes):', privateKey.bytes)
console.log('BIP39 mnemonic:', privateKey.mnemonic)
```

## API Reference

### `Passkey39`

#### Constructor

```typescript
new Passkey39({
  rpName: string,        // Required: Your domain/app name
  challenge?: string     // Optional: Custom challenge (has secure default)
})
```

#### Methods

##### `createPasskeys(username: string): Promise<void>`

Creates a new passkey for the specified user. This should be called once per user to register their authenticator.

```typescript
await passkeys.createPasskeys('user@example.com')
```

##### `authenticate(username: string): Promise<PrivateKey>`

Authenticates the user and returns their deterministic private key.

```typescript
const privateKey = await passkeys.authenticate('user@example.com')
```

### `PrivateKey`

#### Properties

- `hex: string` - Private key as hexadecimal string
- `bytes: Uint8Array` - Private key as byte array
- `mnemonic: string` - Private key as BIP39 mnemonic phrase (24 words)

### Utility Functions

#### `isWebAuthnSupported(): boolean`

Checks if WebAuthn is supported in the current browser environment.

```typescript
if (isWebAuthnSupported()) {
  // WebAuthn is available
}
```

## Security Considerations

- **Deterministic keys**: The same passkey will always generate the same private key
- **Domain-bound**: Keys are tied to your domain (`rpName` and `window.location.origin`)
- **User-specific**: Each username gets a unique private key
- **Cryptographically secure**: Uses HKDF-SHA256 for key derivation
- **Platform authenticators**: Requires user verification (biometrics/PIN)

## Browser Compatibility

Requires a browser with WebAuthn support:

- ✅ Chrome 67+
- ✅ Firefox 60+
- ✅ Safari 14+
- ✅ Edge 18+

## Development

### Prerequisites

- [Bun](https://bun.sh) runtime

### Local Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Build the library
bun run build

# Clean build artifacts
bun run clean
```

## Example: Complete Authentication Flow

```typescript
import { Passkey39, isWebAuthnSupported } from 'passkey39'

async function setupAuthentication() {
  // Check browser support
  if (!isWebAuthnSupported()) {
    alert('Your browser does not support WebAuthn')
    return
  }

  const passkeys = new Passkey39({
    rpName: 'myapp.com'
  })

  const username = 'alice@example.com'

  try {
    // First time: create passkey
    console.log('Creating passkey...')
    await passkeys.createPasskeys(username)
    console.log('✅ Passkey created successfully')

    // Subsequent times: authenticate
    console.log('Authenticating...')
    const privateKey = await passkeys.authenticate(username)
    
    console.log('🔑 Private key:', privateKey.hex)
    console.log('🎯 Mnemonic:', privateKey.mnemonic)
    
  } catch (error) {
    console.error('❌ Authentication failed:', error)
  }
}

setupAuthentication()
```

## License

MIT
