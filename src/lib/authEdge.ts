const DEV_DEFAULT_SECRET = "pak_adenium_development_secret_key_2026_botanical";

function base64urlToUint8(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
  const bin = atob(pad);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

export async function verifySessionCookieEdge(token: string): Promise<boolean> {
  try {
    const isProd = process.env.NODE_ENV === "production";
    const secret = process.env.ADMIN_SECRET_KEY || (isProd ? "" : DEV_DEFAULT_SECRET);

    if (!secret || secret.trim() === "") return false;

    const [payloadB64, sigB64] = token.split(".");
    if (!payloadB64 || !sigB64) return false;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigBytes = base64urlToUint8(sigB64);
    const dataBytes = encoder.encode(payloadB64);

    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes as unknown as BufferSource, dataBytes);
    if (!isValid) return false;

    const payloadJson = JSON.parse(new TextDecoder().decode(base64urlToUint8(payloadB64)));
    if (payloadJson.exp && payloadJson.exp < Date.now()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
