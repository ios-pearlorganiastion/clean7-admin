"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, RotateCcw, Search, Sparkles } from "lucide-react";
import { OrderList } from "@/features/orders/components/order-list";
import { useOrders } from "@/features/orders/api/order-api";
import { PageHeader } from "@/components/ui/page-header";
import { apiRequest } from "@/lib/browser-api";
import type { BranchAdminResponse, OrderResponse } from "@/lib/types";
import { slotCodes, orderStatuses, paymentStatuses } from "@/lib/constants";
import { humanizeToken } from "@/lib/format";

/** Statuses where pickup rider should be assigned but isn't. */
const PICKUP_UNASSIGNED_STATUSES = new Set([
  "CONFIRMED",
  "IN_PROGRESS",
]);

/** Status where delivery rider should be assigned (via trip). */
const DELIVERY_UNASSIGNED_STATUS = "READY_FOR_DELIVERY";

function orderLabel(order: OrderResponse) {
  return order.orderNumber || order.orderCode || "Order";
}

type QuickFilter =
  | ""
  | "pickup_unassigned"
  | "delivery_unassigned"
  | "booking_asap"
  | "booking_scheduled";

export default function OrdersPage() {
  const [branches, setBranches] = useState<BranchAdminResponse[]>([]);
  const [branchFilter, setBranchFilter] = useState("");
  const [bookingTypeFilter, setBookingTypeFilter] = useState("");
  const [slotFilter, setSlotFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("");

  const { data: orders = [], isLoading: loadingOrders, error: orderError } = useOrders({});

  useEffect(() => {
    let cancelled = false;
    async function loadBranches() {
      try {
        const nextBranches = await apiRequest<BranchAdminResponse[]>({
          path: "/admin/branches",
        });
        if (!cancelled) setBranches(nextBranches);
      } catch (e) {
        console.error("Failed to load branches", e);
      }
    }
    void loadBranches();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (branchFilter && order.branchId !== branchFilter) return false;
      if (bookingTypeFilter && order.bookingType !== bookingTypeFilter) return false;
      if (slotFilter && order.scheduledSlotCode !== slotFilter) return false;
      if (dateFilter && order.scheduledDate && !order.scheduledDate.startsWith(dateFilter)) return false;
      if (statusFilter && order.status !== statusFilter) return false;
      if (paymentStatusFilter && order.paymentStatus !== paymentStatusFilter) return false;

      // Quick filters
      if (quickFilter === "pickup_unassigned") {
        if (!PICKUP_UNASSIGNED_STATUSES.has(order.status)) return false;
        if (order.pickupRiderAuthUserId) return false;
      }
      if (quickFilter === "delivery_unassigned") {
        if (order.status !== DELIVERY_UNASSIGNED_STATUS) return false;
      }
      if (quickFilter === "booking_asap") {
        if (order.bookingType !== "ASAP") return false;
      }
      if (quickFilter === "booking_scheduled") {
        if (order.bookingType !== "SCHEDULED") return false;
      }

      if (!q) return true;
      return (
        orderLabel(order).toLowerCase().includes(q) ||
        (order.customerAuthUserId ? order.customerAuthUserId.toLowerCase().includes(q) : false) ||
        (order.contactSnapshot?.fullName ? order.contactSnapshot.fullName.toLowerCase().includes(q) : false) ||
        (order.serviceCategoryName ?? order.serviceCategoryCode ?? "").toLowerCase().includes(q)
      );
    });
  }, [
    orders,
    branchFilter,
    bookingTypeFilter,
    slotFilter,
    dateFilter,
    statusFilter,
    paymentStatusFilter,
    quickFilter,
    search,
  ]);

  const quickFilterOptions: Array<{ id: QuickFilter; label: string }> = [
    { id: "pickup_unassigned", label: "Needs Pickup Rider" },
    { id: "delivery_unassigned", label: "Needs Delivery Rider" },
    { id: "booking_asap", label: "⚡ 2-Hour Express" },
    { id: "booking_scheduled", label: "📅 Scheduled Slot" },
  ];

  const hasActiveFilters = Boolean(
    quickFilter ||
    branchFilter ||
    bookingTypeFilter ||
    slotFilter ||
    dateFilter ||
    statusFilter ||
    paymentStatusFilter ||
    search
  );

  const resetAllFilters = () => {
    setQuickFilter("");
    setBranchFilter("");
    setBookingTypeFilter("");
    setSlotFilter("");
    setDateFilter("");
    setStatusFilter("");
    setPaymentStatusFilter("");
    setSearch("");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16 text-slate-800">
      {/* ── Top Header Command Bar ── */}
      <div className="flex flex-col gap-4 border-b border-pink-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Orders Management Hub"
          description="Track live order status, filter by schedule & branch, and manage dispatch assignments."
        />

        {/* Live Counter Badge */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200/80 bg-pink-50/70 px-3.5 py-1.5 text-xs font-semibold text-pink-700 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-pink-500" />
            <span className="font-mono font-bold text-pink-600">
              {filteredOrders.length}
            </span>
            <span>{filteredOrders.length === 1 ? "Order Listed" : "Orders Listed"}</span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-pink-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-pink-700 shadow-xs transition hover:bg-pink-50/60 hover:border-pink-300"
            >
              <RotateCcw className="h-3 w-3 text-pink-500" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Filter Bar Card ── */}
      <div className="rounded-2xl border border-pink-100/90 bg-white p-5 shadow-[0_2px_12px_-4px_rgba(244,114,182,0.08)] space-y-4">
        {/* Row 1: Quick-Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-900/80">
            Quick Filter:
          </span>

          {quickFilterOptions.map(({ id, label }) => {
            const isActive = quickFilter === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setQuickFilter(isActive ? "" : id)}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-pink-500 text-white shadow-xs ring-2 ring-pink-300"
                    : "border border-pink-200/90 bg-white text-slate-600 hover:border-pink-300 hover:bg-pink-50/60 hover:text-pink-900"
                }`}
              >
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    isActive ? "bg-white" : "bg-pink-400"
                  }`}
                />
                <span>{label}</span>
              </button>
            );
          })}

          {quickFilter && (
            <button
              type="button"
              onClick={() => setQuickFilter("")}
              className="text-xs font-semibold text-pink-600 transition hover:text-pink-700 hover:underline"
            >
              Clear Quick
            </button>
          )}
        </div>

        {/* Row 2: Search & Detailed Dropdowns */}
        <div className="grid gap-3 border-t border-pink-100 pt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {/* Order Status */}
          <select
            className="cursor-pointer rounded-xl border border-pink-200/90 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-xs outline-none transition hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by order status"
          >
            <option value="">All Statuses</option>
            {orderStatuses.map((s) => (
              <option key={s} value={s}>
                {humanizeToken(s)}
              </option>
            ))}
          </select>

          {/* Payment Status */}
          <select
            className="cursor-pointer rounded-xl border border-pink-200/90 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-xs outline-none transition hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            aria-label="Filter by payment status"
          >
            <option value="">Payment Status</option>
            {paymentStatuses.map((s) => (
              <option key={s} value={s}>
                {humanizeToken(s)}
              </option>
            ))}
          </select>

          {/* Booking Type */}
          <select
            className="cursor-pointer rounded-xl border border-pink-200/90 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-xs outline-none transition hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
            value={bookingTypeFilter}
            onChange={(e) => setBookingTypeFilter(e.target.value)}
            aria-label="Filter by booking type"
          >
            <option value="">Booking Type</option>
            <option value="ASAP">⚡ 2-Hour Express</option>
            <option value="SCHEDULED">📅 Scheduled Slot</option>
          </select>

          {/* Branch */}
          <select
            className="cursor-pointer rounded-xl border border-pink-200/90 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-xs outline-none transition hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            aria-label="Filter by branch"
          >
            <option value="">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Time Slot */}
          <select
            className="cursor-pointer rounded-xl border border-pink-200/90 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-xs outline-none transition hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
            value={slotFilter}
            onChange={(e) => setSlotFilter(e.target.value)}
            aria-label="Filter by slot"
          >
            <option value="">Time Slot</option>
            {slotCodes.map((s) => (
              <option key={s} value={s}>
                {humanizeToken(s)}
              </option>
            ))}
          </select>

          {/* Date Picker */}
          <input
            type="date"
            className="cursor-pointer rounded-xl border border-pink-200/90 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-xs outline-none transition hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            onClick={(e) => {
              try {
                (e.target as HTMLInputElement).showPicker();
              } catch (err) {}
            }}
            aria-label="Filter by date"
          />
        </div>

        {/* Row 3: Search Bar */}
        <div className="relative pt-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 mt-0.5 h-4 w-4 -translate-y-1/2 text-pink-400" />
          <input
            className="w-full rounded-xl border border-pink-200/90 bg-white py-2 pl-10 pr-4 text-sm font-medium text-slate-800 shadow-xs outline-none transition placeholder:text-slate-400 hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer auth ID, contact name, or service category..."
          />
        </div>
      </div>

      {/* ── Error Banner ── */}
      {orderError && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-rose-800 shadow-xs">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          <p className="text-sm font-medium">
            {orderError instanceof Error ? orderError.message : "Failed to load orders"}
          </p>
        </div>
      )}

      {/* ── Orders Table / List ── */}
      <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-[0_2px_12px_-4px_rgba(244,114,182,0.06)]">
        <OrderList
          orders={filteredOrders}
          loading={loadingOrders}
          branches={branches}
          highlightUnassigned={
            quickFilter === "delivery_unassigned" || quickFilter === "pickup_unassigned"
          }
        />
      </div>
    </div>
  );
}