import {initNimSDK} from './initNimSDK'
import {initChatroomSDK, resetChatroomSDK} from './initChatroomSDK'

function connectNim({ state, commit, dispatch }, obj) {
    let { force } = Object.assign({}, obj)
    // 操作为内容页刷新页面，此时无nim实例
    if (!state.nim || force) {
        let loginInfo = {
            uid: cookie.readCookie('uid'),
            sdktoken: cookie.readCookie('sdktoken'),
        }
        if (!loginInfo.uid) {
            // 无cookie，直接跳转登录页
            pageUtil.turnPage('无历史登录记录，请重新登录', 'login')
        } else {
            // 有cookie，重新登录
            dispatch('initNimSDK', loginInfo)
        }
    }
}

function connectChatroom({ state, commit, dispatch }, obj) {
    let { chatroomId } = Object.assign({}, obj)
    const nim = state.nim
    if (nim) {
        dispatch('showLoading')
        nim.getChatroomAddress({
            chatroomId,
            done: function getChatroomAddressDone(error, obj) {
                if (error) {
                    alert(error.message)
                    location.href = '#/room'
                    return
                }
                dispatch('initChatroomSDK', obj)
            }
        })
    }
}

export default {
    // 连接sdk请求，false表示强制重连
    connect(store, obj) {
        let { type } = Object.assign({}, obj)
        // type 可为 nim chatroom
        type = type || 'nim'
        switch (type) {
            case 'nim':
                connectNim(store, obj)
                break
            case 'chatroom':
                connectChatroom(store, obj)
                break
        }
    },
    // 初始化 重新连接SDK
    initNimSDK,
    initChatroomSDK,
    resetChatroomSDK,
}


// this.$store.dispatch('connect', {
//     type: 'chatroom',
//     chatroomId: this.chatroomId
// })