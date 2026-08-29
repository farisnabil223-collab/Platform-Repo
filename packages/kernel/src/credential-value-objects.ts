export class CertificateId {
  constructor(public readonly value: string) {}
}

export class CertificateCode {
  constructor(public readonly value: string) {
    if (!value || !value.startsWith('CERT_')) {
      throw new Error(`Invalid CertificateCode format: ${value}`);
    }
  }
}

export class VerificationCode {
  constructor(public readonly value: string) {
    if (!value || !value.startsWith('VER-')) {
      throw new Error(`Invalid VerificationCode format: ${value}`);
    }
  }
}

export class CryptographicSignature {
  constructor(
    public readonly hash: string,
    public readonly algorithm: string,
    public readonly publicKey: string,
    public readonly signatureValue: string
  ) {}
}

export class DidUrl {
  constructor(public readonly value: string) {
    if (!value || !value.startsWith('did:')) {
      throw new Error(`Invalid DID format: ${value}`);
    }
  }
}
