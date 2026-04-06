'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import CreateNoteModal from '@/components/CreateNoteModal/CreateNoteModal';

export default function NotesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes(page, search),
    keepPreviousData: true,
  });

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('page', String(newPage));

    if (search) params.set('search', search);

    router.push(`?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams();

    if (value) params.set('search', value);

    params.set('page', '1');

    router.push(`?${params.toString()}`);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading notes</p>;

  return (
    <div>
      {/* 🔥 Create button */}
      <button onClick={() => setIsOpen(true)}>+ Create Note</button>

      {/* 🔍 Search */}
      <SearchBox onSearch={handleSearch} initialValue={search} />

      {/* 📋 Notes */}
      <NoteList notes={data?.notes || []} />

      {/* 🔽 Pagination */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => updatePage(page - 1)} disabled={page === 1}>
          Prev
        </button>

        <span>
          Page: {page} / {data?.totalPages}
        </span>

        <button
          onClick={() => updatePage(page + 1)}
          disabled={!data || page >= data.totalPages}
        >
          Next
        </button>
      </div>

      {/* 🔥 Modal */}
      {isOpen && <CreateNoteModal onClose={() => setIsOpen(false)} />}
    </div>
  );
}
