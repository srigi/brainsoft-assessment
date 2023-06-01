import clsx from "clsx";
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
  const [listingVariant, setListingVariant] = useState<"grid" | "list">("grid");

  return (
    <div className="container flex flex-col gap-4 py-8">
      <Switch
        values={["All", "Favorites"]}
        initialValue="All"
        onChange={(value) => {
          setQueryPage([
            {
              cursor: null,
              isFavourited: value === "Favorites" ? true : undefined,
              findByName: queryPages[0].findByName,
            },
          ]);
        }}
      />

      <div className="flex gap-4">
        <div className="flex-1">
          <TextInputAffirm
            onAffirm={(value) => {
              setQueryPage([
                {
                  cursor: null,
                  findByName: value,
                  isFavourited: queryPages[0].isFavourited,
                },
              ]);
            }}
          />
        </div>
        <button
          className={clsx(
            "text-emerald-500",
            listingVariant !== "list" && "opacity-20"
          )}
          onClick={(ev) => {
            ev.preventDefault();
            setListingVariant("list");
          }}
        >
          <ListIcon className="h-8 w-8" />
        </button>
        <button
          className={clsx(
            "text-emerald-500",
            listingVariant !== "grid" && "opacity-20"
          )}
          onClick={(ev) => {
            ev.preventDefault();
            setListingVariant("grid");
          }}
        >
          <GridIcon className="h-10 w-10" />
        </button>
      </div>

      <div
        className={clsx({
          "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4":
            listingVariant === "grid",
          "flex flex-col gap-4": listingVariant === "list",
        })}
      >
        {queryPages.map((qp, idx) => (
          <PokemonsListing
            key={qp.cursor}
            isLastPage={idx === queryPages.length - 1}
            variables={qp}
            variant={listingVariant}
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
