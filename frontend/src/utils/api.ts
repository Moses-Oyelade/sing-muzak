export const api = async (endpoint: string, options = {}) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };
  
  export const fetchSongs = async () => {
    const response = await fetch('http://localhost:3000/songs');
    if (!response.ok) throw new Error('Failed to fetch songs');
    return response.json();
  };
  
  export async function fetchFilterSongs({
    page = 1,
    limit = 10,
    status = '',
    category = '',
  }: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
  }) {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  
    if (status) query.append('status', status);
    if (category) query.append('category', category);
  
    const res = await fetch(`http://localhost:3000/songs?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch songs');
    return res.json();
  }
  