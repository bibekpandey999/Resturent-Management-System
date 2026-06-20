"use client";

import { activityLogApi } from "@/lib/api/log.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useActivityLogs({
  page = 1,
  limit,
  module,
  userId,
}: UsePaginationParams & {
  module?: string;
  userId?: string;
}) {
  return useQuery({
    queryKey: ["activity-logs", page, limit, module, userId],
    queryFn: () =>
      activityLogApi.getActivityLogsApi({
        page,
        limit,
        module,
        userId,
      }),
  });
}
