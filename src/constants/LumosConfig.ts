import { predefined, createConfig } from "@ckb-lumos/config-manager";
export const TestnetLumosConfig = createConfig({
  ...predefined.AGGRON4,
  SCRIPTS: {
    ...predefined.AGGRON4.SCRIPTS,
    OMNILOCK: {
      ...predefined.AGGRON4.SCRIPTS.OMNILOCK,
      CODE_HASH: "0x79f90bb5e892d80dd213439eeab551120eb417678824f282b4ffb5f21bad2e1e",
      TX_HASH: "0x9154df4f7336402114d04495175b37390ce86a4906d2d4001cf02c3e6d97f39c",
      INDEX: "0x0",
    },
  },
});
