<template>
  <div>
    <p></p>
    <el-page-header @back="goBack"> </el-page-header>
    <p></p>
    <el-backtop></el-backtop>
    <el-card v-for="value in noticeList" :key="value">
      <el-descriptions
        column="2"
        :colon="false"
        v-loading="loading"
        element-loading-text="拼命加载中..."
      >
        <el-descriptions-item>
          {{ value.toUserName }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-time"></i>
            时间：
          </template>
          {{ date(value.createTime) }}
        </el-descriptions-item>
        <el-descriptions-item
          :contenteditable="{ 'font-size': '30px' }"
          :span="1"
        >
          <template slot="label">
            <i class="el-icon-document"></i>
          </template>
          {{ value.content }}
        </el-descriptions-item>
        <el-descriptions-item
          :contenteditable="{ 'font-size': '30px' }"
          :span="1"
        >
          <el-link
            class="none"
            :underline="false"
            @click.native="goTo(value.id)"
          >
            点击查看详情
          </el-link>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-divider><i class="el-icon-mobile-phone"></i></el-divider>

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
</template>

<script>
import { getnoticelist, deletemessage } from "@/api/message/fmessage";
import { dateFormat } from "@/utils/date";
export default {
  name: "noticeDetail",
  data() {
    return {
      pageNum: 0,
      total: 0,
      size: 5,
      noticeList: [],
      conversationId: "",
    };
  },
  created() {
    this.getParams();
    this.getNoticeTopicList(this.conversationId);
  },
  methods: {
    getParams() {
      this.conversationId = this.$route.query.conversationId;
    },
    date(data) {
      return dateFormat(data);
    },
    getNoticeTopicList(conversationId, page, size) {
      page = page ? page : this.pageNum;
      size = size ? size : this.size;
      getnoticelist(conversationId, page, size).then((res) => {
        if (res.data.code == 1) {
          console.log(res.data);
          this.noticeList = res.data.data;
          this.total = res.data.map.total;
        } else {
          console.log(res.data);
        }
      });
    },

    findSizeChange(size) {
      console.log("当每页条数改变的时候" + size);
      //将val赋值给size
      this.size = size;
      //重新去后台查询数据
      this.getNoticeTopicList();
    },

    findPage() {
      console.log(this.pageNum);
      this.getNoticeTopicList(this.pageNum, this.size);
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
    goTo(arg) {
      this.$router.push({
        path: "/discussPostDeatil",
        query: {
          id: arg,
        },
      });
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>
</style>