"use client";

import { roboto } from '@/app/ui/fonts';
import outputs from "@/amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import styles from '@/app/dashboard/activities/styles.module.css';
import { 
  Background, 
  Heading,
  Fade, 
  Logo, 
  Button, 
  StyleOverlay, 
  IconButton, 
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
  Tag
} from "@/once-ui/components";
import { MediaUpload } from "@/once-ui/modules";
import { uploadData } from 'aws-amplify/storage';
import { getUrl } from 'aws-amplify/storage';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function Page() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [activities, setActivities] = useState<Array<Schema["Activity"]["type"]>>([]);
  const [editedActivity, setEditedActivity] = useState<Schema["Activity"]["type"]>();
  const [file, setFile] = useState("");
  const [urls, setUrls] = useState<Array<string>>([]);
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [firstDialogHeight, setFirstDialogHeight] = useState<number>();
  const [twoFA, setTwoFA] = useState(false);
  const [tags, setTags] = useState<string[]>(["Outdoors", "Food", "Game"]);
  const [activityName, setActivityName] = useState<string>("");
  const [activityDescription, setActivityDescription] = useState<string>("");
  const [activityCount, setActivityCount] = useState<number>(0);
  const [activityRating, setActivityRating] = useState<number>(0);
  const [activityNotes, setActivityNotes] = useState<string[]>([]);
  const [activityImage, setActivityImage] = useState<string>("");
  const [activityCost, setActivityCost] = useState<number>(0);
  const [activityLocation, setActivityLocation] = useState<string>("");

  const handleChange = (event: any) => {
      setFile(event.target.files[0]);
  };

  const handleUploadData = async (file: File): Promise<void> => {
    await uploadData({
      path: `picture-submissions/${file.name}`, 
      data: file
    });
    setActivityImage(`picture-submissions/${file.name}`)
  }

  const getImageUrl = async (key: string): Promise<string> => {
    const url = getUrl({
      path: key
  });
    return (await url).url.toString();
  }

  const poopGetImageUrl = (key: string): any => {
    getImageUrl(key).then((url) => {
      return url;
    });
  }


  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
    }

  function listActivities() {
    client.models.Activity.observeQuery().subscribe({
      next: async (data) => {
        setActivities([...data.items]);
        const urls = await Promise.all(data.items.map(async (activity) => {
          if (activity.image) {
            return await getImageUrl(activity.image);
          }
          return "";
        }));
        setUrls(urls);
      },
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
    listActivities();
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

  function createActivity() {
    client.models.Activity.create({
      name: window.prompt("Activity name"),
      description: window.prompt("Activity description"),
      count: 0,
      rating: 0,
      notes: [],
      image: "https://via.placeholder.com/150",
      lever_of_effort: 0,
      categories: []
    });
  }

  function createNewActivity() {
    console.log("Creating new activty");
    const result = client.models.Activity.create({
      name: activityName,
      description: activityDescription,
      count: activityCount,
      rating: activityRating,
      notes: activityNotes,
      image: activityImage,
      lever_of_effort: 0,
      categories: tags,
      cost: activityCost,
      location: activityLocation
    });
    console.log(result);
    setIsFirstDialogOpen(false);
    setActivityName("");
    setActivityDescription("");
    setActivityCount(0);
    setActivityRating(0);
    setActivityNotes([]);
    setActivityImage("");
    setActivityCost(0);
    setActivityLocation("");
    setFile("");
  }

  function updateActivity(activity: Schema["Activity"]["type"]) {
    console.log(`Done Editing Activity: ${activity.name}`);
    activity.name = activityName;
    activity.description = activityDescription;
    activity.count = activityCount;
    activity.rating = activityRating;
    activity.notes = activityNotes;
    activity.image = activityImage;
    activity.cost = activityCost;
    activity.location = activityLocation;
    activity.categories = tags;
    client.models.Activity.update(activity);
    setIsEditDialogOpen(false);
    setActivityName("");
    setActivityDescription("");
    setActivityCount(0);
    setActivityRating(0);
    setActivityNotes([]);
    setActivityImage("");
    setActivityCost(0);
    setActivityLocation("");
    setFile("");
  }

  function populateActivity(activity: Schema["Activity"]["type"]) {
    isEditDialogOpen? console.log("returning ") :
    setIsEditDialogOpen(true);
    setEditedActivity(activity);
    activity.name? setActivityName(activity.name) : setActivityName("");
    activity.description? setActivityDescription(activity.description) : setActivityDescription("");
    activity.count? setActivityCount(activity.count) : setActivityCount(0);
    activity.rating? setActivityRating(activity.rating) : setActivityRating(0);
    activity.notes ? setActivityNotes(activity.notes.filter(note => note !== null)) : setActivityNotes([]);
    activity.image? setActivityImage(activity.image) : setActivityImage("");
    activity.cost? setActivityCost(activity.cost) : setActivityCost(0);
    activity.location? setActivityLocation(activity.location) : setActivityLocation("");
    activity.categories? setTags(activity.categories.filter(tag => tag !== null )) : setTags([]);
    console.log(`Editing Activity: ${activity.name}`);
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
        {/* <Row position="fixed" top="0" fillWidth justifyContent="center" zIndex={3}>
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
        </Row> */}
        <h2 className={`${roboto.className} text-xl text-gray-50 md:text-3xl md:leading-normal`}>Robday Activity List</h2>
        <button className={`${styles.button}`} onClick={createTodo}>+ new</button>
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
          {todos.map((todo) => (
            <div key={todo.id} className={`${styles.li} ${roboto.className} ${todo.isDone} `}>
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
          <Column maxWidth={36} gap="8">
          {activities.map((activity) => (
            <TiltFx fillWidth paddingX="32" paddingTop="4" key={`${activity.id}fx`}>
              <Flex
                  background="page"
                  radius={undefined}
                  bottomRadius="l"
                  topRadius='l'
                  overflow="hidden"
                  position="relative"
                  fillWidth
                  alignItems="center"
                  border="neutral-medium"
                  mobileDirection='column'
                  key={`${activity.id}flex0`}
                  onClick={() => populateActivity(activity)}
                  // onDoubleClick={() => populateActivity(activity)}
                >
                  {/* <MediaUpload
                    border={undefined}
                    emptyState={<Row paddingBottom="80">Drag and drop or click to browse</Row>}
                    position="relative"
                    aspectRatio="16 / 9"
                    sizes="l"
                    radius={undefined}
                    initialPreviewImage={activity.image ? poopGetImageUrl(activity.image) : ""}
                    key={`${activity.id}mu`}
                    onFileUpload={handleUploadData}
                  ></MediaUpload> */}
                  <SmartImage
                    src={urls[activities.indexOf(activity)]}
                    aspectRatio="16/9"
                    radius="l"
                    objectFit="cover"
                    sizes='s'
                  />
                  <Column
                    // paddingTop="160"
                    paddingX="16"
                    paddingBottom="16"
                    fillWidth
                    position="relative"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    overflow='hidden'
                    // marginTop="xl"
                    gap="0"
                    key={`${activity.id}c0`}
                  >
                    <Heading marginTop="xs" variant="heading-default-xs" key={`${activity.id}h0`}>
                      {activity.name}
                    </Heading>
                    <Row>
                      {(activity.categories ?? []).map((tag) => (
                        // <Text align="center" onBackground="accent-medium" variant='body-default-xs' key={`${activity.categories?.indexOf(tag)}tag`} >
                        //   - {tag}, 
                        // </Text>
                        // {const tagString = tag.toString()}
                        <Tag
                          key={`${activity.categories?.indexOf(tag)}tag`}
                          label={tag?.toString()}
                          size="s"
                          variant="info"
                          />
                      ))}
                    </Row>
                    {/* <Text align="center" onBackground="neutral-weak" marginBottom="2" variant='body-default-xs' key={`${activity.id}t0`}>
                      Outdoors, Other
                    </Text> */}
                    <Text align="left" onBackground="neutral-medium" variant='body-default-xs' key={`${activity.id}t1`}>
                      {activity.description}
                    </Text>
                  </Column>
                </Flex>
              </TiltFx>
              
            ))}
            {/* <TiltFx fillWidth paddingX="32" paddingTop="64">
              <Flex
                background="page"
                radius={undefined}
                bottomRadius="l"
                topRadius='l'
                overflow="hidden"
                position="relative"
                fillWidth
                alignItems="center"
                border="neutral-medium"
                mobileDirection='column'
              >
                <MediaUpload
                  border={undefined}
                  emptyState={<Row paddingBottom="80">Drag and drop or click to browse</Row>}
                  position="relative"
                  aspectRatio="16 / 9"
                  sizes="l"
                  radius={undefined}
                  initialPreviewImage="/tunnies.png"
                  onFileUpload={undefined}
                ></MediaUpload>
                <Column
                  // paddingTop="160"
                  paddingX="16"
                  paddingBottom="16"
                  fillWidth
                  position="relative"
                  alignItems="flex-start"
                  justifyContent="flex-start"
                  overflow='hidden'
                  // marginTop="xl"
                  gap="0"
                >
                  <Heading marginTop="xs" variant="heading-default-xs">
                    Go to Tunnies
                  </Heading>
                  <Text align="center" onBackground="neutral-weak" marginBottom="2" variant='body-default-xs'>
                    Indoors, Food
                  </Text>
                  <Text align="left" onBackground="neutral-medium" variant='body-default-xs'>
                    I'm yet another ass-sized description of the activity and all the shit that the Robs are gonna do
                  </Text>
                </Column>
              </Flex>
            </TiltFx> */}
            <Flex>
              <Button
                // onClick={createActivity}
                onClick={() => setIsFirstDialogOpen(true)}
                variant="tertiary"
                size="m"
                label="Create Activity"
              />
            </Flex>
          </Column>
          <Dialog
            isOpen={isFirstDialogOpen}
            onClose={() => setIsFirstDialogOpen(false)}
            title="Create New Robday Activity"
            description="Add a new activity for Robday."
            onHeightChange={(height) => setFirstDialogHeight(height)}
            footer={
              <>
                <Button variant="secondary" onClick={() => createNewActivity()}>
                  Submit
                </Button>
              </>
            }
          >
            <Flex
              fillWidth
              alignItems='center'
              justifyContent='center'
            >
              <Flex
                maxWidth={20}
                alignItems='center'
              >
                <MediaUpload
                  emptyState={<Row paddingBottom="80">Drag and drop or click to browse</Row>}
                  onFileUpload={handleUploadData}
                >  
                </MediaUpload>
              </Flex>
            </Flex>
            <Column paddingTop="24" fillWidth gap="24">
              <Input
                radius="top"
                label="Name"
                // labelAsPlaceholder
                defaultValue=""
                id="name"
                // onChange={(e) => console.log(e.target.value)}
                onChange={(e) => setActivityName(e.target.value)}
              />
              <Input
                radius="top"
                label="Location"
                // labelAsPlaceholder
                defaultValue=""
                id="location"
                // onChange={(e) => console.log(e.target.value)}
                onChange={(e) => setActivityLocation(e.target.value)}
              />
              <Input
                radius="top"
                label="Cost"
                // labelAsPlaceholder
                defaultValue={0}
                id="cost"
                // onChange={(e) => console.log(e.target.value)}
                onChange={(e) => setActivityCost(parseInt(e.target.value))}
              />
              <Textarea
                id="description"
                label="Description"
                lines={2}
                // onChange={(e) => console.log(e.target.value)}
                onChange={(e) => setActivityDescription(e.target.value)}
                >
              </Textarea>
              <Textarea
                id="notes"
                label="Notes"
                lines={2}
                // onChange={(e) => console.log(e.target.value)}
                onChange={(e) => setActivityNotes([e.target.value])}
                >
              </Textarea>
              <Switch
                reverse
                isChecked={twoFA}
                onToggle={() => setTwoFA(!twoFA)}
                label="Outdoors"
                description="Activity is Outdoors"
              />
              <TagInput
                  id="tags"
                  value={tags}
                  onChange={(newTags: string[]) => {
                    setTags(newTags);
                  }}
                  label="Tags"
              />
              {/* <Button>Add tag</Button> */}
            </Column>
        </Dialog>
        <Dialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          title="Edit Robday Activity"
          description="Edit Robday activity."
          onHeightChange={(height) => setFirstDialogHeight(height)}
          footer={
            <>
              <Button variant="secondary" onClick={() => editedActivity && updateActivity(editedActivity)}>
                Update
              </Button>
            </>
          }
        >
          <Flex
            fillWidth
            alignItems='center'
            justifyContent='center'
          >
            <Flex
              maxWidth={20}
              alignItems='center'
            >
              <MediaUpload
                emptyState={<Row paddingBottom="80">Drag and drop or click to browse</Row>}
                onFileUpload={handleUploadData}
                initialPreviewImage={editedActivity ? urls[activities.indexOf(editedActivity)] : ""}
              >  
              </MediaUpload>
            </Flex>
          </Flex>
          <Column paddingTop="24" fillWidth gap="24">
            <Input
              radius="top"
              label="Name"
              // labelAsPlaceholder
              defaultValue={editedActivity?.name?.toString() ?? ""}
              id="name"
              // onChange={(e) => console.log(e.target.value)}
              onChange={(e) => setActivityName(e.target.value)}
            />
            <Input
              radius="top"
              label="Location"
              // labelAsPlaceholder
              defaultValue={editedActivity?.location?.toString() ?? ""}
              id="location"
              // onChange={(e) => console.log(e.target.value)}
              onChange={(e) => setActivityLocation(e.target.value)}
            />
            <Input
              radius="top"
              label="Cost"
              // labelAsPlaceholder
              defaultValue={editedActivity?.cost?.toString()}
              id="cost"
              // onChange={(e) => console.log(e.target.value)}
              onChange={(e) => setActivityCost(parseInt(e.target.value))}
            />
            <Textarea
              id="description"
              label="Description"
              defaultValue={editedActivity?.description?.toString()}
              lines={2}
              // onChange={(e) => console.log(e.target.value)}
              onChange={(e) => setActivityDescription(e.target.value)}
              >
            </Textarea>
            <Textarea
              id="notes"
              label="Notes"
              defaultValue={editedActivity?.notes?.toString()}
              lines={2}
              // onChange={(e) => console.log(e.target.value)}
              onChange={(e) => setActivityNotes([e.target.value])}
              >
            </Textarea>
            <Switch
              reverse
              isChecked={twoFA}
              onToggle={() => setTwoFA(!twoFA)}
              label="Outdoors"
              description="Activity is Outdoors"
            />
            <TagInput
                id="tags"
                value={editedActivity?.categories?.filter(tag => tag !== null) ?? []}
                onChange={(newTags: string[]) => {
                  setTags(newTags);
                }}
                label="Tags"
            />
            {/* <Button>Add tag</Button> */}
          </Column>
        </Dialog>
      </Flex>
    </main>
  )
}