import util from '../../../utils/util';

/* 客户排行榜 bar*/
const getCustomerRanking = (datas) => {

    let labels = datas.slice(0, 9).map(s => {
        return s.TerminalName.substring(0, 8)
    })

    let sets = datas.slice(0, 9).map(s => {
        return s.NetAmount
    })

    const config = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '销售净额',
                data: sets,
                backgroundColor: [
                    'rgba(255, 99, 132)',
                    'rgba(255, 159, 64)',
                    'rgba(255, 205, 86)',
                    'rgba(75, 192, 192)',
                    'rgba(54, 162, 235)',
                    'rgba(153, 102, 255)',
                    'rgba(201, 203, 207)',
                    'rgb(255, 99, 132)',
                    'rgb(75, 192, 192)',
                    'rgb(255, 205, 86)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            legend: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },
    };

    return config;
}

/* 业务销售排行 horizontalBar*/
const getBusinessRanking = (datas) => {

    let labels = datas.slice(0, 9).map(s => {
        return s.BusinessUserName.substring(0, 8)
    })

    let sets = datas.slice(0, 9).map(s => {
        return s.NetAmount
    })

    return {
        type: 'horizontalBar',
        data: {
            labels: labels,
            datasets: [{
                label: '销售净额',
                backgroundColor: [
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998'
                ],
                hoverBackgroundColor: [
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245'
                ],
                data: sets
            }],
        },
        options: {
            responsive: true,
            legend: false,
            tooltips: {
                mode: 'index',
                intersect: false,
            }
        }
    }
}

/* 品牌销量汇总 bar*/
const getBrandRanking = (datas) => {

    let labels = datas.slice(0, 9).map(s => {
        return s.BrandName.substring(0, 8)
    })

    let sets = datas.slice(0, 9).map(s => {
        return s.NetAmount
    })

    const config = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '销售净额',
                data: sets,
                backgroundColor: [
                    'rgba(255, 99, 132)',
                    'rgba(255, 159, 64)',
                    'rgba(255, 205, 86)',
                    'rgba(75, 192, 192)',
                    'rgba(54, 162, 235)',
                    'rgba(153, 102, 255)',
                    'rgba(201, 203, 207)',
                    'rgb(255, 99, 132)',
                    'rgb(75, 192, 192)',
                    'rgb(255, 205, 86)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            legend: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },
    };

    return config;
}

/* 热销排行榜 horizontalBar */
const getHotSaleRanking = (datas) => {

    let labels = datas.slice(0, 9).map(s => {
        return s.ProductName.substring(0, 8)
    })

    let sets = datas.slice(0, 9).map(s => {
        return s.TotalSumNetAmount
    })

    return {
        type: 'horizontalBar',
        data: {
            labels: labels,
            datasets: [{
                label: '销售净额',
                backgroundColor: [
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998'
                ],
                hoverBackgroundColor: [
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245'
                ],
                data: sets
            }],
        },
        options: {
            responsive: true,
            legend: false,
            tooltips: {
                mode: 'index',
                intersect: false,
            }
        }
    }
}

/* 销量走势图 line */
const getSaleTrending = (datas) => {
    let labels = datas.slice(0, 9).map(s => {
        return util.moment('yy/M/d', s.SaleDate);
    })

    let sets = datas.slice(0, 9).map(s => {
        return s.SaleAmount
    })

    let sets2 = datas.slice(0, 9).map(s => {
        return s.NetAmount
    })

    let sets3 = datas.slice(0, 9).map(s => {
        return s.SaleReturnAmount
    })

    return {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '销售',
                backgroundColor: 'transparent',
                borderColor: 'rgba(242, 71, 80, 1)',
                pointBackgroundColor: 'white',
                pointBorderColor: 'rgba(242, 71, 80, 1)',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(77,83,96,1)',
                data: sets,
                fill: false,
            }, {
                label: '净额',
                fill: false,
                backgroundColor: 'transparent',
                borderColor: 'rgba(41, 191, 118, 1)',
                pointBackgroundColor: 'white',
                pointBorderColor: 'rgba(41, 191, 118, 1)',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148,159,177,0.8)',
                data: sets2,
            }, {
                label: '退额',
                fill: false,
                backgroundColor: 'transparent',
                borderColor: 'rgba(242, 71, 80, 1)',
                pointBackgroundColor: 'white',
                pointBorderColor: 'rgba(242, 71, 80, 1)',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(77,83,96,1)',
                data: sets3,
            }]
        },
        options: {
            responsive: true,
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    ticks: {
                        minRotation: 45
                    },
                    position: 'bottom'
                }],
                yAxes: [{
                    display: true
                }]
            }
        }
    }
}

