import './globals.css'
import { SessionProvider } from "next-auth/react";
import 'highlight.js/styles/vs2015.css';
import Script from "next/script";
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>

        <Script
          id="clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "vntevgong6");
            `,
          }}
        />

        <SessionProvider>
          {children}
        </SessionProvider>

      </body>
    </html>
  );
}