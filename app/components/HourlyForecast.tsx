import { memo } from "react";
import { Shimmer } from "./LoadingShimmer";

export const HourlyForecastItem = memo(
    ({ hour, loading }: { hour: any; loading: boolean }) => (
      <div className="p-2 w-[145px] border border-gray-300 rounded-lg shadow-sm text-center">
        <span className="block text-black font-semibold">
          {loading ? (
            <Shimmer width="50px" height="16px" />
          ) : (
            new Date(hour.dt * 1000).toLocaleTimeString("en-US", {
              hour: "numeric",
              hour12: true,
            })
          )}
        </span>
        <span className="block text-lg font-bold text-gray-400">
          {loading ? (
            <Shimmer width="40px" height="20px" />
          ) : (
            `${Math.round(hour.main?.temp || 0)}°`
          )}
          <span className="text-sm">C</span>
        </span>
        <span className="block text-gray-500 capitalize">
          {loading ? (
            <Shimmer width="80px" height="16px" />
          ) : (
            hour.weather?.[0]?.main
          )}
        </span>
      </div>
    )
  );