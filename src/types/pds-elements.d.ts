import type { HTMLAttributes } from "react";

type PdsNavigationProps = HTMLAttributes<HTMLElement> & {
  variant?: string;
  layoutcontainervariant?: string;
  loginlink?: string;
  logohref?: string;
};

type PdsFooterProps = HTMLAttributes<HTMLElement> & {
  behavior?: string;
  layoutcontainervariant?: string;
  hidecontactphone?: string;
  hidehelplink?: string;
  hidecontactlink?: string;
  logohref?: string;
  loginsupportlink?: string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "pds-primary-navigation": PdsNavigationProps;
      "pds-footer": PdsFooterProps;
    }
  }
}

export {};
