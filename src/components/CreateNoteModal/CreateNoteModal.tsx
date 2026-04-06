'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import toast from 'react-hot-toast';

import css from './CreateNoteModal.module.css';

interface Props {
  onClose: () => void;
}

export default function CreateNoteModal({ onClose }: Props) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success('Note created');

      queryClient.invalidateQueries({
        queryKey: ['notes'],
        exact: false,
      });

      onClose();
    },
    onError: () => {
      toast.error('Failed to create note');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    mutation.mutate({ title, content, tag });
  };

  return (
    <div className={css.backdrop}>
      <div className={css.modal}>
        <h2>Create Note</h2>

        <form onSubmit={handleSubmit} className={css.form}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <input
            type="text"
            placeholder="Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />

          <div className={css.actions}>
            <button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating...' : 'Create'}
            </button>

            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
