"use client";
import { Trash2 } from "lucide-react";

export interface DeleteUserDialogProps {
  id?: string | undefined;
  onDelete: (userId: string) => void;
}

export const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  id,
  onDelete,
}) => {
  return (
    <dialog id="DeleteUserDialog" className="modal md:p-5">
      <div className="modal-box max-w-5xl p-10 lg:w-1/3">
        <h3 className="text-lg text-black font-bold text-center">
          Are you sure you want to delete?
        </h3>
        <div className="modal-action flex justify-center gap-2">
          <form method="dialog" className="flex justify-center gap-2">
            <button
              type="submit"
              className="btn btn-outline btn-error md:btn-wide"
              onClick={() => id && onDelete(String(id))}
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
