"use client";

import { roboto } from '@/app/ui/fonts';
import outputs from "@/amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import styles from '@/app/dashboard/activities/styles.module.css';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function Page() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
    }

    useEffect(() => {
      listTodos();
    }, []);

    function createTodo() {
      client.models.Todo.create({
        content: window.prompt("Todo content"),
      });
    }

    function deleteTodo(id: string) {
      client.models.Todo.delete({ id })
    }
    
  return (
    <main>
      <h1 className={`${roboto.className} text-white mb-4 text-xl md:text-2xl text-center`}>
          Activities page
      </h1>
      <h2 className={`${roboto.className} text-xl text-gray-50 md:text-3xl md:leading-normal`}>Robday Activity List</h2>
      <button className={`${styles.button}`} onClick={createTodo}>+ new</button>
      <ul className={`${styles.ul}`}>
        {todos.map((todo) => (
          <div className={`${styles.li} ${roboto.className} text-white`}>
            <li
              onClick={() => deleteTodo(todo.id)}
              key={todo.id}>
                {todo.content}
            </li>
          </div>
        ))}
      </ul>
    </main>
  )
}