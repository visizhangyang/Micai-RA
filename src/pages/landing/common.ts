export const REGEX_PHONE_NUMBER = new RegExp('^1[3|4|5|7|8][0-9]\\d{8}$|^0{6}\\d{5}$')

export const REGEX_PASSWORD_NUMBER = new RegExp('^(?=.*\\d)(?=.*[a-zA-Z])\\w{8,}$')

export const REGEX_PHONE_CODE = new RegExp('^\\d{6}$')

export const MAP_ERROR_CODE = {
    phone_unregistered: '手机号没有注册',
    login_failed_error: '手机,验证码有误,请重试',
    serializer_validation_error: '提交的数据有误',
    phone_registered: '该手机号已被注册过了',
    user_has_active_phone: '您已经用这个手机号注册过了一次',
    phone_verification_error: '验证码不正确或已经过期，请尝试重新发送验证码',
    phone_not_found: '请先发送验证码到这个手机号',
    phone_verification_send_failed: '无法发送短信，请联系弥财支持团队',
    incorrect_password: '密码不正确',
    invalid_invite_code: '输入的邀请码不存在',
    account_inactive: '您的试用账户已过期，如果需要重新获得授权登录，请与弥财公司联系(support@micaiapp.com)',
}