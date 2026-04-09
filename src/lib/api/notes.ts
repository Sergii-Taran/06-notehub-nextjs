import { api } from './client';
import type { CreateNoteDto, Note } from '@/types/note';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number = 1,
  search: string = ''
): Promise<FetchNotesResponse> => {
  const res = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage: 12,
      ...(search ? { search } : {}),
    },
  });

  return res.data;
};

export const createNote = async (note: CreateNoteDto): Promise<Note> => {
  const res = await api.post<Note>('/notes', note);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  try {
    const res = await api.get<Note>(`/notes/${id}`);

    if (!res.data || !res.data.id) {
      throw new Error('Note not found');
    }

    return res.data;
  } catch (_) {
    throw new Error('Note not found');
  }
};
