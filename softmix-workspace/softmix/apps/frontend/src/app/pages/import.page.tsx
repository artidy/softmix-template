import { ChangeEvent, MouseEvent, ReactElement, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { DEFAULT_DOWNLOADS_LIMIT, ExternalService, ProductCreate, UrlPaths } from '@project-lib/shared-types';

import { useAppDispatch, useAppSelector } from '../hooks';
import {
  getCategories as getDownloadCategories,
  getIsCategoriesLoading,
  getProducts as getDownloadProducts,
  getIsProductsLoading,
  getNewProducts,
  getExcludedProducts,
  getPagination,
} from '../store/downloads-data/selectors';
import {
  getCategories as getLocalCategories,
  isLoading as isLocalCategoriesLoading,
} from '../store/categories-data/selectors';
import { getExternalServices } from '../store/external-services-data/selectors';
import { getExternalServicesApi } from '../store/external-services-data/api-actions';
import { getServiceCategoriesApi, getServiceProductsApi } from '../store/downloads-data/api-actions';
import { getCategoriesApi } from '../store/categories-data/api-actions';
import { createProductManyApi } from '../store/products-data/api-actions';
import {
  setCategories,
  setProducts,
  addNewProduct,
  deleteNewProduct,
  setNewProducts,
} from '../store/downloads-data/downloads-data';
import { setCategories as setLocalCategories } from '../store/categories-data/categories-data';
import { Message, DEFAULT_PRODUCT_IMG } from '../const';
import LoaderComponent from '../components/loader/loader.component';
import Modal from '../components/modal/modal.component';

import '../components/downloads/downloads.css';

function ImportPage(): ReactElement {
  const dispatch = useAppDispatch();

  const services = useAppSelector(getExternalServices);
  const downloadCategories = useAppSelector(getDownloadCategories);
  const isCategoriesLoading = useAppSelector(getIsCategoriesLoading);
  const downloadProducts = useAppSelector(getDownloadProducts);
  const isProductsLoading = useAppSelector(getIsProductsLoading);
  const newProducts = useAppSelector(getNewProducts);
  const excludedProducts = useAppSelector(getExcludedProducts);
  const pagination = useAppSelector(getPagination);
  const localCategories = useAppSelector(getLocalCategories);
  const localCategoriesLoading = useAppSelector(isLocalCategoriesLoading);

  const [selectedService, setSelectedService] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [localCategoryId, setLocalCategoryId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const activeServices = services.filter((s) => s.isActive);
  const filteredProducts = downloadProducts.filter((p) => !excludedProducts.includes(p.downloadId));
  const selectedIds = new Set(newProducts.map((p) => p.id));

  useEffect(() => {
    dispatch(getExternalServicesApi());
    return () => {
      dispatch(setCategories([]));
      dispatch(setProducts([]));
      dispatch(setNewProducts([]));
    };
  }, []);

  const handleServiceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
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

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const catId = e.target.value;
    setSelectedCategory(catId);
    setCurrentPage(1);
    dispatch(setNewProducts([]));

    if (catId && selectedService) {
      dispatch(getServiceProductsApi({
        serviceName: selectedService,
        categoryId: catId,
        page: 1,
        limit: DEFAULT_DOWNLOADS_LIMIT,
      }));
    }
  };

  const loadPage = (page: number) => {
    setCurrentPage(page);
    dispatch(getServiceProductsApi({
      serviceName: selectedService,
      categoryId: selectedCategory,
      page,
      limit: DEFAULT_DOWNLOADS_LIMIT,
    }));
  };

  const toggleProduct = (product: any) => {
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

  const deselectAll = () => {
    dispatch(setNewProducts([]));
  };

  const openImportModal = () => {
    if (newProducts.length === 0) {
      toast.error('Выберите товары для импорта');
      return;
    }
    dispatch(getCategoriesApi());
    setModalOpen(true);
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
    setModalOpen(false);
  };

  const selectStyle = {
    display: 'block' as const,
    width: '100%',
    padding: '8px 15px',
    border: '2px solid #e5eaee',
    height: '50px',
    fontSize: '14px',
    borderRadius: '8px',
    backgroundColor: '#fff',
  };

  return (
    <section>
      <h1>Импорт товаров</h1>
      <p style={{ color: '#666', marginBottom: '25px' }}>
        Загрузка товаров от дистрибьюторов через подключённые внешние сервисы
      </p>

      {/* Шаг 1: Выбор сервиса и категории */}
      <div className="row" style={{ marginBottom: '25px' }}>
        <div className="col-md-4">
          <label style={{ fontWeight: 600, marginBottom: '8px', display: 'block' }}>1. Выберите сервис</label>
          <select value={selectedService} onChange={handleServiceChange} style={selectStyle}>
            <option value="">-- Выберите сервис --</option>
            {activeServices.map((s) => (
              <option key={s.id} value={s.name}>{s.name} {s.description ? `(${s.description})` : ''}</option>
            ))}
          </select>
          {activeServices.length === 0 && (
            <p style={{ color: '#999', fontSize: '12px', marginTop: '5px' }}>
              Нет активных сервисов. Добавьте в разделе "Внешние сервисы"
            </p>
          )}
        </div>

        <div className="col-md-4">
          <label style={{ fontWeight: 600, marginBottom: '8px', display: 'block' }}>2. Выберите категорию</label>
          {isCategoriesLoading ? (
            <div style={{ padding: '12px', color: '#999' }}>Загрузка категорий...</div>
          ) : (
            <select value={selectedCategory} onChange={handleCategoryChange} style={selectStyle}
              disabled={!selectedService || downloadCategories.length === 0}>
              <option value="">-- Выберите категорию --</option>
              {downloadCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
          )}
        </div>

        <div className="col-md-4">
          <label style={{ fontWeight: 600, marginBottom: '8px', display: 'block' }}>3. Действия</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn btn-add" onClick={selectAll}
              disabled={filteredProducts.length === 0}
              style={{ fontSize: '13px', padding: '8px 16px' }}>
              <i className="fa fa-check-square-o"></i> Выбрать все
            </button>
            <button className="btn" onClick={deselectAll}
              disabled={newProducts.length === 0}
              style={{ fontSize: '13px', padding: '8px 16px', border: '1px solid #dce1e8', borderRadius: '8px', background: '#fff' }}>
              <i className="fa fa-square-o"></i> Снять выбор
            </button>
            <button className="btn btn-add" onClick={openImportModal}
              disabled={newProducts.length === 0}
              style={{ fontSize: '13px', padding: '8px 16px' }}>
              <i className="fa fa-cloud-download"></i> Импорт ({newProducts.length})
            </button>
          </div>
        </div>
      </div>

      {/* Статистика */}
      {selectedCategory && !isProductsLoading && (
        <div style={{
          display: 'flex', gap: '20px', marginBottom: '20px', padding: '12px 18px',
          background: '#f8f9fb', borderRadius: '10px', fontSize: '14px', color: '#555',
        }}>
          <span>Всего: <strong>{pagination.total}</strong></span>
          <span>На странице: <strong>{filteredProducts.length}</strong></span>
          <span>Выбрано: <strong style={{ color: 'var(--ltn__secondary-color)' }}>{newProducts.length}</strong></span>
          <span>Страница: <strong>{currentPage}</strong> / {pagination.totalPages}</span>
        </div>
      )}

      {/* Товары */}
      {isProductsLoading ? (
        <LoaderComponent />
      ) : filteredProducts.length > 0 ? (
        <div className="row">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-xl-3 col-lg-4 col-sm-6 col-12" style={{ marginBottom: '20px' }}>
              <div
                className={`ltn__product-item text-center${selectedIds.has(product.id) ? ' downloads-chosen' : ''}`}
                onClick={() => toggleProduct(product)}
                style={{
                  cursor: 'pointer',
                  borderRadius: '12px',
                  border: selectedIds.has(product.id) ? '2px solid var(--ltn__secondary-color)' : '2px solid transparent',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s',
                  overflow: 'hidden',
                  background: '#fff',
                }}
              >
                {selectedIds.has(product.id) && (
                  <div style={{
                    position: 'absolute', top: '10px', right: '10px', zIndex: 2,
                    width: '26px', height: '26px', borderRadius: '50%',
                    background: 'var(--ltn__secondary-color)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 700,
                  }}>
                    &#10003;
                  </div>
                )}
                <div className="product-img" style={{ padding: '15px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={product.imageUrl || DEFAULT_PRODUCT_IMG}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }}
                  />
                </div>
                <div className="product-info" style={{ padding: '0 15px 15px' }}>
                  <h2 className="product-title" style={{ fontSize: '13px', lineHeight: '1.4', minHeight: '36px', margin: '0 0 8px' }}>
                    {product.title}
                  </h2>
                  <div className="product-price">
                    <span style={{ fontWeight: 700, color: 'var(--ltn__primary-color-2)' }}>
                      {product.price} ₸
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : selectedCategory ? (
        <p style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          Нет товаров в этой категории
        </p>
      ) : null}

      {/* Пагинация */}
      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={() => loadPage(currentPage - 1)}
            disabled={currentPage <= 1}
            style={{
              padding: '8px 14px', border: '1px solid #dce1e8', borderRadius: '8px',
              background: '#fff', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage <= 1 ? 0.5 : 1,
            }}
          >
            &larr;
          </button>
          {Array.from({ length: Math.min(pagination.totalPages, 10) }, (_, i) => {
            let page: number;
            if (pagination.totalPages <= 10) {
              page = i + 1;
            } else if (currentPage <= 5) {
              page = i + 1;
            } else if (currentPage >= pagination.totalPages - 4) {
              page = pagination.totalPages - 9 + i;
            } else {
              page = currentPage - 5 + i;
            }
            return (
              <button
                key={page}
                onClick={() => loadPage(page)}
                style={{
                  padding: '8px 14px', border: '1px solid #dce1e8', borderRadius: '8px',
                  background: page === currentPage ? 'var(--ltn__secondary-color)' : '#fff',
                  color: page === currentPage ? '#fff' : '#333',
                  cursor: 'pointer', fontWeight: page === currentPage ? 700 : 400,
                }}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => loadPage(currentPage + 1)}
            disabled={currentPage >= pagination.totalPages}
            style={{
              padding: '8px 14px', border: '1px solid #dce1e8', borderRadius: '8px',
              background: '#fff', cursor: currentPage >= pagination.totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage >= pagination.totalPages ? 0.5 : 1,
            }}
          >
            &rarr;
          </button>
        </div>
      )}

      {/* Модалка выбора локальной категории */}
      <Modal
        isOpen={modalOpen}
        onCloseHandler={() => setModalOpen(false)}
        children={
          localCategoriesLoading ? (
            <LoaderComponent />
          ) : (
            <div className="ltn__form-box">
              <h4 className="title-2">Импорт {newProducts.length} товаров</h4>
              <p style={{ color: '#666', marginBottom: '15px' }}>
                Выберите категорию на сайте, в которую будут добавлены товары
              </p>
              <select value={localCategoryId} onChange={(e) => setLocalCategoryId(e.target.value)} style={selectStyle}>
                <option value="">-- Выберите категорию --</option>
                {localCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button className="theme-btn-1 btn" type="button" onClick={handleImport}>
                  <i className="fa fa-cloud-download"></i> Импортировать
                </button>
                <button className="theme-btn-2 btn" type="button" onClick={() => setModalOpen(false)}>
                  <i className="fa fa-times"></i> Отмена
                </button>
              </div>
            </div>
          )
        }
      />
    </section>
  );
}

export default ImportPage;
