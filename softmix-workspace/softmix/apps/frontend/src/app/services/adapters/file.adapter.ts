import { FileApi } from '@project-lib/shared-types';

import { FileUrl } from '../../types/upload-file';

export function fileAdapt(element: FileApi): FileUrl {
  return element ? {
    ...element,
  } : null
}

export function filesAdapt(elements: FileApi[]): FileUrl[] {
  return elements ? elements.map((element) => fileAdapt(element)) : [];
}
