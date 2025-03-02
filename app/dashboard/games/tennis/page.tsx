"use client";


import {
    Column,
    Heading,
    Row,
    Grid,
    Text,
    Skeleton
} from "@/once-ui/components";

import { useState } from "react";
import SlidingImage from "@/app/ui/effects/slide-in-sticker";
import styles from '@/app/ui/effects/slide-in-sticker.module.css';

// Interface for ParentComponent state
interface ParentComponentState {
    triggerSlide: boolean;
    animationCount: number;
}


export default function Page() {
    const [stickerState, setStickerState] = useState<ParentComponentState>({
        triggerSlide: false,
        animationCount: 0,
    });

    const handleTrigger = (): void => {
        setStickerState(prevState => ({
            ...prevState,
            triggerSlide: true
        }));
    };

    const handleHover = (): void => {
        setStickerState(prevState => ({
            ...prevState,
            triggerSlide: true
        }));
    };

    const handleAnimationComplete = (): void => {
        setStickerState(prevState => ({
            triggerSlide: false,
            animationCount: prevState.animationCount + 1
        }));
    };



    return (
        <Column fillWidth fillHeight alignItems="center" justifyContent="center" onClick={handleTrigger} onMouseEnter={handleHover} zIndex={3}>
            <Heading variant="display-default-l" marginBottom="16">
                TENNIS
            </Heading>
            {(!stickerState.triggerSlide) && (
            <div className={`${styles.rob} flex`}>
                <img src={"/stickers/robo_pointing1.png"}></img>
            </div>
            )}
            <SlidingImage
                trigger={stickerState.triggerSlide}
                onAnimationComplete={handleAnimationComplete}
                slideInDuration={1000}
                visibleDuration={1000}
                slideOutDuration={1000}
                imageSrc="/stickers/robo_thumbsup1.png"
                startPosition="100%"
                endPosition="30%"
                startPosition2="-50%"
                rotateIn="2deg"
                rotateOut="-2deg"
                // imageSrc="/stickers/robo_tennis1.png"
            />
            <SlidingImage
                trigger={stickerState.triggerSlide}
                onAnimationComplete={handleAnimationComplete}
                slideInDuration={1000}
                visibleDuration={1000}
                slideOutDuration={1000}
                axis="Y"
                endPosition="0%"
                startPosition="100%"
                // imageSrc="/stickers/robo_thumbsup1.png"
                imageSrc="/stickers/robo_tennis1.png"
            />
            <SlidingImage
                trigger={stickerState.triggerSlide}
                onAnimationComplete={handleAnimationComplete}
                slideInDuration={2000}
                visibleDuration={1000}
                slideOutDuration={1000}
                axis="X"
                endPosition="20%"
                startPosition="-100%"
                startPosition2="-50%"
                // imageSrc="/stickers/robo_thumbsup1.png"
                imageSrc="/stickers/robo_catch1.png"
            />
            <SlidingImage
                trigger={stickerState.triggerSlide}
                onAnimationComplete={handleAnimationComplete}
                slideInDuration={3000}
                visibleDuration={2000}
                slideOutDuration={3000}
                axis="X"
                startPosition="-100%"
                endPosition="-25%"
                startPosition2="0%"
                rotateIn="5deg"
                rotateOut="-5deg"
                // imageSrc="/stickers/robo_thumbsup1.png"
                imageSrc="/stickers/robo_pointing1.png"
            />
            <SlidingImage
                trigger={stickerState.triggerSlide}
                onAnimationComplete={handleAnimationComplete}
                slideInDuration={4000}
                visibleDuration={2000}
                slideOutDuration={3000}
                axis="X"
                startPosition="-100%"
                endPosition="-25%"
                startPosition2="-40%"
                rotateIn="5deg"
                rotateOut="-5deg"
                // imageSrc="/stickers/robo_thumbsup1.png"
                imageSrc="/stickers/robo_pointing2.png"
            />
            <SlidingImage
                trigger={stickerState.triggerSlide}
                onAnimationComplete={handleAnimationComplete}
                slideInDuration={4000}
                visibleDuration={2000}
                slideOutDuration={3000}
                axis="Y"
                startPosition="100%"
                endPosition="-10%"
                startPosition2="10%"
                // imageSrc="/stickers/robo_thumbsup1.png"
                imageSrc="/stickers/robo_unhappy1.png"
            />
            <SlidingImage
                trigger={stickerState.triggerSlide}
                onAnimationComplete={handleAnimationComplete}
                slideInDuration={1000}
                visibleDuration={2000}
                slideOutDuration={4000}
                axis="Y"
                startPosition="100%"
                endPosition="-10%"
                startPosition2="10%"
                // imageSrc="/stickers/robo_thumbsup1.png"
                imageSrc="/stickers/robo_thumbsup2.png"
            />
        </Column>
    );
}