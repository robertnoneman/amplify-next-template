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

export default function Dartboard() {
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
    
    <div className={styles.dart}></div>
    <div className={styles.dart2}></div>
    {/* </Row> */}
  </Column>
//   </div>
);
}