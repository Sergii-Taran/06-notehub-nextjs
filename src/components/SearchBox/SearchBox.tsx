'use client';

import { useState, useEffect } from 'react';
import css from './SearchBox.module.css';

interface Props {
  onSearch: (value: string) => void;
  initialValue?: string;
}

export default function SearchBox({ onSearch, initialValue = '' }: Props) {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes..."
      value={query}
      onChange={(e) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
      }}
    />
  );
}
