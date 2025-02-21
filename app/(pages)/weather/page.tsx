"use client";

import Loader from "@/app/components/Loader";
import WeatherComponent from "@/app/components/WeatherComponent";
import { Suspense } from "react";

export default function WeatherWrapper() {
  return (
    <Suspense fallback={<Loader />}>
      <WeatherComponent />
    </Suspense>
  );
}
