"use client";

import { useState, useEffect } from "react";
import CountdownToMonday from "@/app/ui/CountdownToMonday";
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
    SmartLink,
    Arrow
  } from "@/once-ui/components";
  import { isRobDay } from "@/app/lib/utils";
  import { useWindowSize } from 'react-use';


  export default function NotRobDayOverlay() {
    const [isRedirectDialogOpen, setIsRedirectDialogOpen] = useState(false);
    const [todayIsRobDay, setTodayIsRobDay] = useState(false);
    const { width, height } = useWindowSize();

    function checkIfRobDay() {
        setTodayIsRobDay(isRobDay());
      };

    function onRedirect() {
        console.log("Redirecting to itsnotrobday.com");
      };

    useEffect(() => {
        checkIfRobDay();
        console.log("Today is Robday?:", todayIsRobDay);
        if (todayIsRobDay) {
          setIsRedirectDialogOpen(true);
        }
      }, []);

    return (
        // <Column as="div">
        // {!todayIsRobDay && (
              <Column 
                fillWidth
                fillHeight
                background="surface"
                position='absolute'
                alignItems='center'
                justifyContent='space-around'
                >
                
              <Column paddingTop="xl">
                <Heading as='h1' variant="display-default-l" onSolid="brand-strong">
                  It's not Robday 🙁
                </Heading>
                <Text
                  variant="body-default-s"
                  onBackground="neutral-strong"
                >
                  Bummer man.
                </Text>
              </Column>
                <Column
                  fillWidth
                  alignItems='center'
                  justifyContent='center'
                >
                  <CountdownToMonday/>
                </Column>
                <Button 
                  variant="secondary" 
                  onClick={() => onRedirect()}
                  href="https://itsnotrobday.com"
                  arrowIcon
                  >
                  Take me to itsnotrobday.com
                </Button>
              </Column>
        //       )}
        // </Column>
    )
}   