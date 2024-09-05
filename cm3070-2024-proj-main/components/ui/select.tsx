import * as SelectPrimitive from '@rn-primitives/select'; // Importing select primitive components for cross-platform support
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native'; // Platform-specific utilities and components
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'; // Animated transitions for the select dropdown
import { Check } from '~/lib/icons/Check'; // Custom check icon for selected items
import { ChevronDown, ChevronUp } from '~/lib/icons'; // Custom Chevron icons for dropdown arrows
import { cn } from '~/lib/utils'; // Utility for handling conditional class names

// Define Option type for easier referencing
type Option = SelectPrimitive.Option;

// Root Select component using primitives
const Select = SelectPrimitive.Root;

// Grouping items within the select
const SelectGroup = SelectPrimitive.Group;

// Component for displaying the selected value
const SelectValue = SelectPrimitive.Value;

// Trigger for opening the select dropdown, using forwardRef for ref handling
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex flex-row h-10 native:h-12 items-center text-sm justify-between rounded-md', // Default styling for the trigger
      'border border-input bg-background px-3 py-2 web:ring-offset-background text-muted-foreground', // Additional styling for web
      props.disabled && 'web:cursor-not-allowed opacity-50', // Disabled state handling
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown size={16} aria-hidden={true} className='text-foreground opacity-50' /> {/* Chevron icon */}
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

// ScrollUp button component, only rendered for web
const SelectScrollUpButton = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>) => {
  if (Platform.OS !== 'web') {
    return null; // Return null on non-web platforms
  }
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn('flex web:cursor-default items-center justify-center py-1', className)} // Scroll button styling
      {...props}
    >
      <ChevronUp size={14} className='text-foreground' /> {/* Upward chevron icon */}
    </SelectPrimitive.ScrollUpButton>
  );
};

// ScrollDown button component, only rendered for web
const SelectScrollDownButton = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>) => {
  if (Platform.OS !== 'web') {
    return null; // Return null on non-web platforms
  }
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn('flex web:cursor-default items-center justify-center py-1', className)} // Scroll button styling
      {...props}
    >
      <ChevronDown size={14} className='text-foreground' /> {/* Downward chevron icon */}
    </SelectPrimitive.ScrollDownButton>
  );
};

// Content component for the dropdown, with animations for opening and closing
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & { portalHost?: string }
>(({ className, children, position = 'popper', portalHost, ...props }, ref) => {
  const { open } = SelectPrimitive.useRootContext(); // Determine if the dropdown is open

  return (
    <SelectPrimitive.Portal hostName={portalHost}> {/* Render the dropdown in a portal */}
      <SelectPrimitive.Overlay style={Platform.OS !== 'web' ? StyleSheet.absoluteFill : undefined}>
        <Animated.View entering={FadeIn} exiting={FadeOut}> {/* Animate dropdown on open/close */}
          <SelectPrimitive.Content
            ref={ref}
            className={cn(
              'relative z-50 max-h-96 min-w-[8rem] rounded-md border border-border bg-popover shadow-md', // Default dropdown styling
              'py-2 px-1', // Padding and spacing
              position === 'popper' && 'data-[side=bottom]:translate-y-1', // Adjust based on position
              open ? 'web:animate-in web:fade-in' : 'web:animate-out web:fade-out', // Animations based on state
              className
            )}
            position={position}
            {...props}
          >
            <SelectScrollUpButton />
            <View>
              <SelectPrimitive.Viewport className={cn('p-1', position === 'popper' && 'w-full')}>
                {children}
              </SelectPrimitive.Viewport>
            </View>
            <SelectScrollDownButton />
          </SelectPrimitive.Content>
        </Animated.View>
      </SelectPrimitive.Overlay>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

// Label for the select dropdown
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-popover-foreground text-sm font-semibold', className)} // Label styling
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

// SelectItem component for individual options in the dropdown
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex flex-row w-full items-center rounded-sm py-1.5 pl-8 pr-2 web:hover:bg-accent/50 active:bg-accent', // Default item styling
      props.disabled && 'web:pointer-events-none opacity-50', // Disabled state styling
      className
    )}
    {...props}
  >
    <View className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
      <SelectPrimitive.ItemIndicator>
        <Check size={16} strokeWidth={3} className='text-popover-foreground' /> {/* Check icon for selected items */}
      </SelectPrimitive.ItemIndicator>
    </View>
    <SelectPrimitive.ItemText className='text-sm text-popover-foreground' />
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

// Separator between dropdown items
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type Option,
};
