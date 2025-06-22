<script setup lang="ts">
import { ref } from "vue";
import { Passkey39, isWebAuthnSupported } from "passkey39";

const mnemonic = ref("");
const status = ref("");
const isLoading = ref(false);
const username = "Passkey39 demo user";

async function login() {
  if (!isWebAuthnSupported()) {
    status.value = "❌ WebAuthn is not supported in this browser";
    return;
  }

  isLoading.value = true;
  status.value = "🔐 Authenticating...";
  
  try {
    const passkeys = new Passkey39({
      rpName: window.location.hostname,
    });

    const privateKey = await passkeys.authenticate(username);
    mnemonic.value = privateKey.mnemonic;
    status.value = "✅ Authentication successful!";
  } catch (error: any) {
    status.value = `❌ Authentication failed: ${error.message}`;
    mnemonic.value = "";
  } finally {
    isLoading.value = false;
  }
}

async function createPasskey() {
  if (!isWebAuthnSupported()) {
    status.value = "❌ WebAuthn is not supported in this browser";
    return;
  }

  isLoading.value = true;
  status.value = "🔑 Creating passkey...";
  
  try {
    const passkeys = new Passkey39({
      rpName: window.location.hostname,
    });

    await passkeys.createPasskeys(username);
    status.value = "✅ Passkey created successfully! You can now authenticate.";
    mnemonic.value = "";
  } catch (error: any) {
    status.value = `❌ Passkey creation failed: ${error.message}`;
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="container">
    <header>
      <h1>🔐 Passkey39 Demo</h1>
      <p class="description">
        This demo shows how to use WebAuthn/Passkeys to generate deterministic private keys.
        The same passkey will always produce the same BIP39 mnemonic phrase.
      </p>
    </header>

    <main>
      <div class="steps">
        <div class="step">
          <h3>Step 1: Create a Passkey</h3>
          <p>First, create a passkey using your device's authenticator (Face ID, Touch ID, etc.)</p>
          <button @click="createPasskey" :disabled="isLoading" class="btn btn-primary">
            Create Passkey
          </button>
        </div>

        <div class="step">
          <h3>Step 2: Authenticate</h3>
          <p>Then authenticate to get your deterministic private key as a BIP39 mnemonic</p>
          <button @click="login" :disabled="isLoading" class="btn btn-secondary">
            Authenticate & Get Private Key
          </button>
        </div>
      </div>

      <div v-if="status" class="status" :class="{ error: status.includes('❌'), success: status.includes('✅') }">
        {{ status }}
      </div>

      <div v-if="mnemonic" class="result">
        <h3>🎯 Your BIP39 Mnemonic:</h3>
        <div class="mnemonic">{{ mnemonic }}</div>
        <p class="note">⚠️ This is a demo, do not use this mnemonic for anything important!</p>
      </div>
    </main>

    <footer>
      <p>
        WebAuthn Support: 
        <span :class="{ supported: isWebAuthnSupported(), 'not-supported': !isWebAuthnSupported() }">
          {{ isWebAuthnSupported() ? '✅ Supported' : '❌ Not Supported' }}
        </span>
      </p>
      <p>
        <a href="https://github.com/dolu89/passkey39" target="_blank" class="github-link">
          🔗 View on GitHub
        </a>
      </p>
    </footer>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
}

header {
  text-align: center;
  margin-bottom: 3rem;
}

h1 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 2.5rem;
  font-weight: 600;
}

.description {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin: 0;
  max-width: 500px;
  margin: 0 auto;
}

.steps {
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
}

.step {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f7fafc;
}

.step h3 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1.3rem;
}

.step p {
  margin: 0 0 1rem 0;
  color: #7f8c8d;
}

.btn {
  background: #4a5568;
  color: white;
  border: 1px solid #4a5568;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
}

.btn:hover:not(:disabled) {
  background: #2d3748;
  border-color: #2d3748;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #a0aec0;
  border-color: #a0aec0;
}

.btn-secondary {
  background: #718096;
  border-color: #718096;
}

.btn-secondary:hover:not(:disabled) {
  background: #4a5568;
  border-color: #4a5568;
}

.status {
  padding: 1rem;
  border-radius: 8px;
  margin: 2rem 0;
  font-weight: 600;
  text-align: center;
}

.status.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.result {
  margin-top: 2rem;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.result h3 {
  margin: 0 0 1rem 0;
  color: #2d3748;
}

.mnemonic {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  border: 1px solid #dee2e6;
  word-break: break-all;
  color: #495057;
}

.note {
  margin: 1rem 0 0 0;
  font-size: 0.9rem;
  color: #e67e22;
  font-weight: 600;
  text-align: center;
}

footer {
  margin-top: 3rem;
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #ecf0f1;
  color: #7f8c8d;
}

.supported {
  color: #27ae60;
  font-weight: 600;
}

.not-supported {
  color: #e74c3c;
  font-weight: 600;
}

.github-link {
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.github-link:hover {
  color: #2d3748;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .step {
    padding: 1rem;
  }
}
</style>
