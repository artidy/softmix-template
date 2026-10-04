import { ChangeEvent, useEffect, useId, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Check, ChevronLeft, ChevronRight, CloudDownload, PackageSearch, SquareCheckBig, SquareDashed } from 'lucide-react';
import { DEFAULT_DOWNLOADS_LIMIT, ProductCreate } from '@project-lib/shared-types';

import { useAppDispatch, useAppSelector } from '../hooks';
import { DEFAULT_PRODUCT_IMG } from '../const';
import { cn } from '../lib/cn';
import { buildCategoryOptions } from '../lib/catalog';
import { formatNumber } from '../lib/format';
import { useDocumentTitle } from '../lib/use-document-title';
import {
  getCategories as getDownloadCategories,
  getExcludedProducts,
  getIsCategoriesLoading,
  getIsProductsLoading,
  getNewProducts,
  getPagination,
  getProducts as getDownloadProducts,
} from '../store/downloads-data/selectors';
import { getCategories as getLocalCategories, getIsCategoriesLoading as getIsLocalCategoriesLoading } from '../store/categories-data/selectors';
import { getExternalServices } from '../store/external-services-data/selectors';
import { getExternalServicesApi } from '../store/external-services-data/api-actions';
import { getServiceCategoriesApi, getServiceProductsApi } from '../store/downloads-data/api-actions';
import { getCategoriesApi } from '../store/categories-data/api-actions';
import { createProductManyApi } from '../store/products-data/api-actions';
import { addNewProduct, deleteNewProduct, setCategories, setNewProducts, setProducts } from '../store/downloads-data/downloads-data';
import { Product } from '../types/product';
import { formatPrice } from '../utils/format';
import { AdminPageHeader } from '../components/admin/admin-page-header';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Dialog, DialogContent } from '../ui/dialog';
import { EmptyState, PageLoader, Skeleton } from '../ui/feedback';
import { Field, Select } from '../ui/form';

