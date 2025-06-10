import type { Education } from "@/lib/content"

interface EducationSectionProps {
  education: Education
}

export default function EducationSection({ education }: EducationSectionProps) {
  return (
    <div className="space-y-6">
      {/* Education Card */}
      <div className="education-item bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-slate-200 mb-4">Education</h3>
        <div className="education-content text-slate-300 prose prose-sm prose-slate prose-invert max-w-none">
          <p>
            <strong>Bachelor of Science, Management Information Systems</strong> — Rochester Institute of Technology
          </p>
          <p>Supervised Machine Learning, Stanford Online / DeepLearning.AI (2024)</p>
        </div>
      </div>

      {/* Certifications Card */}
      <div className="education-item bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-slate-200 mb-4">Certifications</h3>
        <div className="education-content text-slate-300 prose prose-sm prose-slate prose-invert max-w-none">
          <ul>
            <li>Advanced Certified Scrum Master (A-CSM)</li>
            <li>Advanced Certified Scrum Product Owner (A-CSPO)</li>
            <li>Certified Scrum Master (CSM)</li>
            <li>Certified Scrum Product Owner (CSPO)</li>
            <li>Certified Professional — Agile Testing & Test Automation (ICAgile)</li>
            <li>ITIL Foundation</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
