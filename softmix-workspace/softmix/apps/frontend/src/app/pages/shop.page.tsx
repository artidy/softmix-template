import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { LayoutGrid, List, ListTree, PackageSearch, Plus, RotateCw, X } from 'lucide-react';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@project-lib/shared-types';

import { AppRoute } from '../const';
import { Category } from '../types/category';
import { QueryParams } from '../types/product';
import { cn } from '../lib/cn';
import { categoryLink, collectCategoryIds } from '../lib/catalog';
import { formatNumber, pluralize } from '../lib/format';
import { useDocumentTitle } from '../lib/use-document-title';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getCategoriesApi } from '../store/categories-data/api-actions';
import { setCategories } from '../store/categories-data/categories-data';
import { getCategories, getIsCategoriesLoading } from '../store/categories-data/selectors';
import { getImagesApi } from '../store/products-data/api-actions';
import { getCanManageProducts } from '../store/user-data/selectors';
import { useGetProductsQuery } from '../store/shop-api';
import { CategoryTree } from '../components/catalog/category-tree';
import { ProductForm } from '../components/product/product-form';
import { ProductGrid } from '../components/product/product-card';
import { Button, buttonVariants } from '../ui/button';
import { Dialog, DialogContent, SheetContent } from '../ui/dialog';
import { EmptyState, Skeleton, Spinner } from '../ui/feedback';
import { Select } from '../ui/form';
import { Container } from '../ui/layout';
import { Crumb, PageHeader } from '../ui/page-header';
import { Pagination } from '../ui/pagination';

const DEFAULT_SORT = 'oldest';

const SORT_OPTIONS = [
  { value: 'oldest', label: 'По умолчанию' },
  { value: 'newest', label: 'Сначала новые' },
  { value: 'price_asc', label: 'По цене: дешевле' },
  { value: 'price_desc', label: 'По цене: дороже' },
  { value: 'title_asc', label: 'По названию (А–Я)' },
  { value: 'discount', label: 'Сначала со скидкой' },
];

type ViewMode = 'grid' | 'list';

