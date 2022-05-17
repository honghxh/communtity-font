<template>
  <el-container>
    <el-header class="head">
      <Header />
    </el-header>
    <el-main class="main">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import Header from "@/components/Header.vue";
export default {
  components: {
    Header,
  },
  name: "HomeView",
};
</script>

<style>
.head {
  position: fixed;
  width: 100%;
  top: 0%;
}
.main{
  margin-top: 3%;
}
</style>