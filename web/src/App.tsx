import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  Client,
  Provider as UrqlProvider,
  cacheExchange,
  fetchExchange,
} from "urql";

import IndexPage from "./pages/Index";
import PokemonDetailPage from "./pages/PokemonDetailPage";

const client = new Client({
  exchanges: [cacheExchange, fetchExchange],
  url: `${process.env.API_BASE_URL}/graphql`,
});
const router = createBrowserRouter([
  {
    path: "/pokemon/:id",
    element: <PokemonDetailPage />,
  },
  {
    path: "/",
    element: <IndexPage />,
  },
]);

function App() {
  return (
    <UrqlProvider value={client}>
      <RouterProvider router={router} />
    </UrqlProvider>
  );
}

export default App;
