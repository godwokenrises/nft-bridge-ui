import { QueryKey } from "react-query";
import { Address } from "@ckb-lumos/base";
import { Icon } from "@ricons/utils";
import { HelpRound } from "@ricons/material";
import { Loader, Tooltip } from "@mantine/core";
import { useNrc721TransferCheckout } from "@/modules/Nrc721";
import { useCkbBalance } from "@/modules/Ckb";

export interface CheckoutTransferNftProps<TQueryKey extends QueryKey> {
  address?: Address;
  selectedNftsLength: number;
  isCheckoutEnabled: boolean;
  checkout: ReturnType<typeof useNrc721TransferCheckout<TQueryKey>>;
  balance: ReturnType<typeof useCkbBalance>;
}

export function CheckoutTransferNft<TQueryKey extends QueryKey = QueryKey>(props: CheckoutTransferNftProps<TQueryKey>) {
  const isFormValid = props.isCheckoutEnabled;
  const fromAddress = props.address;
  const checkout = props.checkout;
  const balance = props.balance;

  return (
    <div className="p-3 space-y-0.5 text-sm text-slate-600">
      <div className="flex justify-between items-center">
        <div className="mr-3 text-slate-800 font-semibold select-none">Selected NFT(s)</div>
        <div>{props.selectedNftsLength}/1</div>
      </div>
      <div className="flex justify-between items-center">
        <Tooltip
          withArrow multiline width={300} position="top"
          events={{ hover: true, touch: true, focus: false }}
          label={(
            <div>
              Total Cost is a certain amount of CKB cost to conduct the transaction.
              It usually has two parts: capacity occupied by new outputs, and transaction fee.
            </div>
          )}
        >
          <div className="inline-flex items-center mr-3 space-x-1 text-slate-800 font-semibold select-none">
            <span>Total Cost</span>
            <span className="inline-flex items-center text-slate-500">
                <Icon>
                  <HelpRound />
                </Icon>
              </span>
          </div>
        </Tooltip>
        <div className="inline-flex items-center">
          {isFormValid && checkout.loading && (
            <Loader size="xs" color="currentColor" className="text-emerald-500" />
          )}
          {isFormValid && !checkout.loading && checkout.totalCostCapacity && (
            `${checkout.formattedTotalCostCapacity} CKB`
          )}
          {(!isFormValid || (!checkout.loading && !checkout.totalCostCapacity)) && (
            "-"
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="mr-3 text-slate-500 font-semibold select-none">Balance</div>
        <div className="inline-flex items-center">
            {balance.loading && (
              <Loader size="xs" color="currentColor" className="text-emerald-500" />
            )}
            {fromAddress && !balance.loading && balance.balance && (
              `${balance.formattedBalance} CKB`
            )}
            {(!fromAddress || (!balance.loading && !balance.balance)) && (
              "-"
            )}
          </div>
      </div>
    </div>
  );
}
