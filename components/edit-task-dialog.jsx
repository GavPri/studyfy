import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import React, { useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";

export default function EditTaskDialog({ task, onEditSuccess, onClose }) {
  const [formData, setFormData] = useState({
    ...task,
    due_date: task.due_date ? new Date(task.due_date) : null, // Ensure date format
    tags: Array.isArray(task.tags) ? task.tags.join(", ") : task.tags || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, due_date: date });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updatedData = {
        ...formData,
        due_date: formData.due_date ? formData.due_date.toISOString() : null,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
      };

      const { error } = await supabase
        .from("tasks")
        .update(updatedData)
        .eq("id", task.id);
      if (error) throw error;

      onEditSuccess(updatedData);
    } catch (error) {
      console.error("Error updating task:", error.message);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        {/* Title */}
        <div>
          <label className="text-sm font-medium">Title</label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="text-sm font-medium">Due Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {formData.due_date
                  ? format(formData.due_date, "PPP")
                  : "Pick a date"}
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={formData.due_date}
                onSelect={handleDateChange}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Priority */}
        <div>
          <label className="text-sm font-medium">Priority</label>
          <Select
            value={formData.priority}
            onValueChange={(value) => handleSelectChange("priority", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium">Status</label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm font-medium">Tags (comma-separated)</label>
          <Input
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. work, urgent"
          />
        </div>

        {/* Save Changes Button */}
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
