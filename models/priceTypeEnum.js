const PriceTypeEnum = {
    ProductCost: 0,
    WholesalePrice: 1,
    RetailPrice: 2,
    LowestPrice: 3,
    LastedPrice: 4,
    CostPrice: 5,
    CustomPlan: 88,
    properties: {
        0: {
            description: "进价(成本价)",
            value: 0,
            code: "ProductCost"
        },
        1: {
            description: "批发价格",
            value: 1,
            code: "WholesalePrice"
        },
        2: {
            description: "零售价格",
            value: 2,
            code: "RetailPrice"
        },
        3: {
            description: "最低售价",
            value: 3,
            code: "LowestPrice"
        },
        4: {
            description: "上次售价",
            value: 4,
            code: "LastedPrice"
        },
        5: {
            description: "成本价",
            value: 5,
            code: "CostPrice"
        },
        88: {
            description: "自定义方案",
            value: 88,
            code: "CustomPlan"
        }
    }
}
export default PriceTypeEnum;