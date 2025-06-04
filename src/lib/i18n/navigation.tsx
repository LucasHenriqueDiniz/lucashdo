// Arquivo de rotas para o App Router
import { createNavigation } from 'next-intl/navigation';
import NextLink from 'next/link';

import { pathnames, locales } from '@/lib/i18n/config';

// Para next-intl 4.x:
// https://next-intl-docs.vercel.app/docs/routing/navigation
export const {
  Link: IntlLink,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation({
  locales,
  pathnames,
});

// Link padrão exportado que é tipado para aceitar as rotas regulares
export { IntlLink as Link };

// Link alternativo que aceita qualquer string como href, para rotas dinâmicas
export function DynamicLink({
  href,
  ...props
}: { href: string } & React.ComponentProps<typeof NextLink>) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <NextLink href={href} {...props} />;
}
