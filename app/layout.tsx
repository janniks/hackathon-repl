import { base64url } from "@scure/base";
import { Inter } from "next/font/google";
import Link from "next/link";
import Script from "next/script";

import { EXAMPLE_SCRIPTS } from "../lib/constants";
import { bytesToUtf8 } from "../lib/helpers";
import * as motion from "../lib/motion";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Stacks.js REPL",
//   description: "Stacks.js REPL by Hiro.",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`flex flex-col items-center min-h-screen bg-[#232329] ${inter.className}`}
      >
        <nav className="flex justify-between w-full p-5 md:p-10 pb-5 max-w-[1400px]">
          <Link href="/" className="">
            <img
              src="/logo.svg"
              alt="Stacks.js Playground"
              className="h-[34px]"
            />
          </Link>
        </nav>

        <div className="flex-1 flex justify-stretch px-5 pt-5 md:px-10 w-full max-w-[1400px] min-w-0">
          <div className="flex-1 flex flex-col space-y-10 lg:space-y-0 lg:flex-row lg:justify-between">
            <main className="lg:flex-1 flex flex-col min-w-0">{children}</main>
            {/* sidebar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              className="flex-initial flex flex-col lg:pl-8 lg:max-w-[18rem]"
            >
              {/* example snippets */}
              <div className="text-zinc-200 text-xl mb-3">Example Snippets</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-0 lg:flex lg:flex-col lg:space-y-4">
                {EXAMPLE_SCRIPTS.map((snippet, i) => (
                  <ExampleSnippet key={i} params={snippet.params} />
                ))}
              </div>
            </motion.div>
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
        <footer className="p-5 md:p-10 w-full bg-zinc-900 border-t-zinc-950 text-zinc-300 text-center font-['Aeonik_Fono']">
          Hacked on by /-/iros 🧡
        </footer>
      </body>
    </html>
  );
}

interface Details {
  id: string;
  code: string;
  t: string;
  d: string;
}

const ExampleSnippet = ({ params }: { params: string }) => {
  const parsed = new URLSearchParams(params);

  const title = bytesToUtf8(base64url.decode(parsed.get("t") ?? ""));
  // const description = bytesToUtf8(base64url.decode(parsed.get("d") ?? ""));

  return (
    <Link
      href={`editor?${params}`}
      className="flex space-x-4 justify-between border border-[#555666] bg-[#393940] rounded p-3 hover:bg-zinc-700 hover:border-zinc-500 group transition-colors"
    >
      <p className="flex-1 text-zinc-200 group-hover:text-zinc-100 text-sm transition-colors">
        {title}
      </p>
      {/* <p className="">{description.slice(0, 100)}</p> */}
      <div>
        <strong className="text-[#461104] group-hover:text-[#82290c] bg-[#FF5500] group-hover:bg-[#ff8f32] transition-colors px-2 py-1 rounded text-sm whitespace-nowrap">
          Load
        </strong>
      </div>
    </Link>
  );
};

function excerpt(code: string) {
  // last 7 lines
  return code.split("\n").slice(-2).filter(Boolean).join("\n");
}
