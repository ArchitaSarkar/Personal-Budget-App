import { DateRangeSelect, DateRangeType } from "@/components/date-range-select";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";

interface Props {
  title: string;
  subtitle: string;
  dateRange?: DateRangeType;
  setDateRange?: (range: DateRangeType) => void;
}

const DashboardHeader = ({ title, subtitle, dateRange, setDateRange }: Props) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-2 mb-4">
      <div className="space-y-1 min-w-0 max-w-full">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight truncate">{title}</h2>
        <p className="text-white/60 text-sm truncate">{subtitle}</p>
      </div>
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto justify-start sm:justify-end">
        <DateRangeSelect dateRange={dateRange || null} setDateRange={(range) => setDateRange?.(range)} />
        <AddTransactionDrawer />
      </div>
    </div>
  );
};

export default DashboardHeader;