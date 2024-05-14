import cls from "classnames";
import { remove as removeDiacritics } from "diacritics";
import React from "react";

type HighlightNamesProps = {
  fullName: string;
  highlightNames: string;
};

const HighlightNames: React.FC<HighlightNamesProps> = ({
  fullName: fullNameProp,
  highlightNames,
}) => {
  const fullName = removeDiacritics(fullNameProp).toLowerCase().trim();
  const highlightPatterns = removeDiacritics(highlightNames)
    .toLowerCase()
    .trim()
    .split(" ");
  const isThereFullMatch = highlightPatterns.every((namePart) =>
    fullName.includes(namePart),
  );

  if (!isThereFullMatch) {
    return <span>{fullName}</span>;
  }

  const matches = highlightPatterns
    .map((partOfName) => {
      const start = fullName.indexOf(partOfName);
      return {
        start,
        end: Math.max(start, 0) + partOfName.length,
        match: true,
      };
    })
    .filter((match) => match.start >= 0);

  const segments = [];
  let lastIndex = 0;

  matches.forEach((match) => {
    if (match.start > lastIndex) {
      segments.push({ start: lastIndex, end: match.start, match: false });
    }
    segments.push(match);
    lastIndex = match.end;
  });

  if (lastIndex < fullName.length) {
    segments.push({ start: lastIndex, end: fullName.length, match: false });
  }

  console.log(segments, fullNameProp);

  return (
    <>
      {segments.map((segment, index) => (
        <span
          key={index}
          className={cls({
            "font-bold dark:bg-destructive bg-yellow-300": segment.match,
          })}
        >
          {fullNameProp.slice(segment.start, segment.end)}
        </span>
      ))}
    </>
  );
};

export default HighlightNames;
