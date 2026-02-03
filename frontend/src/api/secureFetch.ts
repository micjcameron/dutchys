// utils/api.ts
export async function secureRequest(url: string, data: any, requestType: 'POST' | 'DELETE' | 'GET' | 'PATCH' = 'POST') {
    const timestamp = Date.now().toString();
    const secret = process.env.NEXT_PUBLIC_HMAC_SECRET || 'fallback';
  
    // Create HMAC SHA-256 Hash
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', 
      encoder.encode(secret), 
      { name: 'HMAC', hash: 'SHA-256' }, 
      false, 
      ['sign']
    );
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(timestamp));
    const signature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  
    return fetch(url, {
      method: requestType,
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': signature,
        'X-Timestamp': timestamp,
      },
      body: JSON.stringify(data),
    });
  }