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
    <dialog id="DeleteDialog" className="modal p-10">
      <div className="modal-box w-1/3 max-w-5xl p-10 ">
        <h3 className="text-lg font-bold text-center">Are you sure you want to delete?</h3>
        <div className="modal-action flex justify-center gap-2">
          <form method="dialog" className="flex justify-center gap-2">
            <button
              type="submit"
              className="btn btn-outline btn-error btn-wide"
              onClick={() => productId && onDelete(productId)}
            >
              <Trash2 />
              <span className="pt-1">Delete</span>
            </button>
            <button className="btn btn-wide">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};
