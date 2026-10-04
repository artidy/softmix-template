import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Search } from 'lucide-react';

import { AppRoute } from '../const';
import { cn } from '../lib/cn';
import { Input } from '../ui/form';

type SearchFormProps = {
  className?: string;
  autoFocus?: boolean;
  onSearch?: () => void;
};

export function SearchForm({ className, autoFocus, onSearch }: SearchFormProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentQuery = searchParams.get('search') ?? '';
  const [query, setQuery] = useState(currentQuery);

  // Поле повторяет запрос из адреса, например после перехода «назад».
  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `${AppRoute.Shop}?search=${encodeURIComponent(trimmed)}` : AppRoute.Shop);
    onSearch?.();
  };

  return (
    <form role="search" onSubmit={handleSubmit} className={cn('relative', className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={query}
        onChange={(evt) => setQuery(evt.target.value)}
        placeholder="Поиск товаров"
        aria-label="Поиск товаров"
        autoFocus={autoFocus}
        className="rounded-full border-transparent bg-secondary/70 pl-9 shadow-none focus-visible:bg-background"
      />
    </form>
  );
}
