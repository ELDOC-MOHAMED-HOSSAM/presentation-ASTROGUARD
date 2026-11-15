import { SOURCES, type SourceKey } from '../data/sources';

interface Props {
  source: SourceKey;
  note?: string;
  className?: string;
}

export default function SourceLink({ source, note, className = '' }: Props) {
  const { label, url } = SOURCES[source];
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block font-mono-tech underline ${className}`}
    >
      {label}
      {note && ` — ${note}`}
    </a>
  );
}
