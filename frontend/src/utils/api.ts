export const api = async (endpoint: string, options = {}) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };
  