<template>
  <div>
    <p></p>
    <el-page-header @back="goBack"> </el-page-header>
    <p></p>
    <el-backtop></el-backtop>
    <el-button
      type="primary"
      class="comment"
      icon="el-icon-edit"
      round
      @click.native="dialogSendMessage = true"
      >回复</el-button
    >
    <el-card class="list" v-for="value in messageData" :key="value">
      <el-descriptions
        column="2"
        :colon="false"
        v-loading="loading"
        element-loading-text="拼命加载中..."
      >
        <template slot="extra">
          <el-link
            class="none"
            :underline="false"
            @click="deleteMessage(value.id)"
          >
            <i class="el-icon-delete"></i>
          </el-link>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            用户：
          </template>
          <img :src="value.headerUrl" style="width:20px;heigth=10px" />
          {{ value.username }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-time"></i>
            评论时间：
          </template>
          {{ dateFormat(value.createTime) }}
        </el-descriptions-item>

        <el-descriptions-item
          :contenteditable="{ 'font-size': '30px' }"
          :span="2"
        >
          <template slot="label">
            <i class="el-icon-chat-line-square"></i>
          </template>
          {{ value.content }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-dialog
      title="回复私信"
      :visible.sync="dialogSendMessage"
      width="50%"
      :modal-append-to-body="false"
      :append-to-body="true"
    >
      <el-form ref="form" :model="form" label-width="80px">
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
    <el-divider><i class="el-icon-mobile-phone"></i></el-divider>
    <div style="display: inline-block">
      <el-pagination
        v-if="total != 0"
        background="green"
        style="padding-top: 15px"
        @size-change="findSizeChange"
        @current-change="findPage"
        :current-page.sync="pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { sendMessage, deletemessage } from "@/api/message/fmessage";
import { converList } from "@/api/message/fmessage";
export default {
  name: "messageDetail",
  data() {
    return {
      dialogSendMessage: false,
      conversationId: "",
      toUsername: "",
      pageNum: 0,
      total: 0,
      size: 5,
      messageData: [],
      form: {
        toName: "",
        content: "",
      },
    };
  },
  created() {
    this.getParams();
    this.findAll(this.conversationId);
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
    getParams() {
      this.conversationId = this.$route.query.conversationId;
    },

    findAll: function (conversationId, page, size) {
      var that = this;
      page = page ? page : this.pageNum;
      size = size ? size : this.size;
      converList(this.conversationId, page, size).then((response) => {
        console.log(response.data);
        if (response.data.code == 1) {
          that.toName = response.data.map.toUser.username;
          that.messageData = response.data.data;
          that.total = response.data.map.letterCount;
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
      this.DiscussPostComment();
    },

    findPage() {
      console.log(this.pageNum);
      this.DiscussPostComment(this.conversationId, this.pageNum, this.size);
    },
    // 评论
    addMessage(form) {
      this.form.toName = this.toName;
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
    deleteMessage(id) {
      deletemessage(id).then((res) => {
        if (res.data.code == 1) {
          console.log(res.data);
          this.messageData = res.data.data;
          this.total = res.data.map.letterCount;
        } else {
          console.log(res.data);
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>
.list {
  border-radius: 30px;
  width: 80%;
  margin-left: 10%;
  margin-top: 2%;
}

.comment {
  margin-top: 5%;
  position: fixed;
  margin-left: 39%;
}
</style>