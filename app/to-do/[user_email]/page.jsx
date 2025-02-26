"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import CreateTaskDialog from "@/components/create-task-dialog";
import EditTaskDialog from "@/components/edit-task-dialog";
import DeleteTaskDialog from "@/components/delete-task-dialog";
import SearchBar from "@/components/ui/search-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export default function Page() {
  const { user } = useUser();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]); // Filtered list for search
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Fetch all tasks
  const fetchTasks = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("due_date", { ascending: true });

      if (error) throw error;

      // Format tags correctly
      const formattedTasks = data.map((task) => ({
        ...task,
        tags: Array.isArray(task.tags)
          ? task.tags
          : task.tags
          ? task.tags.split(",").map((tag) => tag.trim())
          : [],
      }));

      setTasks(formattedTasks);
      setFilteredTasks(formattedTasks); // Initialize filtered list
    } catch (error) {
      setError("Failed to load tasks.");
      console.error("Error fetching tasks:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to update task list after edit
  const onEditSuccess = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    setTaskToEdit(null);
  };

  // Function to remove task from UI after deletion
  const onDeleteSuccess = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    setTaskToDelete(null);
  };

  // Filter tasks when search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredTasks(tasks);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerCaseQuery) ||
        task.priority.toLowerCase().includes(lowerCaseQuery) ||
        task.status.toLowerCase().includes(lowerCaseQuery) ||
        task.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))
    );

    setFilteredTasks(filtered);
  }, [searchQuery, tasks]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-lg font-bold text-foreground">
        {user?.fullName || "Guest"}
      </h2>
      <h3 className="capitalize text-md text-muted-foreground mb-4">
        To do list
      </h3>
      <p className="capitalize text-md text-muted-foreground mb-8">
        Manage your tasks effectively
      </p>

      {/* Search Bar */}
      

      {/* Task Creation Form */}
      <div className=" flex items-center justify-between border-t-2 border-border py-2 px-4 rounded-lg shadow-md">
        <CreateTaskDialog user={user} /><SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {/* Task List */}
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold">Your Tasks</h3>

        {loading && <p>Loading tasks...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {filteredTasks.length === 0 && !loading && !error && (
          <p className="text-gray-500">No matching tasks found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="shadow-lg relative">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>{task.title}</CardTitle>

                {/* Three-dot Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTaskToEdit(task)}>
                      Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTaskToDelete(task)}
                      className="text-red-500"
                    >
                      Delete Task
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                <div className="flex flex-wrap gap-2 text-sm">
                  <Badge
                    variant="outline"
                    className="bg-gray-200 text-gray-800"
                  >
                    {task.priority}
                  </Badge>
                  <Badge
                    className={`${
                      task.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.status}
                  </Badge>
                  {task.due_date && (
                    <Badge variant="secondary">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
                {/* Display Tags */}
                {task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {task.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit Task Dialog */}
      {taskToEdit && (
        <EditTaskDialog
          task={taskToEdit}
          onEditSuccess={onEditSuccess}
          onClose={() => setTaskToEdit(null)}
        />
      )}

      {/* Delete Task Dialog */}
      {taskToDelete && (
        <DeleteTaskDialog
          task={taskToDelete}
          onDeleteSuccess={onDeleteSuccess}
          onClose={() => setTaskToDelete(null)}
        />
      )}
    </div>
  );
}
