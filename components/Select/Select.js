import classNames from 'classnames';

export default function Select({ label, options, onChange, value, className }) {
  return (
    <div>
      <label
        htmlFor="location"
        className="block text-sm font-medium text-white"
      >
        {label}
      </label>
      <select
        id="location"
        name="location"
        className={classNames(
          'mt-1 block w-full border-gray-300 rounded-full bg-gray-800 py-3 pl-3 pr-20 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm',
          className
        )}
        onChange={(event) => onChange(event)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.label}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}
