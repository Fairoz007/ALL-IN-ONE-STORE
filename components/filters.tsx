"use client"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Filters({
  categories,
  activeId,
  onChange,
}: {
  categories: { id: string; name: string }[]
  activeId?: string
  onChange: (id?: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <motion.div whileHover={{ y: -2 }}>
        <Button variant={activeId ? "outline" : "default"} onClick={() => onChange(undefined)}>
          All
        </Button>
      </motion.div>
      {categories.map((c) => (
        <motion.div key={c.id} whileHover={{ y: -2 }}>
          <Button variant={activeId === c.id ? "default" : "outline"} onClick={() => onChange(c.id)}>
            {c.name}
          </Button>
        </motion.div>
      ))}
    </div>
  )
}
