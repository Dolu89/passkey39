import { sha256 } from "@noble/hashes/sha2"
import { PrivateKey } from "./private_key"
import { isWebAuthnSupported } from "./utils"
import { hkdf } from '@noble/hashes/hkdf'
import { randomBytes } from "@noble/hashes/utils"

interface Passkey39Constructor {
    challenge?: string
    rpName: string
}
const DEFAULT_CHALLENGE = "Never share your private key or recovery phrase with anyone. Your financial security depends on keeping these credentials absolutely private and secure. Only you should have access to your Bitcoin wallet."

export class Passkey39 {
    private challenge: string
    private rpName: string

    constructor({ challenge, rpName }: Passkey39Constructor) {
        this.challenge = challenge ?? DEFAULT_CHALLENGE
        this.rpName = rpName
    }


    async authenticate(username: string) {
        if (!isWebAuthnSupported()) {
            throw new Error('WebAuthn not supported')
        }

        const challenge = this.generateDeterministicChallenge(username)


        const pubKeyOptions: PublicKeyCredentialRequestOptions = {
            challenge: new TextEncoder().encode(challenge),
            timeout: 60000,
            userVerification: "required",
            rpId: this.rpName,
        };

        const assertion = (await navigator.credentials.get({
            publicKey: pubKeyOptions,
            mediation: "optional",
        })) as PublicKeyCredential;

        // @ts-ignore
        const signature: ArrayBuffer = assertion.response.signature;
        return new PrivateKey(this.generatePrivateKeyFromPasskeySignature(new Uint8Array(signature), challenge))
    }


    /**
     * Authenticate with a passkey
     */
    async createPasskeys(username: string): Promise<void> {
        if (!isWebAuthnSupported()) {
            throw new Error('WebAuthn not supported')
        }

        try {
            // Use a fixed deterministic challenge to always generate the same private key
            const challenge = this.generateDeterministicChallenge(username)

            // Create credential request
            const credential = await navigator.credentials.create({
                publicKey: {
                    challenge: new TextEncoder().encode(challenge),
                    rp: { name: this.rpName },
                    user: {
                        id: randomBytes(16),
                        name: username,
                        displayName: username
                    },
                    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                    authenticatorSelection: {
                        authenticatorAttachment: "platform",
                        userVerification: "required"
                    },
                    timeout: 60000,
                    attestation: "direct"
                }
            })

            if (!credential) {
                throw new Error('Authentication failed')
            }
        } catch (error) {
            console.error('Authentication failed:', error)
            throw error
        }
    }

    private generatePrivateKeyFromPasskeySignature(signature: Uint8Array, challenge: string): Uint8Array {
        const salt = new TextEncoder().encode(challenge) // Utilise le challenge comme sel
        return hkdf(sha256, signature, salt, this.rpName, 32)
    }

    private generateDeterministicChallenge(username: string): string {
        const baseChallenge = this.challenge
        const userSalt = `${username}@${this.rpName}@${window.location.origin}`
        return `${baseChallenge}:${userSalt}`
    }
}