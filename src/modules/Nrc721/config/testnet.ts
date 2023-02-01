import { Nrc721Config, Nrc721NftScriptConfig } from "./types";
import { Nrc721MetadataFormatter } from "../metadata/formatters";
import { Nrc721MetadataFetcher } from "../metadata/fetchers";

export const TestnetNrc721NftScript: Nrc721NftScriptConfig = {
  typeScriptHash: "0x9cef3391f34e14155caf019b47fc6e44ea31263ec87d62666ef0590f9defb774",
  typeScript: {
    codeHash: "0x00000000000000000000000000000000000000000000000000545950455f4944",
    args: "0xc2407f8b6ef27a10c35a55ab589e6bfc28db3f2fe5b08cab63384c88a02a14e6",
    hashType: "type",
  },
};

export const TestnetNrc721Config: Nrc721Config = {
  bridgeAddress: "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqga8ztvrgw8xvp89neaj4qs47ql85khmhqggwf89",
  nftScripts: [
    TestnetNrc721NftScript,
  ],
  factories: [
    // inner-test collection provided by CL
    {
      factoryTypeScript: {
        codeHash: "0x00000000000000000000000000000000000000000000000000545950455f4944",
        args: "0xa502aba2d7f3efe5055a3959644d885a8054bb708c61ec2ebf4fcddc93b69818",
        hashType: "type",
      },
    },
    // inner-test collection for image display testing
    {
      factoryTypeScript: {
        codeHash: "0x00000000000000000000000000000000000000000000000000545950455f4944",
        args: "0xb0d569a664c17a6101b6b8af81ff98f781d87b0a7b016c0107d617bc022b42f7",
        hashType: "type",
      },
      loader: Nrc721MetadataFetcher.Standard,
      formatter: Nrc721MetadataFormatter.Erc721Standard,
    }
  ],
};
