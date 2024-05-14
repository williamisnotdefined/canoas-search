import React from "react";

type HighlightNamesProps = {
  fullName: string;
  highlightNames: string;
};

const HighlightNames: React.FC<HighlightNamesProps> = ({
  fullName,
  highlightNames,
}) => {
  const highlightPatterns = highlightNames.split(" ");

  const getHighlightedNameParts = () => {
    const words = fullName.split(" ");
    const nameElements: React.ReactElement[] = [];

    words.forEach((name, index) => {
      const nameLower = name.toLowerCase();
      let matched = false;
      let startIdx = 0;
      let endIdx = 0;

      for (const pattern of highlightPatterns) {
        const patternLower = pattern.toLowerCase();
        startIdx = nameLower.indexOf(patternLower);

        if (startIdx !== -1) {
          matched = true;
          const matchLength = pattern.length;
          endIdx = startIdx + matchLength;
          break;
        }
      }

      if (matched) {
        nameElements.push(
          <React.Fragment key={index}>
            {startIdx > 0 && <span>{name.slice(0, startIdx)}</span>}
            <span className="font-bold dark:bg-destructive bg-yellow-300">
              {name.slice(startIdx, endIdx)}
            </span>
            {endIdx < name.length && <span>{name.slice(endIdx)}</span>}
          </React.Fragment>,
        );
      } else {
        nameElements.push(<span key={index}>{name}</span>);
      }

      if (index < words.length - 1) {
        nameElements.push(<span key={"space" + index}> </span>);
      }
    });

    return <div>{nameElements}</div>;
  };

  return getHighlightedNameParts();
};

export default HighlightNames;
