<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">营销云企业后台管理系统</h3>
      </div>
      <el-form-item prop="telphone">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="telphone" v-model="loginForm.telphone" placeholder="请输入手机号" name="telphone" type="text" tabindex="1" auto-complete="on" maxlength="11" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="请输入密码" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
// import Qs from 'qs'

export default {
  name: 'Login',
  data() {
    const checkContactWay = (rule, value, callback) => {
      const myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      setTimeout(() => {
        if (value && !myreg.test(value)) {
          callback(new Error('请输入有效的手机号码'))
        } else {
          callback()
        }
      }, 200)
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('密码不能为空，且不超过6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        telphone: '',
        password: ''
      },
      loginRules: {
        telphone: [{ required: true, validator: checkContactWay, trigger: 'change' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        console.log(route)
        this.redirect = route.query && route.query.redirect
        console.log(this.redirect)
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // this.$store.dispatch('user/login', this.loginForm).then(() => {
          //   this.$router.push({ path: this.redirect || '/' })
          //   this.loading = false
          // }).catch(() => {
          //   this.loading = false
          // })
          var vm = this
          vm.loading = true
          //this.getRequest('/login/checked?telphone=' + vm.loginForm.telphone + '&password=' + vm.loginForm.password)
            vm.axios({
            method: 'POST',
            url: '/api/login/checked?telphone=' + vm.loginForm.telphone + '&password=' + vm.loginForm.password
          })
           .then(function(res) {
            console.log(4, res)
            if (res.data.data.code === 1) {
              vm.$message.error(res.data.data.msg)
              // vm.$router.push('/login')
              vm.loading = false
            } else if (res.data.data.code === 0) {
              // vm.$router.push({ path: this.redirect || '/' })
              window.sessionStorage.setItem('userInfo', vm.loginForm)
              const meuns=JSON.stringify(res.data.data.menus)
              window.sessionStorage.setItem('meuns', meuns)
              vm.redirect = '/dashboard'
              vm.$message.success(res.data.data.msg)
              vm.loading = false
              vm.$router.push({ path: vm.redirect })
            }
          }).catch(function(res) {
            console.log(2, res)
          })
        } else {
          console.log('error submit!!')
          // vm.$message.error('登录失败')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

.login-container {
  min-height: 100%;
  width: 100%;
  height: 100%;
  background: #304156;
  overflow: hidden;
}
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #889aa4;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
  }
   
  .title{
    font-size: 26px;
      color:#ffffff;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold; 
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }

</style>
