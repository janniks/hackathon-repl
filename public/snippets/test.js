// Some code
import {
  uintCV,
  intCV,
  bufferCV,
  stringAsciiCV,
  stringUtf8CV,
  standardPrincipalCV,
  trueCV,
} from "@stacks/transactions";

const functionArgs = [
  uintCV(1234),
  intCV(-234),
  //bufferCV(Buffer.from('hello, world')),
  stringAsciiCV("hey-ascii"),
  stringUtf8CV("hey-utf8"),
  standardPrincipalCV("STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6"),
  trueCV(),
];

console.log(functionArgs);
