"use client";
import { useEffect } from "react";
export default function PluginInit() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }
  }, []);
  return <></>;
}
