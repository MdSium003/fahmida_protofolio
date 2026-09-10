You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder

Install dependencies first:
```bash
npm: npm install motion/react react-icons
yarn: yarn add motion/react react-icons
pnpm: pnpm add motion/react react-icons
bun: bun add motion/react react-icons
```

Copy-paste this component to /components/ui folder:
```tsx
demo.tsx
import { FilterDisclosure } from "./original";
import { FaBell, FaTasks } from 'react-icons/fa';
import { IoCalendar } from 'react-icons/io5';
import { BsFillPeopleFill, BsPinFill } from 'react-icons/bs';
import { RiBubbleChartFill } from 'react-icons/ri';

export default function FilterDisclosureDemo() {
    const items = [
        { id: "tasks", label: "Tasks", icon: FaTasks },
        { id: "events", label: "Events", icon: IoCalendar },
        { id: "reminders", label: "Reminders", icon: FaBell },
        { id: "appointments", label: "Appointment", icon: BsPinFill },
        { id: "meetings", label: "Mettings", icon: BsFillPeopleFill },
        { id: "celebrations", label: "Celebrations", icon: RiBubbleChartFill },
    ];

    return (
        <div className="flex items-center justify-center">
            <FilterDisclosure
                items={items}
            />
        </div>
    );
}

filter-disclosure-base.tsx
'use client';

import { useState, type FC } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { FaBell, FaTasks } from 'react-icons/fa';
import { IoCalendar } from 'react-icons/io5';
import { BsCheckLg, BsFillPeopleFill, BsPinFill } from 'react-icons/bs';
import { RiBubbleChartFill } from 'react-icons/ri';
import { PiFunnelSimpleBold } from 'react-icons/pi';
import type { IconType } from 'react-icons';

export interface FilterItem {
  id: string;
  label: string;
  icon: IconType;
}

interface FilterDisclosureProps {
  items?: FilterItem[];
  defaultActiveId?: string;
  onChange?: (id: string) => void;
}

const SPRING = {
  type: 'spring',
  stiffness: 240,
  damping: 20,
  mass: 1,
} as const;

const DEFAULT_ITEMS: FilterItem[] = [
  { id: 'tasks', label: 'Tasks', icon: FaTasks },
  { id: 'events', label: 'Events', icon: IoCalendar },
  { id: 'reminders', label: 'Reminders', icon: FaBell },
  { id: 'appointments', label: 'Appointment', icon: BsPinFill },
  { id: 'meetings', label: 'Mettings', icon: BsFillPeopleFill },
  { id: 'celebrations', label: 'Celebrations', icon: RiBubbleChartFill },
];

export const FilterDisclosure: FC<FilterDisclosureProps> = ({
  items = DEFAULT_ITEMS,
  defaultActiveId = 'reminders',
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(defaultActiveId);

  const activeItem = items.find((i) => i.id === active);
  const ActiveIcon = activeItem ? activeItem.icon : FaTasks;

  const handleSelect = (id: string) => {
    setActive(id);
    onChange?.(id);
    setTimeout(() => setOpen(false), 220);
  };

  return (
    <div className="theme-injected flex h-[500px] w-[300px] items-center justify-center">
      <MotionConfig
        transition={{
          type: 'spring',
          bounce: 0.25,
          duration: 0.7,
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {open ? (
            <motion.div
              key="open"
              layoutId="filter-disclosure"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 0 },
              }}
              style={{ transformOrigin: '50% 100%' }}
              className="border-border bg-popover absolute z-20 flex w-[300px] flex-col gap-[4px] overflow-hidden  border-[1.6px] p-[8px] shadow-xl will-change-transform rounded-lg"
            >
              {items.map((item, index) => {
                const Icon = item.icon;
                const selected = active === item.id;

                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, scale: 1.1, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    onClick={() => handleSelect(item.id)}
                    whileTap={{ scale: 0.98 }}
                    transition={{ ...SPRING, delay: (3 + index) * 0.05 }}
                    className="hover:bg-accent flex w-full cursor-pointer items-center justify-between rounded-lg px-[12px] py-[10px] transition-colors"
                  >
                    <div className="flex items-center gap-[28px]">
                      <Icon className="text-muted-foreground h-[24px] w-[24px]" />
                      <span className="text-foreground text-[18px] font-bold tracking-tight">
                        {item.label}
                      </span>
                    </div>

                    <motion.div
                    
                      className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-lg border-[3px] ${
                        selected ? 'border-primary bg-primary' : 'border-border'
                      }`}
                    >
                      <motion.div
                        animate={{
                          scale: selected ? 1 : 0,
                          opacity: selected ? 1 : 0,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 520,
                          damping: 30,
                        }}
                      >
                        <BsCheckLg className="text-primary-foreground h-[16px] w-[16px]" />
                      </motion.div>
                    </motion.div>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <div key="close" className="flex items-center">
              <motion.button
                layoutId="filter-disclosure"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0 },
                }}
                onClick={() => setOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
               
                className="border-border bg-background z-30 flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-lg border-[1.6px] shadow-sm will-change-transform"
              >
                <PiFunnelSimpleBold className="text-foreground h-[30px] w-[30px]" />
              </motion.button>

              <motion.div
                initial={{ x: -30 }}
                animate={{ x: 0 }}
                transition={{
                  type: 'spring',
                  bounce: 0,
                  duration: 1.2,
                }}
                className="border-border bg-background z-10 -ml-[12px] flex h-[60px] w-[60px] items-center justify-center rounded-lg border-[1.6px] opacity-80 shadow-sm"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                  >
                    <ActiveIcon className="text-muted-foreground h-[24px] w-[24px]" />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </div>
  );
};


