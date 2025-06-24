import './globals.css'
import { SessionProvider } from "next-auth/react";
import 'highlight.js/styles/vs2015.css';

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
