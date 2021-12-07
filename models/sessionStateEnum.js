const SessionStateEnum = {
    valid: 1,
    invalid: 2,
    activating: 3,
    properties: {
        1: {
            description: "有效",
            value: 1,
            code: "valid"
        },
        2: {
            description: "无效",
            value: 2,
            code: "invalid"
        },
        3: {
            description: "激活中",
            value: 3,
            code: "activating"
        }
    }
}
export default SessionStateEnum;