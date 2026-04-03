import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, Button } from '@/components/ui';
import { ALLOWED_REACTIONS } from '@cinema-app/shared';

interface CommentData {
  id: string;
  content: string;
  parentId: string | null;
  createdBy: { id: string; displayName: string | null; avatarUrl: string | null };
  reactions: { emoji: string; userId: string }[];
  replies?: CommentData[];
  createdAt: string;
}

interface CommentsSectionProps {
  objectiveId: string;
}

export function CommentsSection({ objectiveId }: CommentsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComments = () => {
    api.get<CommentData[]>(`/objectives/${objectiveId}/comments`)
      .then(setComments)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchComments(); }, [objectiveId]);

  const handlePost = async () => {
    if (!newComment.trim()) return;
    await api.post(`/objectives/${objectiveId}/comments`, { content: newComment.trim() });
    setNewComment('');
    fetchComments();
  };

  const handleReply = async (parentId: string) => {
    if (!replyText.trim()) return;
    await api.post(`/objectives/${objectiveId}/comments`, {
      content: replyText.trim(),
      parentId,
    });
    setReplyTo(null);
    setReplyText('');
    fetchComments();
  };

  const handleReaction = async (commentId: string, emoji: string, alreadyReacted: boolean) => {
    if (alreadyReacted) {
      await api.delete(`/comments/${commentId}/reactions/${encodeURIComponent(emoji)}`);
    } else {
      await api.post(`/comments/${commentId}/reactions`, { emoji });
    }
    fetchComments();
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'agora';
    if (diffMin < 60) return `há ${diffMin}min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `há ${diffH}h`;
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  const renderComment = (comment: CommentData, isReply = false) => {
    const userId = (user as { id: string } | null)?.id;

    // Group reactions by emoji
    const reactionCounts = new Map<string, { count: number; reacted: boolean }>();
    for (const r of comment.reactions) {
      const existing = reactionCounts.get(r.emoji);
      if (existing) {
        existing.count++;
        if (r.userId === userId) existing.reacted = true;
      } else {
        reactionCounts.set(r.emoji, { count: 1, reacted: r.userId === userId });
      }
    }

    return (
      <div key={comment.id} className={`${isReply ? 'ml-8 mt-3' : 'mt-4'}`}>
        <div className="flex gap-3">
          <Avatar
            src={comment.createdBy.avatarUrl}
            name={comment.createdBy.displayName ?? 'Anónimo'}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-primary">
                {comment.createdBy.displayName ?? 'Anónimo'}
              </span>
              <span className="text-xs text-text-secondary">
                {formatTime(comment.createdAt)}
              </span>
            </div>

            {/* Content with @mention highlight */}
            <p className="text-sm text-text-primary mt-1">
              {comment.content.split(/(@\S+)/g).map((part, i) =>
                part.startsWith('@') ? (
                  <span key={i} className="text-primary font-medium">{part}</span>
                ) : (
                  <span key={i}>{part}</span>
                ),
              )}
            </p>

            {/* Reactions */}
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {ALLOWED_REACTIONS.map((emoji) => {
                const data = reactionCounts.get(emoji);
                if (!data && reactionCounts.size > 0) {
                  // Show only add button for unused reactions
                  return (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(comment.id, emoji, false)}
                      className="px-1.5 py-0.5 text-xs rounded border border-transparent hover:border-border hover:bg-bg-secondary cursor-pointer transition-colors"
                      title={`Reagir com ${emoji}`}
                    >
                      {emoji}
                    </button>
                  );
                }
                return (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(comment.id, emoji, data?.reacted ?? false)}
                    className={`
                      px-2 py-0.5 text-xs rounded-full border transition-colors cursor-pointer
                      ${data?.reacted
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:bg-bg-secondary text-text-secondary'}
                    `}
                  >
                    {emoji} {data?.count ?? 0}
                  </button>
                );
              })}

              {/* Reply button */}
              {!isReply && (
                <button
                  onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                  className="px-2 py-0.5 text-xs text-text-secondary hover:text-primary cursor-pointer"
                >
                  Responder
                </button>
              )}
            </div>

            {/* Reply input */}
            {replyTo === comment.id && (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Escrever resposta..."
                  className="flex-1 px-3 py-1.5 text-sm border-2 border-border rounded-sm focus:border-primary outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleReply(comment.id)}
                  autoFocus
                />
                <Button size="sm" onClick={() => handleReply(comment.id)} disabled={!replyText.trim()}>
                  Enviar
                </Button>
              </div>
            )}

            {/* Replies */}
            {comment.replies?.map((reply) => renderComment(reply, true))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <p className="text-text-secondary text-sm text-center py-4">A carregar comentários...</p>;
  }

  return (
    <div>
      {/* New comment input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escrever comentário... Use @nome para mencionar"
          className="flex-1 px-3 py-2 text-sm border-2 border-border rounded-sm focus:border-primary outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handlePost()}
        />
        <Button size="sm" onClick={handlePost} disabled={!newComment.trim()}>
          Enviar
        </Button>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-text-secondary text-sm text-center py-6">
          Nenhum comentário ainda. Seja o primeiro!
        </p>
      ) : (
        <div className="divide-y divide-border">
          {comments.map((c) => renderComment(c))}
        </div>
      )}
    </div>
  );
}