/* 销售利润排行  horizontalBar*/
const getCostProfitRanking = (datas) => {

    let labels = datas.slice(0, 9).map(s => {
        return s.ProductName.substring(0, 8)
    })

    let sets = datas.slice(0, 9).map(s => {
        return s.TotalSumProfit
    })

    return {
        type: 'horizontalBar',
        data: {
            labels: labels,
            datasets: [{
                label: '销售净额',
                backgroundColor: [
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998'
                ],
                hoverBackgroundColor: [
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245'
                ],
                data: sets
            }],
        },
        options: {
            responsive: true,
            legend: false,
            tooltips: {
                mode: 'index',
                intersect: false,
            }
        }
    }
}


/* 客户拜访排行 horizontalBar*/
const getBusinessVisitRanking = (datas) => {

    let labels = datas.sort(function (a, b) {
        return b.VisitedCount - a.VisitedCount
    }).slice(0, 9).map(s => {
        return s.BusinessUserName.substring(0, 8)
    })

    let sets = datas.sort(function (a, b) {
        return b.VisitedCount - a.VisitedCount
    }).slice(0, 9).map(s => {
        return s.VisitedCount
    })

    let sets2 = datas.slice(0, 9).map(s => {
        return s.CustomerCount
    })


    return {
        type: 'horizontalBar',
        data: {
            labels: labels,
            datasets: [{
                label: '次数',
                backgroundColor: [
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998'
                ],
                hoverBackgroundColor: [
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245'
                ],
                data: sets
            }],
        },
        options: {
            responsive: true,
            legend: false,
            tooltips: {
                mode: 'index',
                intersect: false,
            }
        }
    }
}

/* 热定排行榜 */
const getHotOrderRanking = (datas) => {

    let labels = datas.slice(0, 9).map(s => {
        return s.ProductName.substring(0, 8)
    })

    let sets = datas.slice(0, 9).map(s => {
        return s.TotalSumNetAmount
    })

    return {
        type: 'horizontalBar',
        data: {
            labels: labels,
            datasets: [{
                label: '销售净额',
                backgroundColor: [
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998',
                    '#3B5998'
                ],
                hoverBackgroundColor: [
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245',
                    '#53a245'
                ],
                data: sets
            }],
        },
        options: {
            responsive: true,
            legend: false,
            tooltips: {
                mode: 'index',
                intersect: false,
            }
        }
    }
}

/* 订单额分析 doughnut*/
const getSaleAnalysis = (datas) => {

    var sets = [
        datas.Today?.NetAmount ?? 0,
        datas.Yesterday?.NetAmount ?? 0,
        datas.BeforeYesterday?.NetAmount ?? 0,
        datas.LastWeek?.NetAmount ?? 0,
        datas.ThisWeek?.NetAmount ?? 0,
        datas.LastMonth?.NetAmount ?? 0,
        datas.ThisQuarter?.NetAmount ?? 0,
        datas.ThisYear?.NetAmount ?? 0,
    ];

    return {
        type: 'doughnut',
        data: {
            datasets: [{
                data: sets,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(54, 45, 235)',
                    'rgba(255, 99, 132)',
                    'rgba(255, 159, 64)',
                    'rgba(255, 205, 86)',
                    'rgba(75, 192, 192)',
                    'rgba(54, 162, 235)'
                ],
                label: ''
            }],
            labels: [
                "今日净额", "昨天净额", "前天净额", "上周净额", "本周净额", "上月净额", "本季净额", "本年净额"
            ]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    }
}


export default {
    getCustomerRanking,
    getBusinessRanking,
    getBrandRanking,
    getHotSaleRanking,
    getSaleTrending,
    getCostProfitRanking,
    getBusinessVisitRanking,
    getHotOrderRanking,
    getSaleAnalysis
}