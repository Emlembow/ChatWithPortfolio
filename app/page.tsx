import { getProfileInfo, getAboutContent, getExperiences, getReferences, getEducation } from "@/lib/content"
import ClientPortfolio from "@/components/ClientPortfolio"

export default async function Portfolio() {
  // Fetch all content
  const profile = await getProfileInfo()
  const about = await getAboutContent()
  const experiences = await getExperiences()
  const references = await getReferences()
  const education = await getEducation()

  // Pass the data to the client component
  return (
    <ClientPortfolio
      profile={profile}
      about={about}
      experiences={experiences}
      references={references}
      education={education}
    />
  )
}
