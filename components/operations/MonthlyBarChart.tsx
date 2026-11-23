import type { MonthlyChartPoint } from "@/lib/data/operations-dashboard";

type MonthlyBarChartProps = {
  data: MonthlyChartPoint[];
  yAxisLabel?: string;
  xAxisLabel?: string;
};

/**
 * CSS bar chart with a definite plot height.
 * Labels sit outside the plot so percentage bar heights resolve correctly
 * (percentage heights collapse inside flex containers that use items-end).
 */
export function MonthlyBarChart({
  data,
  yAxisLabel = "Order volume",
  xAxisLabel = "Months of the year",
}: MonthlyBarChartProps) {
  const maxValue = Math.max(...data.map((point) => point.value), 1);
  const tickValues = [0, 0.25, 0.5, 0.75, 1].map((ratio) =>
    Math.round(maxValue * ratio),
  );
  const yTicks = [...tickValues].reverse();

  return (
    <div className="mt-3 min-w-0">
      <div className="flex min-w-0 gap-2 sm:gap-3">
        <div
          className="flex h-40 w-9 shrink-0 flex-col justify-between pt-0.5 text-right sm:h-44 sm:w-10"
          aria-hidden="true"
        >
          {yTicks.map((tick) => (
            <span
              key={tick}
              className="font-outfit text-[10px] leading-none text-midnight-party/40 sm:text-[11px]"
            >
              {tick}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="relative h-40 sm:h-44"
            role="img"
            aria-label={`${yAxisLabel} by month from ${data[0]?.month ?? ""} to ${data.at(-1)?.month ?? ""}`}
          >
            <div
              className="pointer-events-none absolute inset-0 flex flex-col justify-between"
              aria-hidden="true"
            >
              {yTicks.map((tick) => (
                <div
                  key={tick}
                  className="border-t border-dashed border-black/8"
                />
              ))}
            </div>

            <div className="absolute inset-0 flex items-stretch gap-1.5 sm:gap-2.5">
              {data.map((point) => {
                const heightPct = Math.max((point.value / maxValue) * 100, 3);
                return (
                  <div
                    key={point.month}
                    className="flex min-w-0 flex-1 items-end justify-center"
                  >
                    <div
                      className="w-full max-w-[36px] rounded-t-md bg-blue-lagoon sm:max-w-[42px]"
                      style={{ height: `${heightPct}%` }}
                      title={`${point.month}: ${point.value}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-2 flex gap-1.5 sm:gap-2.5">
            {data.map((point) => (
              <div
                key={point.month}
                className="min-w-0 flex-1 text-center font-outfit text-[10px] text-midnight-party/55 sm:text-[11px]"
              >
                {point.month}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-3 px-0.5">
        <p className="font-outfit text-[11px] text-midnight-party/45">
          {yAxisLabel}
        </p>
        <p className="font-outfit text-[11px] text-midnight-party/45">
          {xAxisLabel}
        </p>
      </div>
    </div>
  );
}
