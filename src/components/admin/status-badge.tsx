import { Badge } from "@/components/ui/badge";
import type { AppointmentStatus, EnquiryStatus } from "@/types/database";

const APPOINTMENT_MAP: Record<
  AppointmentStatus,
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  pending: { label: "Pending", variant: "warning" },
  confirmed: { label: "Confirmed", variant: "accent" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "danger" },
  no_show: { label: "No show", variant: "muted" },
};

const ENQUIRY_MAP: Record<
  EnquiryStatus,
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  new: { label: "New", variant: "warning" },
  in_progress: { label: "In progress", variant: "accent" },
  resolved: { label: "Resolved", variant: "success" },
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const config = APPOINTMENT_MAP[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function EnquiryStatusBadge({ status }: { status: EnquiryStatus }) {
  const config = ENQUIRY_MAP[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function PublishedBadge({ published }: { published: boolean }) {
  return (
    <Badge variant={published ? "success" : "muted"}>
      {published ? "Published" : "Hidden"}
    </Badge>
  );
}
