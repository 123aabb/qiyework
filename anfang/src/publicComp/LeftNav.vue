<template>
    <div class="leftBody">
      <!-- <div @click="flagChage" class="djtyle el-icon-s-fold"></div> -->
      <el-menu
        :default-active="defaltActive"
        class="el-menu-vertical-demo"
        @select="handleSelect"
        background-color='#304156'
        text-color='#ffffff'
        :collapse="leftFlags">
        <div v-for="item in meunLi" :key="item.index">
          <el-menu-item :index="item.index" v-if="!item.child && item.show">
            <i :class="item.icon"></i>
            <span slot="title">{{item.name}}</span>
          </el-menu-item>

           <el-submenu :index="item.index" v-if="item.child && item.show"> 
              <template slot="title" >
                <i :class="item.icon" v-show="!leftFlags"></i>
                <span v-show="!leftFlags">{{item.name}}</span>
              </template>
              <el-menu-item-group>
                <div  v-for="items in item.child" :key="items.index">
                  <el-menu-item :index="items.index" v-if="items.show">
                    {{items.name}}
                  </el-menu-item>
                </div>   
              </el-menu-item-group>
          </el-submenu>
        </div>
      </el-menu>
    </div>
</template>

<script>
    export default {
      name: "LeftNav",
      data() {
        return {
          isCollapse: this.$store.state.leftFlag,
          defaltActive:'1',
          meunLi:[{
            index:'1',
            name:'营销云企业管理系统',
            icon:'el-icon-location',
            path:'/dashboard',
            show:true
          },
          {
            index:'2',
            name:'用户管理',
            icon:'el-icon-menu',
            path:'/user',
             show:false
          },
          {
            index:'3',
            name:'角色管理',
            icon:'el-icon-office-building',
            path:'/role',
             show:false
          },
          {
            index:'4',
            name:'项目管理',
            icon:'el-icon-school',
            path:'/project',
             show:false
          },
          {
            index:'5',
            name:'项目优惠',
            icon:'el-icon-table-lamp',
            path:'/coupon',
             show:false
          },
          {
            index:'6',
            name:'优惠核销',
            icon:'el-icon-s-custom',
            path:'/customerCoupon',
             show:false
          },
          {
            index:'7',
            name:'客户中心',
            icon:'el-icon-monitor',
            path:'/centrum/centrum',
            show:false,
            child:[
              {
                index:'7-1',
                name:'顾问客户',
                icon:'el-icon-monitor',
                path:'/centrum/centrum',
                show:false,
              },
              {
                index:'7-2',
                name:'潜在客户',
                icon:'el-icon-monitor',
                path:'/centrum/potential',
                show:false,
              },
              {
                index:'7-3',
                name:'客户轨迹',
                icon:'el-icon-monitor',
                path:'/centrum/trajectory',
                show:false,
              },
            ]
          }]
        };
      },
       computed:{
          leftFlags(){
            return this.$store.state.leftFlag
          }
        },
        created(){
          const meunss=JSON.parse(window.sessionStorage.getItem("meuns"))
          console.log(meunss)  
          meunss.map(itm=>{
            switch(itm.menuName){
              case '用户管理':
                this.meunLi[1].show=true
              break;
              case '角色管理':
                this.meunLi[2].show=true
              break;
              case '项目管理':
                this.meunLi[3].show=true
              break;
              case '项目优惠':
                this.meunLi[4].show=true
              break;
              case '优惠核销':
                this.meunLi[5].show=true
              break;
              case '客户中心':
                this.meunLi[6].show=true
                this.handleChild(itm.children)
              break;
            }
          })

        },
      mounted(){
        const Hrefs=window.location.href.split('/')
        if(Hrefs.length<6){
          const name='/'+window.location.href.split('/')[4]
          this.meunLi.map(item=>{
            if(item.path==name){
              this.defaltActive=item.index
              let arrs=[item.name]
              this.$store.dispatch('getLeftName',arrs)
            }
          })
        }else{
          console.log('>=6')
          const name='/'+Hrefs[4]+'/'+Hrefs[5]
          this.meunLi.map(item=>{
            if(item.child){
              item.child.map(re=>{
                 if(re.path==name){
                   this.defaltActive=re.index
                   let arrs=[item.name,re.name]
                   this.$store.dispatch('getLeftName',arrs)
                 }
                 
              })
            }
          })
        }
        
         console.log(this.defaltActive)
      },
      methods: {
        handleChild(child){
          child.map(items=>{
              switch(items.menuName){
              case '顾问客户':
                this.meunLi[6].child[0].show=true
              break;
              case '潜在客户':
                this.meunLi[6].child[1].show=true
              break;
              case '客户轨迹':
                this.meunLi[6].child[2].show=true
              break;
            }
          })         
        },
        //点击侧边栏进行相应的路由跳转
        handleSelect(key, keyPath){
          if(keyPath.length==1){
            this.$router.push(this.meunLi[key-1].path);
            let arrs=[this.meunLi[key-1].name]
            this.$store.dispatch('getLeftName',arrs)
          }else{
             const tkeys=keyPath[1].split('-')[1]
             this.$router.push(this.meunLi[keyPath[0]-1].child[tkeys-1].path);  
             let arrs=[this.meunLi[keyPath[0]-1].name,this.meunLi[keyPath[0]-1].child[tkeys-1].name]
             this.$store.dispatch('getLeftName',arrs)
          }  
        },
        //隐藏侧边栏
        flagChage(){
          this.isCollapse=!this.isCollapse
          this.$store.dispatch('getLeftFlag',1)
        }
      }
    }
</script>

<style scoped>
.leftBody{
  background-color: #304156;
}
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .djtyle{
    width: 30px;
    height: 30px;
    font-size: 30px;
    margin-top: 10px;
  }
</style>
