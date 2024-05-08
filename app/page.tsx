"use client";

import { useState } from "react";
import { remove as removeDiacritics } from "diacritics";

function highlightSubstring(fullString: string, pattern: string) {
  fullString = removeDiacritics(fullString);
  pattern = removeDiacritics(pattern);

  if (!fullString.includes(pattern)) {
    return fullString;
  }

  const splitted = fullString.split(pattern);

  return (
    <>
      <span>{splitted[0]}</span>
      <span className="font-bold text-gray-800 bg-yellow-300">{pattern}</span>
      <span>{splitted[1]}</span>
    </>
  );
}

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
    <div className="p-4">
      <div className="flex gap-2 flex-col max-w-[1000px] m-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Buscador de Abrigados em Canoas
        </h1>

        <p className="rounded-sm text-sm p-3 bg-yellow-200/50 text-yellow-800 border-l-4 border-yellow-800 font-medium">
          Se você não achar pelo nome completo, tente pelo primeiro nome, ou
          nome e apenas um sobrenome e procure nos resultados filtrados. Os
          voluntários dos abrigos podem ter digitado de forma diferente, procure
          por algumas variações do nome.
        </p>

        <label htmlFor="nameInput">Busque pelo nome da pessoa</label>
        <input
          id="name"
          type="text"
          value={name}
          placeholder="Digite o nome da pessoa"
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          className="flex w-fit px-4 py-2 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          onClick={fetchData}
          disabled={loading}
        >
          {loading ? "CARREGANDO..." : "Procurar"}
        </button>
        {error && <div className="text-red-500">{error}</div>}
        {responseData?.data.length >= 0 && (
          <p>
            {responseData?.data.length} resultado(s) encontrado(s).{" "}
            {responseData?.data.length === 0 && (
              <span className="font-bold">Não perca as experanças!</span>
            )}
          </p>
        )}
      </div>
      {responseData?.data.map(
        (person: { [x: string]: string }[], __index: number) => {
          const mergedPerson = person.reduce((result, currentObject) => {
            return { ...result, ...currentObject };
          }, {});

          const tableId = mergedPerson.id;

          const attrs = Object.keys(mergedPerson)
            .filter((key) => key !== "id")
            .map((key, index) => {
              return (
                <div
                  key={key + index}
                  className="flex bg-gray-100 text-gray-600 uppercase font-medium py-2"
                >
                  <div className="flex-1 px-4">{key}</div>
                  <div className="flex-1 px-4">
                    {highlightSubstring(
                      mergedPerson[key].toLowerCase(),
                      name.toLowerCase()
                    )}
                  </div>
                </div>
              );
            });

          return (
            <div className="flex flex-col grow-1 max-w-[1000px] w-full px-4 m-auto">
              <p className="m-auto w-full font-medium text-2xl">{tableId}</p>
              <div key={__index} className="py-4 m-auto w-full">
                <div className="flex flex-col">{attrs}</div>
              </div>
            </div>
          );
        }
      )}

      <div className="flex gap-2 flex-col max-w-[1000px] m-auto mt-4">
        <p className="text-xs p-3 bg-neutral-200 text-gray-950 border-l-4 border-zinc-600 font-medium">
          Esse buscador pode ajudar pessoas, familias e amigos a se
          reencontrarem, por favor, compartilhe nos seus stories, marque os
          amigos, e ajude a divulgar!{" "}
          <a
            href="https://www.instagram.com/encontrados.canoas/"
            className="text-blue-700 hover:underline focus:outline-none focus:underline"
            target="_blank"
          >
            @encontrados.canoas
          </a>
        </p>
        <p className="text-xs italic">
          Fonte de dados: Esta aplicação tem como base de dados as planilhas do
          google drive dos abrigados, criadas pelo tosalvocanoas, canoasmilgrau,
          etc.{" "}
          <a
            href="https://docs.google.com/spreadsheets/d/1-1q4c8Ns6M9noCEhQqBE6gy3FWUv-VQgeUO9c7szGIM/htmlview#"
            target="_blank"
            className="text-blue-500 hover:underline focus:outline-none focus:underline not-italic"
          >
            [Tabela de abrigados em Canoas]
          </a>
        </p>
      </div>
    </div>
  );
};

export default IndexPage;
