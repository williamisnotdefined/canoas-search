"use client";

import { remove as removeDiacritics } from "diacritics";
import { AlertTriangle } from "lucide-react";
import React, { useState } from "react";

import Loader from "@/components/Loader";
import SearchInfos from "@/components/SearchInfos";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Source } from "@/tasks/scrape/core/sources";

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
      <span className="font-bold dark:bg-destructive bg-yellow-300">
        {pattern}
      </span>
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
      e.preventDefault();
      fetchData();
    }
  };

  const fetchData = async () => {
    try {
      if (name.trim() === "" || name.length <= 2) {
        setError(
          "Nome válido e com mais de 2 letras é obrigatório para buscar.",
        );
        return;
      }
      setResponseData(null);
      setIsLoading(true);
      const response = await fetch(
        `/api/scrape?name=${encodeURIComponent(name)}`,
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
        "Tente novamente em breve, ou contate os administradores. (@tosalvocanoas)",
      );
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchData();
        }}
      >
        <div className="flex gap-2 flex-col max-w-[1000px] m-auto">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Atenção!</AlertTitle>
            <AlertDescription>
              Se você não achar pelo nome completo, tente pelo primeiro nome, ou
              nome e apenas um sobrenome e procure nos resultados filtrados. Os
              voluntários dos abrigos podem ter digitado de forma diferente,
              procure por algumas variações do nome.
            </AlertDescription>
          </Alert>

          <div className="py-4">
            <Label htmlFor="name">Busque pelo nome da pessoa</Label>
            <Input
              id="name"
              type="text"
              value={name}
              placeholder="Digite o nome da pessoa"
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="max-w-96"
            />

            <div className="flex gap-4 items-center mt-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Carregando..." : "Procurar"}
              </Button>
              {loading && <Loader />}
              {error && <div className="text-sm text-destructive">{error}</div>}
            </div>
          </div>
        </div>
      </form>

      <div className="flex flex-col gap-4 max-w-[1000px] m-auto mt-4">
        {responseData?.data.length >= 0 && (
          <p>
            {responseData?.data.length} resultado(s) encontrado(s) de{" "}
            {new Intl.NumberFormat("pt-BR").format(
              responseData?.registersCount,
            )}{" "}
            registros em nossa base.
            {responseData?.data.length === 0 && (
              <p>
                Tente procurar por outras variações deste nome.{" "}
                <span className="font-bold">Não perca as experanças!</span>
              </p>
            )}
          </p>
        )}

        {responseData?.data.map(
          (person: { [x: string]: string }[], __index: number) => {
            const mergedPerson = person.reduce((result, currentObject) => {
              return { ...result, ...currentObject };
            }, {});

            const tableName = mergedPerson.id;

            const attrs = Object.keys(mergedPerson)
              .filter((key) => key !== "id")
              .map((key, index) => {
                return (
                  <div
                    key={key + index}
                    className="flex bg-accent uppercase font-medium py-2"
                  >
                    <div className="flex-1 px-4">{key}</div>
                    <div className="flex-1 px-4">
                      {highlightSubstring(
                        mergedPerson[key].toLowerCase(),
                        name.toLowerCase(),
                      )}
                    </div>
                  </div>
                );
              });

            return (
              <div key={__index} className="flex flex-col">
                {mergedPerson["lista de origem"] === Source.TOSALVOCANOAS && (
                  <p className="m-auto w-full font-medium text-2xl">
                    {tableName}
                  </p>
                )}
                <div key={__index} className="m-auto w-full">
                  <div className="flex flex-col">{attrs}</div>
                </div>
              </div>
            );
          },
        )}
      </div>

      <SearchInfos />
    </div>
  );
};

export default IndexPage;
