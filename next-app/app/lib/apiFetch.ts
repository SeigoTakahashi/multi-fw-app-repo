'use client';

type FetchOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>;
};

export default async function apiFetch(
  url: string,
  options: FetchOptions = {},
  accessToken?: string
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  const response = await fetch(url, { ...options, headers });

  if ([401, 403].includes(response.status)) {
    localStorage.removeItem('user_session');
    alert('認証されてません。再度ログインしてください。');
    window.location.href = '/';
    throw new Error('Unauthorized');
  }
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error('APIリクエストに失敗しました. ' + errorData.error);
  }
  return response.json();
}


