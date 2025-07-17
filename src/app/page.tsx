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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">TASK</h1>
        <div className="bg-white border-2 border-purple-500 rounded-2xl p-4 flex items-center gap-4 shadow-md mb-6">
          <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-purple-600 font-bold text-lg border border-purple-300">
            {localTodos.length > 0
              ? `${Math.round(
                  (localTodos.filter((t) => t.completed).length /
                    localTodos.length) *
                    100
                )}%`
              : "0%"}
          </div>
          <div>
            <p className="font-semibold">
              You have {localTodos.length} task{localTodos.length > 1 && "s"} to
              complete in this page.
            </p>
            <p className="text-gray-500 text-sm">
              {localTodos.filter((t) => t.completed).length === 0
                ? "No tasks completed yet. Keep going!"
                : `${
                    localTodos.filter((t) => t.completed).length
                  } task(s) completed.`}
            </p>
          </div>
        </div>
        <form
          onSubmit={handleAdd}
          className="mb-6 flex flex-col sm:flex-row gap-3"
        >
          <input
            className="flex-1 border border-purple-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task..."
          />
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl transition cursor-pointer"
            type="submit"
          >
            Add
          </button>
        </form>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <ul className="space-y-4">
            {localTodos.map((todo, index) => (
              <li
                key={todo.id}
                className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-2xl p-4 shadow-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{todo.title}</p>
                  <p className="text-sm text-white/80">
                    {todo.completed ? "Completed" : "Not Completed"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer"
                    onClick={() => toggleCompleted(todo.id)}
                  >
                    <p className="text-sm text-white/80">
                      {todo.completed ? "✗" : "✓"}
                    </p>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-2 justify-center">
          <button
            className="bg-gray-200 px-3 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page === 0}
            onClick={() => setPage(0)}
          >
            First
          </button>
          <button
            className="bg-gray-200 px-3 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
          >
            Prev
          </button>
          <span className="px-3 py-1 rounded bg-purple-500 text-white">
            {page + 1}
          </span>
          <button
            className="bg-gray-200 px-3 py-1 cursor-pointer rounded disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page + 1 >= TOTAL_PAGES}
            onClick={() => setPage((p) => Math.min(p + 1, TOTAL_PAGES - 1))}
          >
            Next
          </button>
          <button
            className="bg-gray-200 px-3 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page + 1 >= TOTAL_PAGES}
            onClick={() => setPage(TOTAL_PAGES - 1)}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
