import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

const CreateTaskDialog = ({ user }) => {
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
  if (!user) {
    toast("You must be logged in to create a task.");
    return;
  }

  setLoading(true);
  try {
    const userId = user.id;

    // Ensure priority is one of the allowed values
    const validPriorities = ["Low", "Medium", "High"];
    if (!validPriorities.includes(data.priority)) {
      throw new Error("Invalid priority value.");
    }

    const { error } = await supabase.from("tasks").insert([
      {
        title: data.title,
        description: data.description,
        due_date: selectedDate ? selectedDate.toISOString() : null,
        priority: data.priority, // Must be 'low', 'medium', or 'high'
        status: data.status,
        tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
        user_id: userId,
      },
    ]);

    if (error) throw error;
    toast("Task created successfully!");
    reset();
  } catch (error) {
    console.error("Error adding task:", error.message);
    toast("Failed to create task: " + error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <Dialog>
      <DialogTrigger>
        <Button>Add Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add task details</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new task.
          </DialogDescription>
        </DialogHeader>
        {user ? ( // ✅ Show form only if user is logged in
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter task title"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter task description"
                required
              />
            </div>
            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    <CalendarIcon className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setValue("due_date", date);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={(value) => setValue("priority", value)}>
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
            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setValue("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                {...register("tags")}
                placeholder="Comma-separated tags"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Create Task"}
            </Button>
          </form>
        ) : (
          <p className="text-red-500">You must be logged in to add tasks.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
