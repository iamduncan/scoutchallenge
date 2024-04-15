import { type StrategyVerifyCallback } from 'remix-auth'
import { OAuth2Strategy, OAuth2StrategyVerifyParams } from 'remix-auth-oauth2'

import {
	type AdditionalFacebookProfileField,
	type FacebookProfile,
	type FacebookScope,
	type FacebookExtraParams,
	type FacebookStrategyOptions,
} from './types'
export * from './types'

export const baseProfileFields = [
  'id',
  'email',
  'name',
  'first_name',
  'middle_name',
  'last_name',
  'picture',
] as const

export const FacebookStrategyName = 'facebook'
export const FacebookStrategyDefaultScopes: FacebookScope[] = [
  'public_profile',
  'email'
]
export const FacebookStrategyScopeSeparator = ','
export 
