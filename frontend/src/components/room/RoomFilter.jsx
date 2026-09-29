const ROOM_TYPES = ["Single", "Double", "Deluxe", "Suite", "Family"];

const RoomFilter = ({ filters, onChange }) => {
  const handleFieldChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  const handleClear = () => {
    onChange({});
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-5 mb-6 flex flex-wrap gap-4 items-end">
      <div>
        <label className="block text-slate-400 text-xs mb-1">Check-in</label>
        <input
          type="date"
          value={filters.checkIn || ""}
          onChange={(e) => handleFieldChange("checkIn", e.target.value)}
          className="bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-slate-400 text-xs mb-1">Check-out</label>
        <input
          type="date"
          value={filters.checkOut || ""}
          onChange={(e) => handleFieldChange("checkOut", e.target.value)}
          className="bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-slate-400 text-xs mb-1">Room type</label>
        <select
          value={filters.roomType || ""}
          onChange={(e) => handleFieldChange("roomType", e.target.value)}
          className="bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All types</option>
          {ROOM_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-slate-400 text-xs mb-1">Min price</label>
        <input
          type="number"
          min="0"
          value={filters.minPrice || ""}
          onChange={(e) => handleFieldChange("minPrice", e.target.value)}
          placeholder={"\u20B9"}
          className="bg-slate-700 text-white rounded-lg px-3 py-2 w-28 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-slate-400 text-xs mb-1">Max price</label>
        <input
          type="number"
          min="0"
          value={filters.maxPrice || ""}
          onChange={(e) => handleFieldChange("maxPrice", e.target.value)}
          placeholder={"\u20B9"}
          className="bg-slate-700 text-white rounded-lg px-3 py-2 w-28 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-slate-400 text-xs mb-1">Guests</label>
        <input
          type="number"
          min="1"
          value={filters.capacity || ""}
          onChange={(e) => handleFieldChange("capacity", e.target.value)}
          placeholder="Any"
          className="bg-slate-700 text-white rounded-lg px-3 py-2 w-24 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleClear}
        className="text-slate-400 hover:text-white text-sm underline px-2 py-2"
      >
        Clear filters
      </button>
    </div>
  );
};

export default RoomFilter;