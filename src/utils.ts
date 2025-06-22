export function isWebAuthnSupported(): boolean {
    return !!(typeof navigator !== 'undefined' &&
        navigator.credentials &&
        typeof navigator.credentials.create === 'function' &&
        typeof navigator.credentials.get === 'function');
}