filter-disclosure.tsx
'use client';

import { useState, type FC } from 'react';
import {
  motion,
  AnimatePresence,
  MotionConfig,
} from 'motion/react';
import { FaBell, FaTasks } from 'react-icons/fa';
import { IoCalendar } from 'react-icons/io5';
import { BsCheckLg, BsFillPeopleFill, BsPinFill } from 'react-icons/bs';
import { RiBubbleChartFill } from 'react-icons/ri';
import { PiFunnelSimpleBold } from 'react-icons/pi';
import type { IconType } from 'react-icons';

export interface FilterItem {
  id: string;
  label: string;
  icon: IconType;
}

interface FilterDisclosureProps {
  items?: FilterItem[];
  defaultActiveId?: string;
  onChange?: (id: string) => void;
}

const SPRING = {
  type: 'spring',
  stiffness: 240,
  damping: 20,
  mass: 1,
} as const;

const DEFAULT_ITEMS: FilterItem[] = [
  { id: 'tasks', label: 'Tasks', icon: FaTasks },
  { id: 'events', label: 'Events', icon: IoCalendar },
  { id: 'reminders', label: 'Reminders', icon: FaBell },
  { id: 'appointments', label: 'Appointment', icon: BsPinFill },
  { id: 'meetings', label: 'Mettings', icon: BsFillPeopleFill },
  { id: 'celebrations', label: 'Celebrations', icon: RiBubbleChartFill },
];

export const FilterDisclosure: FC<FilterDisclosureProps> = ({
  items = DEFAULT_ITEMS,
  defaultActiveId = 'reminders',
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(defaultActiveId);

  const activeItem = items.find((i) => i.id === active);
  const ActiveIcon = activeItem ? activeItem.icon : FaTasks;

  const handleSelect = (id: string) => {
    setActive(id);
    onChange?.(id);
    setTimeout(() => setOpen(false), 220);
  };

  return (
    <div className="flex h-[70px] w-[300px] items-center justify-center">
      <MotionConfig
        transition={{
          type: 'spring',
          bounce: 0.25,
          duration: 0.7,
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {open ? (
            <motion.div
              key="open"
              layoutId="filter-disclosure"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 0 },
              }}
              style={{ transformOrigin: '50% 100%', borderRadius: 32 }}
              className="absolute z-20 flex w-[300px] flex-col gap-[4px] overflow-hidden rounded-2xl border-[1.6px] border-[#E5E5E9] bg-[#FEFEFE] p-[8px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] will-change-transform dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              {items.map((item, index) => {
                const Icon = item.icon;
                const selected = active === item.id;

                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, scale: 1.1, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    onClick={() => handleSelect(item.id)}
                    whileTap={{ scale: 0.98 }}
                    transition={{ ...SPRING, delay: (3 + index) * 0.05 }}
                    className="flex w-full cursor-pointer items-center justify-between rounded-[16px] px-[12px] py-[10px] transition-colors hover:bg-[#F6F5FA] dark:hover:bg-neutral-800/60"
                  >
                    <div className="flex items-center gap-[28px]">
                      <Icon className="h-[24px] w-[24px] text-[#AFAEB9] dark:text-neutral-500" />
                      <span className="text-[18px] font-bold tracking-tight text-[#535257] dark:text-neutral-200">
                        {item.label}
                      </span>
                    </div>

                    <motion.div
                      animate={{
                        backgroundColor: selected ? '#31C051' : 'rgba(0,0,0,0)',
                      }}
                      className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-[3px] ${selected ? 'border-[#31C051]' : 'border-[#ADADB2] dark:border-neutral-700'} `}
                    >
                      <motion.div
                        animate={{
                          scale: selected ? 1 : 0,
                          opacity: selected ? 1 : 0,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 520,
                          damping: 30,
                        }}
                      >
                        <BsCheckLg className="h-[16px] w-[16px] text-white" />
                      </motion.div>
                    </motion.div>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <div key="close" className="flex items-center">
              <motion.button
                layoutId="filter-disclosure"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0 },
                }}
                onClick={() => setOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  borderRadius: 32,
                }}
                className="z-30 flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full border-[1.6px] border-[#E5E5E9] bg-[#FEFEFE] shadow-xs will-change-transform dark:border-neutral-800 dark:bg-neutral-900"
              >
                <PiFunnelSimpleBold className="h-[30px] w-[30px] text-[#272729] dark:text-neutral-100" />
              </motion.button>

              <motion.div
                initial={{ x: -30 }}
                animate={{ x: 0 }}
                transition={{
                  type: 'spring',
                  bounce: 0,
                  duration: 1.2,
                }}
                className="z-10 -ml-[12px] flex h-[60px] w-[60px] items-center justify-center rounded-full border-[1.6px] border-[#E5E5E9] bg-[#FEFEFE] opacity-80 shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                  >
                    <ActiveIcon className="h-[24px] w-[24px] text-[#AFAEB9] dark:text-neutral-500" />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </div>
  );
};
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's arguments and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Install external dependencies (see above)
 1. Copy paste all the code above in the correct directories
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them