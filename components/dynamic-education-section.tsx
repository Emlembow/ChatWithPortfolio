import type { Education } from "@/lib/content"

interface EducationSectionProps {
  education: Education
}

export default function DynamicEducationSection({ education }: EducationSectionProps) {
  return (
    <div className="space-y-6">
      {education.sections.map((section, index) => (
        <div key={index} className="education-item bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-slate-200 mb-4">{section.title}</h3>
          <div
            className="education-content text-slate-300 prose prose-sm prose-slate prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      ))}
    </div>
  )
}
