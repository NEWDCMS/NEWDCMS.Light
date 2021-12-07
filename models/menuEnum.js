const MenuEnum = {
    SaleReservationBillApproved: 127,
    SaleReservationBillReverse: 128,
    SaleBillApproved: 141,
    SaleBillReverse: 142,
    ReturnBillApproved: 148,
    ReturnBillReverse: 149,
    AccountReceivableSave: 162,
    AllocationFormApproved: 236,
    AllocationFormReverse: 237,
    properties: {
        127: {
            description: "销售订单-审核",
            value: 127,
            code: "SaleReservationBillApproved"
        },
        128: {
            description: "销售订单-红冲",
            value: 128,
            code: "SaleReservationBillReverse"
        },
        141: {
            description: "销售单-审核",
            value: 141,
            code: "SaleBillApproved"
        },
        142: {
            description: "销售单-红冲",
            value: 142,
            code: "SaleBillReverse"
        },
        148: {
            description: "退货单-审核",
            value: 148,
            code: "ReturnBillApproved"
        },
        149: {
            description: "退货单-红冲",
            value: 149,
            code: "ReturnBillReverse"
        },
        162: {
            description: "收款对账单-确认上交",
            value: 149,
            code: "AccountReceivableSave"
        },
        236: {
            description: "调拨单-审核",
            value: 236,
            code: "AllocationFormApproved"
        },
        237: {
            description: "调拨单-红冲",
            value: 237,
            code: "AllocationFormReverse"
        },
    }
}
export default MenuEnum;