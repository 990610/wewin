import { login, logout, getInfo } from '@/api/login/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    deptName: '',
    phone: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_DEPTNAME: (state, deptName) => {
    state.deptName = deptName
  },
  SET_PHONE: (state, phone) => {
    state.deptName = phone
  }

}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, captcha, uuid } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, captcha, uuid }).then(response => {
        console.log(response)
        commit('SET_TOKEN', response.token)
        setToken(response.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        console.log(response)
        // const { data } = response
        if (!response.userName) {
          return reject('Verification failed, please Login again.')
        }
        const { userName, deptName, phone } = response
        commit('SET_NAME', userName)
        commit('SET_DEPTNAME', deptName)
        commit('SET_PHONE', phone)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