/** Окно из 10 номеров страниц вокруг текущей. */
function getPageWindow(current: number, total: number): number[] {
  const size = Math.min(total, 10);
  let start = 1;
  if (total > 10) {
    if (current <= 5) {
      start = 1;
    }
    else if (current >= total - 4) {
      start = total - 9;
    }
    else {
      start = current - 5;
    }
  }
  return Array.from({ length: size }, (_, index) => start + index);
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-lg font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function ImportPage() {
  const dispatch = useAppDispatch();
  const id = useId();

  const services = useAppSelector(getExternalServices);
  const downloadCategories = useAppSelector(getDownloadCategories);
  const isCategoriesLoading = useAppSelector(getIsCategoriesLoading);
  const downloadProducts = useAppSelector(getDownloadProducts);
  const isProductsLoading = useAppSelector(getIsProductsLoading);
  const newProducts = useAppSelector(getNewProducts);
  const excludedProducts = useAppSelector(getExcludedProducts);
  const pagination = useAppSelector(getPagination);
  const localCategories = useAppSelector(getLocalCategories);
  const isLocalCategoriesLoading = useAppSelector(getIsLocalCategoriesLoading);

  const [selectedService, setSelectedService] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localCategoryId, setLocalCategoryId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useDocumentTitle('Импорт товаров — панель управления');

  const activeServices = services.filter((service) => service.isActive);
  // Уже импортированные товары не показываем повторно.
  const filteredProducts = downloadProducts.filter((product) => !excludedProducts.includes(product.downloadId));
  const selectedIds = new Set(newProducts.map((product) => product.id));
  const localOptions = useMemo(() => buildCategoryOptions(localCategories), [localCategories]);

  useEffect(() => {
    dispatch(getExternalServicesApi());
    return () => {
      dispatch(setCategories([]));
      dispatch(setProducts([]));
      dispatch(setNewProducts([]));
    };
  }, [dispatch]);

  const handleServiceChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const name = evt.target.value;
    setSelectedService(name);
    setSelectedCategory('');
    setCurrentPage(1);
    dispatch(setProducts([]));
    dispatch(setNewProducts([]));

    if (name) {
      dispatch(getServiceCategoriesApi(name));
    } else {
      dispatch(setCategories([]));
    }
  };

  const handleCategoryChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const categoryId = evt.target.value;
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    dispatch(setNewProducts([]));

    if (categoryId && selectedService) {
      dispatch(
        getServiceProductsApi({
          serviceName: selectedService,
          categoryId,
          page: 1,
          limit: DEFAULT_DOWNLOADS_LIMIT,
        }),
      );
    }
  };

  const loadPage = (page: number) => {
    setCurrentPage(page);
    dispatch(
      getServiceProductsApi({
        serviceName: selectedService,
        categoryId: selectedCategory,
        page,
        limit: DEFAULT_DOWNLOADS_LIMIT,
      }),
    );
  };

  const toggleProduct = (product: Product) => {
    if (selectedIds.has(product.id)) {
      dispatch(deleteNewProduct(product.id));
    } else {
      dispatch(addNewProduct(product));
    }
  };

  const selectAll = () => {
    for (const product of filteredProducts) {
      if (!selectedIds.has(product.id)) {
        dispatch(addNewProduct(product));
      }
    }
  };

  const openImportModal = () => {
    if (newProducts.length === 0) {
      toast.error('Выберите товары для импорта');
      return;
    }
    dispatch(getCategoriesApi());
    setIsModalOpen(true);
  };

  const handleImport = () => {
    if (!localCategoryId) {
      toast.error('Выберите категорию');
      return;
    }

    const products: ProductCreate[] = newProducts.map((product) => ({
      title: product.title,
      price: product.price,
      pricePrev: 0,
      imageUrl: product.imageUrl,
      description: product.description,
      categoryId: localCategoryId,
      isHot: false,
      downloadId: product.downloadId,
      downloadCompany: selectedService,
    }));

    dispatch(createProductManyApi(products));
    setIsModalOpen(false);
  };

  return (
    <>
      <AdminPageHeader title="Импорт товаров" description="Загрузка товаров от дистрибьюторов через подключённые внешние сервисы" />

      <Card className="mb-6 p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <Field
            label="1. Сервис"
            htmlFor={`${id}-service`}
            hint={activeServices.length === 0 ? 'Нет активных сервисов. Добавьте в разделе «Внешние сервисы».' : undefined}
          >
            <Select id={`${id}-service`} value={selectedService} onChange={handleServiceChange}>
              <option value="">— Выберите сервис —</option>
              {activeServices.map((service) => (
                <option key={service.id} value={service.name}>
                  {service.name} {service.description ? `(${service.description})` : ''}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="2. Категория" htmlFor={`${id}-category`}>
            {isCategoriesLoading ? (
              <Skeleton className="h-10" />
            ) : (
              <Select
                id={`${id}-category`}
                value={selectedCategory}
                onChange={handleCategoryChange}
                disabled={!selectedService || downloadCategories.length === 0}
              >
                <option value="">— Выберите категорию —</option>
                {downloadCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <div className="grid gap-1.5">
            <span className="text-sm font-medium">3. Действия</span>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={selectAll} disabled={filteredProducts.length === 0}>
                <SquareCheckBig />
                Выбрать все
              </Button>
              <Button variant="outline" onClick={() => dispatch(setNewProducts([]))} disabled={newProducts.length === 0}>
                <SquareDashed />
                Снять выбор
              </Button>
              <Button onClick={openImportModal} disabled={newProducts.length === 0}>
                <CloudDownload />
                Импорт ({newProducts.length})
              </Button>
            </div>
          </div>
        </div>

        {selectedCategory && !isProductsLoading && (
          <dl className="mt-5 grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-4">
            <Stat label="Всего" value={formatNumber(pagination.total)} />
            <Stat label="На странице" value={filteredProducts.length} />
            <Stat label="Выбрано" value={newProducts.length} />
            <Stat label="Страница" value={`${currentPage} / ${pagination.totalPages}`} />
          </dl>
        )}
      </Card>

      {isProductsLoading && filteredProducts.length === 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {Array.from({ length: 10 }, (_, index) => (
            <Skeleton key={index} className="aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        // При листании прежние товары остаются приглушёнными, пока не придут новые.
        <div
          className={cn(
            'grid grid-cols-2 gap-3 transition-opacity duration-300 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
            isProductsLoading && 'pointer-events-none opacity-45',
          )}
          aria-busy={isProductsLoading || undefined}
        >
          {filteredProducts.map((product, index) => {
            const isSelected = selectedIds.has(product.id);

            return (
              <button
                key={product.id}
                type="button"
                onClick={() => toggleProduct(product)}
                aria-pressed={isSelected}
                style={{ animationDelay: `${Math.min(index, 14) * 25}ms` }}
                className={cn(
                  'relative flex animate-fade-up flex-col rounded-2xl border bg-card p-2 text-left shadow-card transition-[box-shadow,border-color]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isSelected ? 'border-primary ring-2 ring-primary/30' : 'hover:border-primary/30',
                )}
              >
                <span
                  className={cn(
                    'absolute right-3 top-3 z-10 grid size-6 place-items-center rounded-full border-2 transition-colors',
                    isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background/90',
                  )}
                  aria-hidden="true"
                >
                  {isSelected && <Check className="size-3.5" strokeWidth={3} />}
                </span>
                <span className="grid aspect-square place-items-center overflow-hidden rounded-xl bg-white p-3">
                  <img
                    src={product.imageUrl || DEFAULT_PRODUCT_IMG}
                    alt=""
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                  />
                </span>
                <span className="line-clamp-2 min-h-10 px-1.5 pt-3 text-sm leading-5">{product.title}</span>
                <span className="px-1.5 pb-1.5 pt-1 font-semibold tabular-nums text-primary">{formatPrice(product.price)}</span>
              </button>
            );
          })}
        </div>
      ) : selectedCategory ? (
        <EmptyState icon={<PackageSearch />} title="Нет товаров в этой категории" className="rounded-2xl border bg-card" />
      ) : (
        <EmptyState
          icon={<CloudDownload />}
          title="Выберите сервис и категорию"
          description="Товары дистрибьютора появятся здесь — отметьте нужные и нажмите «Импорт»."
          className="rounded-2xl border bg-card"
        />
      )}

      {pagination.totalPages > 1 && filteredProducts.length > 0 && (
        <nav aria-label="Страницы" className="mt-6 flex flex-wrap justify-center gap-1">
          <Button variant="outline" size="icon-sm" onClick={() => loadPage(currentPage - 1)} disabled={currentPage <= 1} aria-label="Предыдущая страница">
            <ChevronLeft />
          </Button>
          {getPageWindow(currentPage, pagination.totalPages).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? 'primary' : 'ghost'}
              size="icon-sm"
              className="min-w-8 tabular-nums"
              onClick={() => loadPage(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => loadPage(currentPage + 1)}
            disabled={currentPage >= pagination.totalPages}
            aria-label="Следующая страница"
          >
            <ChevronRight />
          </Button>
        </nav>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          title={`Импорт ${newProducts.length} товаров`}
          description="Выберите категорию на сайте, в которую будут добавлены товары"
          size="md"
        >
          {isLocalCategoriesLoading && localCategories.length === 0 ? (
            <PageLoader />
          ) : (
            <div className="grid gap-5">
              <Field label="Категория на сайте" htmlFor={`${id}-local`}>
                <Select id={`${id}-local`} value={localCategoryId} onChange={(evt) => setLocalCategoryId(evt.target.value)}>
                  <option value="">— Выберите категорию —</option>
                  {localOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleImport}>
                  <CloudDownload />
                  Импортировать
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImportPage;
