'use client'

import { useState } from 'react'

type Item = {
  title: string
  content: string
  html?: boolean
  defaultOpen?: boolean
}

type Props = {
  items: Item[]
}

function AccordionItem({ title, content, html, defaultOpen }: Item) {
  const [open, setOpen] = useState(defaultOpen ?? false)

  return (
    <div className="border-t border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left cursor-pointer"
        aria-expanded={open}
      >
        <span className="text-[16px] text-foreground">{title}</span>
        <span className="text-muted-foreground text-[18px] leading-none transition-transform duration-200 shrink-0 ml-4" style={{ transform: open ? 'rotate(45deg)' : 'none' }}>
          +
        </span>
      </button>
      {open && (
        <div className="pb-5">
          {html ? (
            <div
              className="text-[14px] text-muted-foreground leading-relaxed [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_p]:mb-2"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-[14px] text-muted-foreground leading-relaxed">{content}</p>
          )}
        </div>
      )}
    </div>
  )
}

export function ProductAccordion({ items }: Props) {
  return (
    <div className="mt-8">
      {items.map((item) => (
        <AccordionItem key={item.title} {...item} />
      ))}
    </div>
  )
}
