import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import NotesClient from './NotesClient';
import { fetchNotes } from '@/lib/api/notes';

interface Props {
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default async function NotesPage({ searchParams }: Props) {
  // 🔥 ВАЖЛИВО
  const resolvedSearchParams = await searchParams;

  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || '';

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes(page, search),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}
