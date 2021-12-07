const userModel = {
    username: '',
    faceImage: '',
    userRealName: '',
    email: '',
    mobileNumber: '',
    storeName: '',
    starRate: 0,
    dealerNumber: '',
    marketingCenter: '',
    marketingCenterCode: '',
    salesArea: '',
    salesAreaCode: '',
    businessDepartment: '',
    businessDepartmentCode: '',
    roles: [{
        id: 0,
        name: '',
        systemName: ''
    }],
    modules: [{
        name: '',
        code: '',
        parentId: 0,
        linkUrl: '',
        id: 0,
        storeId: 0
    }],
    permissionRecords: [{
        id: 0,
        name: '',
        code: 0
    }],
    districts: [{
        id: 0,
        districtsId: 0
    }],
    appId: '',
    accessToken: '',
    refreshToken: '',
    id: 0,
    storeId: 0
}

export default userModel;