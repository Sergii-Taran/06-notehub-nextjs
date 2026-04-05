import axios from 'axios';
import type { CreateNoteDto, Note } from '@/types/note';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const BASE_URL = 'https://notehub-public.goit.study/api';

// axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

// 🔹 Отримання списку нотаток
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

// 🔹 Створення нотатки
export const createNote = async (note: CreateNoteDto): Promise<Note> => {
  const res = await api.post<Note>('/notes', note);
  return res.data;
};

// 🔹 Видалення нотатки
export const deleteNote = async (id: string): Promise<Note> => {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
};

// 🔹 Отримання однієї нотатки (ВАЖЛИВО для /notes/[id])
export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};
