// ファイル名: EditDialog.tsx
"use client";
import { Trash2 } from "lucide-react";

export interface DeleteDialogProps {
  productId?: string | undefined;
  onDelete: (productId: string) => void;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  productId,
  onDelete,
}) => {
  return (
    <dialog id="DeleteDialog" className="modal md:p-5">
      <div className="modal-box max-w-5xl p-10 lg:w-1/3">
        <h3 className="text-lg font-bold text-center">Are you sure you want to delete?</h3>
        <div className="modal-action flex justify-center gap-2">
          <form method="dialog" className="flex justify-center gap-2">
            <button
              type="submit"
              className="btn btn-outline btn-error md:btn-wide"
              onClick={() => productId && onDelete(productId)}
            >
              <Trash2 />
              <span className="pt-1">Delete</span>
            </button>
            <button className="btn md:btn-wide">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};
