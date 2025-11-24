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

  useEffect(() => {
    // access_tokenをURLフラグメントから取得
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const errorParam = params.get('error');

      if (errorParam) {
        window.history.replaceState(null, '', window.location.pathname);
      } else if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        window.location.href = '/memos';
      }
    }
  }, []);

  const login = async () => {
    setSuccessMessage('ログイン成功しました。');
    // window.location.href = '/memos';
  };

  const register = async () => {
    setError('ログイン失敗しました。');
    // window.location.href = '/memos';
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
