type DatePickerProps = {
  selectedDate: string;
  onDateChange: (date: string) => void;
};

const DatePicker = ({ selectedDate, onDateChange }: DatePickerProps) => {
  return (
    <div className="flex flex-col items-center p-4">
      <label
        htmlFor="date-picker"
        className="mb-2 font-bold text-center text-lg text-gray-700"
      >
        Select Date:
      </label>
      <input
        id="date-picker"
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="p-2 border rounded w-52 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default DatePicker;
