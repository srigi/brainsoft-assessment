import { FunctionComponent, useState } from "react";

import { ReactComponent as ArrowRightCircle } from "../assets/arrow-right-circle.svg";

interface Props {
  initialValue?: string;
  onAffirm: (value: string) => void;
}

const TextInputAffirm: FunctionComponent<Props> = ({
  initialValue,
  onAffirm,
}) => {
  const [value, setValue] = useState(initialValue || "");

  return (
    <div className="relative">
      <input
        className="bg-emerald-50 border-0 placeholder:text-gray-400 outline-none pl-4 pr-10 py-2 w-full ring-1 ring-inset ring-emerald-200 focus:ring-2 focus:ring-emerald-400"
        onChange={(ev) => setValue(ev.target.value)}
        onKeyDown={(ev) => {
          if (ev.key === "Enter") onAffirm(value);
        }}
        placeholder="search by name"
        type="text"
        value={value}
      />
      {value.length !== 0 && (
        <button
          onClick={(ev) => {
            ev.preventDefault();
            onAffirm(value);
          }}
        >
          <ArrowRightCircle className="absolute right-2 top-[calc(50%-14px)] text-emerald-400 w-7 h-7" />
        </button>
      )}
    </div>
  );
};

export default TextInputAffirm;
