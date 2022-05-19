<template>
  <div>
    <el-carousel indicator-position="outside" type="card">
      <el-carousel-item v-for="item in urls" :key="item">
        <el-image :src="item" :fit="cover" class="bannerimg"></el-image>
      </el-carousel-item>
    </el-carousel>
    <el-card>
      <div>
        <el-image
          style="width: 100px; height: 100px"
          :src="personal.headerUrl"
        ></el-image>
      </div>

      <span style="paddng: 18px large">用户名：{{ personal.username }}</span>

      <div style="paddng: 18px large"></div>
      <span class="information">邮箱:{{ personal.email }}</span>
      <span class="information"> 注册时间:{{ date(personal.createTime) }}</span>
      <div class="bottom card-header">
        <span class="information">获得了{{ personal.likeCount }}个赞</span>
        
        <el-button
          type="text"
          class="information"
          @click.native="dialogFollower = true"
        >
          {{ personal.followerCount }}人关注</el-button
        >
        <el-button
          type="text"
          class="information"
          @click.native="dialogFollowee = true"
          >关注了{{ personal.followeeCount }}人</el-button
        >

        <el-tooltip
          content="关注"
          placement="bottom"
          effect="light"
          v-if="personal.hasFollowed != true"
        >
          <el-button
            class="el-icon-circle-plus-outline"
            circle
            @click="toFollow(personal.id)"
          >
          </el-button>
        </el-tooltip>

        <el-tooltip
          content="取消关注"
          placement="bottom"
          effect="light"
          v-if="personal.hasFollowed == true"
        >
          <el-button
            class="el-icon-remove"
            circle
            @click="unFollow(personal.id)"
          >
          </el-button>
        </el-tooltip>
      </div>
    </el-card>
    <div>
      <p>
        <el-backtop></el-backtop>
      </p>
    </div>
    <el-card class="list">
      <el-tabs>
        <el-tab-pane
          label="我发布的帖子"
          name="first"
        >
          <el-table :data="userPost">
            <el-table-column
              ><template slot-scope="scope">
                <el-avatar :size="large" :src="scope.row.headerUrl"></el-avatar>
              </template>
            </el-table-column>
            <el-table-column prop="title"> </el-table-column>
            <el-table-column prop="content" :formatter="stateFormat"> </el-table-column>
            <el-table-column
              ><template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{
                  date(scope.row.createTime)
                }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="我的评论" name="second"
          ><el-table :data="userComment">
            <el-table-column
              ><template slot-scope="scope">
                <el-avatar :size="large" :src="scope.row.headerUrl"></el-avatar>
              </template>
            </el-table-column>
            <el-table-column prop="username"> </el-table-column>
            <el-table-column prop="content" :formatter="stateFormat"> </el-table-column>
            <el-table-column
              ><template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{
                  date(scope.row.createTime)
                }}</span>
              </template>
            </el-table-column>
          </el-table>
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
          </el-tab-pane
        >
        <el-tab-pane label="我关注的帖子" name="third"
          >
          我关注的帖子
          <el-table :data="followPost">
            <el-table-column
              ><template slot-scope="scope">
                <el-avatar :size="large" :src="scope.row.headerUrl"></el-avatar>
              </template>
            </el-table-column>
            <el-table-column prop="title"> </el-table-column>
            <el-table-column prop="content" :formatter="stateFormat"> </el-table-column>
            <el-table-column
              ><template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{
                  date(scope.row.followTime)
                }}</span>
              </template>
            </el-table-column>
          </el-table></el-tab-pane
        >
      </el-tabs>
      <p></p>
    </el-card>

    <el-dialog
      title="关注我的人"
      width="40%"
      :modal-append-to-body="false"
      :append-to-body="true"
      :visible.sync="dialogFollower"
    >
      <el-table :data="followertableData">
        <el-table-column>
          <template slot-scope="scope">
            <el-avatar :size="large" :src="scope.row.headerUrl"></el-avatar>
          </template>
        </el-table-column>

        <el-table-column prop="username"> </el-table-column>
        <el-table-column
          ><template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{
              date(scope.row.followTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="right">
          <el-tooltip
          content="取消关注"
          placement="bottom"
          effect="light">
          <el-button class="el-icon-star-on" circle @click="unFollow(scope.row.id)"> </el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      title="我关注的人"
      width="40%"
      :modal-append-to-body="false"
      :append-to-body="true"
      :visible.sync="dialogFollowee"
    >
      <el-table :data="followeetableData">
        <el-table-column>
          <template slot-scope="scope">
            <el-avatar :size="large" :src="scope.row.headerUrl"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username"> </el-table-column>
        <el-table-column
          ><template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{
              date(scope.row.followTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="right">
          <el-tooltip
          content="关注他"
          placement="bottom"
          effect="light">
          <el-button class="el-icon-star-on" circle @click="toFollow(scope.row.id)"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  personData,
  getFollowee,
  getFollower,
  follow,
  unfollow,
  getusercomment
} from "@/api/personal";
import { dateFormat } from "@/utils/date";
export default {
  name: "personalHome",

  data() {
    return {
      id: "",
      urls: [
        "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
        "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
      ],
      pageNum: 0,
      total: 0,
      size: 5,
      personal: {
        id: "",
        username: "",
        email: "",
        type: "",
        headerUrl: "",
        createTime: "",
        likeCount: "",
        followeeCount: "",
        followerCount: "",
        hasFollowed: false,
      },
      followData: {
        entityId: "",
        entityType: "",
      },
      dialogFollower: false,
      dialogFollowee: false,
      followertableData: [],
      followeetableData: [],
      userPost: [],
      userComment: [],
      followPost:[],
    };
  },
  created() {
    this.getParams();
    this.getPersonal(this.id);
    this.getfollowerList(this.id);
    this.getfolloweeList(this.id);
    this.getUserPost(this.id);
    this.getUserComment(this.id);
    this.getUserFollowPost(this.id);
  },
  methods: {
    getParams() {
      this.id = this.$route.query.id;
    },
    date(data) {
      return dateFormat(data);
    },

    getPersonal: function (id) {
      var that = this;
      personData(id).then((res) => {
        if (res.data.code == 1) {
          console.log(res.data);
          that.personal = res.data.data;
          that.loading = false;
        } else {
          console.log(res.data);
        }
      });
    },
    toFollow(id) {
      this.followData.entityType = 3;
      this.followData.entityId = id;
      follow(this.followData).then((res) => {
        if (res.data.code == 1) {
          console.log(res.data);
          this.getPersonal(this.id);
        } else {
          console.log(res.data);
        }
      });
    },

    unFollow(id) {
      this.followData.entityType = 3;
      this.followData.entityId = id;
      unfollow(this.followData).then((res) => {
        if (res.data.code == 1) {
          console.log(res.data);
          this.getPersonal(this.id);
        } else {
          console.log(res.data);
        }
      });
    },
    getfollowerList(id) {
      getFollower(id).then((res) => {
        if (res.data.code == 1) {
          console.log(res.data);
          this.followertableData = res.data.data;
        } else {
          console.log(res.data);
        }
      });
    },
    getfolloweeList(id) {
      getFollowee(id).then((res) => {
        if (res.data.code == 1) {
          console.log(res.data);
          this.followeetableData = res.data.data;
        } else {
          console.log(res.data);
        }
      });
    },
    getUserPost(id) {
      this.axios.get("http://localhost:8081/personalPost/" + id).then((res) => {
        if (res.data.code == 1) {
          console.log(res.data);
          this.userPost = res.data.data;
        } else {
          console.log(res.data);
        }
      });
    },
    getUserComment(id,page,size) {
      page = page ? page : this.pageNum;
      size = size ? size : this.size;
       getusercomment(id,page,size).then((res) => {
          if (res.data.code == 1) {
            console.log(res.data);
            this.userComment = res.data.data;
            this.total = res.data.map.commentTotal
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
      this.getUserComment(this.id);
    },
    findPage() {
      console.log(this.pageNum);
      this.getUserComment(this.id,this.pageNum, this.size);
    },

    stateFormat(row, column, cellValue) {
      // console.log(row , column , cellValue)
      if (!cellValue) return "";
      if (cellValue.length > 20) {
        //最长固定显示4个字符
        return cellValue.slice(0, 20) + "...";
      }
      return cellValue;
    },

    getUserFollowPost(id) {
      this.axios
        .get("http://localhost:8081/followerPost/" + id)
        .then((res) => {
          if (res.data.code == 1) {
            console.log(res.data);
            this.followPost = res.data.data;
          } else {
            console.log(res.data);
          }
        });
    },
  },
};
</script>

<style>
.information {
  margin-left: 3%;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 500px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.bannerimg {
  width: 100%;
  height: 100%;
}
</style>