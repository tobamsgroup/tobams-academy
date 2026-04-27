import { ContinueLearningSection } from '@/components/dashboard/sections/ContinueLearningSection'
import { InsightsSection } from '@/components/dashboard/sections/InsightsSection'
import { EngagementBarChart } from '@/components/dashboard/charts/EngagementBarChart'

export default function DashboardHomePage() {
  return (
    <div className="">
      <ContinueLearningSection />
      <InsightsSection />
      <hr className='border-[#D3D2D366]' />
      <EngagementBarChart />
    </div>
  )
}
