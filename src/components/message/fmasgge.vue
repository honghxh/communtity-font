<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane name="first">
        <span slot="label"
          >用户私信<el-badge class="mark" :max="99" :value="letterUnreadCount" v-if ="letterUnreadCount != 0"
        /></span>
        <div>
          <el-button
            type="primary"
            class="comment"
            icon="el-icon-edit"
            round
            @click.native="dialogSendMessage = true"
            >发送私信</el-button
          >
          <el-backtop></el-backtop>
          <el-card class="list" v-for="value in messageData" :key="value">
            <!-- <a  class="none" target="_blank" href ="/discussPostDeatil"> -->
            <el-descriptions
              column="2"
              :colon="false"
              v-loading="loading"
              element-loading-text="拼命加载中..."
            >
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-user"></i>
                </template>
                <img :src="value.headerUrl" style="width:20px;heigth=10px" />
                {{ value.username }}与
                <img
                  :src="value.toUserHeader"
                  style="width:20px;heigth=10px"
                />{{ value.toUserName }}的私信会话
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-time"></i>
                  时间：
                </template>
                {{ dateFormat(value.createTime) }}
              </el-descriptions-item>
              <el-descriptions-item
                :contenteditable="{ 'font-size': '30px' }"
                :span="2"
              >
                <template slot="label">
                  <i class="el-icon-document"></i>
                  最新内容：
                </template>
                <el-link
                  class="none"
                  :underline="false"
                  @click="goTo(value.conversationId)"
                >
                  {{ value.content }}
                </el-link>
              </el-descriptions-item>
              <el-descriptions-item>
                <i class="el-icon-chat-line-square"></i>未读会话数：{{
                  value.letterUnreadCount
                }}
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-chat-line-square"></i>
                  总会话数：
                </template>
                {{ value.letterCount }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
          <el-divider><i class="el-icon-mobile-phone"></i></el-divider>

          <el-dialog
            title="发送私信"
            :visible.sync="dialogSendMessage"
            width="50%"
            :modal-append-to-body="false"
            :append-to-body="true"
          >
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="发送给：">
                <el-input v-model="form.toName"></el-input>
              </el-form-item>
              <el-form-item label="内容：">
                <el-input
                  type="textarea"
                  placeholder="不要发送不良评论哦"
                  v-model="form.content"
                ></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogSendMessage = false">取 消</el-button>
              <el-button type="primary" v-on:click="addMessage(form)"
                >发 送</el-button
              >
            </span>
          </el-dialog>
          <div style="display: inline-block">
            <el-pagination
              background="green"
              style="padding-top: 15px"
              @size-change="findSizeChange"
              @current-change="findPage"
              :current-page.sync="pageNum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              v-if="total != 0"
            >
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"
          >系统提示<el-badge class="mark" :max="99" :value="noticeUnreadCount" v-if ="noticeUnreadCount != 0"
        /></span>
        
        <el-empty :image-size="200"></el-empty>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { list, sendMessage } from "@/api/message/fmessage";
export default {
  name: "fmasggeTo",
  data() {
    return {
      activeName: "first",
      dialogSendMessage: false,
      loading: true,
      pageNum: 0,
      total: 0,
      size: 5,
      letterUnreadCount: "",
      noticeUnreadCount: "",
      messageData: [],
      dialogVisible:false,
      form: {
        toName: "",
        content: "",
      },
    };
  },
  mounted() {
    this.findAll(this.page, this.size);
  },
  methods: {
    dateFormat: function (time) {
      var date = new Date(time);
      var year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
    },
    findAll: function (page, size) {
      var that = this;
      page = page ? page : this.pageNum;
      size = size ? size : this.size;
      list(page, size).then((response) => {
        console.log(response.data);
        if (response.data.code == 1) {
          that.messageData = response.data.data;
          that.total = response.data.map.total;
          console.log(response.data.map.letterUnreadCount);
          that.letterUnreadCount = response.data.map.letterUnreadCount;
          that.noticeUnreadCount = response.data.map.noticeUnreadCount;
          that.loading = false;
        } else {
          console.log(response.data);
        }
      });
    },

    findSizeChange(size) {
      console.log("当每页条数改变的时候" + size);
      //将val赋值给size
      this.size = size;
      //重新去后台查询数据
      this.findAll();
    },

    findPage() {
      console.log(this.pageNum);
      this.findAll(this.pageNum, this.size);
    },
    goTo(arg) {
      this.$router.push({
        path: "/messageDetail",
        query: {
          conversationId: arg,
        },
      });
    },
    addMessage(form) {
      sendMessage(form).then((res) => {
        if (res.data.code == 1) {
          console.log(res.data);
          this.total = res.data.map.total;
          this.messageData = res.data.data;
          this.dialogSendMessage = false;
        } else {
          console.log(res.data);
        }
      });
    },
  },
};
</script>


<style>
.comment {
  margin-top: 5%;
  position: fixed;
  margin-left: 39%;
}
</style>