import { bytesToHex } from "@noble/hashes/utils"
import { entropyToMnemonic } from "@scure/bip39"
import { wordlist } from '@scure/bip39/wordlists/english'

export class PrivateKey {
    private key: Uint8Array

    constructor(key: Uint8Array) {
        this.key = key
    }

    get hex(): string {
        return bytesToHex(this.key)
    }

    get bytes(): Uint8Array {
        return this.key
    }

    get mnemonic(): string {
        return entropyToMnemonic(this.key, wordlist)
    }
}