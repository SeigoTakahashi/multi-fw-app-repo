'use client';

import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import Message from './components/Message';
import { useRouter } from 'next/navigation';
import apiFetch from '@/app/lib/apiFetch';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const errorParam = params.get('error');
        const errorDescription = params.get('error_description');
        if (errorParam) {
          return errorDescription || errorParam;
        }
      }
    }
    return '';
  });

  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (localStorage.getItem('user_session')) {
        router.push('/memos');
        return;
      }
      const sessionData = Object.fromEntries(
        new URLSearchParams(window.location.hash.substring(1))
      );
      const accessToken = sessionData?.access_token;
      if (!accessToken) return;
      const userData = await apiFetch('/api/auth/user', {}, accessToken);
      if (userData.email) sessionData.user = userData;
      localStorage.setItem('user_session', JSON.stringify(sessionData));
      router.push('/memos');
    })();
  }, []);

  const login = async () => {
    setError('');
    try {
      const json = await apiFetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!json.access_token || !json.refresh_token) {
        throw new Error('トークンが取得できませんでした.');
      }
      localStorage.setItem('user_session', JSON.stringify(json));
      router.push('/memos');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました');
      console.error(e);
    }
  };

  const register = async () => {
    setError('');
    setSuccessMessage('');
    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setSuccessMessage(
        '登録リクエストを送信しました。Supabaseから確認メールが届いているか確認してください。'
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました');
      console.error(e);
    }
  };

  const loginGithub = () => {
    window.location.href = '/api/auth/oauth2/github';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <Typography
              variant="h5"
              className="text-center font-bold text-gray-900 mb-6"
            >
              ログイン／新規登録
            </Typography>

            <TextField
              label="メールアドレス"
              fullWidth
              type="email"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#f9fafb',
                },
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="パスワード"
              fullWidth
              type="password"
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#f9fafb',
                },
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="contained"
              fullWidth
              sx={{
                mb: 2,
                py: 1.5,
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: '10px',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
              onClick={login}
            >
              ログイン
            </Button>

            <Button
              variant="contained"
              fullWidth
              sx={{
                mb: 2,
                py: 1.5,
                bgcolor: 'secondary.main',
                color: 'white',
                borderRadius: '10px',
                '&:hover': { bgcolor: 'secondary.dark' },
              }}
              onClick={register}
            >
              新規登録
            </Button>

            <Button
              variant="contained"
              fullWidth
              startIcon={<GitHubIcon />}
              sx={{
                py: 1.5,
                bgcolor: 'black',
                color: 'white',
                borderRadius: '10px',
                '&:hover': { opacity: 0.85 },
              }}
              onClick={loginGithub}
            >
              GitHub ログイン
            </Button>
          </CardContent>
        </Card>

        {/* メッセージ */}
        <div className="mt-4 space-y-2">
          <Message messageText={error} setMessage={setError} messageType="error" />
          <Message messageText={successMessage} setMessage={setSuccessMessage} messageType="success" />
        </div>
      </div>
    </div>
  );
}
