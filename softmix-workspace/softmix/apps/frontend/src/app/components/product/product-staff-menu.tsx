import { ChangeEvent, useRef, useState } from 'react';
import { Ellipsis, ImageUp, Pencil, Trash2 } from 'lucide-react';

import { Product } from '../../types/product';
import { cn } from '../../lib/cn';
import { useAppDispatch } from '../../hooks';
import { deleteProductApi, uploadImage } from '../../store/products-data/api-actions';
import { ConfirmDialog } from '../../ui/confirm-dialog';
import { Dialog, DialogContent } from '../../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { ProductForm } from './product-form';

type ProductStaffMenuProps = {
  product: Product;
  className?: string;
  /** Вызывается после удаления — например, чтобы уйти со страницы удалённого товара. */
  onDeleted?: () => void;
};

/** Действия с товаром для сотрудников прямо с витрины: редактирование, фото, удаление. */
export function ProductStaffMenu({ product, className, onDeleted }: ProductStaffMenuProps) {
  const dispatch = useAppDispatch();
  const fileInput = useRef<HTMLInputElement>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (file) {
      dispatch(uploadImage({ ownerId: product.id, name: file.name, file }));
    }
    // Сбрасываем, чтобы можно было выбрать тот же файл повторно.
    evt.target.value = '';
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const isDeleted = await dispatch(deleteProductApi(product.id)).unwrap();
    setIsDeleting(false);
    if (isDeleted) {
      setIsDeleteOpen(false);
      onDeleted?.();
    }
  };

  return (
    <div className={cn(className)}>
      <input
        ref={fileInput}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleFileChange}
      />
      {/* modal={false}: иначе Radix оставляет pointer-events: none на странице при открытии окна из меню. */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className="grid size-8 place-items-center rounded-lg border bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground"
          aria-label="Действия с товаром"
        >
          <Ellipsis className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
            <Pencil />
            Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => fileInput.current?.click()}>
            <ImageUp />
            Загрузить фото
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive onSelect={() => setIsDeleteOpen(true)}>
            <Trash2 />
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent title="Редактирование товара" size="lg">
          <ProductForm product={product} onDone={() => setIsEditOpen(false)} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Удалить товар?"
        description={<>«{product.title}» будет удалён из каталога. Это действие нельзя отменить.</>}
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
