import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ChevronRight, Ellipsis, FolderPlus, Pencil, Plus, Trash2 } from 'lucide-react';

import { Category } from '../../types/category';
import { AppRoute } from '../../const';
import { cn } from '../../lib/cn';
import { categoryLink } from '../../lib/catalog';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getCanManageProducts } from '../../store/user-data/selectors';
import { createCategoryApi, deleteCategoryApi, updateCategoryApi } from '../../store/categories-data/api-actions';
import { ConfirmDialog } from '../../ui/confirm-dialog';
import { Dialog, DialogContent } from '../../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Skeleton } from '../../ui/feedback';
import { CategoryForm } from './category-form';

type DialogState =
  | { type: 'create'; owner?: Category }
  | { type: 'rename'; category: Category }
  | { type: 'delete'; category: Category }
  | null;

type TreeContext = {
  childrenOf: Map<string, Category[]>;
  currentId: string | null;
  pathIds: Set<string>;
  canManage: boolean;
  onNavigate?: () => void;
  onAction: (state: DialogState) => void;
};

const ROW = 'group flex items-center gap-0.5 rounded-lg pr-1 transition-colors';
// Длинные названия переносятся: «Сетевое и серверное оборудование, СХД» должно читаться целиком.
const LINK =
  'min-w-0 flex-1 rounded-lg px-3 py-2 text-sm leading-snug [overflow-wrap:anywhere] outline-none focus-visible:ring-2 focus-visible:ring-ring';
const ICON_BUTTON =
  'grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

function CategoryActions({ category, onAction }: { category: Category; onAction: TreeContext['onAction'] }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className={cn(ICON_BUTTON, 'opacity-100 data-[state=open]:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100')}
        aria-label={`Действия с категорией «${category.title}»`}
      >
        <Ellipsis className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onAction({ type: 'create', owner: category })}>
          <FolderPlus />
          Добавить подкатегорию
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onAction({ type: 'rename', category })}>
          <Pencil />
          Переименовать
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={() => onAction({ type: 'delete', category })}>
          <Trash2 />
          Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CategoryNode({ category, context }: { category: Category; context: TreeContext }) {
  const children = context.childrenOf.get(category.id) ?? [];
  const isActive = category.id === context.currentId;
  const isOnPath = context.pathIds.has(category.id);
  // Ветка открыта, если в ней выбранная категория; пользователь может открыть или свернуть её сам.
  const [manualExpanded, setManualExpanded] = useState<boolean | null>(null);
  const isExpanded = manualExpanded ?? (isActive || isOnPath);

  return (
    <li>
      <div className={cn(ROW, isActive ? 'bg-primary-soft text-primary' : 'hover:bg-accent')}>
        <Link
          to={categoryLink(category.id)}
          onClick={context.onNavigate}
          aria-current={isActive ? 'page' : undefined}
          className={cn(LINK, (isActive || isOnPath) && 'font-medium')}
        >
          {category.title}
        </Link>
        {context.canManage && <CategoryActions category={category} onAction={context.onAction} />}
        {children.length > 0 && (
          <button
            type="button"
            className={ICON_BUTTON}
            onClick={() => setManualExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? `Свернуть «${category.title}»` : `Развернуть «${category.title}»`}
          >
            <ChevronRight className={cn('size-4 transition-transform', isExpanded && 'rotate-90')} />
          </button>
        )}
      </div>
      {children.length > 0 && isExpanded && (
        <ul className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l pl-2">
          {children.map((child) => (
            <CategoryNode key={child.id} category={child} context={context} />
          ))}
        </ul>
      )}
    </li>
  );
}

type CategoryTreeProps = {
  categories: Category[];
  currentCategoryId: string | null;
  loading?: boolean;
  /** Вызывается при переходе в категорию — например, чтобы закрыть мобильную панель. */
  onNavigate?: () => void;
  className?: string;
};

