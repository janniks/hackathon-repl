import { base64url } from "@scure/base";
import { Inter } from "next/font/google";
import Link from "next/link";
import Script from "next/script";

import WrappedEditor from "../components/editor";
import { EXAMPLE_SCRIPTS } from "../lib/constants";
import { utf8ToBytes } from "../lib/helpers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`flex flex-col w-full min-h-screen ${inter.className}`}>
        <nav className="flex justify-between p-10">
          <Link href="/" className="self-start">
            {/* todo: logo */}
            Snippets
          </Link>
          <Link href="/" className="self-end">
            {/* placeholder */}
            Top Snippets
          </Link>
          <Link href="/" className="self-end">
            My Account
          </Link>
        </nav>

        <div className="flex-1 flex justify-between p-10">
          <main className="flex-1 flex flex-col bg-gray-200">{children}</main>
          {/* sidebar */}
          <div className="flex flex-col bg-red-800 min-w-[20rem]">
            {/* example snippets */}
            <div className="text-xl mb-3">Example Snippets</div>
            <div className="space-y-4">
              {EXAMPLE_SCRIPTS.map((item, i) => (
                <div key={i} className="flex border rounded p-3">
                  <div>
                    <div className="flex space-x-4">
                      <p className="text-lg">{item.name}</p>
                      <div>
                        <Link
                          className="bg-slate-500 font-mono px-1 py-0.5 rounded text-sm"
                          href={`editor?code=${base64url.encode(
                            utf8ToBytes(item.code)
                          )}`}
                        >
                          Load {">"}
                        </Link>
                      </div>
                    </div>
                    <pre className="text-sm">
                      <code>{item.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Script type="importmap" id="importmap">
          {`{
            "imports": {
              "@stacks/common": "https://esm.sh/@stacks/common@6.5.2",
              "@stacks/transactions": "https://esm.sh/@stacks/transactions@6.5.4",
              "@stacks/network": "https://esm.sh/@stacks/network@6.5.4",
              "@stacks/encryption": "https://esm.sh/@stacks/encryption@6.5.4",
              "@stacks/profile": "https://esm.sh/@stacks/profile@6.5.4",
              "@stacks/auth": "https://esm.sh/@stacks/auth@6.5.4",
              "@stacks/storage": "https://esm.sh/@stacks/storage@6.5.4",
              "@stacks/wallet-sdk": "https://esm.sh/@stacks/wallet-sdk@6.5.4",
              "@stacks/blockchain-api-client": "https://esm.sh/@stacks/blockchain-api-client@7.2.0",
              "@stacks/stacking": "https://esm.sh/@stacks/stacking@6.5.4",
              "@stacks/connect": "https://esm.sh/@stacks/connect@7.3.1",
              "@noble/hashes/sha256": "https://esm.sh/@noble/hashes@1.3.0/sha256",
              "crypto": "https://esm.sh/crypto-browserify@3.12.0",
              "zone-file": "https://esm.sh/zone-file@1.0.0"
            }
          }`}
        </Script>
        <footer className="p-10 bg-blue-800">Footer</footer>
      </body>
    </html>
  );
}
