import { PlusIcon } from '@heroicons/react/24/outline';
import { useState, type ComponentPropsWithoutRef } from 'react';
import { cn } from '#app/utils/misc.tsx';
import { Button } from './ui/button.tsx';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command.tsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog.tsx';
import { Input } from './ui/input.tsx';
import { Label } from './ui/label.tsx';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.tsx';

// type GroupSection = {};

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface GroupSectionSwitcherProps extends PopoverTriggerProps { };

export default function GroupSectionSwitcher({ className }: GroupSectionSwitcherProps) {
  const [ open, setOpen ] = useState(false);
  const [ showNewSectionDialog, setShowNewSectionDialog ] = useState(false);
  // const [ selectedSection, setSelectedSection ] = useState<GroupSection>();

  return (
    <Dialog open={showNewSectionDialog} onOpenChange={setShowNewSectionDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role='combobox'
            aria-expanded={open}
            aria-label='Select a section'
            className={cn("w-[200px] justify-between", className)}
          >
            <span className="text-left hidden md:block">Select a section</span>
            <span className="text-right">▼</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder='Search sections...' />
              <CommandEmpty>No section found</CommandEmpty>
              {/* list sections and groups in <CommandGroup> and <CommandItem> */}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewSectionDialog(true);
                    }}
                  >
                    <PlusIcon className='mr-2 h-5 w-5' />
                    Create Section
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new section</DialogTitle>
          <DialogDescription>
            Add a new section to your group.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Section name</Label>
              <Input id="name" placeholder="Scouts" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="font-medium">Free</span> -{" "}
                    <span className="text-muted-foreground">
                      Trial for two weeks
                    </span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="font-medium">Pro</span> -{" "}
                    <span className="text-muted-foreground">
                      $9/month per user
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewSectionDialog(false)}>
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}