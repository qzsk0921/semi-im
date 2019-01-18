<template v-if="chatProps.liveUser">
  <div id="live-chat-msg-div">
    <div class="chat-msg-item" v-for="(textMsg, i) in msgData" :key="i">
      <span
        class="msg-item text-msg"
        v-if="((textMsg.type == 1 || textMsg.type == 16) && textMsg.objectName == 'HEP:TxtMsg')"
      >
        <img
          v-if="textMsg.user.userVip"
          class="user-level"
          :src="'../../static/images/userLevel/pic_caifu_lv'+textMsg.user.userVip+'@2x.png'"
          alt
        >
        <span class="user-name-span" v-html="textMsg.user.name + ' : '"></span>
        <span
          class="line-height-span"
          :class="{'barrage': textMsg.type == 16}"
          v-html="textMsg.content"
        ></span>
      </span>
      <span
        class="msg-item in-live-room"
        v-else-if="(textMsg.type == 3 && textMsg.objectName == 'HEP:TxtMsg')"
      >
        <img
          v-if="textMsg.user.userVip"
          class="user-level"
          :src="'../../static/images/userLevel/pic_caifu_lv'+textMsg.user.userVip+'@2x.png'"
          alt
        >
        <span class="line-height-span" v-html="textMsg.content"></span>
      </span>
      <span
        class="msg-item in-live-room"
        v-else-if="((textMsg.type == 2 || textMsg.type == 5) && textMsg.objectName == 'HEP:TxtMsg')"
      >
        <span class="line-height-span" v-html="textMsg.content"></span>
      </span>
      <span class="msg-item in-live-room" v-else-if="(textMsg.objectName == 'HEP:LiveShowLike')">
        <img
          v-if="textMsg.user.userVip"
          class="user-level"
          :src="'../../static/images/userLevel/pic_caifu_lv'+textMsg.user.userVip+'@2x.png'"
          alt
        >
        <span v-html="textMsg.user.name"></span>点亮了
        <img class="user-like" :src="'../../static/images/likes/'+textMsg.content+'@2x.png'" alt>
      </span>
    </div>
  </div>
</template>
<script>
import eventBus from "@/assets/js/bus";
/**
 * 云信聊天SDK，依赖于nim sdk
 */
import config from "@/configs";
// const SDK = require("@/assets/js/" + config.sdk); //云信

