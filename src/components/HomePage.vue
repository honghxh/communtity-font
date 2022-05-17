<template>
  <div>
    <p>首页</p>
    <el-backtop></el-backtop>
    <el-button
      type="primary"
      class="edit"
      icon="el-icon-edit"
      round
      @click="dialogEditPost = true"
      >发布新帖子</el-button
    >
    <el-card class="list" v-for="item in tableData" :key="item">
      <!-- <a  class="none" target="_blank" href ="/discussPostDeatil"> -->
      <el-descriptions
        column="2"
        :colon="false"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        v-for="value in item"
        :key="value"
      >
        <el-descriptions-item label-class-name="my-label" span="1">
          <template slot="label">
            <i class="el-icon-collection"></i>
            标题：
          </template>
          <el-link class="none" :underline="false" @click="goTo(value.id)">
            {{ value.title }}
          </el-link>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            发布用户：
          </template>
          <img :src="value.headerUrl" style="width:20px;heigth=10px" />
          {{ value.username }}
        </el-descriptions-item>
        <el-descriptions-item
          :contenteditable="{ 'font-size': '30px' }"
          :span="2"
        >
          <template slot="label">
            <i class="el-icon-document"></i>
            内容：
          </template>
          {{ value.content }}
        </el-descriptions-item>

        <el-descriptions-item :contentStyle="{ 'text-align': 'right' }">
          <template slot="label">
            <i class="el-icon-chat-line-square"></i>
            评论数：
          </template>
          {{ value.commentCount }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-time"></i>
            发布时间：
          </template>
          {{ dateFormat(value.createTime) }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            点赞数
          </template>
          {{ value.likeCount }}
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
        v-if="total!=0"
      >
      </el-pagination>
    </div>

    <el-dialog
      title="发布帖子"
      :visible.sync="dialogEditPost"
      width="50%"
      :modal-append-to-body="false"
      :append-to-body="true"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditPost = false">取 消</el-button>
        <el-button type="primary" v-on:click="addPost(form)">发 布</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { list } from "@/api/home/tableList";
import { editPost } from "@/api/home/tableList";

export default {
  name: "HomePage",

  data() {
    return {
      dialogEditPost: false,
      loading: true,
      pageNum: 0,
      total: 0,
      size: 5,
      tableData: [],
      form: {
        title: "",
        content: "",
      },
    };
  },
  mounted(page, size) {
    var that = this;
    page = page ? page : this.pageNum;
    size = size ? size : this.size;
    list(page, size).then((response) => {
      that.total = response.data.map.total;
      that.tableData = response.data.data;
      that.loading = false;
    });
  },
  methods: {
    dateFormat:function(time) {
    var date=new Date(time);
    var year=date.getFullYear();
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
    var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
    var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
    var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
    var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
    // 拼接
    return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
},
    goTo(arg) {
      this.$router.push({
        // path: `/discussPostDeatil/${arg}`,
        path: "/discussPostDeatil",
        query: {
          id: arg,
        },
      });
    },
    findAll: function (page, size) {
      var that = this;
      page = page ? page : this.pageNum;
      size = size ? size : this.size;
      this.axios
        .get("http://localhost:8081/home", {
          params: {
            pageNum: page,
            pageSize: size,
          },
        })
        .then((response) => {
          that.total = response.data.map.total;
          that.tableData = response.data.data;
          that.loading = false;
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
    addPost(form) {
      editPost(form).then((response) => {
        console.log(response.data);
        this.dialogEditPost = false;
      });
    },
  },
};
</script>

<style>
.list {
  border-radius: 30px;
  width: 80%;
  margin-left: 10%;
}
.none {
  text-decoration: none;
}
.my-label {
  background: #e1f3d8;
}
.edit {
  margin-top: 5%;
  position: fixed;
  margin-left: 39%;
}
</style>