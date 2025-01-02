"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
// import "@aws-amplify/ui-react/styles.css";
// import { uploadData } from 'aws-amplify/storage';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { lusitana, roboto, robotoFlex, robotoSlab } from '@/app/ui/fonts';
import Image from 'next/image';
// import { ChakraProvider } from "@chakra-ui/react"


Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  // const [file, setFile] = useState();

  // const handleChange = (event: any) => {
  //   setFile(event.target.files[0]);
  // };

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
    <main className="flex min-h-screen flex-col p-6">
      <h1 className={`${roboto.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}><strong>It's Rob Day!</strong></h1>
      <h2 className={`${roboto.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>Rob Day Activity List</h2>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li
            onClick={() => deleteTodo(todo.id)}
            key={todo.id}>{todo.content}
          </li>
        ))}
      </ul>
      <div
        className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black"
      >
        <p className={`${robotoFlex.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
              <strong>Welcome to Acme.</strong> This is the example for the{' '}
              <a href="https://nextjs.org/learn/" className="text-blue-500">
                Next.js Learn Course
              </a>
              , brought to you by Vercel.
        </p>
      </div>
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        🥳 
        <br />
        <div className={`${roboto.className}`}>
          <a href="https://itsnotrobday.com" className={`${roboto.className}' text-white text-lg md:text-2xl`}>
            itsnotrobday.com
          </a>
        </div>
      </div>
      <div 
        className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black"
      />
      <FileUploader
        acceptedFileTypes={['image/*']}
        path="picture-submissions/"
        maxFileCount={1}
        isResumable
      />
    </main>
  );
}
