import { FunctionComponent } from "react";

import { ReactComponent as ArrowRightCircle } from "../assets/arrow-right-circle.svg";

const SearchField: FunctionComponent = () => {
  return (
    <div className="relative">
      <input
        className="bg-emerald-50 border-0 placeholder:text-gray-400 outline-none pl-4 pr-10 py-2 w-full ring-1 ring-inset ring-emerald-200 focus:ring-2 focus:ring-emerald-400"
        placeholder="search by name"
        type="text"
      />
      <ArrowRightCircle className="absolute right-2 top-[calc(50%-14px)] text-emerald-400 w-7 h-7" />
    </div>
  );
};

export default SearchField;
