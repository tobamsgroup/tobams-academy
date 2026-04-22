/** Simple bar chart (no extra deps). Peak month highlighted. */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const VALUES = [0.4, 0.55, 0.7, 0.85, 1, 0.75, 0.6, 0.5, 0.45, 0.55, 0.65, 0.5]
const PEAK_INDEX = 4

export function EngagementBarChart() {
  return (
    <div className="px-6 py-8 md:px-8 md:py-8">
      <div className="mb-[52px] flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-semibold text-heading ">Course Engagement This Year</h2>
          <p className="mt-1 text-[#474348]">
            Monthly activity across all your enrolled courses.
          </p>
        </div>
        <p className="max-w-[484px] rounded-[8px] bg-[#F1F1F4] p-[6px] text-xs text-[#474348]">
          You&apos;ve had the highest engagement in May — keep building on that momentum.
        </p>
      </div>

      <div className="flex h-auto md:h-[288px] items-end gap-1 sm:gap-2">
        {MONTHS.map((m, i) => {
          const h = VALUES[i] ?? 0.3
          const isPeak = i === PEAK_INDEX
          return (
            <div key={m} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex h-[180px] w-full items-end justify-center">
                <div
                  className={`w-full max-w-[28px] rounded-t-md ${isPeak ? '' : 'bg-[#CCDBEB]'}`}
                  style={
                    isPeak
                      ? {
                          height: '100%',
                          background: 'linear-gradient(90deg, #004D99 0%, #003B75 100%)',
                        }
                      : { height: `${h * 100}%` }
                  }
                  title={`${m}`}
                />
              </div>
              <span className="text-[10px] text-[#696969] sm:text-xs">{m}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between border-t border-[#E5E7EB] pt-2 text-xs text-[#696969]">
        <span>0</span>
        <span>2k</span>
      </div>
    </div>
  )
}
