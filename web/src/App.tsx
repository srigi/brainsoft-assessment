import { Client, Provider, cacheExchange, fetchExchange } from "urql";

import PokemonsListing from "./components/PokemonsListing";
import SearchField from "./components/SearchField";
import Switch from "./components/Switch";
import { ReactComponent as ListIcon } from "./assets/list.svg";
import { ReactComponent as GridIcon } from "./assets/grid.svg";

const client = new Client({
  exchanges: [cacheExchange, fetchExchange],
  url: `${process.env.API_BASE_URL}/graphql`,
});

function App() {
  return (
    <Provider value={client}>
      <div className="container flex flex-col gap-4 py-8">
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

        <PokemonsListing />
      </div>
    </Provider>
  );
}

export default App;
