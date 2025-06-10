import { ExternalLink } from "lucide-react"
import type { Reference } from "@/lib/content"

interface ReferencesSectionProps {
  references: Reference[]
}

export default function ReferencesSection({ references }: ReferencesSectionProps) {
  return (
    <div className="space-y-8">
      {references.map((reference) => (
        <div key={reference.id} className="reference-item bg-slate-800/50 rounded-lg p-6">
          <div className="flex flex-col mb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-slate-200">{reference.name}</h3>
              <a
                href={reference.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 flex items-center text-sm"
                aria-label={`${reference.name}'s LinkedIn profile`}
              >
                LinkedIn <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
            <div className="text-slate-400 text-sm mt-1">{reference.title}</div>
            <div className="text-slate-500 text-xs mt-1">
              {reference.date}, {reference.relationship}
            </div>
          </div>

          <div
            className="reference-content text-slate-300 prose prose-sm prose-slate prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: reference.content }}
          />
        </div>
      ))}

      <div className="mt-8 text-center">
        <a
          href="https://neurallink.quantum/professional-network/zara-quantum"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          See all references <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </div>
    </div>
  )
}
