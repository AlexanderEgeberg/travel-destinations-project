import { fetchTravels } from "./api";
import "./App.css";
import TravelCard from "./components/TravelCard";
import useFetch from "./hooks/usefetch";

function App() {
  const { data, refresh, error: _error, loading } = useFetch(fetchTravels);
  console.log("data", data);
  return (
    <>
      {data?.data.map((TravelDestination) => (
        <TravelCard {...TravelDestination} key={TravelDestination.id} />
      ))}
    </>
  );
}

export default App;
