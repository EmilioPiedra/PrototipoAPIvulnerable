const crypto = require('crypto');

class JWT {
  constructor() {
    this.secretPrefix = 'change_key_private_';
    this.token = null;
  }

  base64urlEncode(str) {
    return Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  base64urlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return Buffer.from(str, 'base64').toString();
  }

  sign({ header, payload, secret }) {
    const hmac = crypto.createHmac('sha256', this.secretPrefix + secret);
    hmac.update(`${header}.${payload}`);
    return this.base64urlEncode(hmac.digest());
  }

  create(data) {
    const header = this.base64urlEncode(JSON.stringify(data.header));
    const payload = this.base64urlEncode(JSON.stringify(data.payload));
    const signature = this.sign({ header, payload, secret: data.secret });

    this.token = `${header}.${payload}.${signature}`;
    return this;
  }

  get() {
    return this.token;
  }

  decode({ token, secret }) {
    const [header64, payload64, signature] = token.split('.');
    const expectedSig = this.sign({ header: header64, payload: payload64, secret });
    
    if (expectedSig !== signature) return null;

    return {
      header: JSON.parse(this.base64urlDecode(header64)),
      payload: JSON.parse(this.base64urlDecode(payload64)),
      signature
    };
  }

  update(data) {
    const decoded = this.decode({ token: data.token, secret: data.secret });
    if (!decoded) return this;

    const newHeader = { ...decoded.header, ...data.data.header };
    const newPayload = { ...decoded.payload, ...data.data.payload };

    return this.create({
      header: newHeader,
      payload: newPayload,
      secret: data.secret
    });
  }
}

module.exports = JWT;
