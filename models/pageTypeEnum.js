const PageTypeEnum = {
    add: 1,
    edit: 2,
    check: 3,
    sign: 4,
    properties: {
        1: {
            description: "添加",
            value: 1,
            code: "add"
        },
        2: {
            description: "修改",
            value: 2,
            code: "edit"
        },
        3: {
            description: "查看",
            value: 3,
            code: "check"
        },
        4: {
            description: "签收",
            value: 4,
            code: "sign"
        }
    }
}
export default PageTypeEnum;