export default {
  name: "liveChatMsg",
  props: ["chatProps"],
  data: function() {
    return {
      msgData: [],
      IMInit: false,
      userData: {
        id: this.$common.getLocalStorage("user_id"),
        portrait: this.$common.getLocalStorage("user_pic"),
        userVip: this.$common.getLocalStorage("level")
          ? this.$common.getLocalStorage("level")
          : 0
      }
    };
  },
  created: function() {
    this.initChatDate();
  },
  destroyed: function() {
    // this.quitChatRoom();   // 退出聊天室
    RongIMClient.getInstance().disconnect(); // IM销毁链接
    // this.$store.dispatch('resetChatroomSDK', this.chatroomId) //离开页面，重置当前对话
    eventBus.$off("sendGif");
    eventBus.$off("sendTextMsg");
    eventBus.$off("sendBigGigftMsg");
    eventBus.$off("closeLiveRoom");
    console.log("destroyed");
  },
  watch: {
    msgData: function() {
      this.$nextTick(() => {
        let el = document
          .getElementById("live-chat-msg-div")
          .querySelector("div:last-child");
        el.scrollIntoView({ block: "end", behavior: "smooth" });
      });

      if (this.msgData.length >= 25) {
        this.msgData.shift();
      }
    }
  },
  methods: {
    initChatDate: function() {
      this.welcomeMsg();
      this.initRongIMC(); // 初始化 融云
      // 切换IM通道（融云，云信）
      // if (this.IMstatus === 1) {
      //   this.initRongIMC();
      // } else if (this.IMstatus === 2) {
      //   this.initNIM();
      //   this.$store.dispatch("connect", {
      //     type: "chatroom",
      //     chatroomId: this.chatroomId
      //   });
      // }
      // 订阅发送礼物事件
      eventBus.$on("sendGif", data => {
        let messageName = "TextMessage";
        let objName = "HEP:LiveShowGift";
        let propertysNames = [
          "content",
          "giftaddtime",
          "giftid",
          "giftname",
          "giftprice",
          "giftsendcount",
          "isrtc",
          "objectName",
          "objectname",
          "sendercurrtime",
          "sendertotalltime",
          "touserid",
          "tousername",
          "user"
        ];
        var msgContent = {
          content: "{}",
          giftaddtime: 0,
          giftid: data.id,
          giftname: data.title,
          giftprice: data.price,
          giftsendcount: "1",
          isrtc: "0",
          objectName: objName,
          objectname: objName,
          sendercurrtime: 0,
          sendertotalltime: 0,
          touserid: this.chatProps.liveUser.user_id,
          tousername: this.chatProps.liveUser.user_nickname,
          user: this.userData
        };
        //  console.log(data);
        this.sendIMMessage(
          messageName,
          objName,
          propertysNames,
          msgContent,
          this.giftMsg
        );
      });

      // text消息
      eventBus.$on("sendTextMsg", data => {
        let messageName = "TextMessage";
        let objName = "HEP:TxtMsg";
        let propertysNames = [
          "content",
          "objectName",
          "objectname",
          "pushContent",
          "user"
        ];

        var msgContent = {
          content: data.content, // ep '{"content":"我要疯了","type":1,"price":0}'
          objectName: objName,
          objectname: objName,
          pushContent: data.content,
          user: this.userData
        };

        this.sendIMMessage(
          messageName,
          objName,
          propertysNames,
          msgContent,
          this.sendTextMsgRes
        );
      });

      // gift礼物text消息
      eventBus.$on("sendBigGigftMsg", data => {
        this.txetMsg(data);
      });
    },
    // 直播间公告
    welcomeMsg: function() {
      let data = {
        content:
          '{"content":"合拍直播: ' +
          this.chatProps.liveUser.welcome_msg +
          '","type":3,"price":0}',
        objectName: "HEP:TxtMsg",
        objectname: "HEP:TxtMsg",
        // pushContent: data.content,
        user: {
          name: "合拍直播",
          userVip: 0
        }
      };
      this.txetMsg(data);
    },
    // 加入聊天室
    joinChatRoom: function() {
      var _this = this;
      var chatRoomId = this.chatProps.liveUser.room_id;
      var count = -1; // 拉取最近聊天最多 50 条。 -1不拉取
      // 加入聊天室
      RongIMClient.getInstance().joinChatRoom(chatRoomId, count, {
        onSuccess: function() {
          console.log("加入聊天室成功");
          _this.$emit("joinChatRoomRes", true);
        },
        onError: function(error) {
          console.log(error);
          console.log("加入聊天室失败");
          _this.$emit("joinChatRoomRes", false);
          //  _this.reconectRongIM();
        }
      });
    },
    // 退出聊天室
    quitChatRoom: function() {
      var _this = this;
      var chatRoomId = this.chatProps.liveUser.room_id;
      RongIMClient.getInstance().quitChatRoom(chatRoomId, {
        onSuccess: function() {
          console.log("退出聊天室成功。");
          // RongIMClient.getInstance().disconnect();
        },
        onError: function(error) {
          console.log(_this.chatProps.liveUser.room_id);
          // _this.quitChatRoom();
          console.log("退出聊天室失败。");
        }
      });
    },
    // 发送IM聊天消息
    sendIMMessage: function(
      messageName,
      objName,
      propertysNames,
      msgContent,
      callBack
    ) {
      // 发送IM消息
      // console.log(msgContent)
      if (!this.IMInit) {
        console.log("IM未连接成功！");
        return;
      }
      var messageName = messageName; // 消息名称。
      var objectName = objName; // 消息内置名称，请按照此格式命名。
      var mesasgeTag = new RongIMLib.MessageTag(false, false); // 消息是否保存是否计数，true true 保存且计数，false false 不保存不计数。
      var propertys = propertysNames; // 消息类中的属性名。
      RongIMClient.registerMessageType(
        messageName,
        objectName,
        mesasgeTag,
        propertys
      );
      var conversationType = RongIMLib.ConversationType.CHATROOM; //单聊,其他会话选择相应的消息类型即可。
      var targetId = this.chatProps.liveUser.room_id; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
      // console.log(this.chatProps.rongYun.chatroomId)
      msgContent.user.name = this.$common.getLocalStorage("user_nickname");
      var msg = new RongIMClient.RegisterMessage.TextMessage(msgContent);
      RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
        onSuccess: function(message) {
          callBack(message["content"]);
        },
        onError: function(errorCode) {
          console.log(errorCode);
        }
      });
    },
    // 处理text消息
    txetMsg: function(data) {
      let content = JSON.parse(RongIMLib.RongIMEmoji.emojiToHTML(data.content));
      data.user.name = RongIMLib.RongIMEmoji.emojiToHTML(data.user.name);
      this.$nextTick(() => {
        switch (content["type"]) {
          case 1: // 聊天消息
          case 16:
            this.msgData.push({
              type: content["type"],
              content: content.content,
              user: data.user,
              objectName: data.objectName
            });
            break;
          case 2: // 关注
            this.msgData.push({
              type: 2,
              content: data.user.name + " 关注了主播",
              user: data.user,
              objectName: data.objectName
            });

            break;
          case 3: // 进场
            let str = new RegExp("join_msg");
            let contentMsg = "";
            if (str.test(content.content)) {
              contentMsg = JSON.parse(content.content).join_msg;
            } else {
              contentMsg = content.content;
            }
            this.msgData.push({
              type: 3,
              content: contentMsg,
              user: data.user,
              objectName: data.objectName
            });

            break;
          case 5: // 分享
            this.msgData.push({
              type: 5,
              content: content.content,
              user: data.user,
              objectName: data.objectName
            });
            break;
          case 14: // 关播
            eventBus.$emit("closeLiveRoom");
            break;

          default:
            break;
        }
      });
    },
    // 礼物消息
    giftMsg: function(data) {
      eventBus.$emit("giftMsg", data);
      // console.log(data)
    },
    // 点亮消息
    likeMsg: function(data) {
      this.$nextTick(() => {
        if (data.showmessage == 1) {
          this.msgData.push({
            content: data.content.match(/\[(.*?)\]/)[1],
            user: data.user,
            objectName: data.objectName,
            showmessage: data.showmessage
          });
        }
      });
    },
    sendTextMsgRes(data) {
      if (data) {
        // console.log(data);return;
        this.txetMsg(data);
        this.$emit("textMsgRes", { result: 1 });
      }
    },
    // 融云IM重连
    reconectRongIM: function() {
      let callback = {
        onSuccess: function(userId) {
          console.log("IM重连成功");
        },
        onTokenIncorrect: function() {
          console.log("token无效");
        },
        onError: function(errorCode) {
          console.log(errorCode);
        }
      };
      let config = {
        // 默认 false, true 启用自动重连，启用则为必选参数
        auto: true
        // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
        // url: 'cdn.ronghub.com/RongIMLib-2.3.0.min.js',
        // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
        // rate: [100, 1000, 3000, 6000, 10000]
      };
      RongIMClient.reconnect(callback, config);
    },
    initRongIMC() {
      // 初始化融云IM
      var _this = this;

      // 初始化

      RongIMLib.RongIMClient.init("e5t4ouvptezfa");
      var token = _this.$common.getLocalStorage("rongcloud_token"); // ecp8NZWxmWHHhkD3YHHNoSHqFkk3qoyq59DPkmoC9OebpHsBgRfUe0YzxIj6Z9Uy+oVaFEoyvQ7/HdiCYnEyjA==
      //    RongIMLib.RongIMEmoji.init();
      var chatRoomId = _this.chatProps.liveUser.room_id; // 聊天室 Id。
      // 设置连接监听状态 （ status 标识当前连接状态 ）
      // 连接状态监听器
      RongIMClient.setConnectionStatusListener({
        onChanged: function(status) {
          switch (status) {
            case RongIMLib.ConnectionStatus.CONNECTED:
              console.log("链接成功");
              break;
            case RongIMLib.ConnectionStatus.CONNECTING:
              console.log("正在链接");
              break;
            case RongIMLib.ConnectionStatus.DISCONNECTED:
              console.log("断开连接");
              // _this.reconectRongIM();
              break;
            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
              console.log("其他设备登录");
              // _this.reconectRongIM();
              break;
            case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
              console.log("域名不正确");
              break;
            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
              console.log("网络不可用");
              // _this.reconectRongIM();
              break;
          }
        }
      });

      // 消息监听器
      RongIMClient.setOnReceiveMessageListener({
        // 接收到的消息
        onReceived: function(message) {
          // console.log(message)
          // 判断消息类型
          switch (message.messageType) {
            case RongIMClient.MessageType.TextMessage:
              // message.content.content => 消息内容
              // console.log(message)
              switch (message["objectName"]) {
                case "HEP:TxtMsg":
                  var msgContent = message["content"];
                  _this.txetMsg(msgContent);
                  // console.log(message)
                  break;
                case "HEP:LiveShowGift":
                  // console.log(message['content'])
                  _this.giftMsg(message["content"]);
                  break;
                default:
                  break;
              }
              break;
            case RongIMClient.MessageType.VoiceMessage:
              // 对声音进行预加载
              // message.content.content 格式为 AMR 格式的 base64 码
              break;
            case RongIMClient.MessageType.ImageMessage:
              // message.content.content => 图片缩略图 base64。
              // message.content.imageUri => 原图 URL。
              break;
            case RongIMClient.MessageType.DiscussionNotificationMessage:
              // message.content.extension => 讨论组中的人员。
              break;
            case RongIMClient.MessageType.LocationMessage:
              // message.content.latiude => 纬度。
              // message.content.longitude => 经度。
              // message.content.content => 位置图片 base64。
              break;
            case RongIMClient.MessageType.RichContentMessage:
              // message.content.content => 文本消息内容。
              // message.content.imageUri => 图片 base64。
              // message.content.url => 原图 URL。
              break;
            case RongIMClient.MessageType.InformationNotificationMessage:
              // do something...
              break;
            case RongIMClient.MessageType.ContactNotificationMessage:
              // do something...
              break;
            case RongIMClient.MessageType.ProfileNotificationMessage:
              // do something...
              break;
            case RongIMClient.MessageType.CommandNotificationMessage:
              // do something...
              break;
            case RongIMClient.MessageType.CommandMessage:
              // do something...
              break;
            case RongIMClient.MessageType.UnknownMessage:
              // console.log(message)
              switch (message["objectName"]) {
                // 文本消息
                case "HEP:TxtMsg":
                  _this.txetMsg(message["content"]["message"]["content"]);
                  break;
                // 礼物消息
                case "HEP:LiveShowGift":
                  _this.giftMsg(message["content"]["message"]["content"]);
                  // console.log(message)
                  break;
                // 点亮
                case "HEP:LiveShowLike":
                  _this.likeMsg(message["content"]["message"]["content"]);
                default:
                  break;
              }
              break;
            default:
            // do something...
          }
        }
      });

      // 连接融云服务器。
      RongIMClient.connect(
        token,
        {
          onSuccess: function(userId) {
            _this.IMInit = true;
            console.log("Login successfully");
            _this.joinChatRoom();
          },
          onTokenIncorrect: function() {
            console.log("token无效");
          },
          onError: function(errorCode) {
            var info = "";
            switch (errorCode) {
              case RongIMLib.ErrorCode.TIMEOUT:
                info = "超时";
                break;
              case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                info = "未知错误";
                break;
              case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                info = "不可接受的协议版本";
                break;
              case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                info = "appkey不正确";
                break;
              case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                info = "服务器不可用";
                break;
            }
            console.log(errorCode);
          }
        }
      );
    },
    initNIM() {
      this.$store.dispatch('connect', {
        type: 'chatroom',
        chatroomId: this.chatroomId
      })
      // 初始化云信IM
      var _this = this;
      var token = _this.$common.getLocalStorage("rongcloud_token"); // ecp8NZWxmWHHhkD3YHHNoSHqFkk3qoyq59DPkmoC9OebpHsBgRfUe0YzxIj6Z9Uy+oVaFEoyvQ7/HdiCYnEyjA==
      //    RongIMLib.RongIMEmoji.init();
      var chatRoomId = _this.chatProps.liveUser.room_id; // 聊天室 Id。
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/scss/function";

#live-chat-msg-div {
  box-sizing: border-box;
  padding: 0 torem(20px);

  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  transition: all 0.5s;

  .chat-msg-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    margin: torem(10px) 0;
    text-shadow: 0 0 torem(1px) rgba(0, 0, 0, 1);
    transition: all 0.5s;

    .msg-item {
      font-size: torem(28px);
      border-radius: torem(250px) / 5;
      padding: torem(5px) torem(25px);
      line-height: torem(37px);
      background-color: rgba(0, 0, 0, 0.2);

      .line-height-span {
        line-height: torem(37px);
      }

      .barrage {
        color: #ffe600;
      }

      .user-name-span {
        color: #fff;
        opacity: 0.6;
      }

      .user-level {
        width: torem(66px);
        height: torem(30px);
        vertical-align: sub;
      }

      .user-like {
        width: torem(35px);
        height: torem(35px);
        margin-left: torem(8px);
        vertical-align: sub;
      }
    }

    .text-msg {
      color: #fff;
    }

    .in-live-room {
      color: rgb(54, 232, 251);
    }
  }
}
</style>

