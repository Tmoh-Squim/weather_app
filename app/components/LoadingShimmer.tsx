export const Shimmer = ({ width, height }: { width: string; height: string }) => (
  <div className={`bg-gray-300 animate-pulse rounded`} style={{ width, height }}></div>
);
