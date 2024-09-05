import * as SwitchPrimitives from '@rn-primitives/switch'; // Import switch primitives for cross-platform support
import * as React from 'react';
import { Platform } from 'react-native'; // Platform detection for web/native
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated'; // Animation utilities for smooth transitions
import { useColorScheme } from '~/lib/useColorScheme'; // Custom hook for detecting light/dark mode
import { cn } from '~/lib/utils'; // Utility function for handling class names

// Web implementation of the Switch component
const SwitchWeb = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      'peer flex-row h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors', // Base styles for the switch
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', // Focus and ring effects for accessibility
      props.checked ? 'bg-primary' : 'bg-input', // Background color based on checked state
      props.disabled && 'opacity-50', // Reduced opacity if disabled
      className
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-md', // Thumb styling
        props.checked ? 'translate-x-5' : 'translate-x-0' // Translate thumb based on checked state
      )}
    />
  </SwitchPrimitives.Root>
));
SwitchWeb.displayName = 'SwitchWeb';

// RGB color values for light and dark mode
const RGB_COLORS = {
  light: {
    primary: 'rgb(24, 24, 27)',
    input: 'rgb(228, 228, 231)',
  },
  dark: {
    primary: 'rgb(250, 250, 250)',
    input: 'rgb(39, 39, 42)',
  },
} as const;

// Native implementation of the Switch component
const SwitchNative = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const { colorScheme } = useColorScheme(); // Detect current color scheme (light/dark mode)

  // Translate thumb position based on checked state
  const translateX = useDerivedValue(() => (props.checked ? 18 : 0));

  // Animated style for the switch background color based on the checked state
  const animatedRootStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        translateX.value,
        [0, 18], // Map translation to colors
        [RGB_COLORS[colorScheme].input, RGB_COLORS[colorScheme].primary]
      ),
    };
  });

  // Animated style for the thumb movement
  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(translateX.value, { duration: 200 }) }], // Animate thumb position
  }));

  return (
    <Animated.View
      style={animatedRootStyle} // Apply animated background color
      className={cn('h-8 w-[46px] rounded-full', props.disabled && 'opacity-50')} // Styling for the switch container
    >
      <SwitchPrimitives.Root
        ref={ref}
        className={cn(
          'flex-row h-8 w-[46px] shrink-0 items-center rounded-full border-2 border-transparent', // Base styling for native switch
          className
        )}
        {...props}
      >
        <Animated.View style={animatedThumbStyle}>
          <SwitchPrimitives.Thumb
            className={'h-7 w-7 rounded-full bg-background shadow-md'} // Thumb styling for native
          />
        </Animated.View>
      </SwitchPrimitives.Root>
    </Animated.View>
  );
});
SwitchNative.displayName = 'SwitchNative';

// Select the appropriate component based on platform (web or native)
const Switch = Platform.select({
  web: SwitchWeb, // Use SwitchWeb for web platform
  default: SwitchNative, // Use SwitchNative for other platforms (native)
});

export { Switch };
