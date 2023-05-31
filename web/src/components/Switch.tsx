import { FunctionComponent } from "react";

const Switch: FunctionComponent = () => {
  return (
    <div className="border-2 border-emerald-500 flex text-emerald-500">
      <div className="flex-1">
        <input
          className="peer sr-only"
          id="radio1"
          name="radioSwitch"
          type="radio"
        />
        <label
          className="cursor-pointer block py-1.5 text-center peer-checked:text-white relative z-10"
          htmlFor="radio1"
        >
          All
        </label>
      </div>

      <div className="flex-1 relative">
        <input
          className="peer sr-only"
          id="radio2"
          name="radioSwitch"
          type="radio"
        />
        <label
          className="cursor-pointer block py-1.5 text-center peer-checked:text-white relative z-10"
          htmlFor="radio2"
        >
          Favorites
        </label>
        <div
          className="absolute top-0 -left-full h-full w-full bg-emerald-500 transition-transform peer-checked:translate-x-full z-1"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default Switch;
