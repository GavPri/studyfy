import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function DeleteTaskDialog({ task, onDeleteSuccess, onClose }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", task.id);
      if (error) throw error;
      onDeleteSuccess(task.id);
        toast.success('Task was successfully deleted')
    } catch (error) {
      console.error("Error deleting task:", error.message);
      alert("Failed to delete task.");
    } finally {
      setLoading(false);
      onClose(); // Close the dialog after delete
    }
  };

  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the task:
            <br />
            <strong>{task?.title}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
            <Trash className="ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
