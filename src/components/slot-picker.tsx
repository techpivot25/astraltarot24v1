import { useMemo, useState } from "react";
import { format, isBefore, startOfDay, isSunday, isToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const SLOTS = ["11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

function slotHour(slot: string) {
  const [t, ap] = slot.split(" ");
  let h = Number((t ?? "0").split(":")[0]);
  if (ap === "PM" && h !== 12) h += 12;
  return h;
}

export function formatSlot(date: Date, slot: string) {
  return `${format(date, "EEE, d MMM yyyy")} · ${slot} IST`;
}

export function SlotPicker({ date, slot, onChange }: { date: Date | undefined; slot: string | undefined; onChange: (date: Date | undefined, slot: string | undefined) => void }) {
  const [month, setMonth] = useState<Date>(date ?? new Date());
  const today = useMemo(() => startOfDay(new Date()), []);
  const nowHour = new Date().getHours();

  return (
    <div className="grid gap-4 rounded-lg border border-border bg-card/60 p-4 sm:grid-cols-[auto_1fr]">
      <Calendar
        mode="single"
        selected={date}
        month={month}
        onMonthChange={setMonth}
        onSelect={(d) => onChange(d, undefined)}
        disabled={(d) => isBefore(d, today) || isSunday(d)}
        className="pointer-events-auto p-0"
      />
      <div>
        <p className="eyebrow text-[0.72rem]">{date ? format(date, "EEEE, d MMMM") : "Pick a date first"}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {SLOTS.map((s) => {
            const past = !!date && isToday(date) && slotHour(s) <= nowHour;
            const active = slot === s;
            return (
              <button
                type="button"
                key={s}
                disabled={!date || past}
                onClick={() => onChange(date, s)}
                className={cn(
                  "rounded-md border px-3 py-2 text-sm transition",
                  active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/60 hover:bg-primary/10",
                  (!date || past) && "cursor-not-allowed opacity-40 hover:bg-transparent",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Mon–Sat · 60-minute slots · Indian Standard Time</p>
      </div>
    </div>
  );
}
