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

export default function Page() {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedRange, setSelectedRange] = useState<DateRange>();
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);
  const [firstDialogHeight, setFirstDialogHeight] = useState<number>();
  // const { addToast } = useToast();
  const [intro, setIntro] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tags, setTags] = useState<string[]>(["UX / UI", "Design systems", "AI / ML"]);
  const [twoFA, setTwoFA] = useState(false);
  const [activities, setActivities] = useState<Array<Schema["Activity"]["type"]>>([]);
  const [selectedActivities, setSelectedActivities] = useState<Array<Schema["Activity"]["type"]>>([]);
  const [urls, setUrls] = useState<Array<string>>([]);

  const handleSelect = (value: string) => {
    console.log("Selected option:", value);
    setSelectedValue(value);
  };

  const getImageUrl = async (key: string): Promise<string> => {
    const url = getUrl({
        path: key
    });
      return (await url).url.toString();
    }

  function listActivities() {
    client.models.Activity.observeQuery().subscribe({
      next: async (data) => {
        setActivities([...data.items]);
        const urls = await Promise.all(data.items.map(async (activity) => {
          if (activity.image && activity.isOnNextRobDay) {
            return await getImageUrl(activity.image);
          }
          return "";
        }));
        setUrls(urls);
        const selected = data.items.filter((activity) => activity.isOnNextRobDay);
        setSelectedActivities(selected);
      },
    })
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
              {selectedActivities.map((activity, index) => (
                <Row 
                fillWidth
                padding="xs"
                gap="m"
                position="relative"
                // height="xs"
                mobileDirection="column"
                overflow="hidden"
                radius={undefined}
                key={`${activity.id}`}
                // bottomRadius="l"
                // topRadius='l'
                // alignItems="center"
                // overflow="scroll"
                // border="brand-medium"
                // background="page"
                // radius="l"
              >
                <SmartImage
                  // fitWidth
                  src={urls[selectedActivities.indexOf(activity)]}
                  alt="Robday"
                  aspectRatio="16/9"
                  objectFit="contain"
                  sizes="xs"
                  radius="xl"
                  // maxHeight={15}
                />
                {/* <Column fillHeight fillWidth mobileDirection="row">
                  <Row height={2}></Row>
                  <Row height={2}></Row>
                </Column> */}
                <Column fillWidth >
                  <Text
                    padding="xs" align="left" onBackground="neutral-strong" variant="display-default-s"
                  >
                    {activity.name?.toUpperCase() ?? "ACTIVITY TBD"}
                  </Text>
                  <Text
                    paddingLeft="xs" align="left" onBackground="neutral-medium" variant="code-default-xs"
                  >
                    {activity.location?.toUpperCase() ?? "LOCATION TBD"}
                  </Text>
                  <Text
                    padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s"
                  >
                    {activity.description}
                  </Text>
                </Column>
                {/* </Background> */}
              </Row>
              ))}
              {/* <Row 
                fillWidth
                padding="xs"
                gap="m"
                position="relative"
                // height="xs"
                mobileDirection="column"
                overflow="hidden"
                radius={undefined}
                // bottomRadius="l"
                // topRadius='l'
                // alignItems="center"
                // overflow="scroll"
                // border="brand-medium"
                // background="page"
                // radius="l"
                >
                <SmartImage
                  // fitWidth
                  src="/robday.jpeg"
                  alt="Robday"
                  aspectRatio="16/9"
                  objectFit="contain"
                  sizes="xs"
                  radius="xl"
                  // maxHeight={15}
                />
                {/* <Column fillHeight fillWidth mobileDirection="row">
                  <Row height={2}></Row>
                  <Row height={2}></Row>
                </Column> */}
                {/* <Column fillWidth >
                  <Text
                    padding="xs" align="left" onBackground="neutral-strong" variant="display-default-s"
                  >
                    ACTIVITY 1 TITLE
                  </Text>
                  <Text
                    paddingLeft="xs" align="left" onBackground="neutral-medium" variant="code-default-xs"
                  >
                    LOCATION TBD
                  </Text>
                  <Text
                    padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s"
                  >
                    Short description of activity 1. The goal here is to explain what the plan for this activity is. It should be informative and contain information.
                  </Text>
                </Column> */}
              {/* </Row> */} 

              <Line height={0.1}/>

              {/* <Row 
                fillWidth
                padding="s"
                gap="m"
                position="relative"
                // height="xs"
                mobileDirection="column"
                overflow="hidden"
                // justifyContent="flex-start"
                radius={undefined}
                bottomRadius="l"
                topRadius='l'
              >
                <Column fillWidth>
                  <Text
                    padding="xs" align="left" onBackground="neutral-strong" variant="display-default-s"
                  >
                    ACTIVITY 2 TITLE
                  </Text>
                  <Text
                    paddingLeft="xs" align="left" onBackground="neutral-medium" variant="code-default-xs"
                  >
                    LOCATION ALSO TBD
                  </Text>
                  <Text
                    padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s"
                  >
                    Short description of activity 2 that describes the activity, as if it were a description of it.
                  </Text>
                </Column>
                <SmartImage
                  src="/robdaycropblur.jpeg"
                  alt="Robday"
                  aspectRatio="16/9"
                  objectFit="contain"
                  sizes="xs"
                  radius="xl"
                />
              </Row> */}

            </Column>
          </Row>
          {/* </Card> */}
        </Column>
      </Column>
    </Column>
  );
}