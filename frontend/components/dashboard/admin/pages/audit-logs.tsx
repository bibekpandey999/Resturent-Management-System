"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, PageSection } from "../shared";
import { useActivityLogs } from "@/hooks/admin/log/getAllLogs";
import { TActivityLog } from "@/lib/types/log.types";

export default function AuditLogsPage() {

    const { data: logData } = useActivityLogs({});
    const logs = logData?.data ?? [];

  return (
    <div className="space-y-6">
      <DashboardHeader title="Audit Logs" description="Review recent account activity and system events." />
      <PageSection title="Activity Timeline">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log: TActivityLog) => (
              <TableRow key={log.id}>
                <TableCell>{formatDate(log.createdAt)}</TableCell>
                <TableCell>{log.user.name}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
