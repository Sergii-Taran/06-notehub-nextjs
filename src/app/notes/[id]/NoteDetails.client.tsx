'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';

import css from './NoteDetails.module.css';

export default function NoteDetailsClient() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (error) {
    return <p>Error: {(error as Error).message}</p>;
  }

  if (!note) {
    return <p>Note not found</p>;
  }

  return (
    <main className={css.main}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>

          <p className={css.tag}>{note.tag}</p>

          <p className={css.content}>{note.content}</p>

          <p className={css.date}>
            {new Date(note.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </main>
  );
}