function ViewToggle({ view, onChange }: { view: ViewMode; onChange: (view: ViewMode) => void }) {
  const options = [
    { value: 'grid' as const, label: 'Плиткой', Icon: LayoutGrid },
    { value: 'list' as const, label: 'Списком', Icon: List },
  ];

  return (
    <div className="inline-flex rounded-lg border bg-background p-0.5 shadow-xs" role="group" aria-label="Вид каталога">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          aria-pressed={view === value}
          title={label}
          className={cn(
            'grid size-8 place-items-center rounded-md transition-colors',
            view === value ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
}

function ShopPage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = useAppSelector(getCategories);
  const isCategoriesLoading = useAppSelector(getIsCategoriesLoading);
  const canManage = useAppSelector(getCanManageProducts);
  const [view, setView] = useState<ViewMode>('grid');
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isTreeSettled, setIsTreeSettled] = useState(false);

  const page = Math.max(DEFAULT_PAGE, Number(searchParams.get('page')) || DEFAULT_PAGE);
  const categoryId = searchParams.get('categoryId');
  const sortBy = searchParams.get('sortBy') ?? DEFAULT_SORT;
  const search = searchParams.get('search')?.trim() ?? '';

  useEffect(() => {
    dispatch(getCategoriesApi()).finally(() => setIsTreeSettled(true));
    dispatch(getImagesApi());

    return () => {
      dispatch(setCategories([]));
    };
  }, [dispatch]);

  // Подкатегории известны только после загрузки дерева — до этого не запрашиваем неполный список.
  const isWaitingForTree = Boolean(categoryId) && !isTreeSettled;

  const queryParams = useMemo<QueryParams>(() => {
    const params: QueryParams = { limit: DEFAULT_LIMIT, page };

    if (categoryId) {
      const ids = collectCategoryIds(categoryId, categories);
      if (ids.length > 1) {
        params.categoryIds = ids;
      } else {
        params.categoryId = categoryId;
      }
    }
    if (sortBy !== DEFAULT_SORT) {
      params.sortBy = sortBy;
    }
    if (search) {
      params.search = search;
    }
    return params;
  }, [page, categoryId, sortBy, search, categories]);

  const { data, currentData, isError, refetch } = useGetProductsQuery(queryParams, { skip: isWaitingForTree });

  // Пока грузится новая выборка, прежние товары остаются на месте приглушёнными —
  // без мигания заглушками и без схлопывания страницы.
  const shown = currentData ?? data;
  const isStale = !currentData && Boolean(data) && !isError;
  const isListLoading = !shown && !isError;
  const products = shown?.products ?? [];
  const total = shown?.total ?? 0;
  const totalPages = Math.ceil(total / DEFAULT_LIMIT);

  const { currentCategory, trail, subcategories } = useMemo(() => {
    const byId = new Map(categories.map((category) => [category.id, category]));
    const currentCategory = categoryId ? byId.get(categoryId) : undefined;

    const trail: Category[] = [];
    let cursor = currentCategory?.ownerId ? byId.get(currentCategory.ownerId) : undefined;
    while (cursor && !trail.includes(cursor)) {
      trail.unshift(cursor);
      cursor = cursor.ownerId ? byId.get(cursor.ownerId) : undefined;
    }

    const subcategories = categoryId
      ? categories.filter((category) => category.ownerId === categoryId)
      : categories.filter((category) => !category.ownerId);

    return { currentCategory, trail, subcategories };
  }, [categories, categoryId]);

  const title = currentCategory?.title ?? (search ? 'Поиск по каталогу' : 'Каталог');
  useDocumentTitle(title);

  const breadcrumbs: Crumb[] = [
    { label: 'Главная', to: AppRoute.Main },
    ...(categoryId || search ? [{ label: 'Каталог', to: AppRoute.Shop }] : []),
    ...trail.map((category) => ({ label: category.title, to: categoryLink(category.id) })),
    { label: title },
  ];

  const updateParams = (change: (params: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams);
    change(next);
    next.delete('page');
    setSearchParams(next);
  };

  const handleSortChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const { value } = evt.target;
    updateParams((params) => (value === DEFAULT_SORT ? params.delete('sortBy') : params.set('sortBy', value)));
  };

  const clearSearch = () => updateParams((params) => params.delete('search'));

  const counter = isListLoading ? (
    <Skeleton className="h-4 w-24" />
  ) : total === 0 ? (
    'Нет товаров'
  ) : (
    `${formatNumber(total)} ${pluralize(total, ['товар', 'товара', 'товаров'])}`
  );

  return (
    <>
      <PageHeader
        title={title}
        breadcrumbs={breadcrumbs}
        description={search ? <>Результаты по запросу «{search}»</> : undefined}
        actions={
          canManage && (
            <Button onClick={() => setIsAddOpen(true)}>
              <Plus />
              Добавить товар
            </Button>
          )
        }
      />

      <Container className="py-8 lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:gap-10 lg:py-10">
        <aside className="hidden lg:block" aria-label="Категории каталога">
          <div className="sticky top-24 -mx-3 max-h-[calc(100dvh-7rem)] overflow-y-auto pb-6">
            <CategoryTree categories={categories} currentCategoryId={categoryId} loading={isCategoriesLoading} />
          </div>
        </aside>

        <div className="min-w-0">
          {subcategories.length > 0 && (
            // На больших экранах подкатегории видны в дереве слева.
            <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0 lg:hidden">
              {subcategories.map((category) => (
                <Link
                  key={category.id}
                  to={categoryLink(category.id)}
                  className="inline-flex h-9 shrink-0 items-center rounded-full border bg-card px-4 text-sm transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          )}

          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Button variant="outline" className="lg:hidden" onClick={() => setIsCategoriesOpen(true)}>
              <ListTree />
              Категории
            </Button>
            <div className="mr-auto flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
              {counter}
              {isStale && <Spinner className="size-4" />}
              {search && (
                <span className="inline-flex h-8 items-center gap-1 rounded-full border bg-card pl-3 pr-1 text-foreground">
                  «{search}»
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="grid size-6 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label="Сбросить поиск"
                  >
                    <X className="size-3.5" />
                  </button>
                </span>
              )}
            </div>
            <Select value={sortBy} onChange={handleSortChange} aria-label="Сортировка" className="h-9 w-auto">
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <ViewToggle view={view} onChange={setView} />
          </div>

          {isError ? (
            <EmptyState
              icon={<RotateCw />}
              title="Не удалось загрузить товары"
              description="Проверьте подключение к интернету и попробуйте ещё раз."
              action={<Button onClick={() => refetch()}>Повторить</Button>}
              className="rounded-2xl border bg-card"
            />
          ) : !isListLoading && !isStale && products.length === 0 ? (
            <EmptyState
              icon={<PackageSearch />}
              title="Товаров не найдено"
              description={
                search
                  ? 'По этому запросу ничего не нашлось. Проверьте написание или поищите в другой категории.'
                  : 'В этой категории пока нет товаров. Попробуйте выбрать другую категорию или вернитесь в каталог.'
              }
              action={
                search ? (
                  <Button variant="outline" onClick={clearSearch}>
                    Сбросить поиск
                  </Button>
                ) : (
                  <Link to={AppRoute.Shop} className={buttonVariants({ variant: 'outline' })}>
                    Вернуться в каталог
                  </Link>
                )
              }
              className="animate-fade-up rounded-2xl border bg-card"
            />
          ) : (
            <div
              className={cn('transition-opacity duration-300', isStale && 'pointer-events-none opacity-45')}
              aria-busy={isStale || undefined}
            >
              <ProductGrid
                products={products}
                loading={isListLoading}
                view={view}
                skeletonCount={12}
                className={view === 'grid' ? 'md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4' : undefined}
              />
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} className="mt-10" />
        </div>
      </Container>

      <Dialog open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
        <SheetContent title="Категории" side="left">
          <CategoryTree
            categories={categories}
            currentCategoryId={categoryId}
            loading={isCategoriesLoading}
            onNavigate={() => setIsCategoriesOpen(false)}
            className="p-3"
          />
        </SheetContent>
      </Dialog>

      {canManage && (
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent title="Новый товар" size="lg">
            <ProductForm defaultCategoryId={categoryId} onDone={() => setIsAddOpen(false)} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default ShopPage;
