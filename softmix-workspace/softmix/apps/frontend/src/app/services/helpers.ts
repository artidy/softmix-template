import _ from 'lodash';
import { DEFAULT_LIMIT, DEFAULT_PAGE, getPageOffset } from '@project-lib/shared-types';

import { QueryParams } from '../types/product';
import { AppRoute } from '../const';
import { Pagination } from '../types/pagination';
import { FileUrl } from '../types/upload-file';

function getFormatTitle(title: string): string {
  return `${title[0].toUpperCase()}${title.slice(1)}`;
}

function toggleArrayValue(value: string, array: string[]): string[] {
  if (array.includes(value)) {
    const idxValue = array.indexOf(value);

    return [...array.slice(0, idxValue), ...array.slice(idxValue + 1)];
  }

  return [...array, value];
}

function getRandomValueFromArray(list: Array<string>) {
  return list[_.random(0, list.length - 1)];
}

function getRandomNumber(minNumber: number, maxNumber: number): number {
  return _.random(minNumber, maxNumber, false);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-ES').format(value)
}

function formatBoolean(value: boolean): string {
  return value ? 'Да' : 'Нет';
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(
    new Date(date)
  );
}

function formatDateForInput(date: Date){
  if (!date) {
    return '';
  }

  if (typeof date === 'string') {
    date = new Date(date);
  }

  // Преобразуем дату в формат YYYY-MM-DD
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const getUTCDate = (date: string) => {
  return new Date(date).toISOString();
}

function getMonthStartAndEnd() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Первый день текущего месяца
  const startOfMonth = new Date(currentYear, currentMonth, 1);

  // Последний день текущего месяца
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

  return { startOfMonth, endOfMonth };
}

const getFormatCode = (value: string) => {
  const input = value.replace(/\D/g, '');
  let formattedInput = '';

  for (let i = 0; i < input.length; i++) {
    if (i === 2 || i === 4) {
      formattedInput += '-';
    }
    formattedInput += input[i];
  }

  return formattedInput.slice(0, 8);
}

const getQueryString = (queryParams: QueryParams, excludeParams: string[] = []) => {
  const queryKeys = Object.keys(queryParams);
  let result = '';

  for (const queryKey of queryKeys) {
    if (excludeParams.includes(queryKey)) continue;

    result += result === '' ? '?' : '&';
    result += `${queryKey}=${queryParams[queryKey]}`;
  }

  return result;
}

const convertSearchParams = (searchParams: URLSearchParams) => {
  const queryKeys = searchParams.keys();
  const result = {};

  for (const queryKey of queryKeys) {
    result[queryKey] = searchParams.get(queryKey);
  }

  return result;
}

const createPaginationLinks = (appRoute: AppRoute, queryParams: QueryParams, total: number, count: number): Pagination => {
  const { page, limit, ...params} = queryParams;
  const limitPage = limit ? limit : DEFAULT_LIMIT;
  const currentPage = page ? page : DEFAULT_PAGE;
  const totalPages = Math.ceil(total / limitPage);
  const offset = getPageOffset(currentPage, limit) + count;
  let urlParams = getQueryString(params);
  urlParams += urlParams === '' ? '?' : '&';

  return {
    first: `${appRoute}${urlParams}page=1&limit=${limitPage}`,
    prev: page > 1 ? `${appRoute}${urlParams}page=${currentPage - 1}&limit=${limitPage}` : null,
    next: page < totalPages ? `${appRoute}${urlParams}page=${currentPage + 1}&limit=${limitPage}` : null,
    last: `${appRoute}${urlParams}page=${totalPages}&limit=${limitPage}`,
    offset,
    page,
    totalPages,
    total,
  };
}

function getImageUrl(images: FileUrl[], ownerId: string, imageUrl: string) {
  const result = images.find((image) => image.ownerId === ownerId);

  if (result) {
    return result.url;
  }

  return imageUrl;
}

export {
  getFormatTitle,
  toggleArrayValue,
  getRandomValueFromArray,
  getRandomNumber,
  formatNumber,
  formatBoolean,
  formatDate,
  getUTCDate,
  formatDateForInput,
  getMonthStartAndEnd,
  getFormatCode,
  getQueryString,
  getPageOffset,
  convertSearchParams,
  createPaginationLinks,
  getImageUrl,
}
