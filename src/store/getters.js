const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  deptName: state => state.user.deptName,
  phone: state => state.user.phone,
  deptId: state => state.user.deptId,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  roles: state => state.user.roles,
  permissions: state => state.permission.permissions,
  permission_routes: state => state.permission.routes
}
export default getters
