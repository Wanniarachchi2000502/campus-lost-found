import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { errMsg } from './api';

// Loads data whenever the screen gains focus; exposes loading/error/reload.
export default function useLoad(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setError('');
    try { setData(await fn()); } catch (e) { setError(errMsg(e)); }
    setLoading(false);
  }, deps); // eslint-disable-line
  useFocusEffect(useCallback(() => { load(); }, [load]));
  return { data, loading, error, reload: load };
}
