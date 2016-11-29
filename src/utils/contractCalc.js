import {
    notification
} from 'antd'

// 去重
const handleUniq = (arr, arr1, id) => {
    let ids = []
    if (arr.length == 0) {
        arr = arr1
    } else {
        arr.map(item => {
            ids.push(item[id])
        })
        arr1.map(item => {
            if (ids.indexOf(item[id]) == -1) {
                arr.push(item)
            }
        })
    }
    return arr
}

/**
 * 算法
 * 合同标准金额 = 班线费用 + 房间租金
 * 合同优惠 = 合同标准金额 * item
 * 冲抵总额 = 履约保证金冲抵 + 优惠金额
 * 合同金额 = 合同标准金额 - 冲抵总额
 * @memberOf ContractInsert
 */
const handleMonth = (startDate, endDate) => {
    const startArr = startDate.format('YYYY/MM/DD').split('/')
    const endArr = endDate.format('YYYY/MM/DD').split('/')
    let disMonths = (parseInt(endArr[0]) - parseInt(startArr[0])) * 12 + (parseInt(endArr[1]) - parseInt(startArr[1]))
    if (parseInt(endArr[2]) - parseInt(startArr[2]) > 0) {
        disMonths += 1
    }

    if (disMonths < 0) {
        notification.error({
            message: '起始时间有误',
            description: '请正确选择起始时间'
        })
        return false;
    }
    return disMonths
}

const handleMoney = (money, years, num = 2) => {
    return parseFloat((money * years / 12).toFixed(num))
}

const handleContractCalc = (roomArr, lineArr, policyArr, bondArr, marginmoney=0, startDate, endDate) => {
    const years = handleMonth(startDate, endDate)
    marginmoney = parseFloat(marginmoney.toFixed(2))
    console.log('月份：', years)
    let roommoney = 0               // 房间租金
    let linemoney = 0               // 班线费用
    let standardmoney = 0           // 合同标准金额

    let promotionmoneyoffset = 0    // 合同优惠        
    let marginmoneyoffset = 0       // 履约保证金冲抵
    let totaloffsetmoney = 0        // 冲抵总额

    let money = 0                   // 合同金额

    // 房间租金
    if (roomArr && roomArr.length) {
        roomArr.map(item => {
            roommoney += parseFloat(item.money)
        })
        roommoney = handleMoney(roommoney, years)
    }

    // 班线费用
    if (lineArr && lineArr.length) {
        lineArr.map(item => {
            linemoney += parseFloat(item.linefee)
        })
        linemoney = handleMoney(linemoney, years)
    }

    // 合同标准金额
    standardmoney = roommoney + linemoney

    // 合同优惠
    if (policyArr && policyArr.length) {
        let _roommoney = roommoney
        let _linemoney = linemoney
        // alert(_linemoney)
        policyArr.map(item => {
            if (item.promotionbody === '房间') {
                if (item.promotiontype === '减免') {
                    _roommoney = _roommoney - item.promotionnum
                } else if (item.promotiontype === '折扣') {
                    // alert(_roommoney)
                    _roommoney = parseFloat((_roommoney * item.promotionnum / 10).toFixed(2))
                    // alert(_roommoney)
                }
            } else if (item.promotionbody === '班线') {
                if (item.promotiontype === '减免') {
                    _linemoney = _linemoney - item.promotionnum
                } else if (item.promotiontype === '折扣') {
                    // alert(_linemoney)
                    _linemoney = parseFloat((_linemoney * item.promotionnum / 10).toFixed(2))
                    // alert(_linemoney)
                }
            }
        })

        if (_roommoney < 0 || _linemoney < 0) {
            let description = ''
            if(_roommoney < 0){
                description = '请查看合同房间或合同优惠主体房间的选择'
            }
            if(_linemoney < 0){
                description = '请查看合同班线或合同优惠主体班线的选择'
            }
            promotionmoneyoffset = 0
            notification.error({
                message:'优惠金额有误',
                description,
                duration: null
            })
        }else{
            promotionmoneyoffset = standardmoney - (_roommoney + _linemoney)
        }
    }

    // 履约保证金冲抵
    if (bondArr && bondArr.length) {
        bondArr.map(item => {
            marginmoneyoffset += parseFloat(item.marginmoney)
        })
    }

    // 冲抵总额
    totaloffsetmoney = marginmoneyoffset + promotionmoneyoffset

    // 合同金额
    money = standardmoney - totaloffsetmoney + marginmoney
    if (money < 0) {
        notification.error({
            message: '分期金额有误',
            description: '分期金额不能为零或负数'
        })
    }

    // 设置值
    return {
        roommoney,
        linemoney,
        standardmoney,
        marginmoneyoffset,
        promotionmoneyoffset,
        totaloffsetmoney,
        money
    }
}

export {
    handleUniq,
    handleContractCalc
}