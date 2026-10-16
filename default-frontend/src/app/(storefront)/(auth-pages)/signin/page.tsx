import { Suspense } from 'react';

import SignIn from '@/components/SignIn';

export const metadata = {
  title: 'Sign in | Zeen',
  description:
    'Continue with your mobile number. New customers get an account the moment the code is verified.',
};

/**
 * The post-sign-in destination arrives in the query string, and reading it
 * with useSearchParams opts the page out of prerendering unless the boundary
 * is here -- without it the production build fails on this route.
 */
export default function SignInPage() {
  return (
    <Suspense>
      <SignIn />
    </Suspense>
  );
}
