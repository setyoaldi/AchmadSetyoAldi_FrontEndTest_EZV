import { Todo } from "../../types/todo";

export const revalidate = 10;

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/todos?_start=0&_limit=10"
  );
  return res.json();
}

export default async function ISRPage() {
  const todos = await fetchTodos();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ISR Todo List</h1>
      <ul className="list-disc pl-5 space-y-1">
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}
