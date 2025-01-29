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
    Grid
  } from "@/once-ui/components";
  import { roboto } from '@/app/ui/fonts';
  import { TodoProps } from "@/app/lib/definitions";
  import styles from '@/app/dashboard/activities/styles.module.css';
  import { createTodo, updateTodo} from "@/app/lib/actions";
import { todo } from "node:test";


  export default function TodoItem(todoProps: TodoProps) {
    const updateTodoWithId = updateTodo.bind(null, todoProps.id);
    const [content, setContent] = useState(todoProps.content);

    const updateTodoContent = () => {
        const updatedTodoProps = { ...todoProps, content };
        // todoProps.content = content;
        updateTodoWithId(updatedTodoProps);
    }

    return (
        // <Row fillWidth justifyContent="space-between">
        <div key={todoProps.id} className={`${styles.li} ${roboto.className} ${todoProps.isDone} `}>
            <li
            // onClick={() => updateTodoWithId()}
            key={todoProps.id}>
                <Row fillWidth gap="-1" alignItems="center" justifyContent="space-between">
                <Column width="l">
                    <Input 
                        id="content"
                        label={`${todoProps.content}`}
                        labelAsPlaceholder
                        radius="left"
                        defaultValue={`${todoProps.content}`}
                        onChange={(e) => setContent(e.target.value)}
                    >
                        {content !== todoProps.content && <Button onClick={updateTodoContent}>Save</Button>}
                    </Input>
                </Column>
                <Column width="xs" alignItems='center'>
                    <Button size="s" onClick={() => updateTodoWithId(todoProps)} >
                        {todoProps.isDone ? "Done" : "Not Done"}
                    </Button >
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