import { Suspense } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SearchInput } from "@/components/layout/SearchInput";
import { getShop } from "@/lib/shopify/queries/shop";
import { CartDrawer } from "@/components/store/CartDrawer";

type Props = {
  locale: string;
};


function ProfileIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export async function Navbar({ locale }: Props) {
  const [t, shop] = await Promise.all([getTranslations("nav"), getShop()]);

  return (
    <header className="border-b border-border bg-background sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-4">
        {/* ── Left: brand + nav links ──────────────────────── */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-foreground shrink-0"
            aria-label={`${shop.name} — Home`}
          >
            <span
              className="w-3.5 h-3.5 bg-foreground border border-foreground shrink-0"
              aria-hidden
            />
            <span className="eyebrow font-bold tracking-[0.14em]">
              {shop.name}
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href={`/${locale}/collections`}
              className="eyebrow text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              {t("collections")}
            </Link>
          </nav>
        </div>

        {/* ── Center: search input ─────────────────────────── */}
        <div className="flex-1 flex justify-center">
          <Suspense fallback={<div className="w-44 h-4" />}>
            <SearchInput locale={locale} />
          </Suspense>
        </div>

        {/* ── Right: account + cart icons ──────────────────── */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <Link
            href={`/${locale}/account`}
            aria-label={t("account")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ProfileIcon />
          </Link>
          <CartDrawer locale={locale} cartLabel={t("cart")} />
        </div>
      </div>
    </header>
  );
}
