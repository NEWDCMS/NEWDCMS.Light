const BillTypeEnum = {
  SaleReservationBill: 11,
  SaleBill: 12,
  ReturnReservationBill: 13,
  ReturnBill: 14,
  FinanceReceiveAccount: 16,
  AllocationBill: 31,
  CashReceiptBill: 41,
  PaymentReceiptBill: 42,
  AdvanceReceiptBill: 43,
  AdvancePaymentBill: 44,
  CostExpenditureBill: 45,
  CostContractBill: 46,
  FinancialIncomeBill: 47,
  properties: {
    11: {
      description: "销售订单",
      value: 11,
      code: "XD"
    },
    12: {
      description: "销售单",
      value: 12,
      code: "XS"
    },
    13: {
      description: "退货订单",
      value: 13,
      code: "TD"
    },
    14: {
      description: "退货单",
      value: 14,
      code: "TH"
    },
    16: {
      description: "收款对账",
      value: 16,
      code: "FRA"
    },
    31: {
      description: "调拨单",
      value: 31,
      code: "DBD"
    },
    41: {
      description: "收款单",
      value: 41,
      code: "SK"
    },
    42: {
      description: "付款单",
      value: 42,
      code: "FK"
    },
    43: {
      description: "预收款单",
      value: 43,
      code: "YSK"
    },
    44: {
      description: "预付款单",
      value: 44,
      code: "YFK"
    },
    45: {
      description: "费用支出",
      value: 45,
      code: "FYZC"
    },
    46: {
      description: "费用合同",
      value: 46,
      code: "FYHT"
    },
    47: {
      description: "其他收入",
      value: 47,
      code: "CWSR"
    }
  }
}
export default BillTypeEnum;