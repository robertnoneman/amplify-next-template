"use client";

import { useState } from 'react';

import {
  Background,
  Heading,
  Fade,
  Logo,
  Button,
  StyleOverlay,
  IconButton,
  Icon,
  Row,
  Text,
  Input,
  Column,
  Flex,
  SmartImage,
  Switch,
  Dialog,
  Textarea,
  TagInput,
  TiltFx,
  Chip,
  Tag,
  RevealFx,
  Line,
  Grid,
  Select,
  Accordion
} from "@/once-ui/components";
import { roboto } from '@/app/ui/fonts';
import { TodoProps } from "@/app/lib/definitions";
import styles from '@/app/dashboard/activities/styles.module.css';
import { createTodo, updateTodo } from "@/app/lib/actions";


export default function TodoItem(todoProps: TodoProps) {
  const updateTodoWithId = updateTodo.bind(null, todoProps.id);
  const [content, setContent] = useState(todoProps.content);
  const [status, setStatus] = useState(todoProps.status);
  const [notes, setNotes] = useState(todoProps.notes ?? ["Add notes"]);
  const [newNote, setNewNote] = useState("Add a nice note");

  const updateTodoContent = () => {
    const updatedTodoProps = { ...todoProps, content };
    // todoProps.content = content;
    updateTodoWithId(updatedTodoProps);
  }

  const updateTodoStatus = (newStatus: string) => {
    const updatedTodoProps = { ...todoProps, status: newStatus as "Todo" | "InProgress" | "Completed" };
    setStatus(newStatus as "Todo" | "InProgress" | "Completed");
    // todoProps.content = content;
    updateTodoWithId(updatedTodoProps);
  }

  const updateTodoNotes = () => {
    notes[0] = newNote;
    const updatedTodoProps = { ...todoProps, notes: [newNote] };
    updateTodoWithId(updatedTodoProps);
  }

  return (
    // <Row fillWidth justifyContent="space-between">
    <div key={todoProps.id}
    // className={`${styles.li} ${roboto.className} ${todoProps.isDone} `}
    >
      <li
        // onClick={() => updateTodoWithId()}
        key={todoProps.id}>
        <Row fillWidth gap="-1" alignItems="center" justifyContent="space-between">
          <Column width="s">
            <Accordion
              title={todoProps.content}
            >
              <Textarea
                id="content"
                label={`${todoProps.content}`}
                labelAsPlaceholder
                radius="left"

                defaultValue={notes && `${notes[0] ?? "Add notes"}`}
                onChange={(e) => setNewNote(e.target.value)}
              >
                {(!todoProps.notes || !todoProps.notes[0] || newNote !== todoProps.notes[0]) && <Button onClick={updateTodoNotes}>Save</Button>}
              </Textarea>
            </Accordion>
          </Column>
          <Column width="xs" alignItems='center'>
            {/* <Button size="s" onClick={() => updateTodoWithId(todoProps)} >
                      {todoProps.isDone ? "Done" : "Not Done"}
                  </Button > */}
            <Select
              id="isDone"
              label="Status"
              labelAsPlaceholder
              radius="right"

              options={[
                { description: "Ain't done", label: "Todo", value: "Todo" },
                { description: "You ever gonna finish this?", label: "In Progress", value: "InProgress" },
                { description: "Gah finally", label: "Done", value: "Completed" },
              ]}
              value={status}
              onSelect={updateTodoStatus}
            />
          </Column>
          {/* <Input
                  id="isDone"
                  label="Status"
                  labelAsPlaceholder
                  radius="right"
                  defaultValue={`${todoProps.isDone ? "Done" : "Not Done"}`}
                  onClick={() => updateTodoWithId()}
              /> */}
          {/* <Text variant="body-default-m"> 
                  {todo.isDone ? "Done" : "Not Done"}
                  </Text> */}
        </Row>
      </li>
    </div>
    // </Row>
  );
}