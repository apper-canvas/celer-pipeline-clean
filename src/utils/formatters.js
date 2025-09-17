import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from "date-fns";

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value) => {
  return `${Math.round(value)}%`;
};

export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = typeof dateString === "string" ? parseISO(dateString) : dateString;
  
  if (isToday(date)) {
    return format(date, "h:mm a");
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else {
    return format(date, "MMM d");
  }
};

export const formatFullDate = (dateString) => {
  if (!dateString) return "";
  const date = typeof dateString === "string" ? parseISO(dateString) : dateString;
  return format(date, "MMM d, yyyy");
};

export const formatRelativeDate = (dateString) => {
  if (!dateString) return "";
  const date = typeof dateString === "string" ? parseISO(dateString) : dateString;
  return formatDistanceToNow(date, { addSuffix: true });
};

export const getStageColor = (stage) => {
  const colors = {
    "Lead": "border-l-warning",
    "Qualified": "border-l-info",
    "Proposal": "border-l-primary",
    "Closed Won": "border-l-success",
    "Closed Lost": "border-l-error"
  };
  return colors[stage] || "border-l-secondary";
};

export const getActivityIcon = (type) => {
  const icons = {
    "call": "Phone",
    "email": "Mail",
    "meeting": "Calendar",
    "note": "FileText",
    "task": "CheckSquare"
  };
  return icons[type] || "Activity";
};

export const getProbabilityColor = (probability) => {
  if (probability >= 80) return "text-success";
  if (probability >= 60) return "text-primary";
  if (probability >= 40) return "text-info";
  if (probability >= 20) return "text-warning";
  return "text-error";
};