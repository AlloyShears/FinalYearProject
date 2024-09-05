import * as React from 'react';
import { Platform, View } from 'react-native'; // Import platform-specific functionality and View component
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated'; // Animated utilities for smooth progress animations
import * as ProgressPrimitive from '@rn-primitives/progress'; // Progress primitive component for cross-platform support
import { cn } from '~/lib/utils'; // Utility for handling class names

// Progress component using forwardRef to allow external ref handling
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string; // Optional prop for styling the indicator
  }
>(({ className, value, indicatorClassName, ...props }, ref) => {
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)} // Base progress bar styling
      {...props}
    >
      <Indicator value={value} className={indicatorClassName} /> {/* Renders the progress indicator */}
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName; // Set display name for easier debugging

export { Progress };

// Indicator component to animate the progress bar
function Indicator({ value, className }: { value: number | undefined | null; className?: string }) {
  const progress = useDerivedValue(() => value ?? 0); // Use derived value for smooth animation

  // Animated style for the progress bar width
  const indicator = useAnimatedStyle(() => {
    return {
      width: withSpring(
        `${interpolate(progress.value, [0, 100], [1, 100], Extrapolation.CLAMP)}%`, // Interpolates the width based on progress
        { overshootClamping: true } // Smooth spring animation
      ),
    };
  });

  // If running on the web, handle styles differently
  if (Platform.OS === 'web') {
    return (
      <View
        className={cn('h-full w-full flex-1 bg-primary web:transition-all', className)} // Web-specific styles
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }} // Web-based animation using CSS transforms
      >
        <ProgressPrimitive.Indicator className={cn('h-full w-full', className)} /> {/* Web progress indicator */}
      </View>
    );
  }

  // For non-web platforms, use Animated.View for the progress indicator
  return (
    <ProgressPrimitive.Indicator asChild>
      <Animated.View style={indicator} className={cn('h-full bg-foreground', className)} /> {/* Animated progress bar */}
    </ProgressPrimitive.Indicator>
  );
}
