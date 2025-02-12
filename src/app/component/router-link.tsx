"use client";

import { forwardRef, ForwardedRef } from "react";
import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes } from "react";

type RouterLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(
  function RouterLink(props, ref: ForwardedRef<HTMLAnchorElement>) {
    return <Link ref={ref} {...props} />;
  }
);
