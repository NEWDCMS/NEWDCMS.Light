const AccountingCodeEnum = {
    AdvancesReceived: 24,
    properties: {
        24: {
            description: "预收款",
            value: 24,
            code: "0"
        },
    }
}
export default AccountingCodeEnum;


//   /// <summary>
//     /// 库存现金:defaultCode(1001)
//     /// </summary>
//     [Description("库存现金")]
//     HandCash = 1,
//     /// <summary>
//     /// 银行存款:defaultCode(xxx)
//     /// </summary>
//     [Description("银行存款")]
//     BankDeposits = 2,
//     /// <summary>
//     /// 应收账款:defaultCode(xxx)
//     /// </summary>
//     [Description("应收账款")]
//     AccountsReceivable = 3,
//     /// <summary>
//     /// 预付账款:defaultCode(xxx)
//     /// </summary>
//     [Description("预付账款")]
//     AdvancePayment = 4,
//     /// <summary>
//     /// 应收利息:defaultCode(xxx)
//     /// </summary>
//     [Description("应收利息")]
//     InterestReceivable = 5,

//     /// <summary>
//     /// 库存商品:defaultCode(xxx)
//     /// </summary>
//     [Description("库存商品")]
//     InventoryGoods = 6,
//     /// <summary>
//     /// 固定资产:defaultCode(xxx)
//     /// </summary>
//     [Description("固定资产")]
//     FixedAssets = 7,
//     /// <summary>
//     /// 累计折旧:defaultCode(xxx)
//     /// </summary>
//     [Description("累计折旧")]
//     AccumulatedDepreciation = 8,
//     /// <summary>
//     /// 固定资产清理:defaultCode(xxx)
//     /// </summary>
//     [Description("固定资产清理")]
//     LiquidationFixedAssets = 9,
//     /// <summary>
//     /// 现金:defaultCode(xxx)
//     /// </summary>
//     [Description("现金")]
//     Cash = 10,
//     /// <summary>
//     /// 银行:defaultCode(xxx)
//     /// </summary>
//     [Description("银行")]
//     Bank = 11,
//     /// <summary>
//     /// 微信:defaultCode(xxx)
//     /// </summary>
//     [Description("微信")]
//     WChat = 12,
//     /// <summary>
//     /// 支付宝:defaultCode(xxx)
//     /// </summary>
//     [Description("支付宝")]
//     PayTreasure = 13,
//     /// <summary>
//     /// 预付款:defaultCode(xxx)
//     /// </summary>
//     [Description("预付款")]
//     Imprest = 14,
//     /// <summary>
//     /// 短期借款:defaultCode(xxx)
//     /// </summary>
//     [Description("短期借款")]
//     ShortBorrowing = 15,
//     /// <summary>
//     /// 应付账款
//     /// </summary>
//     [Description("应付账款")]
//     AccountsPayable = 16,
//     /// <summary>
//     /// 预收账款:defaultCode(xxx)
//     /// </summary>
//     [Description("预收账款")]
//     AdvanceReceipt = 17,
//     /// <summary>
//     /// 订货款:defaultCode(xxx)
//     /// </summary>
//     [Description("订货款")]
//     Order = 18,
//     /// <summary>
//     /// 应付职工薪酬:defaultCode(xxx)
//     /// </summary>
//     [Description("应付职工薪酬")]
//     EmployeePayable = 19,
//     /// <summary>
//     /// 应交税费:defaultCode(xxx)
//     /// </summary>
//     [Description("应交税费")]
//     PayableTaxes = 20,
//     /// <summary>
//     /// 应付利息:defaultCode(xxx)
//     /// </summary>
//     [Description("应付利息")]
//     InterestPayable = 21,
//     /// <summary>
//     /// 其他应付款:defaultCode(xxx)
//     /// </summary>
//     [Description("其他应付款")]
//     OtherPayables = 22,
//     /// <summary>
//     /// 长期借款:defaultCode(xxx)
//     /// </summary>
//     [Description("长期借款")]
//     LongBorrowing = 23,
//     /// <summary>
//     /// 预收款:defaultCode(xxx)
//     /// </summary>
//     [Description("预收款")]
//     AdvancesReceived = 24,
//     /// <summary>
//     /// 应交增值税:defaultCode(xxx)
//     /// </summary>
//     [Description("应交增值税")]
//     VATPayable = 25,
//     /// <summary>
//     /// 进项税额:defaultCode(xxx)
//     /// </summary>
//     [Description("进项税额")]
//     InputTax = 26,
//     /// <summary>
//     /// 已交税金:defaultCode(xxx)
//     /// </summary>
//     [Description("已交税金")]
//     PayTaxes = 27,
//     /// <summary>
//     /// 转出未交增值税:defaultCode(xxx)
//     /// </summary>
//     [Description("转出未交增值税")]
//     TransferTaxes = 28,
//     /// <summary>
//     /// 销项税额:defaultCode(xxx)
//     /// </summary>
//     [Description("销项税额")]
//     OutputTax = 29,
//     /// <summary>
//     /// 未交增值税:defaultCode(xxx)
//     /// </summary>
//     [Description("未交增值税")]
//     UnpaidVAT = 30,
//     /// <summary>
//     /// 实收资本:defaultCode(xxx)
//     /// </summary>
//     [Description("实收资本")]
//     PaidCapital = 31,
//     /// <summary>
//     /// 资本公积:defaultCode(xxx)
//     /// </summary>
//     [Description("资本公积")]
//     CapitalReserves = 32,
//     /// <summary>
//     /// 盈余公积:defaultCode(xxx)
//     /// </summary>
//     [Description("盈余公积")]
//     SurplusReserve = 33,
//     /// <summary>
//     /// 本年利润:defaultCode(xxx)
//     /// </summary>
//     [Description("本年利润")]
//     ThisYearProfits = 34,
//     /// <summary>
//     /// 利润分配:defaultCode(xxx)
//     /// </summary>
//     [Description("利润分配")]
//     ProfitDistribution = 35,
//     /// <summary>
//     /// 法定盈余公积:defaultCode(xxx)
//     /// </summary>
//     [Description("法定盈余公积")]
//     LegalSurplus = 36,
//     /// <summary>
//     /// 未分配利润:defaultCode(xxx)
//     /// </summary>
//     [Description("未分配利润")]
//     UndistributedProfit = 37,
//     /// <summary>
//     /// 任意盈余公积:defaultCode(xxx)
//     /// </summary>
//     [Description("任意盈余公积")]
//     ArbitrarySurplus = 38,
//     /// <summary>
//     /// 主营业务收入:defaultCode(xxx)
//     /// </summary>
//     [Description("主营业务收入")]
//     MainIncome = 39,
//     /// <summary>
//     /// 其他业务收入:defaultCode(xxx)
//     /// </summary>
//     [Description("其他业务收入")]
//     OtherIncome = 40,
//     /// <summary>
//     /// 盘点报溢收入:defaultCode(xxx)
//     /// </summary>
//     [Description("盘点报溢收入")]
//     TakeStockIncome = 41,
//     /// <summary>
//     /// 成本调价收入:defaultCode(xxx)
//     /// </summary>
//     [Description("成本调价收入")]
//     CostIncome = 42,
//     /// <summary>
//     /// 厂家返点:defaultCode(xxx)
//     /// </summary>
//     [Description("厂家返点")]
//     ManufacturerRebates = 43,
//     /// <summary>
//     /// 商品拆装收入:defaultCode(xxx)
//     /// </summary>
//     [Description("商品拆装收入")]
//     GoodsIncome = 44,
//     /// <summary>
//     /// 采购退货收入:defaultCode(xxx)
//     /// </summary>
//     [Description("采购退货收入")]
//     PurchaseIncome = 45,
//     /// <summary>
//     /// 主营业务成本:defaultCode(xxx)
//     /// </summary>
//     [Description("主营业务成本")]
//     MainCost = 46,
//     /// <summary>
//     /// 其他业务成本:defaultCode(xxx)
//     /// </summary>
//     [Description("其他业务成本")]
//     OtherCost = 47,
//     /// <summary>
//     /// 销售费用:defaultCode(xxx)
//     /// </summary>
//     [Description("销售费用")]
//     SaleFees = 48,
//     /// <summary>
//     /// 管理费用:defaultCode(xxx)
//     /// </summary>
//     [Description("管理费用")]
//     ManageFees = 49,
//     /// <summary>
//     /// 财务费用:defaultCode(xxx)
//     /// </summary>
//     [Description("财务费用")]
//     FinanceFees = 50,
//     /// <summary>
//     /// 盘点亏损:defaultCode(xxx)库存现金
//     /// </summary>
//     [Description("盘点亏损")]
//     InventoryLoss = 51,
//     /// <summary>
//     /// 成本调价损失:defaultCode(xxx)
//     /// </summary>
//     [Description("成本调价损失")]
//     CostLoss = 52,
//     /// <summary>
//     /// 采购退货损失:defaultCode(xxx)
//     /// </summary>
//     [Description("采购退货损失")]
//     PurchaseLoss = 53,
//     /// <summary>
//     /// 优惠:defaultCode(xxx)
//     /// </summary>
//     [Description("优惠")]
//     Preferential = 54,
//     /// <summary>
//     /// 刷卡手续费:defaultCode(xxx)
//     /// </summary>
//     [Description("刷卡手续费")]
//     CardFees = 55,
//     /// <summary>
//     /// 陈列费:defaultCode(xxx)
//     /// </summary>
//     [Description("陈列费")]
//     DisplayFees = 56,
//     /// <summary>
//     /// 油费:defaultCode(xxx)
//     /// </summary>
//     [Description("油费")]
//     OilFees = 57,
//     /// <summary>
//     /// 车辆费:defaultCode(xxx)
//     /// </summary>
//     [Description("车辆费")]
//     CarFees = 58,
//     /// <summary>
//     /// 用餐费:defaultCode(xxx)
//     /// </summary>
//     [Description("用餐费")]
//     MealsFees = 59,
//     /// <summary>
//     /// 运费:defaultCode(xxx)
//     /// </summary>
//     [Description("运费")]
//     TransferFees = 60,
//     /// <summary>
//     /// 折旧费用:defaultCode(xxx)
//     /// </summary>
//     [Description("折旧费用")]
//     OldFees = 61,
//     /// <summary>
//     /// 0.5元奖盖:defaultCode(xxx)
//     /// </summary>
//     [Description("0.5元奖盖")]
//     BottleCapsFees = 62,
//     /// <summary>
//     /// 2元瓶盖:defaultCode(xxx)
//     /// </summary>
//     [Description("2元瓶盖")]
//     TwoCapsFees = 63,
//     /// <summary>
//     /// 50元瓶盖:defaultCode(xxx)
//     /// </summary>
//     [Description("50元瓶盖")]
//     FiftyCapsFees = 64,
//     /// <summary>
//     /// 办公费:defaultCode(xxx)
//     /// </summary>
//     [Description("办公费")]
//     OfficeFees = 65,
//     /// <summary>
//     /// 房租:defaultCode(xxx)
//     /// </summary>
//     [Description("房租")]
//     HouseFees = 66,
//     /// <summary>
//     /// 物业管理费:defaultCode(xxx)
//     /// </summary>
//     [Description("物业管理费")]
//     ManagementFees = 67,
//     /// <summary>
//     /// 水电费:defaultCode(xxx)
//     /// </summary>
//     [Description("水电费")]
//     WaterFees = 68,
//     /// <summary>
//     /// 累计折旧:defaultCode(xxx)
//     /// </summary>
//     [Description("累计折旧")]
//     AccumulatedFees = 69,
//     /// <summary>
//     /// 汇兑损益:defaultCode(xxx)
//     /// </summary>
//     [Description("汇兑损益")]
//     ExchangeLoss = 70,
//     /// <summary>
//     /// 利息:defaultCode(xxx)
//     /// </summary>
//     [Description("利息")]
//     Interest = 71,
//     /// <summary>
//     /// 手续费:defaultCode(xxx)
//     /// </summary>
//     [Description("手续费")]
//     PoundageFees = 72,
//     /// <summary>
//     /// 其他账户:defaultCode(xxx)
//     /// </summary>
//     [Description("其他账户")]
//     OtherAccount = 73,
//     /// <summary>
//     /// 银行:defaultCode(xxx)
//     /// </summary>
//     [Description("其他银行")]
//     BankTwo = 74,
//     /// <summary>
//     /// 赠品:defaultCode(xxx)
//     /// </summary>
//     [Description("赠品")]
//     Gifts = 75,

//     /// <summary>
//     /// 营业外支出:defaultCode(xxx)
//     /// </summary>
//     [Description("营业外支出")]
//     NonOperatingExpenses = 78,

//     /// <summary>
//     /// 营业外收入:defaultCode(xxx)
//     /// </summary>
//     [Description("营业外收入")]
//     NonOperatingIncome = 79,