import { HelpingHandIcon } from "lucide-react";
import React, { useState } from "react";

import ToSalvoAnchor from "@/components/ToSalvoAnchor";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
const SearchInfos: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("josyaninail@hotmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="flex gap-2 flex-col max-w-[1000px] m-auto mt-6">
      <Alert>
        <HelpingHandIcon className="w-5 h-5" />
        <AlertTitle>Neste momento, seja solidário!</AlertTitle>
        <AlertDescription>
          <p className="">
            Colabore doando para a <ToSalvoAnchor /> através do pix:
            <span className="ml-1 font-semibold">josyaninail@hotmail.com</span>
          </p>
          <Button size="sm" variant="outline" onClick={handleCopy}>
            {copied ? "Copiado!" : "Copiar chave pix"}
          </Button>
          <p className="mt-4 text-xs">
            Esse buscador pode ajudar pessoas, familias e amigos a se
            reencontrarem, por favor, compartilhe nos seus stories, marque os
            amigos, e ajude a divulgar: <ToSalvoAnchor />. Os dados desse site
            só foram possíveis graças ao trabalho de <ToSalvoAnchor /> e a
            prefeitura de canoas (
            <a
              href="https://www.instagram.com/prefcanoas/"
              className="text-primary hover:underline focus:outline-none focus:underline"
              target="_blank"
            >
              @prefcanoas
            </a>
            ).
          </p>
        </AlertDescription>
      </Alert>

      <Alert>
        <AlertDescription>
          <div className="flex flex-col gap-1">
            <p className="text-xs">
              Fonte de dados: Este buscador tem como base de dados as planilhas
              de abrigados, criada pelo tosalvocanoas:{" "}
              <a
                href="https://docs.google.com/spreadsheets/d/1-1q4c8Ns6M9noCEhQqBE6gy3FWUv-VQgeUO9c7szGIM/htmlview#"
                target="_blank"
                className="text-primary hover:underline focus:outline-none focus:underline"
              >
                [Tabela de abrigados @tosalvocanoas]
              </a>
              , assim como a planilha oficial da prefeitura de canoas:{" "}
              <a
                href="https://www.canoas.rs.gov.br/noticias/prefeitura-de-canoas-divulga-lista-de-resgatados-da-enchente-e-alojados-em-abrigos/"
                target="_blank"
                className="text-primary hover:underline focus:outline-none focus:underline"
              >
                [Tabela de abrigados prefeitura de canoas]
              </a>
            </p>
            <p className="text-xs">
              Nós somos 100% transparentes com os dados e com a integridade
              desse site, você pode ver o código nesse link do github:{" "}
              <a
                href="https://github.com/williamisnotdefined/canoas-search/"
                target="_blank"
                className="text-primary hover:underline focus:outline-none focus:underline"
              >
                [Código fonte]
              </a>
              . Colabore conosco, abre um pull request, ou entre em contato.
            </p>
            <p className="text-xs">
              Com o intuito de não afogar o instagram da{" "}
              <span className="font-medium">@tosalvocanoas</span> temos um canal
              exclusivamente direcionado para suporte técnico do site, dúvidas
              gerais ou de funcionalidades desse site, reporte de bugs ou
              sugestões:{" "}
              <a
                href="https://www.instagram.com/encontrados.canoas/"
                target="_blank"
                className="text-primary hover:underline focus:outline-none focus:underline"
              >
                [@encontrados.canoas]
              </a>
              . Essa página não é direcionada a notícias ou doações, apenas para
              assuntos direcionados a esse site de busca.
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SearchInfos;
