"use client";


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
  import { useState } from "react";
  import { TodoProps } from "@/app/lib/definitions";
  import styles from '@/app/dashboard/activities/styles.module.css';
  import { createTodo, updateTodo} from "@/app/lib/actions";
  import TodoItem from "@/app/ui/dashboard/todo/todo-item";


  export default function TodoList({
    todoProps,
  }: {
    todoProps: TodoProps[]
    }) {
    const [hideDone, setHideDone] = useState(false);
    // const updateTodoWithId = updateTodo.bind(null, todoProps.todos);

    return (
        <Column fillWidth paddingY="80" alignItems="center" flex={1}>
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
        {/* <h2 className={`${roboto.className} text-xl text-gray-50 md:text-3xl md:leading-normal`}>Robday Todo List</h2> */}
        <Heading variant="display-default-m">ROBDAY TODO LIST</Heading>
        <Column gap="8" paddingY="s" fillWidth alignItems='flex-end'>
          <Line height={0.1}></Line>
          <Row fillWidth justifyContent="space-around">
            {/* <Column fillWidth /> */}
            {/* <Button variant="primary" fillWidth onClick={createTodo}>Create Todo</Button> */}
            <Button variant="tertiary" fillWidth onClick={() => setHideDone(!hideDone)}>{hideDone ? "Show Done" : "Hide Done"}</Button>
          </Row>
        </Column>
        {/* <div className={`${styles.ul} ${roboto.className} `}> */}
        <ul className={`${styles.ul}`} key={"todoList"}>
          <div className={`${styles.li} ${roboto.className} `}>
            {/* <li key={"todoheader"}> */}
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
            {/* </li> */}
          </div>
        {/* </div> */}
          {todoProps.map((todo) => (
            <div key={todo.id}>
              {hideDone && todo.isDone ? null : 
                <TodoItem key={todo.id} {...todo} />
            }
            </div>
            // <div key={todo.id} className={`${styles.li} ${roboto.className} ${todo.isDone} `}>
            //   {hideDone && todo.isDone ? null :
            //   <li
            //     onClick={() => deleteTodo(todo.id, todo.content, todo.isDone)}
            //     key={todo.id}>
            //       <Row fillWidth gap="-1" alignItems="center" justifyContent="space-between">
            //         <Input 
            //           id="content"
            //           label={`${todo.content}`}
            //           labelAsPlaceholder
            //           radius="left"
            //           defaultValue={`${todo.content}`}
            //         />
            //         <Input
            //           id="isDone"
            //           label="Status"
            //           labelAsPlaceholder
            //           radius="right"
            //           defaultValue={`${todo.isDone ? "Done" : "Not Done"}`}
            //         />
            //         {/* <Text variant="body-default-m"> 
            //           {todo.isDone ? "Done" : "Not Done"}
            //           </Text> */}
            //       </Row>
            //   </li>
            //   }
            // </div>
          ))}
        </ul>
      </Column>
    )
}