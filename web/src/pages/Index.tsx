import { FunctionComponent, useState } from "react";

import { NexusGenArgTypes } from "api/src/nexus";
import PokemonsListing from "../components/PokemonsListing";
import TextInputAffirm from "../components/TextInputAffirm";
import Switch from "../components/Switch";
import { ReactComponent as ListIcon } from "../assets/list.svg";
import { ReactComponent as GridIcon } from "../assets/grid.svg";

const IndexPage: FunctionComponent = () => {
  const [queryPages, setQueryPage] = useState<
    Array<NexusGenArgTypes["Query"]["pokemons"]>
  >([{ cursor: null }]);

  return (
    <div className="container flex flex-col gap-4 py-8">
      <Switch />

      <div className="flex gap-4">
        <div className="flex-1">
          <TextInputAffirm
            onAffirm={(value) => {
              setQueryPage([{ cursor: null, findByName: value }]);
            }}
          />
        </div>
        <button className="text-emerald-500">
          <ListIcon className="h-8 w-8" />
        </button>
        <button className="text-emerald-500 opacity-20">
          <GridIcon className="h-10 w-10" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {queryPages.map((qp, idx) => (
          <PokemonsListing
            key={qp.cursor}
            isLastPage={idx === queryPages.length - 1}
            variables={qp}
            loadMore={(cursor) => {
              setQueryPage([...queryPages, { cursor }]);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default IndexPage;
