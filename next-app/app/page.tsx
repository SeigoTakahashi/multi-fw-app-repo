'use client';

import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
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
    // 初期エラーをURLフラグメントから取得
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
    window.location.href = '/memos';
  };

  return (
    <div className="w-full flex items-center justify-center mt-24 px-4">
      <Card className="w-full max-w-md shadow-xl" variant="outlined">
        <CardContent>
          <Typography
            variant="h5"
            sx={{ mb: 2 }}
            className="text-center font-bold"
          >
            ログイン／新規登録
          </Typography>

          <TextField
            label="メールアドレス"
            fullWidth
            type="email"
            sx={{ mb: 1 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="パスワード"
            fullWidth
            type="password"
            sx={{ mb: 1 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            className="w-full py-2"
            sx={{
              mb: 1,
              bgcolor: 'gray',
              color: 'white',
              '&:hover': { opacity: 0.8 },
            }}
            onClick={login}
          >
            ログイン
          </Button>

          <Button
            variant="contained"
            className="w-full py-2"
            sx={{
              mb: 1,
              bgcolor: 'gray',
              color: 'white',
              '&:hover': { opacity: 0.8 },
            }}
            onClick={register}
          >
            新規登録
          </Button>

          <Button
            variant="contained"
            className="w-full py-2 flex items-center gap-2"
            sx={{
              bgcolor: 'black',
              color: 'white',
              '&:hover': { opacity: 0.8 },
            }}
            onClick={loginGithub}
          >
            <GitHubIcon />
            GitHub ログイン
          </Button>
        </CardContent>
      </Card>

      <Message messageText={error} setMessage={setError} messageType='error' />
      <Message messageText={successMessage} setMessage={setSuccessMessage} messageType='success' />
    </div>
  );
}
