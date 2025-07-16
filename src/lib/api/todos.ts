import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Todo } from '../../types/todo';

export const todosApi = createApi({
    reducerPath: 'todosApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
    tagTypes: ['Todos'],
    endpoints: (builder) => ({
        getTodos: builder.query<Todo[], { start: number; limit: number }>({
            query: ({ start, limit }) => `todos?_start=${start}&_limit=${limit}`,
            providesTags: ['Todos'],
        }),
        addTodo: builder.mutation<Todo, Partial<Todo>>({
            query: (newTodo) => ({
                url: 'todos',
                method: 'POST',
                body: newTodo,
            }),
            invalidatesTags: ['Todos'],
        }),
    }),
});

export const { useGetTodosQuery, useAddTodoMutation } = todosApi;
