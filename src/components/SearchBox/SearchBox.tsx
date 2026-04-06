'use client';

import { useState, useEffect } from 'react';
import css from './SearchBox.module.css';

interface Props {
  onSearch: (value: string) => void;
  initialValue?: string;
}

export default function SearchBox({ onSearch, initialValue = '' }: Props) {
  const [query, setQuery] = useState(initialValue);

  // 🔥 синхронізація з URL
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const id = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => clearTimeout(id);
  }, [query, onSearch]);

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
