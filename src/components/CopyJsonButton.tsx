import { Copy } from 'lucide-react';

interface Props {
  data: unknown;
  filename: string;
  color: string;
  notify: (msg: string) => void;
}

export default function CopyJsonButton({ data, filename, color, notify }: Props) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      notify(`Copied ${filename}`);
    } catch {
      notify('Clipboard not available in this browser');
    }
  };

  return (
    <button
      onClick={copy}
      className={`px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono-tech flex items-center gap-1.5 transition cursor-pointer ${color}`}
    >
      <Copy className="w-3.5 h-3.5" />
      <span>Copy JSON</span>
    </button>
  );
}
