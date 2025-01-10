"use client";

import React, { act, useEffect, useState } from "react";

import {
  Heading,
  Text,
  Button,
  Icon,
  InlineCode,
  Logo,
  Input,
  Avatar,
  AvatarGroup,
  Textarea,
  PasswordInput,
  SegmentedControl,
  SmartLink,
  Dialog,
  Feedback,
  SmartImage,
  Line,
  LogoCloud,
  Background,
  Select,
  useToast,
  Card,
  Fade,
  StatusIndicator,
  DateRangePicker,
  DateRange,
  TiltFx,
  HoloFx,
  IconButton,
  TagInput,
  Switch,
  Column,
  Row,
  StyleOverlay,
  Flex,
  DateInput,
  Skeleton,
  Arrow
} from "@/once-ui/components";
import { CodeBlock, MediaUpload } from "@/once-ui/modules";
import Link from 'next/link';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import clsx from 'clsx';
import { roboto } from '@/app/ui/fonts';
import { usePathname } from 'next/navigation';
import { getNextRobDay } from "@/app/lib/utils";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json"
import { getUrl } from 'aws-amplify/storage';

Amplify.configure(outputs);

const client = generateClient<Schema>();

const navigation = [
  { name: 'Dashboard', href: '/dashboard', current: true },
  { name: 'Activities', href: '/dashboard/activities', current: false },
  { name: 'Planner', href: '/dashboard/planner', current: false },
  { name: 'Archive', href: '#', current: false },
]

interface Dictionarty {
  activity: Schema["Activity"]["type"];
  url: string;
}
type ActivityType = Schema["Activity"]["type"];