/** Дерево категорий каталога; сотрудникам — ещё и добавление, переименование и удаление. */
export function CategoryTree({ categories, currentCategoryId, loading = false, onNavigate, className }: CategoryTreeProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const canManage = useAppSelector(getCanManageProducts);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { roots, childrenOf, pathIds } = useMemo(() => {
    const byId = new Map(categories.map((category) => [category.id, category]));
    const childrenOf = new Map<string, Category[]>();
    const roots: Category[] = [];

    for (const category of categories) {
      if (category.ownerId && byId.has(category.ownerId)) {
        childrenOf.set(category.ownerId, [...(childrenOf.get(category.ownerId) ?? []), category]);
      } else if (!category.ownerId) {
        roots.push(category);
      }
    }

    // Родители выбранной категории — их ветки раскрыты.
    const pathIds = new Set<string>();
    let cursor = currentCategoryId ? byId.get(currentCategoryId) : undefined;
    while (cursor?.ownerId && !pathIds.has(cursor.ownerId)) {
      pathIds.add(cursor.ownerId);
      cursor = byId.get(cursor.ownerId);
    }

    return { roots, childrenOf, pathIds };
  }, [categories, currentCategoryId]);

  const context: TreeContext = {
    childrenOf,
    currentId: currentCategoryId,
    pathIds,
    canManage,
    onNavigate,
    onAction: setDialog,
  };

  const closeDialog = () => setDialog(null);

  const handleCreate = (title: string) => {
    const owner = dialog?.type === 'create' ? dialog.owner : undefined;
    return dispatch(
      createCategoryApi(owner ? { title, ownerId: owner.id, position: owner.position + 1 } : { title }),
    ).unwrap();
  };

  const handleRename = (title: string) => {
    if (dialog?.type !== 'rename') {
      return Promise.resolve(false);
    }
    return dispatch(updateCategoryApi({ id: dialog.category.id, title })).unwrap();
  };

  const handleDelete = async () => {
    if (dialog?.type !== 'delete') {
      return;
    }
    const { category } = dialog;
    setIsDeleting(true);
    const isDeleted = await dispatch(deleteCategoryApi(category.id)).unwrap();
    setIsDeleting(false);
    if (!isDeleted) {
      return;
    }
    setDialog(null);
    // Удалили открытую категорию или её родителя — возвращаемся ко всему каталогу.
    if (category.id === currentCategoryId || pathIds.has(category.id)) {
      navigate(AppRoute.Shop);
    }
  };

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-2 px-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Категории</h2>
        {canManage && (
          <button
            type="button"
            className={ICON_BUTTON}
            onClick={() => setDialog({ type: 'create' })}
            aria-label="Добавить категорию"
            title="Добавить категорию"
          >
            <Plus className="size-4" />
          </button>
        )}
      </div>

      <ul className="flex flex-col gap-0.5">
        <li>
          <div className={cn(ROW, currentCategoryId ? 'hover:bg-accent' : 'bg-primary-soft text-primary')}>
            <Link
              to={AppRoute.Shop}
              onClick={onNavigate}
              aria-current={currentCategoryId ? undefined : 'page'}
              className={cn(LINK, !currentCategoryId && 'font-medium')}
            >
              Все товары
            </Link>
          </div>
        </li>
        {loading && roots.length === 0
          ? Array.from({ length: 5 }, (_, index) => (
              <li key={index} className="px-3 py-2">
                <Skeleton className="h-4 w-4/5" />
              </li>
            ))
          : roots.map((category) => <CategoryNode key={category.id} category={category} context={context} />)}
      </ul>

      {canManage && (
        <>
          <Dialog open={dialog?.type === 'create' || dialog?.type === 'rename'} onOpenChange={(open) => !open && closeDialog()}>
            {dialog?.type === 'create' && (
              <DialogContent
                title={dialog.owner ? 'Новая подкатегория' : 'Новая категория'}
                description={dialog.owner ? <>Будет добавлена в «{dialog.owner.title}».</> : undefined}
                size="sm"
              >
                <CategoryForm submitLabel="Добавить" onSubmit={handleCreate} onCancel={closeDialog} />
              </DialogContent>
            )}
            {dialog?.type === 'rename' && (
              <DialogContent title="Переименовать категорию" size="sm">
                <CategoryForm
                  initialTitle={dialog.category.title}
                  submitLabel="Сохранить"
                  onSubmit={handleRename}
                  onCancel={closeDialog}
                />
              </DialogContent>
            )}
          </Dialog>

          <ConfirmDialog
            open={dialog?.type === 'delete'}
            onOpenChange={(open) => !open && closeDialog()}
            title="Удалить категорию?"
            description={
              dialog?.type === 'delete' ? (
                <>Категория «{dialog.category.title}» будет удалена. Это действие нельзя отменить.</>
              ) : undefined
            }
            loading={isDeleting}
            onConfirm={handleDelete}
          />
        </>
      )}
    </div>
  );
}
