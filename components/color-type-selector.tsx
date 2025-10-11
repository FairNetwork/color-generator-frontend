"use client"

import { Button } from "@/components/ui/button"
import type { ColorType } from "@/lib/color-generator"

interface ColorTypeSelectorProps {
  value: ColorType
  onChange: (type: ColorType) => void
}

const colorTypes: { value: ColorType; label: string }[] = [
  { value: "pastel", label: "Pastell" },
  { value: "vibrant", label: "Lebendig" },
  { value: "dark", label: "Dunkel" },
  { value: "light", label: "Hell" },
  { value: "neon", label: "Neon" },
  { value: "earth", label: "Erdtöne" },
]

export function ColorTypeSelector({ value, onChange }: ColorTypeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {colorTypes.map((type) => (
        <Button
          key={type.value}
          variant={value === type.value ? "default" : "outline"}
          onClick={() => onChange(type.value)}
          className="font-medium"
        >
          {type.label}
        </Button>
      ))}
    </div>
  )
}