export default function Page() {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValueLabel, setSelectedValueLabel] = useState("Choose an activity");
  const [selectedRange, setSelectedRange] = useState<DateRange>();
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isAddActivityDialogOpen, setIsAddActivityDialogOpen] = useState(false);
  const [firstDialogHeight, setFirstDialogHeight] = useState<number>();
  // const { addToast } = useToast();
  const [intro, setIntro] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tags, setTags] = useState<string[]>(["UX / UI", "Design systems", "AI / ML"]);
  const [twoFA, setTwoFA] = useState(false);
  const [activities, setActivities] = useState<Array<Schema["Activity"]["type"]>>([]);
  const [selectedActivities, setSelectedActivities] = useState<Array<Schema["Activity"]["type"]>>([]);
  const [removedActivity, setRemovedActivity] = useState<Schema["Activity"]["type"]>();
  const [editededActivity, setEditedActivity] = useState<Schema["Activity"]["type"]>();
  const [completedActivity, setCompletedActivity] = useState<Schema["Activity"]["type"]>();
  const [addedActivity, setAddedActivity] = useState<Schema["Activity"]["type"]>();
  // const [urls, setUrls] = useState<Array<string>>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});

  const handleSelect = (activity: Schema["Activity"]["type"]) => {
    console.log("Selected option:", activity.name);
    setSelectedValue(activity.name ?? "");
    setSelectedValueLabel(activity.location ?? "");
    setAddedActivity(activity);
  };

  const printSelect = (value: string) => {
    setSelectedValue(value);
    setSelectedValueLabel(value);
    console.log("Selected value:", value);
  }

  const getImageUrl = async (key: string): Promise<string> => {
    const url = getUrl({
        path: key
    });
      return (await url).url.toString();
    }

  function listActivities() {
    const urlDict: Record<string, string> = {};
    client.models.Activity.observeQuery().subscribe({
      next: async (data) => {
        setActivities([...data.items]);
        const urls = await Promise.all(data.items.map(async (activity) => {
          if (activity.image && activity.isOnNextRobDay) {
            urlDict[activity.id] = await getImageUrl(activity.image);
            return await getImageUrl(activity.image);
          }
          return "";
        }));
        // setUrls(urls);
        setUrls(urlDict);
        const selected = data.items.filter((activity) => activity.isOnNextRobDay);
        setSelectedActivities(selected);
      },
    })
  }

  function onRemoveActivity(activity: Schema["Activity"]["type"]) {
    setRemovedActivity(activity);
    setIsFirstDialogOpen(true);
  }

  function onEditActivity(activity: Schema["Activity"]["type"]) {
    setEditedActivity(activity);
    setIsSecondDialogOpen(true);
  }

  function onAddActivity(activity: Schema["Activity"]["type"]) {
    setAddedActivity(activity);
    addedActivity ? addedActivity.isOnNextRobDay = true : null;
    addedActivity ? client.models.Activity.update({ ...addedActivity }) : null;
    setAddedActivity(undefined);
    // setIsSecondDialogOpen(true);
  }

  function onCompleteActivity(activity: Schema["Activity"]["type"]) {
    setCompletedActivity(activity);
    setIsCompleteDialogOpen(true);
  }

  function removeActivity() {
    removedActivity ? removedActivity.isOnNextRobDay = false : null;
    removedActivity ? client.models.Activity.update({ ...removedActivity }) : null;
    setRemovedActivity(undefined);
    setIsFirstDialogOpen(false);
  }

  function editActivity() {
    editededActivity ? client.models.Activity.update({ ...editededActivity }) : null;
    setEditedActivity(undefined);
    setIsSecondDialogOpen(false);
  }

  function addActivity() {
    addedActivity ? addedActivity.isOnNextRobDay = true : null;
    addedActivity ? client.models.Activity.update({ ...addedActivity }) : null;
    setAddedActivity(undefined);
    setIsAddActivityDialogOpen(false);
  }

  function completeActivity() {
    completedActivity ? completedActivity.isOnNextRobDay = false : null;
    const newCount = completedActivity ? completedActivity.count ? completedActivity.count + 1 : completedActivity.count = 1 : 1;
    completedActivity ? completedActivity.count? completedActivity.count = newCount : completedActivity.count = 1 : 1;
    completedActivity ? client.models.Activity.update({ ...completedActivity }) : null;
    setCompletedActivity(undefined);
    setIsCompleteDialogOpen(false);
  }

  useEffect(() => {
    listActivities();
  }, []);

  const pathname = usePathname();
  return (
    <Column fillWidth paddingY="80" paddingX="s" alignItems="center" flex={1}>
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
      <Column
        overflow="hidden"
        as="main"
        maxWidth="l"
        position="relative"
        radius="xl"
        alignItems="center"
        border="neutral-alpha-weak"
        fillWidth
      >
        <Column
          fillWidth
          alignItems="center"
          gap="48"
          radius="xl"
          paddingTop="80"
          position="relative"
        >
          <Background
            mask={{
              x: 0,
              y: 48,
            }}
            position="absolute"
            grid={{
              display: true,
              width: "0.25rem",
              color: "neutral-alpha-medium",
              height: "0.25rem",
            }}
          />
          <Background
            mask={{
              x: 80,
              y: 0,
              radius: 100,
            }}
            position="absolute"
            gradient={{
              display: true,
              tilt: -35,
              height: 50,
              width: 75,
              x: 100,
              y: 40,
              colorStart: "accent-solid-medium",
              colorEnd: "static-transparent",
            }}
          />
          <Background
            mask={{
              x: 100,
              y: 0,
              radius: 100,
            }}
            position="absolute"
            gradient={{
              display: true,
              opacity: 100,
              tilt: -35,
              height: 20,
              width: 120,
              x: 120,
              y: 35,
              colorStart: "brand-solid-strong",
              colorEnd: "static-transparent",
            }}
          />
          <Column fillWidth alignItems="center" gap="32" padding="32" position="relative">
            <Heading wrap="balance" variant="display-default-l" align="center" marginBottom="16">
              On the next Robday...
            </Heading>
          </Column>

          <Row
            padding="32"
            fillWidth
            gap="64"
            position="relative"
            mobileDirection="column"
            alignItems="center"
          >
            <Column
              fillWidth
              background="surface"
              radius="xl"
              border="neutral-medium"
              overflow="hidden"
              padding="32"
              gap="40"
              position="relative"
            >
              <Row fillWidth justifyContent="center">
                <DateRangePicker
                  data-scaling="100"
                  size="l"
                  fitWidth
                  gap="40"
                  mobileDirection="column"
                  onChange={(range) => setSelectedRange(range)}
                  value={selectedRange}
                />
              </Row>
            </Column>
          </Row>

          {/* AGENDA CARD */}
          <Row
            fillWidth 
            transition="macro-medium"
            padding="32"
            gap="64"
            position="relative"
            overflow="hidden"
          >
            <Column
              background="brand-weak"
              // direction="column"
              // overflow="hidden"
              padding="32"
              gap="20"
              border="neutral-medium"
              radius="xl"
              fillWidth
              fillHeight>
              <Line height={0.25}/>
              <Heading variant="display-default-m" align="center">
                ROBDAY AGENDA
              </Heading>
              <Line height={0.25}/>
              <Row fillWidth justifyContent="space-between">
                <DateInput
                  id="date-input"
                  label="Date"
                  value={getNextRobDay()}>
                </DateInput>
                <Icon
                  name="calendarDays"
                  size="l"
                  onBackground="neutral-medium"
                />
              </Row>

              <Line height={0.1}/>
              <Line height={0.1}/>
              
              <Column>
                {selectedActivities.map((activity, index) => (
                  <Column key={`${activity.id}`}>
                    <Row 
                    fillWidth
                    padding="xs"
                    gap="m"
                    position="relative"
                    // height="xs"
                    mobileDirection="column"
                    overflow="hidden"
                    radius={undefined}
                    // key={`${activity.id}`}
                    // bottomRadius="l"
                    // topRadius='l'
                    // alignItems="md:center"
                    // overflow="scroll"
                    // border="brand-medium"
                    // background="page"
                    // radius="l"
                  >
                    <Flex
                      border="brand-alpha-weak"
                      position="relative"
                      maxWidth={10}
                      // aspectRatio={0.75}
                      overflow="hidden"
                    >
                      <SmartImage
                        // fitWidth
                        // src={urls[selectedActivities.indexOf(activity)]}
                        src={urls[activity.id]}
                        alt="Robday"
                        aspectRatio="16/9"
                        objectFit="cover"
                        sizes="xs"
                        radius="xl"
                        // maxHeight={15}
                      />
                      <Fade
                        fillWidth
                        position="absolute"
                        top="0"
                        to="bottom"
                        height={1}
                        zIndex={3}
                        pattern={{
                          display: true,
                          size: '2'
                        }}
                      />
                      <Fade
                        fillWidth
                        position="absolute"
                        to="top"
                        bottom="0"
                        height={1}
                        zIndex={3}
                        pattern={{
                          display: true,
                          size: '2'
                        }}
                      />
                      <Fade
                        // fillWidth
                        width={1}
                        fillHeight
                        position="absolute"
                        to="left"
                        // bottom="0"
                        right="0"
                        // height={12}
                        zIndex={3}
                        pattern={{
                          display: true,
                          size: '2'
                        }}
                      />
                      <Fade
                        // fillWidth
                        width={1}
                        fillHeight
                        position="absolute"
                        to="right"
                        // bottom="0"
                        left="0"
                        // height={12}
                        zIndex={3}
                        pattern={{
                          display: true,
                          size: '2'
                        }}
                      />
                    </Flex>
                    <Column fillWidth >
                      <Text
                        padding="xs" align="left" onBackground="neutral-strong" variant="display-default-xs"
                      >
                        {activity.name?.toUpperCase() ?? "ACTIVITY TBD"}
                      </Text>
                      <Text
                        paddingLeft="xs" align="left" onBackground="neutral-medium" variant="code-default-xs"
                      >
                        {activity.location?.toUpperCase() ?? "LOCATION TBD"}
                      </Text>
                      <Line/>
                      <Text
                        padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s"
                      >
                        {activity.description}
                      </Text>
                    </Column>
                    <Column justifyContent="space-evenly" mobileDirection="row" background="neutral-alpha-weak" border="neutral-alpha-medium" radius="s">
                      <IconButton
                        icon="close"
                        onClick={() => onRemoveActivity(activity)}
                        variant="tertiary"
                        size="s"
                        />
                        <IconButton
                          icon="edit"
                          onClick={() => setIsSecondDialogOpen(true)}
                          variant="tertiary"
                          size="s"
                        />
                        <IconButton
                          icon="check"
                          onClick={() => onCompleteActivity(activity)}
                          variant="tertiary"
                          size="s"
                          />
                      </Column>
                    {/* </Background> */}
                  </Row>
                  <Line height={0.1}/>
                </Column>
                ))}
              </Column>
              <Row fillWidth justifyContent="center">
                <Button
                  onClick={() => setIsAddActivityDialogOpen(true)}
                  variant="tertiary"
                  size="m"
                  id="trigger"
                >
                <Flex justifyContent="center" alignItems="center">
                  ADD NEW ACTIVITY
                  <Arrow
                    trigger="#trigger"
                    color="onBackground"
                  />
                </Flex>
                </Button>
              </Row>

            </Column>
          </Row>
          {/* </Card> */}
        </Column>
      </Column>
      
      <Dialog
        isOpen={isFirstDialogOpen}
        onClose={() => setIsFirstDialogOpen(false)}
        title="Remove Robday Activity?"
        description=""
        onHeightChange={(height) => setFirstDialogHeight(height)}
        style={{marginBottom: "50%"}}
        justifyContent="center"
        footer={
          <>
            <Button variant="secondary" onClick={() => removeActivity()}>
              REMOVE
            </Button>
          </>
        }
          >
          <Text variant="body-default-s">
            Are you sure you want to remove this activity from the Robday agenda?
          </Text>  
        </Dialog>
        <Dialog
        isOpen={isSecondDialogOpen}
        onClose={() => setIsSecondDialogOpen(false)}
        title="Edit Robday Activity"
        description=""
        // onHeightChange={(height) => setFirstDialogHeight(height)}
        footer={
          <>
            <Button variant="secondary" onClick={() => editActivity()}>
              UPDATE
            </Button>
          </>
        }
          >
          <Text variant="body-default-s">
            Ability to edit activity here coming soon...
          </Text>  
        </Dialog>
        <Dialog
        isOpen={isCompleteDialogOpen}
        onClose={() => setIsCompleteDialogOpen(false)}
        title="Mark Robday Activity as Complete?"
        description=""
        style={{marginBottom: "50%"}}
        // onHeightChange={(height) => setFirstDialogHeight(height)}
        footer={
          <>
            <Button variant="secondary" onClick={() => completeActivity()}>
              COMPLETE
            </Button>
          </>
        }
          >
          <Text variant="body-default-s">
            Are you sure you want to mark this activity as complete?
          </Text>
        </Dialog>
        <Dialog
        isOpen={isAddActivityDialogOpen}
        onClose={() => setIsAddActivityDialogOpen(false)}
        title="Add Robday Activity"
        description=""
        style={{marginBottom: "50%"}}
        // onHeightChange={(height) => setFirstDialogHeight(height)}
        footer={
          <>
            <Button variant="secondary" onClick={() => addActivity()}>
              ADD
            </Button>
          </>
        }
        >
          <Column >
            <Text variant="body-default-s">
              Ability to add activity here coming soon...
            </Text>
            <Select
              searchable
              id="activity"
              label={selectedValueLabel}
              minHeight={300}
              options={activities.map((activity) => {
                return { value: activity.id, label: activity.name, description: activity.description }
              })}
              // onChange={(value) => setSelectedValue(activities.find((activity) => activity.id === value.target.value)?.id ?? "")}
              // onChange={(value) => handleSelect(activities.find((activity) => activity.name === value.target.value ) ?? activities[0])}
              // onSelect={(value) => printSelect(value)}
              onSelect={(value) => handleSelect(activities.find((activity) => activity.id === value ) ?? activities[0])}
              value={selectedValue}
              // value=""
            />
          </Column>
        </Dialog>
        
    </Column>
  );
}