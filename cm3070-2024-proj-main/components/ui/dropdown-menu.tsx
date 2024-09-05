import * as DropdownMenuPrimitive from '@rn-primitives/dropdown-menu'; // Dropdown menu primitive components
import * as React from 'react';
import { Platform, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'; // React Native components and utilities
import { Check } from '~/lib/icons/Check'; // Custom icon for checkmark
import { ChevronDown, ChevronRight, ChevronUp } from '~/lib/icons'; // Custom Chevron icons
import { cn } from '~/lib/utils'; // Utility function for conditional class names
import { TextClassContext } from '~/components/ui/text'; // Context to manage text styling

// Root component for DropdownMenu
const DropdownMenu = DropdownMenuPrimitive.Root;

// DropdownMenu trigger component to open the dropdown
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

// Group component for grouping dropdown items
const DropdownMenuGroup = DropdownMenuPrimitive.Group;

// Portal to render the dropdown content outside the DOM hierarchy
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

// Submenu component for nested dropdowns
const DropdownMenuSub = DropdownMenuPrimitive.Sub;

// RadioGroup for grouping radio items within the dropdown
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// SubTrigger for triggering the display of a submenu, uses forwardRef for ref handling
const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => {
  const { open } = DropdownMenuPrimitive.useSubContext(); // Access context to determine if submenu is open
  const Icon = Platform.OS === 'web' ? ChevronRight : open ? ChevronUp : ChevronDown; // Choose icon based on open state and platform
  return (
    <TextClassContext.Provider
      value={cn(
        'select-none text-sm native:text-lg text-primary', // Text styling
        open && 'native:text-accent-foreground' // Change text color when open
      )}
    >
      <DropdownMenuPrimitive.SubTrigger
        ref={ref}
        className={cn(
          'flex flex-row web:cursor-default web:select-none gap-2 items-center', // Styling for the sub trigger
          open && 'bg-accent', // Change background when open
          inset && 'pl-8', // Apply padding if inset is true
          className
        )}
        {...props}
      >
        {children}
        <Icon size={18} className='ml-auto text-foreground' /> {/* Chevron icon */}
      </DropdownMenuPrimitive.SubTrigger>
    </TextClassContext.Provider>
  );
});
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

// SubContent to render the contents of a submenu
const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => {
  const { open } = DropdownMenuPrimitive.useSubContext(); // Check if submenu is open
  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border mt-1 bg-popover p-1 shadow-md', // Dropdown submenu styling
        open ? 'web:animate-in web:fade-in' : 'web:animate-out web:fade-out', // Animation based on open state
        className
      )}
      {...props}
    />
  );
});
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

// Content for the main dropdown menu
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & {
    overlayStyle?: StyleProp<ViewStyle>; // Optional style for the overlay
    overlayClassName?: string; // Optional class for the overlay
    portalHost?: string; // Host for the portal
  }
>(({ className, overlayClassName, overlayStyle, portalHost, ...props }, ref) => {
  const { open } = DropdownMenuPrimitive.useRootContext(); // Access root context to check if dropdown is open
  return (
    <DropdownMenuPrimitive.Portal hostName={portalHost}>
      <DropdownMenuPrimitive.Overlay
        style={
          overlayStyle
            ? StyleSheet.flatten([Platform.OS !== 'web' ? StyleSheet.absoluteFill : undefined, overlayStyle])
            : Platform.OS !== 'web'
            ? StyleSheet.absoluteFill
            : undefined
        }
        className={overlayClassName}
      >
        <DropdownMenuPrimitive.Content
          ref={ref}
          className={cn(
            'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 shadow-md', // Main content styling
            open ? 'web:animate-in web:fade-in' : 'web:animate-out web:fade-out', // Animation on open/close
            className
          )}
          {...props}
        />
      </DropdownMenuPrimitive.Overlay>
    </DropdownMenuPrimitive.Portal>
  );
});
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

// DropdownMenuItem component for individual items in the menu
const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <TextClassContext.Provider value='select-none text-sm native:text-lg text-popover-foreground'>
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex flex-row items-center rounded-sm px-2 py-1.5 native:py-2', // Item styling
        inset && 'pl-8', // Apply padding if inset
        props.disabled && 'opacity-50 web:pointer-events-none', // Disable item if needed
        className
      )}
      {...props}
    />
  </TextClassContext.Provider>
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

// Checkbox item for the dropdown, with a checkmark icon
const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex flex-row items-center rounded-sm py-1.5 native:py-2 pl-8 pr-2', // Checkbox item styling
      props.disabled && 'web:pointer-events-none opacity-50', // Disable item if needed
      className
    )}
    checked={checked}
    {...props}
  >
    <View className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
      <DropdownMenuPrimitive.ItemIndicator>
        <Check size={14} strokeWidth={3} className='text-foreground' /> {/* Checkmark icon */}
      </DropdownMenuPrimitive.ItemIndicator>
    </View>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

// Radio item for the dropdown, with a radio indicator
const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex flex-row items-center rounded-sm py-1.5 native:py-2 pl-8 pr-2', // Radio item styling
      props.disabled && 'web:pointer-events-none opacity-50', // Disable item if needed
      className
    )}
    {...props}
  >
    <View className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
      <DropdownMenuPrimitive.ItemIndicator>
        <View className='bg-foreground h-2 w-2 rounded-full' /> {/* Radio indicator */}
      </DropdownMenuPrimitive.ItemIndicator>
    </View>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

// Label component for the dropdown
const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold text-foreground', inset && 'pl-8', className)} // Label styling
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

// Separator for dividing dropdown sections
const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

// Shortcut text, typically used for keyboard
