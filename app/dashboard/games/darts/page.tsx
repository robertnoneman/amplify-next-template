"use client";

import {
    Column,
    Heading,
    Background,
    Carousel,
    Row, 
    Button,
    Flex,
    Arrow,
    Line,
    Text,
    SmartImage
  } from "@/once-ui/components";

  import dartbaord from "@/app/ui/dashboard/dartboard";
import Dartboard from "@/app/ui/dashboard/dartboard";


export default function Page() {
    return (
      <Column fillWidth alignItems="center" gap="32" padding="32" position="relative">
        <Heading wrap="balance" variant="display-default-l" align="center" marginBottom="16">
          DARTS!
        </Heading>
        HERE'S WHERE ALL THE DART GAMES WILL BE!
        <Column background="success-strong" fillWidth gap="24" radius="xl" paddingY="m" position="relative">
          <Background
            // mask={{
            //   x: 100,
            //   y: 0,
            //   radius: 75,
            // }}
            position="absolute"
            grid={{
              display: true,
              opacity: 60,
              width: "25%",
              color: "neutral-alpha-medium",
              height: "20%",
            }}
          />
          <Column alignItems="center" gap="24" padding="24">
            <Heading wrap="balance" variant="display-default-s" align="center">
              ROBDAY NIGHT FOOTBALL
            </Heading>
            <Line height={0.2} background="neutral-alpha-strong"/>
            <Text variant="body-default-l" align="left">
              RULES
            </Text>
            <Line height={0.1} background="neutral-alpha-strong"/>
          </Column>
          <Row gap="24" mobileDirection="column">
            
            <Column justifyContent="flex-start" paddingX="24">
              <Text variant="body-strong-l" align="left">
                1. Cointoss
              </Text>
              <Text variant="body-default-m" align="left">
                - Both players stand behind the throwline side by side. <br/> 
                - Whichever player won the last game starts a countdown from 3. <br/> 
                - On 0 both players throw a dart at the board. <br/>  
                - The player who's dart is closest to the bullseye wins the cointoss.
              </Text>
            </Column>
            <Row height="xs" alignItems="center" mobileDirection="column" position="relative">
              <Dartboard />
            </Row>
            {/* <SmartImage
              style={{width: "50%"}}
              alt="Darts"
              aspectRatio="1 / 1"
              src="/dartboard.png"
              >
            </SmartImage> */}
          </Row>
          <Line height={0.2} background="neutral-alpha-strong"/>
          <Row gap="24" mobileDirection="column">
            
            <Column justifyContent="flex-start" paddingX="24">
              <Text variant="body-strong-l" align="left">
                2. Kickoff
              </Text>
              <Text variant="body-default-m" align="left">
                - Both players stand behind the throwline side by side. <br/> 
                - Whichever player won the last game starts a countdown from 3. <br/> 
                - On 0 both players throw a dart at the board. <br/>  
                - The player who's dart is closest to the bullseye wins the cointoss.
              </Text>
            </Column>
            {/* <Row height="xs" alignItems="center" mobileDirection="column" position="relative">
              <Dartboard />
            </Row> */}
            {/* <SmartImage
              style={{width: "50%"}}
              alt="Darts"
              aspectRatio="1 / 1"
              src="/dartboard.png"
              >
            </SmartImage> */}
          </Row>
        </Column>
        <Button
          id="trigger"
          variant="primary"
          size="l"
          href={'/dashboard/games'}
        >
          <Flex fillHeight justifyContent="center" alignItems="center">
            <Arrow
              trigger="#trigger"
              color="onBackground"
              style={{
                transform: `rotate(180deg)`,
              }}
            />
            Back
          </Flex>
        </Button>
      </Column>
    )
  }