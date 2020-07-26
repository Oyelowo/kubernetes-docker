import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";

interface Data {
  seenIndexes: { number: number }[];
  values: Record<string, number>;
  index: string;
}

const Fib = () => {
  const [state, setState] = useState<Data>({
    seenIndexes: [],
    values: {},
    index: "",
  });

  const fetchValues = async () => {
    const values = await axios.get("/api/values/current");
    setState((prevState) => ({ ...prevState, values: values.data }));
  };

  const fetchIndexes = async () => {
    const seenIndexes = await axios.get("/api/values/all");
    setState((prevState) => ({ ...prevState, seenIndexes: seenIndexes.data }));
  };

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  const renderSeenIndexes = () => {
    return state.seenIndexes.map(({ number }) => number).join(", ");
  };

  const renderValues = () => {
    const entries = [];

    for (const key in state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {state.values[key]}
        </div>
      );
    }

    return entries;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.post("/api/values", {
      index: state.index,
    });

    setState((prev) => ({ ...prev, index: "" }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index:</label>
        <input
          type="text"
          value={state.index}
          onChange={(e) => {
            e.persist();
            setState((prevState) => ({ ...prevState, index: e.target.value }));
          }}
        />
        <button>Submit</button>
      </form>

      <h3>Indexes I have seen:</h3>
      {renderSeenIndexes()}

      <h3>Calculated values: :</h3>
      {renderValues()}
    </div>
  );
};

export default Fib;
