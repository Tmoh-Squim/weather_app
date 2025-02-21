import { memo } from "react";
import { Shimmer } from "./LoadingShimmer";

export const ForecastItem = memo(
  function ForecastItem({ day, loading }: { day: any; loading: boolean }) {
    return (
      <div className="p-4 w-[145px] border border-gray-300 rounded-lg shadow-sm">
        <span className="block text-teal-600 tracking-wider font-semibold">
          {loading ? (
            <Shimmer width="60px" height="16px" />
          ) : (
            new Date(day.dt * 1000)
              .toLocaleDateString("en-US", {
                weekday: "short",
              })
              .toUpperCase()
          )}
        </span>
        <span className="block text-2xl text-black font-bold">
          {loading ? (
            <Shimmer width="40px" height="24px" />
          ) : (
            `${Math.round(day.main?.temp || 0)}°C`
          )}
        </span>
        <span className="block text-gray-500 capitalize">
          {loading ? (
            <Shimmer width="80px" height="16px" />
          ) : (
            day.weather?.[0]?.description
          )}
        </span>
      </div>
    );
  }
);
ForecastItem.displayName = "ForecastItem";
