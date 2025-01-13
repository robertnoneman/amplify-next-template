import styles from '@/app/ui/dashboard/dartboard.module.css'
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
  import { inter } from '@/app/ui/fonts';

export default function Dartboard({
  animation,
}: {
  animation: string;
}) {
return (
    
    // <div className="height-[1px] width-[1px] flex items-center justify-center">
  <Column 
    width="xs"
    alignItems="center"
    position="relative"
    justifyContent="center"
    // mobileDirection='row'
  >
    {/* <Row fillHeight> */}
    <ul className={styles.dartboard}>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    <div className={`${styles.board} ${inter.className} position-absolute`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    {animation === "cointoss" ? <div className={styles.dart}></div> : null}
    {animation === "cointoss" ? <div className={styles.dart2}></div> : null}
    {animation === "cointoss" ? <div className={styles.result}><div/></div> : null}

    {animation === "kickoff" ? <div className={styles.dart3}></div> : null}
    {animation === "kickoff" ? <div className={styles.dart4}></div> : null}
    {animation === "kickoff" ? <div className={styles.dart5}></div> : null}
    {animation === "kickoff" ? <div className={styles.kickoffresult}><div></div></div> : null}

    {animation === "bigkickoff" ? <div className={styles.dartBigKickoff}></div> : null}
    {animation === "bigkickoff" ? <div className={styles.bigKickoffResult}><div/></div> : null}

    {animation === "bustkickoff" ? <div className={styles.dartBigKickoff}></div> : null}
    {animation === "bustkickoff" ? <div className={styles.dartTouchbackKickoff}></div> : null}
    {animation === "bustkickoff" ? <div className={styles.bustKickoffResult}><div/></div> : null}

    {animation === "kickoffreturn" ? <div className={styles.dart3return}></div> : null}
    {animation === "kickoffreturn" ? <div className={styles.kickoffReturnResult}><div></div></div> : null}

    {animation === "kickOutOfBounds" ? <div className={styles.dartRedBounceout}></div> : null}
    {animation ===  "kickOutOfBounds" ? <div className={styles.kickoutResult}><div></div></div> : null}

    {animation === "blockedPunt" ? <div className={styles.dartRedBounceout}></div> : null}
    {animation ===  "blockedPunt" ? <div className={styles.blockedPuntResult}><div></div></div> : null}

    {animation === "bounceOut" ? <div className={styles.dartBounceout}></div> : null}

    {animation === "firstDown" ? <div className={`${styles.los} ${inter.className}`}><div></div><div></div></div> : null}
    {animation === "firstDown" ? <div className={styles.dartFirstDown}></div> : null}
    {animation ===  "firstDown" ? <div className={styles.firstDownResult}><div></div></div> : null}

    {animation === "bigfirstDown" ? <div className={`${styles.los} ${inter.className}`}><div></div><div></div></div> : null}
    {animation === "bigfirstDown" ? <div className={styles.dartBigFirstDown}></div> : null}
    {animation ===  "bigfirstDown" ? <div className={styles.firstDownResult}><div></div></div> : null}

    {animation === "turnoverOnDowns" ? <div className={styles.dart3}></div> : null}
    {animation === "turnoverOnDowns" ? <div className={styles.dartTouchbackKickoff}></div> : null}
    {animation === "turnoverOnDowns" ? <div className={styles.dart4}></div> : null}
    {animation === "turnoverOnDowns" ? <div className={styles.dart5}></div> : null}
    {animation === "turnoverOnDowns" ? <div className={`${styles.los} ${inter.className}`}><div></div><div></div></div> : null}
    {animation ===  "turnoverOnDowns" ? <div className={styles.turnoverOnDownsResult}><div></div></div> : null}

    {/* </Row> */}
  </Column>
//   </div>
);
}