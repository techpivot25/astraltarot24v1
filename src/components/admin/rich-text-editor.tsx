import { useEffect, useRef } from "react";
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Image as ImageIcon,
  Italic, Link2, List, ListOrdered, Palette, Table, Underline,
} from "lucide-react";
import { toast } from "sonner";
import { uploadBlogImage } from "@/lib/blog-admin";

const FONTS = ["Default", "Cinzel", "Cormorant Garamond", "Georgia", "Arial", "Courier New"];
const SIZES: Array<[string, string]> = [["Default", "3"], ["Small", "2"], ["Normal", "3"], ["Large", "5"], ["Huge", "6"]];

function cmd(name: string, value?: string) {
  document.execCommand(name, false, value);
}

export function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value;
  }, [value]);

  const push = () => onChange(ref.current?.innerHTML ?? "");

  async function onPickImage(file: File) {
    try {
      const url = await uploadBlogImage(file);
      ref.current?.focus();
      cmd("insertHTML", `<img src="${url}" alt="" style="max-width:100%;border-radius:8px" />`);
      push();
      toast.success("Image added to the post");
    } catch {
      toast.error("Image upload failed", { description: "Please try a different file." });
    }
  }

  const Btn = ({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => { onClick(); push(); }}
      className="grid size-8 place-items-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
        <select
          aria-label="Font family"
          onChange={(e) => { cmd("fontName", e.target.value === "Default" ? "inherit" : e.target.value); push(); }}
          className="h-8 rounded-md border border-border bg-background px-2 text-sm"
        >
          {FONTS.map((f) => <option key={f}>{f}</option>)}
        </select>
        <select
          aria-label="Font size"
          onChange={(e) => { cmd("fontSize", e.target.value); push(); }}
          className="h-8 rounded-md border border-border bg-background px-2 text-sm"
        >
          {SIZES.map(([label, size]) => <option key={label} value={size}>{label}</option>)}
        </select>
        <span className="mx-1 h-6 w-px bg-border" />
        <Btn title="Bold" onClick={() => cmd("bold")}><Bold className="size-4" /></Btn>
        <Btn title="Italic" onClick={() => cmd("italic")}><Italic className="size-4" /></Btn>
        <Btn title="Underline" onClick={() => cmd("underline")}><Underline className="size-4" /></Btn>
        <label title="Text colour" className="grid size-8 cursor-pointer place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
          <Palette className="size-4" />
          <input type="color" className="sr-only" onChange={(e) => { cmd("foreColor", e.target.value); push(); }} />
        </label>
        <span className="mx-1 h-6 w-px bg-border" />
        {(["H1", "H2", "H3"] as const).map((h, i) => (
          <Btn key={h} title={h} onClick={() => cmd("formatBlock", `<h${i + 1}>`)}>
            <span className="text-xs font-semibold">{h}</span>
          </Btn>
        ))}
        <span className="mx-1 h-6 w-px bg-border" />
        <Btn title="Bulleted list" onClick={() => cmd("insertUnorderedList")}><List className="size-4" /></Btn>
        <Btn title="Numbered list" onClick={() => cmd("insertOrderedList")}><ListOrdered className="size-4" /></Btn>
        <span className="mx-1 h-6 w-px bg-border" />
        <Btn title="Align left" onClick={() => cmd("justifyLeft")}><AlignLeft className="size-4" /></Btn>
        <Btn title="Align centre" onClick={() => cmd("justifyCenter")}><AlignCenter className="size-4" /></Btn>
        <Btn title="Align right" onClick={() => cmd("justifyRight")}><AlignRight className="size-4" /></Btn>
        <Btn title="Justify" onClick={() => cmd("justifyFull")}><AlignJustify className="size-4" /></Btn>
        <span className="mx-1 h-6 w-px bg-border" />
        <Btn title="Insert link" onClick={() => { const url = window.prompt("Link URL"); if (url) cmd("createLink", url); }}>
          <Link2 className="size-4" />
        </Btn>
        <Btn title="Insert image" onClick={() => fileRef.current?.click()}><ImageIcon className="size-4" /></Btn>
        <Btn
          title="Insert table"
          onClick={() => {
            const rows = Number(window.prompt("Rows", "3")) || 3;
            const cols = Number(window.prompt("Columns", "3")) || 3;
            const cell = '<td style="border:1px solid #d4d4d8;padding:8px">&nbsp;</td>';
            const html = `<table style="border-collapse:collapse;width:100%">${Array.from({ length: rows })
              .map(() => `<tr>${cell.repeat(cols)}</tr>`)
              .join("")}</table><p><br/></p>`;
            cmd("insertHTML", html);
          }}
        >
          <Table className="size-4" />
        </Btn>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) void onPickImage(f); e.target.value = ""; }}
      />

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={push}
        onBlur={push}
        role="textbox"
        aria-multiline="true"
        aria-label="Blog content"
        className="admin-prose min-h-[420px] w-full bg-background p-5 outline-none"
      />
    </div>
  );
}
