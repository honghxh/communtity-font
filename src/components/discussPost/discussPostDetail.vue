<template>
  <div>
    <p></p>
    <el-page-header @back="goBack"> </el-page-header>
    <p></p>
    <el-card>
      <el-descriptions
        column="2"
        :colon="false"
        v-loading="loading"
        element-loading-text="拼命加载中..."
      >
        <el-descriptions-item label-class-name="my-label" span="2">
          {{ post.title }}
        </el-descriptions-item>

        <el-descriptions-item span="1">
          <img :src="post.headerUrl" style="width:20px;heigth=10px" />
          {{ post.username }}
        </el-descriptions-item>

        <el-descriptions-item
          :contentStyle="{ 'text-align': 'right' }"
          span="1"
        >
          <template slot="label">
            <i class="el-icon-time"></i>
          </template>
          {{ dateFormat(post.createTime) }}
        </el-descriptions-item>

        <el-descriptions-item
          :contenteditable="{ 'font-size': '50px' }"
          span="2"
        >
          {{ post.content }}
        </el-descriptions-item>
        <el-descriptions-item content-class-name="item-foot" span="2">
          <el-tooltip content="赞一下" placement="bottom" effect="light">
            
            <el-badge
              :value="post.likeCount"
              class="item"
              type="primary"
            >
            <el-button
              class="el-icon-arrow-up"
              circle
              @click="postLike(post.id, post.userId)"
            >
            </el-button
            >
            </el-badge>
          </el-tooltip>
          <el-divider direction="vertical"></el-divider>
          <el-tooltip content="踩一下" placement="bottom" effect="light">
            <el-badge :value="total" class="item" type="primary">
              <el-button class="el-icon-arrow-down" circle> </el-button>
            </el-badge>
          </el-tooltip>
          <el-divider direction="vertical"></el-divider>
          <el-tooltip content="关注" placement="bottom" effect="light" v-if="followStatus!=false">
            <el-badge :value="post.followCount" class="item" type="primary">
              <el-button class="el-icon-star-off" circle @click="toFollow(post.id)"> </el-button>
            </el-badge>
          </el-tooltip>
          <el-tooltip content="取消关注" placement="bottom" effect="light" v-else>
            <el-badge :value="post.followCount" class="item" type="primary">
              <el-button class="el-icon-star-on" circle @click="unFollow(post.id)"> </el-button>
            </el-badge>
          </el-tooltip>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <p></p>
    <span><i class="el-icon-chat-line-square"></i>共{{ total }}条评论</span>
    <p></p>
    <el-backtop></el-backtop>

    <el-button
      type="primary"
      class="comment"
      icon="el-icon-edit"
      round
      @click.native="dialogAddComment = true"
      >发布评论</el-button
    >

    <el-dialog
      title="编写评论"
      :visible.sync="dialogAddComment"
      width="50%"
      :modal-append-to-body="false"
      :append-to-body="true"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="内容">
          <el-input
            type="textarea"
            placeholder="请友善发言哦"
            v-model="form.content"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddComment = false">取 消</el-button>
        <el-button type="primary" v-on:click="addComment(form)"
          >发 布</el-button
        >
      </span>
    </el-dialog>

    <el-card class="list" v-for="item in commentTable" :key="item">
      <el-descriptions
        column="2"
        :colon="false"
        v-loading="loading"
        element-loading-text="拼命加载中..."
        v-for="value in item"
        :key="value"
      >
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
        <el-descriptions-item>
          <el-tooltip content="赞一下" placement="top" effect="dark">
            <el-badge
              :value="value.commentLikeCount"
              class="item"
              type="primary">
            <el-button class="el-icon-arrow-up" circle @click="commentLike(value.id, value.userId)"> </el-button>
            </el-badge>
          </el-tooltip>

          <el-tooltip content="发表回复" placement="top">
            <el-button
              icon="el-icon-edit"
              circle
              class="item"
              v-on:click="replycomment(value.id, value.userId)"
            ></el-button>
          </el-tooltip>

          <el-tooltip content="点击查看回复" effect="light" placement="top">
            <el-link
              class="item"
              :underline="false"
              v-on:click="displayList(value.id)"
              type="primary"
              v-if="value.total != 0"
            >
              查看{{ value.total }}条回复
            </el-link>
          </el-tooltip>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-dialog :visible.sync="replyDetail">
      <el-card class="replylist" v-for="item in replyTable" :key="item">
        <el-descriptions
          column="2"
          :colon="false"
          v-loading="loading"
          element-loading-text="拼命加载中..."
          v-for="value in item"
          :key="value"
        >
          <el-descriptions-item v-if="value.replyName != null">
            <template slot="label">
              <i class="el-icon-user"></i>
            </template>
            {{ value.username }} 回复 {{ value.replyName }}
          </el-descriptions-item>
          <el-descriptions-item v-if="value.replyName == null">
            <template slot="label">
              <i class="el-icon-user"></i>
            </template>
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

          <el-descriptions-item>
            <el-tooltip content="赞一下" placement="top">
              <el-badge
                :value="value.commentLikeCount"
                type="primary"
                class="item"
               >
              <el-button class="el-icon-arrow-up" circle @click="commentLike(value.id,value.userId)"> </el-button>
              </el-badge>
            </el-tooltip>
            <el-tooltip content="发表回复" placement="top">
              <el-button
                class="item"
                icon="el-icon-edit"
                circle
                v-on:click="replyuser(value.id, value.userId)"
              ></el-button>
            </el-tooltip>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-dialog>

    <el-dialog
      title="回复"
      :visible.sync="dialogReplyComment"
      width="50%"
      :modal-append-to-body="false"
      :append-to-body="true"
    >
      <el-form ref="replyComment" :model="replyComment" label-width="80px">
        <el-form-item label="内容">
          <el-input
            type="textarea"
            placeholder="请友善发言哦"
            v-model="replyComment.content"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogReplyComment = false">取 消</el-button>
        <el-button type="primary" v-on:click="addReplyComment(replyComment)"
          >回复</el-button
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
import {
  PostDetail,
  PostDetailComment,
  addComment,
  reply,
  replyList,
} from "@/api/home/discussPostDetail";
import { addlike } from "@/api/home/like";
import {
  follow,unfollow
} from "@/api/personal";
export default {
  name: "postDetail",
  data() {
    return {
      id: "",
      pageNum: 0,
      total: 0,
      size: 5,
      replyTotal: 0,
      replyDetail: false,
      dialogAddComment: false,
      dialogReplyComment: false,
      commentTable: [],
      replyTable: [],
      form: {
        content: "",
        discussPostId: "",
        targetId: "",
      },
      replyComment: {
        id: " ",
        user_id: "",
        entity_id: "",
        entity_type: "",
        target_id: "",
        target_userid: "",
        content: " ",
      },

      post: {
        id: "",
        title: "",
        usernama: "",
        headerUrl: "",
        content: "",
        email: "",
        type: "",
        commentCount: "",
        score: "",
        createTime: "",
        status: "",
        likeCount: "",
        likeSatus: "",
        followCount:"",
        followStatus:"",
      },

        followData:{
        entityId:"",
        entityType:"",
      },
      like: {
        entityType: "",
        entityId: "",
        entityUserId: "",
      },

    };
  },
  created() {
    this.getParams();
    this.getDiscussPostDetail(this.id);
    this.DiscussPostComment(this.id);
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
      this.id = this.$route.query.id;
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
      this.DiscussPostComment(this.id, this.pageNum, this.size);
    },
    // 评论
    DiscussPostComment: function (id, page, size) {
      var that = this;
      page = page ? page : this.pageNum;
      size = size ? size : this.size;
      PostDetailComment(this.id, page, size).then((res) => {
        if (res.data.code == 1) {
          console.log(res.data);
          that.commentTable = res.data.data;
          that.loading = false;
        } else {
          console.log(res.data);
        }
      });
    },
    //帖子详情
    getDiscussPostDetail: function (id) {
      var that = this;
      PostDetail(id).then((res) => {
        if (res.data.code == 1) {
          console.log(res.data);
          that.post = res.data.data;
          console.log(that.post);
          that.total = res.data.data.commentCount;
          that.loading = false;
        } else {
          console.log(res.data);
        }
      });
    },

    addComment(form) {
      form.discussPostId = this.id;
      addComment(form).then((res) => {
        if (res.data.code == 1) {
          this.commentTable = res.data.data;
          this.total = res.data.map.total;
          console.log(res.data);
          this.dialogAddComment = false;
        } else {
          console.log(res.data);
        }
      });
    },

    replycomment(id, userId) {
      this.dialogReplyComment = true;
      this.replyComment.id = id;
      this.replyComment.entity_type = 2;
      this.replyComment.user_id = userId;
      this.replyComment.entity_id = this.id;
    },
    replyuser(id, userId) {
      this.dialogReplyComment = true;
      this.replyComment.id = id;
      this.replyComment.entity_type = 3;
      this.replyComment.user_id = userId;
      this.replyComment.entity_id = this.id;
    },
    addReplyComment(replyComment) {
      reply(replyComment).then((res) => {
        if (res.data.code == 1) {
          console.log(res.data);
          this.dialogReplyComment = false;
        } else {
          console.log(res.data);
        }
      });
    },
    displayList(id) {
      replyList(id).then((res) => {
        if (res.data.code == 1) {
          console.log(res.data);
          console.log(res.data.data);
          this.replyTable = res.data.data;
          this.replyTotal = res.data.map.replyTotal;
          if (this.replyTable == null) {
            this.$message({
              message: "还没有人回复",
              type: "warning",
            });
          }
          this.replyDetail = true;
        } else {
          console.log(res.data);
        }
      });
    },

    postLike(id, userId) {
      this.like.entityId = id;
      this.like.entityType = 1;
      this.like.entityUserId = userId;
      addlike(this.like).then((res) => {
        if (res.data.code == 1) {
          this.getDiscussPostDetail(id)
          console.log(res.data);
        } else {
          console.log(res.data);
        }
      });
    },
    commentLike(id, userId) {
      this.like.entityId = id;
      this.like.entityType = 2;
      this.like.entityUserId = userId;
      addlike(this.like).then((res) => {
        if (res.data.code == 1) {
          console.log(res.data);
          this.DiscussPostComment(id,this.pageNum,this.size)
        } else {
          console.log(res.data);
        }
      });
    },
    toFollow(id){
      this.followData.entityType = 1
      this.followData.entityId = id
      follow(this.followData).then((res) => {
        if (res.data.code == 1) {
          console.log(res.data);
          this.getDiscussPostDetail(id)
          this.followStatus=false;
        } else {
          console.log(res.data);
        }
      });
    },
    unFollow(id) {
      this.followData.entityType = 1;
      this.followData.entityId = id;
      unfollow(this.followData).then((res) => {
        if (res.data.code == 1) {
          console.log(res.data);
          this.getDiscussPostDetail(id)
          this.followStatus=true;
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
}

.comment {
  margin-top: 5%;
  position: fixed;
  margin-left: 39%;
}
.item {
  margin-left: 10px;
}
</style>