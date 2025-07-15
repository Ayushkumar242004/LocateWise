"use client"

import { useState } from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
}

export function MultiSelect({ options, selected, onChange, placeholder }: MultiSelectProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const handleRemove = (value: string) => {
    onChange(selected.filter((item) => item !== value))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white/80 border-slate-300 hover:bg-white/90 min-h-[44px] shadow-sm"
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selected.length === 0 ? (
              <span className="text-slate-500">{placeholder}</span>
            ) : (
              selected.slice(0, 2).map((value) => {
                const option = options.find((opt) => opt.value === value)
                return (
                  <Badge
                    key={value}
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200"
                  >
                    {option?.label}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer hover:text-blue-900"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(value)
                      }}
                    />
                  </Badge>
                )
              })
            )}
            {selected.length > 2 && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 border border-slate-200">
                +{selected.length - 2} more
              </Badge>
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 shadow-xl border-2">
        <Command>
          <CommandInput placeholder="Search regions..." />
          <CommandList>
            <CommandEmpty>No regions found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="cursor-pointer hover:bg-blue-50"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${selected.includes(option.value) ? "opacity-100 text-blue-600" : "opacity-0"}`}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
