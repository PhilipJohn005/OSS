import './globals.css'
import { SessionProvider } from "next-auth/react";
import 'highlight.js/styles/vs2015.css';
import { ReactNode } from 'react';
import MicrosoftClarity from "./metrics/MicrosoftClarity";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>

        <MicrosoftClarity />
      </body>
    </html>
  );
}