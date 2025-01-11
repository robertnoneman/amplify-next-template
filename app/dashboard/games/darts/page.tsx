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
                1. COINTOSS
              </Text>
              <Text variant="body-default-m" align="left">
                - Both players stand behind the throwline side by side. <br/> 
                - Whichever player won the last game starts a countdown from 3. <br/> 
                - On 0 both players throw a dart at the board. <br/>  
                - The player who's dart is closest to the bullseye wins the cointoss.
              </Text>
            </Column>
            <Row height="xs" alignItems="center" mobileDirection="column" position="relative">
              <Dartboard animation="cointoss"/>
            </Row>
            <Row height={4} alignItems="center" mobileDirection="column" position="relative"/>
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
                2. {"Kickoff / Punting".toUpperCase()}
              </Text>
              <Row mobileDirection="column">
                <Text variant="body-default-m" align="left">
                  - The kicking team can throw up to 3 darts. <br/><br/>
                  - The kicking team kicks off from their 40 yard line. <br/><br/>
                  - Each dart is worth the point value in yards (e.g., a single 10 is worth 10 yards, a triple 20 is worth 60 yards). <br/><br/>
                  - Single digits are rounded up or down (e.g., a 41 yard kickoff is rounded to 40 yards; 45 is rounded to 50). <br/><br/>
                </Text>
                <Row height="xs" alignItems="center" mobileDirection="column" position="relative" >
                  <Dartboard animation="kickoff"/>
                </Row>
              </Row>
              <Row height={4} alignItems="center" mobileDirection="column" position="relative"/>
              <Row mobileDirection="column">
                <Text variant="body-default-m" align="left">
                  - The kicking team can decide to stop throwing if they are satisfied with the yardage kicked in less than 3 darts if they so choose <br/><br/>
                  - - (e.g., the kicking team throws a triple 20 on their first throw, amounting to 60 yards, and elects to stop there to prevent a potential touchback or penalty). <br/><br/>
                </Text>
                <Row height="xs" alignItems="center" mobileDirection="column" position="relative">
                  <Dartboard animation="bigkickoff"/>
                </Row>
                <Row height={4} alignItems="center" mobileDirection="column" position="relative"/>
                <Text variant="body-default-m" align="left">
                  - If the total yards kicked exceeds 60 yards, it is a touchback, and the receiving team can opt to throw a single “return” dart or take a knee and start from their own 30 yard line. <br/><br/>
                </Text>
                <Row height="xs" alignItems="center" mobileDirection="column" position="relative">
                  <Dartboard animation="bustkickoff"/>
                </Row>
                <Row height={4} alignItems="center" mobileDirection="column" position="relative"/>

                <Text variant="body-default-m" align="left">
                  - After the kicking team has ended their kickoff, the receiving team can opt to throw a single “return” dart. <br/><br/>
                    - - The yards returned is equivalent to the point total of the dart (e.g., a single 10 is worth 10 yards, a triple 20 is worth 60 yards). <br/><br/>
                </Text>
                
              </Row>
                
              <Text variant="body-strong-m" align="left">
                Penalties
              </Text>
              <Row mobileDirection="column">
                <Text variant="body-default-m" align="left">
                  If the kicking team bounces out a dart, it is considered a kick out of bounds, and the receiving team starts on their own 40 yard line. <br/><br/>
                  If the punting team bounces out a dart, it is considered a blocked punt / fumble / turnover, and the receiving team takes possession at the spot of the punt. (plus a return yards dart throw) <br/><br/>
                </Text>
                <Row height="xs" alignItems="center" mobileDirection="column" position="relative">
                  <Dartboard animation="kickout"/>
                </Row>
                <Row height={4} alignItems="center" mobileDirection="column" position="relative"/>
              </Row>
              <Text variant="body-default-m" align="left">
                If the receiving team bounces out their single return yard dart, it is considered a muffed punt / fumble / turnover, and the kicking team takes possession at the spot of the return. <br/>
                </Text>
            </Column>
            
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
                3. {"Offense".toUpperCase()}
              </Text>
              <Text variant="body-default-m" align="left">
                The offensive team starts at the yard line determined by the kickoff. <br/>
                The offensive team then has up to 4 throws (equivalent to 4 downs) to achieve a new set of downs (aka get a 1st down). <br/>
                This is accomplished by hitting the next 10 increment on the board from where the line of scrimmage is <br/>
                (e.g., if the offense team is starting from their own 30 yard line, they would be aiming for the 4 on the dartboard. <br/>
                Hitting a single 4 would achieve a new set of downs, and the offensive team would then attempt to reach the 50 yard line by hitting the 5 on the dartboard). <br/>
                If the offensive team hits a double or triple on the target yard line, this is equivalent to a 20 or 30 yard gain <br/>
                (e.g., if the offensive team is on their 30 (thus aiming for the 4 on the dartboard to reach the 40 yard line) and hits a triple 4, it is a 30 yard gain, <br/>
                resulting in a 1st down starting at the opponents 40 yard line).<br/>
              </Text>
                <Text variant="body-strong-m" align="left">
                Turnovers
              </Text>
              <Text variant="body-default-m" align="left">
                If the offensive team fails to convert on 4th down, it is a turnover on downs, and the opposing team takes possession at the line of scrimmage. <br/>
                Any bounce out throw is a turnover from the line of scrimage. The defense can opt to throw a single return yards dart or “fair catch” and start at the point of the turnover. <br/>
                If the receiving team bounces out their single return yard dart, it is considered a muffed punt / fumble / turnover, and the kicking team takes possession at the spot of the return. <br/>
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
          
          <Line height={0.2} background="neutral-alpha-strong"/>

          <Row gap="24" mobileDirection="column">
            
            <Column justifyContent="flex-start" paddingX="24">
              <Text variant="body-strong-l" align="left">
                4. {"Defense".toUpperCase()}
              </Text>
              <Text variant="body-default-m" align="left">
                The offensive team throws a dart that misses any point value on the board, but does still stick to the board, this triggers a potential sack play <br/>
                The defensive team then has one opportunity to throw a dart at the line of scrimmage minus 10 yards (e.g., if the offensive team is on the 50, the defensive team would aim for the 4). <br/>
                If successful, the defensive team records a sack, and the offensive team loses 10 yards. <br/>
                If the defensive team misses the target yard line, the offensive team retains possession at the line of scrimmage, and it is simply considered an incomplete pass.<br/>
              </Text>
                <Text variant="body-strong-m" align="left">
                Penalities
              </Text>
              <Text variant="body-default-m" align="left">
                If the defensive team bounces out their sack dart, it is considered a roughing the passer penalty, and the offensive team gains 10 yards. <br/>
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

          <Line height={0.2} background="neutral-alpha-strong"/>

          <Row gap="24" mobileDirection="column">
            
            <Column justifyContent="flex-start" paddingX="24">
              <Text variant="body-strong-l" align="left">
                5. {"Scoring".toUpperCase()}
              </Text>
              <Text variant="body-strong-m" align="left">
                Field Goals
              </Text>
              <Text variant="body-default-m" align="left">
                - Once the offensive team has reached the 30 yard line, they are on in field goal range, and can elect to kick a field goal on any down there after. <br/>
                - The team must declare they are kicking a field goal if they decide to do so. To succeed, the player must hit a single, double, or triple 3 (all are worth a single field goal). <br/>
              </Text>
              <br/>
              <Text variant="body-strong-m" align="left">
                Touchdowns
              </Text>
              <Text variant="body-default-m" align="left">
                Once the offensive team is in field goal range, they can also score a touchdown by hitting: <br/>
                - a triple 7 if they are on their opponents 30 yard line, <br/>
                - a double (or triple) 7 if they are on their opponents 20 yard line, or <br/>
                - a single (or double or triple) 7 if they are on their opponents 10 yard line. <br/>
                <br/>
                </Text>
                <Text variant="body-strong-m" align="left">
                Extra Point / 2 Point Conversion
              </Text>
              <Text variant="body-default-m" align="left">
                - Extra points are automatic. <br/>
                - - If the offsensive team so chooses, they can forego the automatic extra point and attempt a 2 point conversion by hitting the 2 on the dartboard. <br/>
              </Text>
              <br/>
                <Text variant="body-strong-m" align="left">
                Special Rules
              </Text>
              <Text variant="body-default-m" align="left">
                Regardless of their field position, the offensive team can score a touchdown from any part of the field on any down by hitting a double bullseye. <br/>
                <br/>
                They can also achieve a first down by hitting a single bullseye (unless they are on their opponent's 10 or less, in which case a single bullseye would be a touchdown). <br/>
                </Text>
            </Column>
          </Row>

          <Line height={0.2} background="neutral-alpha-strong"/>

          <Row gap="24" mobileDirection="column">
            <Column justifyContent="flex-start" paddingX="24">
              <Text variant="body-strong-l" align="left">
                6. {"Game Duration".toUpperCase()}
              </Text>
              <Text variant="body-default-m" align="left">
                - There are 4 quarters in a game, and each team gets 2 offensive possessions per quarter. <br/>
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

          <Line height={0.2} background="neutral-alpha-strong"/>

          <Row gap="24" mobileDirection="column">
            <Column justifyContent="flex-start" paddingX="24">
              <Text variant="body-strong-l" align="left">
                7. {"Onside Kicks".toUpperCase()}
              </Text>
              <Text variant="body-default-m" align="left">
                - Remember how this works?<br/>
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