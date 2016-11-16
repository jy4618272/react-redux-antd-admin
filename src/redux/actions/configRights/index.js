import { default as departmentActionCreators } from './department'

import { default as postActionCreators } from './post'

import { default as roleActionCreators } from './role'

import { default as userActionCreators } from './user'



export default {
  ...departmentActionCreators,
  ...postActionCreators,
  ...roleActionCreators,
  ...userActionCreators
}
