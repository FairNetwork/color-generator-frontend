"use client"

import { Button } from "@/components/ui/button"
import { ALL_COLOR_TYPES, type ColorType } from "@/lib/color-generator"

interface ColorTypeSelectorProps {
  value: ColorType[]
  onChange: (types: ColorType[]) => void
}

const colorTypes: { value: ColorType; label: string }[] = [
  { value: "pastel", label: "Pastel" },
  { value: "vibrant", label: "Vibrant" },
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "neon", label: "Neon" },
  { value: "earth", label: "Earthy" },
  { value: "muted", label: "Muted" },
  { value: "warm", label: "Warm" },
  { value: "cool", label: "Cool" },
  { value: "monochrome", label: "Monochrome" },
]

export const ColorTypeSelector = ({
  value,
  onChange,
}: ColorTypeSelectorProps) => {
  const isAllSelected = value.length === ALL_COLOR_TYPES.length

  const toggleType = (type: ColorType) => {
    if (isAllSelected) {
      onChange([type])
      return
    }

    const isSelected = value.includes(type)
    const nextTypes = isSelected
      ? value.filter((t) => t !== type)
      : [...value, type]

    if (nextTypes.length === 0) {
      onChange([...ALL_COLOR_TYPES])
      return
    }

    if (nextTypes.length === ALL_COLOR_TYPES.length) {
      onChange([...ALL_COLOR_TYPES])
      return
    }

    const orderedTypes = ALL_COLOR_TYPES.filter((availableType) =>
      nextTypes.includes(availableType),
    )
    onChange(orderedTypes)
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant={isAllSelected ? "default" : "outline"}
        onClick={() => onChange([...ALL_COLOR_TYPES])}
        className="font-medium"
      >
        All
      </Button>
      {colorTypes.map((type) => (
        <Button
          key={type.value}
          variant={
            !isAllSelected && value.includes(type.value) ? "default" : "outline"
          }
          onClick={() => toggleType(type.value)}
          className="font-medium"
        >
          {type.label}
        </Button>
      ))}
    </div>
  )
}
