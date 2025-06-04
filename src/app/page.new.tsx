import { redirect } from 'next/navigation';

import { defaultLocale } from '@/lib/i18n/config';

export default function RootPage() {
  // Redireciona para a página com o locale padrão
  redirect(`/${defaultLocale}`);

  // Este retorno nunca é alcançado devido ao redirecionamento acima,
  // mas é necessário para satisfazer o compilador TypeScript
  return null;
}
