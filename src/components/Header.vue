<template>
  <div>
    <el-contaion>
      <el-menu class="el-menu-demo" mode="horizontal" default-active="1">
        <el-menu-item index="1" @click="goTo('/HomePage')">
          <i class="el-icon-menu"></i>
          <span slot="title">首页 </span>
        </el-menu-item>
        <el-menu-item index="2" @click="goTo('/fmasgge')">
          <template slot="title">
            <i class="el-icon-message"></i>
            消息</template
          >
        </el-menu-item>
        <el-menu-item>
          <el-input
            placeholder="请输入搜索内容"
            suffix-icon="el-icon-search"
            style="width: 750px"
            v-model="input"
            clearable
          >
          </el-input>
        </el-menu-item>
        <el-menu-item>
          <el-button
            type="text"
            @click.native="dialogRegister = true"
            v-if="person.id == 0"
            >注册</el-button
          >
        </el-menu-item>
        <el-menu-item>
          <el-button
            type="text"
            @click.native="dialoginView = true"
            v-if="person.id == 0"
            >登录</el-button
          >
        </el-menu-item>
        <el-menu-item class="setting" v-if="person.id != 0">
          <el-dropdown trigger="click">
            <i class="el-icon-setting" color="#545c64"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="go(person.id)"
                >个人中心</el-dropdown-item
              >
              <el-dropdown-item>
                账号设置<i></i>
                <el-submenu>
                  <el-menu-item @click.native="dialoguploadimage = true"
                    ><span slot="title">上传头像</span></el-menu-item
                  >
                  <el-menu-item @click.native="dialogAlterPass = true"
                    ><span slot="title">修改密码</span></el-menu-item
                  ></el-submenu
                >
              </el-dropdown-item>

              <el-dropdown-item @click.native="logout()"
                >退出登陆</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>

        <el-menu-item class="avatar" v-if="person.id != 0">
          <el-row>
            <el-avatar :size ="large" :src="person.headerUrl"></el-avatar>
            {{ person.username }}
          </el-row>
        </el-menu-item>
      </el-menu>
    </el-contaion>

    <el-dialog
      title="登陆"
      :visible.sync="dialoginView"
      width="30%"
      :modal-append-to-body="false"
      :append-to-body="true"
    >
      <el-form
        ref="loginForm"
        :model="form"
        :rules="loginrules"
        label-width="80px"
        class="login-form"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            type="text"
            placeholder="请输入账号"
            v-model="form.username"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="form.password"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialoginView = false">取 消</el-button>
        <el-button type="primary" v-on:click="onSubmit('loginForm')"
          >确定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="登陆提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :modal-append-to-body="false"
      :append-to-body="true"
    >
      <span>请输入账号和密码</span>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogVisible = false"
          v-loading="loading"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="注册提示"
      :visible.sync="dialogRegister"
      width="30%"
      :modal-append-to-body="false"
      :append-to-body="true"
    >
      <span>注册</span>
      <el-form ref="register" :model="user" :rules="registerRules">
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="user.username"
            placeholder="请输入你的注册账号"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="user.password"
            placeholder="请输入你的密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email" v-model="user.email" label="邮箱">
          <el-input
            v-model="user.email"
            placeholder="请输入你的邮箱"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRegister = false">取 消</el-button>
        <el-button type="primary" v-on:click="add('register')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改提示"
      :visible.sync="dialogAlterPass"
      width="30%"
      :modal-append-to-body="false"
      :append-to-body="true"
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="旧密码" prop="oldPass">
          <el-input
            type="password"
            v-model="ruleForm.oldPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAlterPass = false">取 消</el-button>
        <el-button type="primary" v-on:click="alterPass('ruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="提示:图片不能大于2MB,图片格式为jpg"
      :visible.sync="dialoguploadimage"
      width="30%"
    >
      <el-upload
        class="avatar-uploader"
        action="http://localhost:8081/uploadHeader"
        :with-credentials="true"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="person.headerUrl" :src="person.headerUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { login } from "@/api/login";
export default {
  name: "HeaderTo",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      input: "",
      dialogRegister: false,
      dialoginView: false,
      dialogVisible: false,
      dialogAlterPass: false,
      dialoguploadimage: false,

      person: {
        id: "0",
        username: "未登陆",
        password: "",
        email: "",
        type: "",
        headerUrl: "",
        createTime: "",
      },

      form: {
        username: "",
        password: "",
      },

      user: {
        id: "",
        username: "",
        password: "",
        email: "",
      },

      ruleForm: {
        username: "",
        oldPass: "",
        Pass: "",
        checkPass: "",
      },

      loginrules: {
        username: [
          { required: true, message: "账号不可为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不可为空", trigger: "blur" },
        ],
      },

      registerRules: {
        username: [
          { required: true, message: "账号不可为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不可为空", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
      },

      rules: {
        oldpass: [{ required: true, message: "密码不可为空", trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },

  mounted() {
    this.axios.get("http://localhost:8081/person").then((res) => {
      if (res.data.code == 1) {
        this.person = res.data.data;
        this.$message({
          message: res.data.msg,
          type: "success",
        });
      } else {
        this.$message({
          message: res.data.msg,
          type: "warning",
        });
      }
    });
  },

  methods: {
    goTo(path) {
      this.$router.replace(path);
    },
    go(arg) {
      this.$router.push({
        path: "/personalHome",
        query: {
          id: arg,
        },
      });
    },
    onSubmit(formName) {
      // 为表单绑定验证功能
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 使用 vue-router 路由到指定页面，该方式称之为编程式导航
          login(this.form).then((res) => {
            if (res.data.code == 1) {
              console.log(res.data);
              this.dialoginView = false;
              this.person = res.data.data;
            } else {
              console.log(res.data);
            }
          });
        } else {
          this.dialoginView = true;
        }
      });
    },
    add(register) {
      this.$refs[register].validate((valid) => {
        if (valid) {
          register(this.user).then((res) => {
            console.log(res.data.code);
            if (res.data.code == 1) {
              this.dialogRegister = false;
              console.log(res.data);
              this.$message({
                message: res.data.msg,
                type: "success",
              });
            } else {
              console.log(res);
              console.log(res.data);
              this.$message({
                message: res.data.msg,
                type: "warning",
              });
            }
          });
        } else {
          this.diaregisterVisible = false;
        }
      });
    },
    logout() {
      this.axios.get("http://localhost:8081/logout").then((res) => {
        this.person.id = 0;
        this.person.username = "未登陆";
        this.person.headerUrl = "";
        this.$message({
          message: res.data.msg,
          type: "success",
        });
      });
    },
    alterPass(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.ruleForm.username = this.person.username;
          this.axios
            .post("http://localhost:8081/alterPass", this.ruleForm)
            .then((res) => {
              if (res.data.code == 1) {
                this.dialogAlterPass = false;
                this.$message({
                  message: res.data.msg,
                  type: "success",
                });
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning",
                });
              }
            });
        }
      });
    },
    handleAvatarSuccess(res, file) {
      this.person.headerUrl = URL.createObjectURL(file.raw);
      if (res.code == 1) {
        this.dialoguploadimage = false;
        this.person.headerUrl = URL.createObjectURL(file.raw);
        this.$message({
          message: res.msg,
          type: "success",
        });
      } else {
        this.$message({
          message: res.msg,
          type: "warning",
        });
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #27c167;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>