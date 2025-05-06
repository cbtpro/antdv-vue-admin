import { createFormItem } from './FormItem';

const userName = createFormItem('input', {
  label: '用户名称',
  field: 'userName',
  value: '',
  placeholder: '请输入用户名',
  rules: [{ required: true, message: '用户名不能为空' }],
}, () => userType);

const userType = createFormItem('radio', {
  label: '用户类型',
  field: 'userType',
  value: 'external',
  options: [
    { label: '内部用户', value: 'internal' },
    { label: '外部用户', value: 'external' },
  ],
  rules: [{
    required: true, message: '用户类型不能为空'
  }],
}, (current) => current.payload.value === 'internal' ? internalUserRole : functions);

const internalUserRole = createFormItem('select', {
  label: '用户角色',
  field: 'userRole',
  value: 'operator',
  options: [
    { label: '运营人员', value: 'operator' },
    { label: '产品经理', value: 'pm' },
    { label: '技术支持', value: 'support' },
  ],
}, (current) => {
  if (current.payload.value === 'pm') return functions;
  if (current.payload.value === 'support') return notificationMethod;
  return null;
});

const functions = createFormItem('checkbox', {
  label: '功能授权',
  field: 'permissions',
  value: ['export'],
  options: [
    { label: '数据导出', value: 'export' },
    { label: '系统配置', value: 'config' },
    { label: '消息通知类型', value: 'messageChannel' },
  ],
}, (current) => current.payload.value.includes('messageChannel') ? notificationMethod : null);

const notificationMethod = createFormItem('radio', {
  label: '通知方式',
  field: 'notificationMethod',
  value: 'email',
  options: [
    { label: '邮件', value: 'email' },
    { label: '站内信', value: 'inbox' },
    { label: '短信', value: 'sms' },
  ],
});

export default userName;
