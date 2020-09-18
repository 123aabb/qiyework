import vue from 'vue'
import vuex from 'vuex'
vue.use(vuex)

export default new vuex.Store({
    state:{
        leftFlag:false,
        nameArr:[]
    },
    getters:{
        getThFlag(state){
            return state.leftFlag
        }
    },
    mutations:{
        //导航栏大小变化
        changFlag(state,data){
            if(data){
                state.leftFlag=!state.leftFlag
            } 
        },
        changName(state,data) {
            state.nameArr=data 
        }
    },
    actions:{
        //导航栏大小变化
        getLeftFlag(contx,data){
            contx.commit('changFlag',data)
        },
        //当前点击的导航栏名字
        getLeftName(contx,data){
            contx.commit('changName',data)
        }
    }
})