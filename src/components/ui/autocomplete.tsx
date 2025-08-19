import * as React from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AutocompleteOption {
  value: string
  label: string
  group?: string
}

interface AutocompleteProps {
  value?: string
  onValueChange?: (value: string) => void
  options: AutocompleteOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
  onSearch?: (search: string) => void
}

export function Autocomplete({
  value,
  onValueChange,
  options,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  className,
  disabled,
  onSearch
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  const handleSearch = React.useCallback((search: string) => {
    setSearchValue(search)
    if (onSearch) {
      onSearch(search)
    }
  }, [onSearch])

  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options
    return options.filter(option =>
      option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
      option.value.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [options, searchValue])

  const groupedOptions = React.useMemo(() => {
    const grouped: { [key: string]: AutocompleteOption[] } = {}
    filteredOptions.forEach(option => {
      const group = option.group || 'Options'
      if (!grouped[group]) {
        grouped[group] = []
      }
      grouped[group].push(option)
    })
    return grouped
  }, [filteredOptions])

  const selectedOption = options.find(option => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={handleSearch}
          />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandList className="max-h-[200px] overflow-auto">
            {Object.entries(groupedOptions).map(([group, groupOptions]) => (
              <CommandGroup key={group} heading={group}>
                {groupOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      const newValue = currentValue === value ? "" : currentValue
                      onValueChange?.(newValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}