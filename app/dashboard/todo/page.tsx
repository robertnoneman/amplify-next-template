
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
  import TodoList from "@/app/ui/dashboard/todo/todo-list";
  import { fetchTodos } from "@/app/lib/actions";
  import { unstable_cache } from 'next/cache';

  const getTodos = unstable_cache( async () => {
    return await fetchTodos();
}, ["todos"], {revalidate: 3600, tags: ["todos"]});

export default async function Page() {

    const todos = await getTodos();
    return (
      <main>
        <Flex
            justifyContent="center"
            paddingX="32"
            paddingY="64"
            fillWidth
            gap="32"
            position="relative"
            mobileDirection='column'
          >
          <Background
            mask={{
              cursor: true,
            }}
            dots={{
              display: true,
              opacity: 50,
              color: "brand-solid-strong",
              size: "24",
            }}
            fill
            position="absolute"
            gradient={{
              display: true,
              opacity: 100,
              tilt: 0,
              height: 100,
              width: 200,
              x: 50,
              y: 0,
              colorStart: "brand-background-medium",
              colorEnd: "static-transparent",
            }}
          />
            <Column
              fillWidth
              gap="16"
              alignItems="center"
              justifyContent="center"
              >
              {/* <Heading
                size="xl"
                color="brand-strong"
                >
                  Robday Todo List
              </Heading> */}
              <TodoList todoProps={todos}/>
            </Column>
        </Flex>
      </main>
    )
    
}