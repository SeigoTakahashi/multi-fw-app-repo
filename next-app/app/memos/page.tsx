'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  IconButton,
  Divider,
  Box,
  CircularProgress,
  Paper,
  Fade
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import Message from '../components/Message';
import { apiAuthFetch, errorHandling } from '../lib/apiFetch';


type Memo = {
  id: number;
  user_id: string;
  title: string;
  content?: string;
  createdAt: string;
};

export default function MemosPage() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const [userEmail, setUserEmail] = useState<string>('未ログイン');

  const [summary, setSummary] = useState('');

  const [errorCode, setErrorCode] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  const loadMemos = async () => {
    await errorHandling(async () => {
      const json = await apiAuthFetch('/api/memos');
      setMemos(json);
    }, setError);
  };

  useEffect(() => {
    (async () => {
      await loadMemos();
    })();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = JSON.parse(localStorage.getItem('user_session') || '{}');
      setUserEmail(session?.user?.email || '未ログイン');
    }
  }, []);

  const router = useRouter();

  async function createMemo() {
    await errorHandling(async () => {
      const savedMemo = await apiAuthFetch('/api/memos', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
      });

      // 要約があれば値をセットする
      if (savedMemo.summary) {
        setSummary(savedMemo.summary);
      }
      await loadMemos();
    }, setError);
  }

  async function deleteMemo(id: number) {
    await errorHandling(async () => {
      await apiAuthFetch(`/api/memos/${id}`, {
        method: 'DELETE',
      });
      await loadMemos();
    }, setError);
  }

  function startEdit(memo: Memo) {
    setEditingId(memo.id);
    setEditTitle(memo.title);
    setEditContent(memo.content || '');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  }

  async function updateMemo(id: number) {
    await errorHandling(async () => {
      await apiAuthFetch(`/api/memos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title: editTitle, content: editContent  }),
      });
      cancelEdit()
      await loadMemos();
    }, setError);
  }
  async function logout() {
    setError('');
    await apiAuthFetch(`/api/auth/logout`, {
      method: 'POST',
    });
    localStorage.removeItem('user_session');
    router.push('/');
  }

  async function errorSuggest() {
    setLoading(true);
    await errorHandling(async () => {
      const errorHandling = await apiAuthFetch('/api/errors', {
        method: 'POST',
        body: JSON.stringify({ errorCode }),
      });

      // 提案があれば値をセットする
      if (errorHandling.suggestion) {
        setSuggestion(errorHandling.suggestion);
      }
    }, setError);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
          <Typography variant="h4" className="font-bold text-gray-900">
            メモ一覧
          </Typography>
          <div className="flex items-center gap-3">
            <Typography className="text-gray-600 text-sm">
              {userEmail}
            </Typography>
            <Button variant="outlined" color="secondary" onClick={logout}>
              ログアウト
            </Button>
          </div>
        </div>

        {/* エラーメッセージ */}
        <Message messageText={error} setMessage={setError} messageType="error" />

        {/* メモ作成 */}
        <Card className="mb-6 shadow-lg rounded-xl" sx={{ backgroundColor: '#ffffff' }}>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4 text-gray-800">
              メモ追加
            </Typography>
            <TextField
              label="タイトル"
              fullWidth
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#f9fafb',
                },
              }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
            />
            <TextField
              label="内容"
              fullWidth
              multiline
              minRows={3}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#f9fafb',
                },
              }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              className="w-full py-2"
              onClick={createMemo}
            >
              追加
            </Button>
          </CardContent>
        </Card>

        <Divider className="mb-6" />

        {/* summaryが存在する場合のみ表示 */}
        {summary && (
          <Fade in={Boolean(summary)}>
            <Paper
              elevation={0}
              sx={{
                mt: 2,
                mb: 2,
                p: 2,
                backgroundColor: '#f8f9fa', // ほんのりグレーで別枠感を出す
                borderLeft: '4px solid #3f51b5', // アクセントカラーの左線
                borderRadius: '4px',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AutoAwesomeIcon sx={{ fontSize: 20, color: '#3f51b5', mr: 1 }} />
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
                  AIによる要約
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {summary}
              </Typography>
            </Paper>
          </Fade>
        )}

        {/* メモ一覧 */}
        <div className="space-y-4">
          {memos.map((memo) => (
            <Card
              key={memo.id}
              className="shadow-md rounded-xl hover:shadow-2xl transition-shadow duration-200"
              sx={{ backgroundColor: '#ffffff' }}
            >
              <CardContent>
                {editingId === memo.id ? (
                  <>
                    <TextField
                      label="タイトル"
                      fullWidth
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          backgroundColor: '#f9fafb',
                        },
                      }}
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <TextField
                      label="内容"
                      fullWidth
                      multiline
                      minRows={3}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          backgroundColor: '#f9fafb',
                        },
                      }}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="flex gap-2 justify-end">
                      <IconButton color="primary" onClick={() => updateMemo(memo.id)}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton color="default" onClick={cancelEdit}>
                        <CancelIcon />
                      </IconButton>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <Typography className="text-xs text-gray-500">
                        {new Date(memo.createdAt).toLocaleString()}
                      </Typography>
                      <div>
                        <IconButton color="info" size="small" onClick={() => startEdit(memo)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" size="small" onClick={() => deleteMemo(memo.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </div>
                    <Typography variant="h6" className="mb-2 font-medium text-blue-700">
                      {memo.title}
                    </Typography>
                    <Typography className="text-gray-700 whitespace-pre-line">
                      {memo.content}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>


        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            AI エラー解決サポーター
          </Typography>
          
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
              <TextField
                fullWidth
                label="エラーコードまたはログを入力"
                variant="outlined"
                value={errorCode}
                onChange={(e) => setErrorCode(e.target.value)}
                placeholder="例: NullPointerException at line 42..."
                multiline
                // rows を指定することで、最初から大きな入力エリアになります
                rows={8} 
                // maxRows を外すか大きくすることで、入力に応じてさらに伸びるようになります
                maxRows={15} 
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={errorSuggest}
                  disabled={loading || !errorCode}
                  // ボタンを少し大きく、存在感を出す
                  sx={{ minWidth: 160, py: 1.5, fontWeight: 'bold' }}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                >
                  AIに解決策を聞く
                </Button>
              </Box>
            </Box>
          </Paper>

          {suggestion && (
            <Paper sx={{ p: 4, bgcolor: '#f8f9fa' }} elevation={0} variant="outlined">
              <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
                AIからの提案
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {/* マークダウン表示部分 */}
              <Box className="markdown-body">
                <Markdown remarkPlugins={[remarkGfm]}>
                  {suggestion}
                </Markdown>
              </Box>
            </Paper>
          )}
        </Box>
      </div>
    </div>
  );
}
