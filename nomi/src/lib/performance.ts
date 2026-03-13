import {
  onCLS,
  onFCP,
  onINP,
  onLCP,
  onTTFB,
  type Metric,
} from "web-vitals";
import { logEvent } from "../utils/logger";
import { isMonitoringEnabled } from "./env";

function reportMetric(metric: Metric) {
  if (!isMonitoringEnabled()) {
    return;
  }

  logEvent("web-vital", {
    id: metric.id,
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    navigationType: metric.navigationType,
  });
}

export function initPerformanceMonitoring() {
  onCLS(reportMetric);
  onFCP(reportMetric);
  onINP(reportMetric);
  onLCP(reportMetric);
  onTTFB(reportMetric);
}
