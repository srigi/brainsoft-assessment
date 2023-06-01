import clsx from "clsx";
import { FunctionComponent, useState } from "react";

interface Props {
  values: Array<string>;
  initialValue: string;
  onChange: (value: string) => void;
}

const Switch: FunctionComponent<Props> = ({
  values,
  initialValue,
  onChange,
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="border-2 border-emerald-500 flex text-emerald-500">
      {values.map((v, idx) => (
        <div
          className={clsx("flex-1", idx === values.length - 1 && "relative")}
          key={v}
        >
          <input
            className="peer sr-only"
            id={`radio-${idx}`}
            name="radioSwitch"
            type="radio"
            value={v}
            checked={v === value}
            onChange={() => {
              setValue(v);
              onChange(v);
            }}
          />
          <label
            className="cursor-pointer block py-1.5 text-center peer-checked:text-white relative z-10"
            htmlFor={`radio-${idx}`}
          >
            {v}
          </label>
          {idx === values.length - 1 && (
            <div
              className="absolute top-0 -left-full h-full w-full bg-emerald-500 transition-transform peer-checked:translate-x-full z-1"
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Switch;
