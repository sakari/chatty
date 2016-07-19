// @flow
//
export const development = process.env.NODE_ENV === 'development'
export const cookiePassword = development ? "password-should-be-32-characters" : process.env.cookie_password

