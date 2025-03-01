"use client";


import React, { useState, useEffect } from 'react';

interface SlidingImageProps {
    trigger: boolean;
    imageSrc?: string;
    altText?: string;
    slideInDuration?: number;
    visibleDuration?: number;
    slideOutDuration?: number;
    onAnimationComplete?: () => void;
    width?: string | number;
    height?: string | number;
    axis?: 'X' | 'Y';
    startPosition?: string;
    endPosition?: string;
    startPosition2?: string;
}

type AnimationState = 'hidden' | 'sliding-in' | 'visible' | 'sliding-out';

const SlidingImage: React.FC<SlidingImageProps> = ({
    trigger,
    imageSrc = "/api/placeholder/400/320",
    altText = "Person giving thumbs up",
    slideInDuration = 100,
    visibleDuration = 2000,
    slideOutDuration = 1000,
    onAnimationComplete = () => { },
    width = '100%',
    height = '300px',
    axis = 'X',
    startPosition = "105%",
    endPosition = "55%",
    startPosition2 = "0%"
    
}) => {
    const [animationState, setAnimationState] = useState<AnimationState>('hidden');
    const [previousTrigger, setPreviousTrigger] = useState<boolean>(false);

    // Effect to detect changes in the trigger prop
    useEffect(() => {
        // Only trigger animation when changing from false to true
        if (trigger && !previousTrigger && (animationState === 'hidden' || animationState === 'sliding-out')) {
            startAnimation();
        }
        setPreviousTrigger(trigger);
    }, [trigger, previousTrigger, animationState]);

     // Function to start the animation sequence
  const startAnimation = (): void => {
    // Start sliding in
    setAnimationState('sliding-in');
    
    // After sliding in, set to visible and pause
    const slideInTimer = setTimeout(() => {
      setAnimationState('visible');
      
      // After pausing, start sliding out
      const pauseTimer = setTimeout(() => {
        setAnimationState('sliding-out');
        
        // After sliding out, reset to hidden
        const slideOutTimer = setTimeout(() => {
          setAnimationState('hidden');
          onAnimationComplete(); // Notify parent the animation is complete
        }, slideOutDuration);
        
        return () => clearTimeout(slideOutTimer);
      }, visibleDuration);
      
      return () => clearTimeout(pauseTimer);
    }, slideInDuration);
    
    // @ts-ignore
    return () => clearTimeout(slideInTimer); 
  };

    // Styles for the container
    const containerStyle: React.CSSProperties = {
        position: 'fixed',
        width,
        height,
        overflow: 'hidden',
    };

    // Calculate the position based on the animation state
    const getImageStyle = (): React.CSSProperties => {
        const secondAxis = axis === 'X' ? 'Y' : 'X';
        const baseStyle: React.CSSProperties = {
            position: 'fixed',
            height: '90%',
            // Set the secondAxis to the startPosition2 value
            transform: `translate${secondAxis}(${startPosition2})`,
            transition: `transform ${slideInDuration / 1000}s ease-in-out`,
        };

        switch (animationState) {
            case 'hidden':
                return { ...baseStyle, transform: `translate${axis}(${startPosition}) translate${secondAxis}(${startPosition2})`};
            case 'sliding-in':
                return { ...baseStyle, transform: `translate${axis}(${endPosition}) translate${secondAxis}(${startPosition2})` };
            case 'visible':
                return { ...baseStyle, transform: `translate${axis}(${endPosition}) translate${secondAxis}(${startPosition2})` };
            case 'sliding-out':
                return { ...baseStyle, transform: `translate${axis}(${startPosition}) translate${secondAxis}(${startPosition2})` };
            default:
                return baseStyle;
        }
    };

    return (
        <div style={containerStyle} className="items-center justify-center z-10">
            <img
                src={imageSrc}
                alt={altText}
                style={getImageStyle()}
                className="object-contain"
            />
        </div>
    );
};
//   const [animationState, setAnimationState] = useState('hidden'); // 'hidden', 'sliding-in', 'visible', 'sliding-out'
//   const [triggerCount, setTriggerCount] = useState(0);



//   // Effect to manage the animation sequence
//   useEffect(() => {
//     if (triggerCount === 0) return;

//     // Start sliding in
//     setAnimationState('sliding-in');

//     // After sliding in, set to visible and pause
//     const slideInTimer = setTimeout(() => {
//       setAnimationState('visible');

//       // After pausing, start sliding out
//       const pauseTimer = setTimeout(() => {
//         setAnimationState('sliding-out');

//         // After sliding out, reset to hidden
//         const slideOutTimer = setTimeout(() => {
//           setAnimationState('hidden');
//         }, 1000); // Time to slide out

//         return () => clearTimeout(slideOutTimer);
//       }, 2000); // Time to stay visible

//       return () => clearTimeout(pauseTimer);
//     }, 1000); // Time to slide in

//     return () => clearTimeout(slideInTimer);
//   }, [triggerCount]);

//   // Styles for the container and image
//   const containerStyle: React.CSSProperties = {
//     position: 'relative',
//     width: '100%',
//     height: '300px',
//     overflow: 'hidden',
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     background: 'transparent',
//     boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
//   };

//   // Calculate the position based on the animation state
//   const getImageStyle = () => {
//     const baseStyle: React.CSSProperties = {
//       position: 'absolute' as 'absolute',
//       height: '280px',
//       transition: 'transform 1s ease-in-out',
//     };

//     switch (animationState) {
//       case 'hidden':
//         return { ...baseStyle, transform: 'translateX(105%)' };
//       case 'sliding-in':
//         return { ...baseStyle, transform: 'translateX(55%)' };
//       case 'visible':
//         return { ...baseStyle, transform: 'translateX(55%)' };
//       case 'sliding-out':
//         return { ...baseStyle, transform: 'translateX(105%)' };
//       default:
//         return baseStyle;
//     }
//   };

//   return (
//     <div className="flex flex-col items-center gap-4 p-4 z-10">
//       <div className="flex items-center justify-center">
//         <img 
//           src="/stickers/robo_thumbsup1.png" 
//           alt="Person giving thumbs up" 
//           style={getImageStyle()} 
//           className="object-contain"
//         />
//       </div>

//       <div className="flex gap-4">
//         <button 
//           onClick={triggerAnimation}
//           className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
//         >
//           Trigger Animation
//         </button>

//         <div className="px-4 py-2 text-gray-700 bg-gray-100 rounded">
//           State: {animationState}
//         </div>
//       </div>
//     </div>
//   );
// };

export default SlidingImage;