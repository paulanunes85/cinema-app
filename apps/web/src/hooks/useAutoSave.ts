import { useEffect, useRef, useState, useCallback } from 'react';

interface UseAutoSaveOptions {
  value: string;
  onSave: (value: string) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useAutoSave({
  value,
  onSave,
  delay = 2000,
  enabled = true,
}: UseAutoSaveOptions) {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef(value);

  const save = useCallback(
    async (val: string) => {
      if (val === lastSavedRef.current) return;
      setStatus('saving');
      try {
        await onSave(val);
        lastSavedRef.current = val;
        setStatus('saved');
        // Reset to idle after 2s
        setTimeout(() => setStatus('idle'), 2000);
      } catch {
        setStatus('error');
      }
    },
    [onSave],
  );

  useEffect(() => {
    if (!enabled || value === lastSavedRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      save(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, enabled, save]);

  const statusLabel: Record<SaveStatus, string> = {
    idle: '',
    saving: 'A guardar...',
    saved: 'Guardado ✓',
    error: 'Erro ao guardar',
  };

  return { status, statusText: statusLabel[status] };
}
