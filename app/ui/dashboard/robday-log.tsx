"use client";

import { act, useEffect, useState } from "react";

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
import { Nullable } from "@aws-amplify/data-schema";
import { LazyLoader } from "@aws-amplify/data-schema/runtime";
import { get } from "http";

Amplify.configure(outputs);

const client = generateClient<Schema>();


export default function RobdayLog({ 
  robdayLogNumber,
  robdayLogDate,
  robdayLogWeather,
  robdayLogTemperature,
  robdayLogActivities,
  activitiesDict,
  activityInstances,
  urlsDict,
  notes
}: { 
  robdayLogNumber: string; 
  robdayLogDate: string;
  robdayLogWeather: string;
  robdayLogTemperature: number;
  robdayLogActivities: Schema["RobdaylogActivity"]["type"][];
  activitiesDict: Record<string, Schema["Activity"]["type"]>;
  activityInstances: Schema["ActivityInstance"]["type"][];
  urlsDict: Record<string, string>;
  notes: Array<string>;
}) {

  const [location, setLocation] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const getImageUrl = async (key: string): Promise<string> => {
      const url = getUrl({
          path: key
      });
        return (await url).url.toString();
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString();
  }

  useEffect(() => {
    activityInstances?.forEach(async (activityInstance) => {
      const location = await activityInstance.location();
      setLocation(location.data?.name ?? null);
      activityInstance.images?.forEach(async (image) => {
        if (image) {
          const url = await getImageUrl(image);
          setImageUrls((imageUrls) => [...imageUrls, url]);
        }
      }
      );
    });
  }, [activityInstances]);

  return (
    <Row
      fillWidth 
      transition="macro-medium"
      gap="64"
      position="relative"
      overflow="hidden"
    >
      <Column
        background="accent-alpha-weak"
        padding="m"
        gap="xs"
        border="neutral-medium"
        radius="xl"
        fillWidth
        fillHeight>
        {/* <Line height={0.25}/> */}
        <Heading variant="display-default-m" align="center">
          ROBDAY #{robdayLogNumber}
        </Heading>
        <Line height={0.25}/>
        { formatDate(robdayLogDate) } <br></br>
        {/* <Row fillWidth justifyContent="space-between">
          <DateInput
            id="date-input"
            label="Date"
            value={new Date(robdayLog?.date ?? '')}>
          </DateInput>
          <Icon
            name="calendarDays"
            size="l"
            onBackground="neutral-medium"
          />
        </Row> */}
        
        {robdayLogWeather} - {robdayLogTemperature}°<br></br>

        <Line height={0.1}/>
        {notes.map((note) => (
          <Text
            key={note}
            padding="xs"
            align="left"
            onBackground="neutral-strong"
            variant="body-default-s"
          >
            {note}
          </Text>
        ))}
        <Line height={0.1}/>
        
        <Column>
          {activityInstances && Object.entries(activityInstances).map(([id, activityInstance]) => (
            <Column key={`${activityInstance.id}`} fillWidth>
              <Row>
              {/* <Column
                position="relative"
                overflow="hidden"
                width={20}
              > */}
                {/* <SmartImage
                  src={urlsDict[id] ?? ""}
                  alt="Robday"
                  aspectRatio="1/1"
                  objectFit="contain"
                  sizes="s"
                  radius="xl"
                  width={10}
                  height={10}
                /> */}
              {/* </Column> */}
              <Column fillWidth >
                <Text
                  padding="xs" align="left" onBackground="neutral-strong" variant="display-default-xs"
                >
                  {activityInstance.displayName?.toUpperCase() ?? "ACTIVITY TBD"}
                </Text>
                <Line/>
                <Text
                  paddingLeft="xs" align="left" onBackground="neutral-medium" variant="code-default-xs"
                >
                  {location?.toUpperCase() ?? "LOCATION TBD"}
                </Text>
                
              </Column>
              <Line vertical width={0.1}/>
              <Column fillWidth justifyContent="center">
                <Text
                    padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s"
                  >
                  {activityInstance.notes}
                </Text>
              </Column>
            </Row>
            <Line height={0.1}/>
            <Row fillWidth justifyContent="space-around" padding="s">
              {imageUrls.map((url) => (
                <SmartImage
                  key={`${imageUrls.indexOf(url)}-${id}`}
                  src={url}
                  alt="Robday"
                  // aspectRatio="1/1"
                  objectFit="cover"
                  sizes="s"
                  radius="xl"
                  // width={15}
                  // fillWidth
                  maxWidth="l"
                  minHeight="l"
                  // height={15}
                />
              ))}
            </Row>
            <Line height={0.1}/>
          </Column>
          ))}
          {/* {activitiesDict && Object.entries(activitiesDict).map(([id, activity]) => (
            <Column key={`${activity.id}`} fillWidth>
              <Row>
              <Column
                position="relative"
                overflow="hidden"
                width={20}
              >
                <SmartImage
                  src={urlsDict[id] ?? ""}
                  alt="Robday"
                  aspectRatio="1/1"
                  objectFit="contain"
                  sizes="s"
                  radius="xl"
                  width={10}
                  height={10}
                />
              </Column>
              <Column fillWidth >
                <Text
                  padding="xs" align="left" onBackground="neutral-strong" variant="display-default-xs"
                >
                  {activity.name?.toUpperCase() ?? "ACTIVITY TBD"}
                </Text>
                <Line/>
                <Text
                  paddingLeft="xs" align="left" onBackground="neutral-medium" variant="code-default-xs"
                >
                  {activity.location?.toUpperCase() ?? "LOCATION TBD"}
                </Text>
                
              </Column>
              <Line vertical width={0.1}/>
              <Column fillWidth justifyContent="center">
                <Text
                    padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s"
                  >
                  {activity.description}
                </Text>
              </Column>
            </Row>
            <Line height={0.1}/>
          </Column>
          ))} */}
        </Column>
      </Column>
    </Row>
  )
}