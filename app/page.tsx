"use client";

import { useState } from "react";

const IndexPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [responseData, setResponseData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const fetchData = async () => {
    try {
      if (name.trim() === "" || name.length <= 2) {
        setError(
          "Nome válido e com mais de 2 letras é obrigatório para buscar."
        );
        return;
      }
      setIsLoading(true);
      const response = await fetch(
        `/api/scrape?name=${encodeURIComponent(name)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setResponseData(data);
      setIsLoading(false);
      setError(null);
    } catch (error) {
      setError(
        "Tente novamente em breve, ou contate os administradores. (@tosalvocanoas)"
      );
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <div className="flex gap-2 flex-col max-w-[1000px] m-auto">
        <h1 className="text-4xl font-bold text-gray-900">
          Busca dos Abrigados em Canoas
        </h1>

        <label htmlFor="nameInput">Nome da pessoa</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          className="max-w-36 grow-0 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          onClick={fetchData}
          disabled={loading}
        >
          {loading ? "CARREGANDO..." : "Encontrar"}
        </button>
        {error && <div className="text-red-500">{error}</div>}
        {responseData?.data.length > 0 && (
          <p>{responseData?.data.length} resutlado(s) encontrado(s).</p>
        )}
      </div>
      {responseData?.data.map(
        (person: { [x: string]: string }[], __index: number) => {
          const mergedPerson = person.reduce((result, currentObject) => {
            return { ...result, ...currentObject };
          }, {});

          const attrs = Object.keys(mergedPerson).map((key, index) => {
            return (
              <div
                key={key + index}
                className="flex bg-gray-100 text-gray-600 uppercase font-semibold py-2"
              >
                <div className="flex-1 px-4">{key}</div>
                <div className="flex-1 px-4">{mergedPerson[key]}</div>
              </div>
            );
          });

          return (
            <div
              key={__index}
              className="bg-white px-6 py-4 max-w-[700px] m-auto"
            >
              <div className="flex flex-col">{attrs}</div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default IndexPage;
