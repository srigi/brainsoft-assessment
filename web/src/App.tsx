import SearchField from "./components/SearchField";
import Switch from "./components/Switch";

import { ReactComponent as ListIcon } from "./assets/list.svg";
import { ReactComponent as GridIcon } from "./assets/grid.svg";

function App() {
  return (
    <div className="container flex flex-col gap-4">
      <Switch />

      <div className="flex gap-4">
        <div className="flex-1">
          <SearchField />
        </div>

        <button className="text-emerald-500">
          <ListIcon className="h-8 w-8" />
        </button>
        <button className="text-emerald-500 opacity-20">
          <GridIcon className="h-10 w-10" />
        </button>
      </div>

      <div className="grid">
        <div className="">
          <img src="" alt="" />
          <div className="">
            <div>
              <h4>pokemon.name</h4>
              <h4>pokemon.type(s)</h4>
            </div>
            <button>favorite</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
