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
        </Column>
    );
}