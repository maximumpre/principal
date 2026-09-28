import type { ReactNode } from "react";

export function PrincipalShell({ children }: { children: ReactNode }) {
  return (
    <div className="page-shell">
      <header id="header">
        <pds-primary-navigation
          variant="default"
          layoutcontainervariant="default"
          loginlink="none"
          logohref="/"
        />
      </header>
      {children}
      <footer id="footer">
        <pds-footer
          behavior="login"
          layoutcontainervariant="default"
          hidecontactphone="true"
          hidehelplink="true"
          hidecontactlink="true"
          logohref="/"
          loginsupportlink="https://www.principal.com/were-here-help"
        />
      </footer>
    </div>
  );
}
