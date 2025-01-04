"use client";

import React, { forwardRef } from "react";
import { Flex } from ".";
import styles from "./Card.module.scss";

interface CardProps extends React.ComponentProps<typeof Flex> {
  children?: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, style, className, ...rest }, ref) => {
    return (
      <Flex
        ref={ref}
        direction="column"
        background="surface"
        transition="macro-medium"
        radius="xl"
        border="neutral-medium"
        className={styles.card}
        {...rest}
      >
        {children}
      </Flex>
    );
  },
);

Card.displayName = "Card";
export { Card };
