// 定义某个表的querySchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = {
    classLine: [
        {
            key: 'site',
            title: '所属基地',
            dataType: 'varchar',
            showType: 'full',
            placeholder: '请输入所属基地',
            disabled: true
        },
        {
            key: 'linename',
            title: '班线名称',
            dataType: 'varchar',
            placeholder: '请输入班线名称',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'string', min: 1, message: '必填，班线名称不能重复' },
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
                    { required: true, type: 'number', message: '必填，请输入正确的班线价格' },
                ],
                trigger: ['onChange']
            }]
        },
        {
            key: 'memo',
            title: '备注',
            dataType: 'varchar',
            showType: 'full',
            placeholder: '备注',
            feedBackShow: true,
            validate: [{
                rules: [
                    { min: 4, type: 'string', message: '非必填，如果填写至少4个汉字' },
                ],
                trigger: 'onChange',
            }]
        },
    ],
    policy: [
        {
            key: 'site',
            title: '所属基地',
            dataType: 'varchar',
            showType: 'full',
            placeholder: '请输入所属基地',
            disabled: true
        },
        {
            key: 'promotionname',
            title: '活动名称',
            dataType: 'varchar',
            placeholder: "请输入活动名称",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'string', message: '必填，活动名称不能为空' },
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
                        { required: true, type: 'string', message: '必填，请选择优惠类型' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'promotionnum',
            title: '优惠幅度',
            dataType: 'float',
            step: 0.1,
            placeholder: '请输入优惠幅度',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'number', message: '必填，优惠幅度不能为空' },
                    ],
                    trigger: ['onChange']
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
                        { required: true, type: 'string', message: '必填，请选择优惠对象' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'area',
            title: '区域',
            showType: 'select',
            options: [],
            placeholder: "请选择区域",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'string', message: '必填，请选择区域' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'startdate',
            keyEnd: 'enddate',
            title: '活动期限',
            dataType: 'datetime',
            showType: 'between',
            format: 'YYYY-MM-DD HH:mm:ss',
            feedBackShow: true,
            help: "必填，请选择活动期限",
            validate: [
                {
                    rules: [
                        { required: true },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'memo',
            title: '备注',
            dataType: 'varchar',
            showType: 'two',
            placeholder: '备注',
            feedBackShow: true,
            validate: [{
                rules: [
                    { min: 4, type: 'string', message: '非必填，如果填写至少4个汉字' },
                ],
                trigger: 'onChange',
            }]
        }
    ],
    accountManager: [
        {
            key: 'site',
            title: '所属基地',
            dataType: 'varchar',
            showType: 'full',
            placeholder: '请输入所属基地',
            disabled: true
        },
        {
            key: 'username',
            title: '姓名',
            dataType: 'varchar',
            placeholder: '请输入姓名',
            feedBackShow: true,
            validate: [{
                rules: [
                    { required: true, type: 'string', message: '必填，请输入姓名' },
                ],
                trigger: 'onChange',
            }]
        },
        {
            key: 'jobcard',
            title: '工号',
            dataType: 'varchar',
            placeholder: '请输入工号',
            feedBackShow: true,
            validate: [{
                rules: [
                    { required: true, type: 'string', message: '必填，请输入工号' },
                ],
                trigger: 'onChange',
            }]
        },
        {
            key: 'memo',
            title: '备注',
            dataType: 'varchar',
            showType: 'full',
            placeholder: '备注',
            feedBackShow: true,
            validate: [{
                rules: [
                    { type: 'string', min: 4, message: '非必填，如果填写至少4个汉字' },
                ],
                trigger: 'onChange',
            }]
        }
    ],
    contractTpl: [
        {
            key: 'modelname',
            title: '模板名称',
            dataType: 'varchar',
            showType: 'full',
            placeholder: '请输入模板名称',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'string', message: '必填，请输入模板名称' },
                    ],
                    trigger: 'onChange',
                }
            ]
        },
        {
            key: 'modeltext',
            title: '模板内容',
            dataType: 'textarea',
            showType: 'full',
            placeholder: '请输入模板内容',
            feedBackShow: true,
            validate: [{
                rules: [
                    { required: true, type: 'string', message: '必填，请输入模板内容' },
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
                        { required: true, type: 'string', message: '必填，请选择合同类型' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'memo',
            title: '备注',
            dataType: 'varchar',
            showType: 'full',
            placeholder: '备注',
            feedBackShow: true,
            validate: [{
                rules: [
                    { type: 'string', min: 4, message: '非必填，如果填写至少4个汉字' },
                ],
                trigger: 'onChange',
            }]
        }
    ],
    auditPerson: [
        {
            key: 'name',
            title: '开发中',
            dataType: 'varchar',
            placeholder: '开发中'
        }
    ]
}
