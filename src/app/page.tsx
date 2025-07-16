"use client";

import { useState, useEffect } from "react";
import { useGetTodosQuery, useAddTodoMutation } from "../lib/api/todos";
import { toast, Toaster } from "react-hot-toast";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const LIMIT = 10;
  const TOTAL_ITEMS = 200;
  const TOTAL_PAGES = Math.ceil(TOTAL_ITEMS / LIMIT);
  const [page, setPage] = useState(0);
  const { data: fetchedTodos = [], isLoading } = useGetTodosQuery({
    start: page * LIMIT,
    limit: LIMIT,
  });
  const [title, setTitle] = useState("");
  const [addTodo] = useAddTodoMutation();
  const [localTodos, setLocalTodos] = useState<typeof fetchedTodos>([]);

  useEffect(() => {
    setLocalTodos(fetchedTodos);
  }, [fetchedTodos]);

  const handleAdd = async (e: React.FormEvent) => {
    setPage(0);
    e.preventDefault();
    if (!title) return;
    const newTodo = { title, userId: 1, completed: false };
    const result = await addTodo(newTodo);
    if ("data" in result) {
      setLocalTodos((prev: typeof localTodos) => {
        const maxId = Array.isArray(prev)
          ? prev.reduce((max, todo) => {
              const id = typeof todo?.id === "number" ? todo.id : 0;
              return Math.max(max, id);
            }, 0)
          : 0;
        const updated = [{ ...result.data, id: maxId + 1 }, ...prev];
        return updated.slice(0, LIMIT);
      });
      toast.success("Todo added successfully! but only Local");
    }
    setTitle("");
  };

  const toggleCompleted = (todoId: number) => {
    setLocalTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
    toast.success("Todo updated successfully! but only Local");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-4 text-center">Todo List</h1>
      <form
        onSubmit={handleAdd}
        className="mb-4 flex flex-col sm:flex-row gap-2 w-full"
      >
        <input
          className="border p-2 rounded w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New todo"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto cursor-pointer"
          type="submit"
        >
          Add
        </button>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="pl-5 space-y-1">
          {localTodos.map((todo, index) => (
            <li key={todo.id} className="flex justify-between items-center">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full">
                <span
                  className="font-medium cursor-pointer"
                  onClick={() => toggleCompleted(todo.id)}
                >
                  {page * LIMIT + index + 1}. {todo.title}
                </span>
                <span
                  className={`text-sm cursor-pointer ${
                    todo.completed ? "text-green-600" : "text-red-500"
                  }`}
                  onClick={() => toggleCompleted(todo.id)}
                >
                  {todo.completed ? "✓" : "✗"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex items-center gap-2 justify-center">
        <button
          className="bg-gray-300 px-3 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={page === 0}
          onClick={() => setPage(0)}
        >
          First
        </button>
        <button
          className="bg-gray-300 px-3 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
        >
          Prev
        </button>
        <span className="px-3 py-1 rounded bg-blue-500 text-white">
          {page + 1}
        </span>
        <button
          className="bg-gray-300 px-3 py-1 cursor-pointer rounded disabled:opacity-50"
          disabled={page + 1 >= TOTAL_PAGES}
          onClick={() => setPage((p) => Math.min(p + 1, TOTAL_PAGES - 1))}
        >
          Next
        </button>
        <button
          className="bg-gray-300 px-3 py-1 rounded cursor-pointer disabled:opacity-50"
          disabled={page + 1 >= TOTAL_PAGES}
          onClick={() => setPage(TOTAL_PAGES - 1)}
        >
          Last
        </button>
      </div>
    </div>
  );
}
