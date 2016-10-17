// 定义某个表的querySchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = {
    room: [
        {
            key: 'type',  // 传递给后端的字段名
            title: '区域',  // 前端显示的名称

            // 数据类型, 前端会根据数据类型展示不同的输入框
            // 目前可用的dataType: int/float/varther/datetime
            dataType: 'varther',

            // 显示类型, 一些可枚举的字段, 比如type, 可以被显示为单选框或下拉框
            // 默认显示类型是normal, 就是一个普通的输入框, 这时可以省略showType字段
            // 目前可用的showType: normal/select/radio/between
            // select和radio只能用于int和varther
            // between只能用于int/float/datetime, 会显示2个输入框, 用于范围查询
            showType: 'select',
            options: [],
            placeholder: '请选择区域'
        },
        {
            key: 'build',
            title: '楼号',
            dataType: 'varther',
            showType: 'select',
            options: [],
            placeholder: '请选择楼号'
        },
        {
            key: 'room',
            title: '房间号',
            dataType: 'varther',
            placeholder: '请输入房间号'
        },
        {
            key: 'roomarea',
            title: '面积',
            dataType: 'float',
            placeholder: '请输入面积'
        },
        {
            key: 'money',
            title: '金额',
            dataType: 'float',
            placeholder: '请输入金额'
        },
        {
            key: 'memo',
            title: '备注',
            dataType: 'varther',
            showType: 'full',
            placeholder: '备注',
            feedBackShow: true,
            validate: [{
                rules: [
                    { min: 4, max: 255, message: '非必填，如果填写至少4个汉字' },
                ],
                trigger: 'onChange',
            }]
        }
    ],
    classLine: [
        {
            key: 'site',
            title: '所属基地',
            dataType: 'varther',
            showType: 'full',
            placeholder: '请输入所属基地',
            disabled: true
        },
        {
            key: 'linename',
            title: '班线名称',
            dataType: 'varther',
            placeholder: '请输入班线名称',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, min: 1, max: 100, message: '必填，班线名称不能重复' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'linefee',
            title: '班线价格',
            dataType: 'float',
            placeholder: '请输入班线价格',
            feedBackShow: true,
            step: 0.1,
            validate: [{
                rules: [
                    { required: true, message: '必填，请输入正确的班线价格' },
                ],
                trigger: ['onBlur', 'onChange']
            }]
        },
        {
            key: 'memo',
            title: '备注',
            dataType: 'varther',
            showType: 'full',
            placeholder: '备注',
            feedBackShow: true,
            validate: [{
                rules: [
                    { min: 4, max: 255, message: '非必填，如果填写至少4个汉字' },
                ],
                trigger: 'onChange',
            }]
        },
    ],
    policy: [
        {
            key: 'site',
            title: '所属基地',
            dataType: 'varther',
            showType: 'full',
            placeholder: '请输入所属基地',
            disabled: true
        },
        {
            key: 'promotionname',
            title: '活动名称',
            dataType: 'varther',
            placeholder: "请输入活动名称",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, max: 50, message: '必填，活动名称不能为空' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'promotiontype',
            title: '优惠类型',
            showType: 'select',
            options: [
                { key: '减免', value: '减免' },
                { key: '折扣', value: '折扣' }
            ],
            placeholder: "请选择优惠类型",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, message: '必填，请选择优惠类型' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'promotionnum',
            title: '优惠幅度',
            dataType: 'varther',
            placeholder: '请输入优惠幅度',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, max: 50, message: '必填，优惠幅度不能为空' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'promotionbody',
            title: '优惠对象',
            showType: 'select',
            options: [
                { key: '合同', value: '合同' },
                { key: '班线', value: '班线' }
            ],
            placeholder: "请选择优惠对象",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, message: '必填，请选择优惠对象' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'area',
            title: '区域',
            showType: 'select',
            options: JSON.parse(sessionStorage.getItem('areaBySite')),
            placeholder: "请选择区域",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, message: '必填，请选择区域' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'date',
            title: '活动期限',
            dataType: 'datetime',
            showType: 'between',
            format: 'YYYY-MM-DD HH:mm:ss',
            feedBackShow: true,
            help:"必填，请选择活动期限",
            validate: [
                {
                    rules: [
                        { required: true},
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'mome',
            title: '备注',
            dataType: 'varther',
            showType: 'two',
            placeholder: '备注',
            feedBackShow: true,
            validate: [{
                rules: [
                    { min: 4, max: 255, message: '非必填，如果填写至少4个汉字' },
                ],
                trigger: 'onChange',
            }]
        }
    ],
    accountManager: [
        {
            key: 'site',
            title: '所属基地',
            dataType: 'varther',
            showType: 'full',
            placeholder: '请输入所属基地',
            disabled: true
        },
        {
            key: 'username',
            title: '姓名',
            dataType: 'varther',
            showType: 'two',
            placeholder: '请输入姓名',
            feedBackShow: true,
            validate: [{
                rules: [
                    { required: true, max: 20, message: '必填，请输入姓名' },
                ],
                trigger: 'onChange',
            }]
        },
        {
            key: 'jobcard',
            title: '工号',
            dataType: 'varther',
            showType: 'two',
            placeholder: '请输入工号',
            feedBackShow: true,
            validate: [{
                rules: [
                    { required: true, max: 100, message: '必填，请输入工号' },
                ],
                trigger: 'onChange',
            }]
        },
        {
            key: 'mome',
            title: '备注',
            dataType: 'varther',
            showType: 'full',
            placeholder: '备注',
            feedBackShow: true,
            validate: [{
                rules: [
                    { min: 4, max: 255, message: '非必填，如果填写至少4个汉字' },
                ],
                trigger: 'onChange',
            }]
        }
    ],
    contractTpl: [
        {
            key: 'modelname',
            title: '模板名称',
            dataType: 'varther',
            showType: 'full',
            placeholder: '请输入模板名称',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, max: 255, message: '必填，请输入模板名称' },
                    ],
                    trigger: 'onChange',
                }
            ]
        },
        {
            key: 'modeltext',
            title: '模板内容',
            dataType: 'varther',
            showType: 'two',
            placeholder: '请输入模板内容',
            feedBackShow: true,
            validate: [{
                rules: [
                    { required: true, max: 255, message: '必填，请输入模板内容' },
                ],
                trigger: 'onChange',
            }]
        },
        {
            key: 'pactkind',
            title: '合同类型',
            showType: 'select',
            options: [
                { key: '合同', value: '合同' },
                { key: '协议', value: '协议' }
            ],
            placeholder: "请选择合同类型",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, message: '必填，请选择合同类型' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'mome',
            title: '备注',
            dataType: 'varther',
            showType: 'full',
            placeholder: '备注',
            feedBackShow: true,
            validate: [{
                rules: [
                    { min: 4, max: 255, message: '非必填，如果填写至少4个汉字' },
                ],
                trigger: 'onChange',
            }]

        }
    ],
    auditPerson: [
        {
            key: 'name',
            title: '开发中',
            dataType: 'varther',
            placeholder: '开发中'
        }
    ]
}
