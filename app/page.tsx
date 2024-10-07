"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Home() {
  const [value, setValue] = useState("");
  const { push } = useRouter();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    push(`/prediction/${value}`);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="p-40 shadow-md bg-black rounded-md">
        <h1 className="text-8xl text-center font-semibold mb-2 text-white">
          COUNTRY.
        </h1>
        <form onSubmit={handleSubmit} className="p-10 space-y-3">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
            placeholder="Enter your name..."
          />
          <button
            type="submit"
            className="w-full py-2 px-8 bg-beige hover:bg-gray-100 text-black font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Next
          </button>
        </form>
      </div>
      
    </div>
  );
}
