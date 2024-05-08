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
    const { value } = e.target;
    if (value !== name) {
      setResponseData(null);
    }
    setName(value);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  const fetchData = async () => {
    try {
      if (name.trim() === "" || name.length <= 2) {
        setError(
          "Nome válido e com mais de 2 letras é obrigatório para buscar."
        );
        return;
      }
      setResponseData(null);
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
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
        />
        <div className="flex gap-4 items-center">
          <button
            className="flex w-fit px-4 py-2 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? "CARREGANDO..." : "Procurar"}
          </button>
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {responseData?.data.length >= 0 && (
          <p className="mt-6 mb-4 px-4">
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
          amigos, e ajude a divulgar:{" "}
          <a
            href="https://www.instagram.com/encontrados.canoas/"
            className="text-blue-700 hover:underline focus:outline-none focus:underline"
            target="_blank"
          >
            @encontrados.canoas
          </a>
          . Os dados desse site só foram possíveis graças ao trabalho de{" "}
          <a
            href="https://www.instagram.com/tosalvocanoas/"
            className="text-blue-700 hover:underline focus:outline-none focus:underline"
            target="_blank"
          >
            @tosalvocanoas
          </a>{" "}
          e a prefeitura de canoas (
          <a
            href="https://www.instagram.com/prefcanoas/"
            className="text-blue-700 hover:underline focus:outline-none focus:underline"
            target="_blank"
          >
            @prefcanoas
          </a>
          ) .
        </p>
        <p className="text-xs italic">
          Fonte de dados: Esta aplicação tem como base de dados as planilhas do
          google drive dos abrigados, criadas pelo tosalvocanoas, canoasmilgrau
          e outros:{" "}
          <a
            href="https://docs.google.com/spreadsheets/d/1-1q4c8Ns6M9noCEhQqBE6gy3FWUv-VQgeUO9c7szGIM/htmlview#"
            target="_blank"
            className="text-blue-500 hover:underline focus:outline-none focus:underline not-italic"
          >
            [Tabela de abrigados @tosalvocanoas]
          </a>
          , assim como a planilha oficial da prefeitura de canoas:{" "}
          <a
            href="https://www.canoas.rs.gov.br/noticias/prefeitura-de-canoas-divulga-lista-de-resgatados-da-enchente-e-alojados-em-abrigos/"
            target="_blank"
            className="text-blue-500 hover:underline focus:outline-none focus:underline not-italic"
          >
            [Tabela de abrigados prefeitura de canoas]
          </a>
        </p>
        <p className="text-xs italic">
          Nós somos 100% transparentes com os dados e com a integridade desse
          site, você pode ver o código nesse link do github:{" "}
          <a
            href="https://github.com/williamisnotdefined/canoas-search/"
            target="_blank"
            className="text-blue-500 hover:underline focus:outline-none focus:underline not-italic"
          >
            [Código fonte]
          </a>
          . Colabore conosco, abre um pull request, ou entre em contato.
        </p>
      </div>
    </div>
  );
};

export default IndexPage;
