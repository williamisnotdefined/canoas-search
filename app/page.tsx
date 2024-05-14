"use client";

import { AlertTriangle } from "lucide-react";
import React, { useState } from "react";

import HighlightNames from "@/components/HighlightNames";
import Loader from "@/components/Loader";
import SearchInfos from "@/components/SearchInfos";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Source } from "@/tasks/scrape/core/sources";

const forbiddenColumnsHeader = [
  "OS NOMES DUPLICADOS SÃO RESULTADO DE DUPLICAÇÃO DA INFORMAÇÃO DO MOMENTO DO REGISTRO E LOCALIZAÇÃO. PREFERIMOS DUPLICAR PARA GARANTIR QUE ALGUMA INFORMAÇÃO POSSA CONTRIBUIR PARA A LOCALIZAÇÃO DOS ABRIGADOS",
];

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

          <div className="mt-4">
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

      {responseData?.data.length >= 0 && (
        <div className="flex flex-col gap-4 max-w-[1000px] m-auto mt-4">
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

          {responseData?.data.map(
            (person: { [x: string]: string }[], __index: number) => {
              const mergedPerson = person.reduce(
                (result, currentObject, index) => {
                  const key = Object.keys(currentObject)[0];
                  if (typeof result[key] !== "undefined") {
                    return {
                      ...result,
                      [`duplicated-key::${key}::${index}`]: currentObject[key],
                    };
                  }
                  return { ...result, ...currentObject };
                },
                {},
              );

              const tableName = mergedPerson.id;

              const attrs = Object.keys(mergedPerson)
                .filter((key) => key !== "id")
                .map((_key, index) => {
                  const isForbiddenColumnHead = forbiddenColumnsHeader.some(
                    (forbiddenHead) =>
                      _key.toLowerCase().includes(forbiddenHead.toLowerCase()),
                  );

                  const key = isForbiddenColumnHead ? "-" : _key;
                  const isDuplicatedKey = key.indexOf("duplicated-key::") === 0;
                  const duplicatedKeyValue = key.split("::")[1] || "-";
                  const normalizedKey = isDuplicatedKey
                    ? duplicatedKeyValue
                    : key || "-";

                  const value = mergedPerson[_key].toLowerCase().trim();
                  if (normalizedKey === "-" && value === "-") {
                    return null;
                  }

                  return (
                    <div
                      key={key + index + value}
                      className="flex bg-accent uppercase font-medium py-2"
                    >
                      <div className="flex-1 px-4">
                        {isForbiddenColumnHead ? "-" : normalizedKey}
                      </div>
                      <div className="flex-1 px-4">
                        {value !== "-" && (
                          <HighlightNames
                            fullName={value}
                            highlightNames={name}
                          />
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
      )}

      <SearchInfos />
    </div>
  );
};

export default IndexPage;
