"use client";

import { roboto } from '@/app/ui/fonts';
import outputs from "@/amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import styles from '@/app/dashboard/activities/styles.module.css';
import { Fade, Logo, Button, StyleOverlay, IconButton, Row, Text, Input, Column, Flex } from "@/once-ui/components";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function Page() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
    }

  function updateTodo() {
    client.models.Todo.onUpdate().subscribe({
      next: (data) => todos.map((todo) => {
        if (todo.id === data.id) {
          todo.isDone = !todo.isDone;
          }})
    });
  }

    useEffect(() => {
      listTodos();
      updateTodo();
    }, []);

    function createTodo() {
      client.models.Todo.create({
        content: window.prompt("Todo content"),
        isDone: false
      });
    }

    function deleteTodo(id: string, content: any, isDone: any) {
      // client.models.Todo.delete({ id })
      const todo = {
        id: id,
        isDone: !isDone,
        content: content
      }
      client.models.Todo.update(todo);
      // client.models.Todo.delete({ id });
      // client.models.Todo.create({ ...todo });
      // client.models.Todo.update.arguments = { id: id, isDone: true, content: content }
    }
    
  return (
    <main>
      <Column fillWidth paddingY="80" paddingX="xs" alignItems="center" flex={1}>
      <Fade
        zIndex={3}
        pattern={{
          display: true,
          size: "4",
        }}
        position="fixed"
        top="0"
        left="0"
        to="bottom"
        height={5}
        fillWidth
        blur={0.25}
      />
      <Row position="fixed" top="0" fillWidth justifyContent="center" zIndex={3}>
        <Row
          data-border="rounded"
          justifyContent="space-between"
          maxWidth="l"
          paddingRight="64"
          paddingLeft="32"
          paddingY="20"
        >
          <Logo size="m" icon={false} href="https://itsrobday.com" />
          <Row gap="12" hide="s">
            <Button
              href="https://github.com/robertnoneman/amplify-next-template"
              prefixIcon="github"
              size="s"
              label="GitHub"
              weight="default"
              variant="tertiary"
            />
            <StyleOverlay top="20" right="24" />
          </Row>
          <Row gap="16" show="s" alignItems="center" paddingRight="24">
            <IconButton
              href="https://github.com/robertnoneman/amplify-next-template"
              icon="github"
              variant="tertiary"
            />
            <StyleOverlay top="20" right="24" />
          </Row>
        </Row>
      </Row>
      <h2 className={`${roboto.className} text-xl text-gray-50 md:text-3xl md:leading-normal`}>Robday Activity List</h2>
      <button className={`${styles.button}`} onClick={createTodo}>+ new</button>
      
      <ul className={`${styles.ul}`}>
        <div className={`${styles.li} ${roboto.className} `}>
          <li>
            <Flex background="surface" fillWidth >
              <Column alignItems="left" paddingTop="4" fillWidth gap="0">
                <Row fillWidth justifyContent="space-around">
                  <Text variant="body-default-xl" align="left"> 
                    Activity
                  </Text>
                  <Text variant="body-default-xl" align="left"> 
                    Status
                  </Text>
                </Row>
              </Column>
            </Flex>
          </li>
        </div>
        {todos.map((todo) => (
          <div className={`${styles.li} ${roboto.className} ${todo.isDone} `}>
            <li
              onClick={() => deleteTodo(todo.id, todo.content, todo.isDone)}
              key={todo.id}>
                <Row fillWidth gap="-1" alignItems="center" justifyContent="space-between">
                  <Input 
                    id="content"
                    label={`${todo.content}`}
                    labelAsPlaceholder
                    radius="left"
                    defaultValue={`${todo.content}`}
                  />
                  <Input
                    id="isDone"
                    label="Status"
                    labelAsPlaceholder
                    radius="right"
                    defaultValue={`${todo.isDone ? "Done" : "Not Done"}`}
                  />
                  {/* <Text variant="body-default-m"> 
                    {todo.isDone ? "Done" : "Not Done"}
                  </Text> */}
                </Row>
            </li>
          </div>
        ))}
      </ul>
      </Column>
    </main>
  )
}