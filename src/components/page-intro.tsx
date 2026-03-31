import type { ReactNode } from "react";

type Props = {
  kicker: string;
  title: string;
  lead?: string;
  children?: ReactNode;
};

export function PageIntro({ kicker, title, lead, children }: Props) {
  return (
    <header className="max-w-2xl space-y-3">
      <p className="section-kicker">{kicker}</p>
      <h1 className="page-title">{title}</h1>
      {lead ? (
        <p className="page-lead text-base leading-relaxed">{lead}</p>
      ) : null}
      {children}
    </header>
  );
}
