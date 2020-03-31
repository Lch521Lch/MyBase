import Vue from "vue";
import Router from "vue-router";
import Layout from "./views/Layout/Index.vue";
import jwt_decode from "jwt-decode";

Vue.use(Router);

/**
* hidden: true                   如果hidden为true则在左侧菜单栏展示，否则不显示
* name:'router-name'             路由名称，必须填写
* meta : {
    title: 'title'               对应路由在左侧菜单栏的标题名称
    icon: 'icon-class'           对应路由在左侧菜单栏的图标样式，样式使用fontawesome图标库
  }
**/

export const asyncRouterMap = [
  {
    path: "/",
    name: "dashboard",
    component: Layout,
    hidden: true,
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        meta: { title: "首页", icon: "el-icon-s-home" },
        component: () => import("@/views/Home.vue")
      }
    ]
  },
  {
    path: "/dataManage",
    name: "dataManage",
    hidden: true,
    meta: { title: "EF教务管理", icon: "el-icon-goods" ,
    roles: ["admin", "staff"]},
    component: Layout,
    redirect: "/tableData",
    children: [
    
    
       
      {
        path: "/infoStudent",
        name: "infoStudent",
        meta: {
          title: "学生信息",
          icon: "el-icon-user",
          roles: ["admin", "staff"]
        },
        component: () => import("@/views/DataManage/Student.vue")
      },
      {
        path: "/formData",
        name: "formData",
        meta: {
          title: "新增学生",
          icon: "el-icon-zoom-in",
          roles: ["admin", "staff"]
        },
        component: () => import("@/views/DataManage/FormData.vue")
      }
      ,
      {
        path: "/PayRecord",
        name: "PayRecord",
        meta: {
          title: "缴费记录",
          icon: "el-icon-monitor",
          roles: ["admin", "staff"]
        },
        component: () => import("@/views/DataManage/PayRecord.vue")
      }
      
      
      
      
      ,
      {
        path: "/EFclass",
        name: "EFclass",
        meta: {
          title: "班级信息",
          icon: "el-icon-map-location",
          roles: ["admin", "staff"]
        },
        component: () => import("@/views/DataManage/EFclass.vue")
      }
      ,
      {
        path: "/Schedule",
        name: "Schedule",
        meta: {
          title: "班级课程表",
          icon: "el-icon-tickets",
          roles: ["admin", "staff"]
        },
        component: () => import("@/views/DataManage/Schedule.vue")
      }
      ,
      {
        path: "/StudentAbsent",
        name: "StudentAbsent",
        meta: {
          title: "出勤记录",
          icon: "el-icon-place",
          roles: ["admin", "staff"]
        },
        component: () => import("@/views/DataManage/StudentAbsent.vue")
      }
      ,
      {
        path: "/infoTeacher",
        name: "infoSTeacher",
        meta: {
          title: "教师信息",
          icon: "el-icon-s-custom",
          roles: ["admin", "staff"]
        },
        component: () => import("@/views/DataManage/Teacher.vue")
       }
       ,
       {
         path: "/infoCourse",
         name: "infoCourse",
         meta: {
           title: "课程信息",
           icon: "el-icon-date",
           roles: ["admin", "staff"]
         },
         component: () => import("@/views/DataManage/Course.vue")
       }
       ,
      {
        path: "/infoRoom",
        name: "infoRoom",
        meta: {
          title: "教室信息",
          icon: "el-icon-house",
          roles: ["admin", "staff"]
        },
        component: () => import("@/views/DataManage/Room.vue")
      }
   
    ]
  } 
,

{
  path: "/reportManage",
  name: "reportManage",
  hidden: true,
  meta: { title: "报表打印", icon: "el-icon-goods" ,
  roles: ["admin", "staff"]},
  component: Layout,
  redirect: "/tableData",
  children: [
  
    {
      path: "/PayRecordPrint",
      name: "PayRecordPrint",
      meta: {
        title: "缴费打印",
        icon: "el-icon-monitor",
        roles: ["admin", "staff"]
      },
      component: () => import("@/views/DataManage/PayRecordPrint.vue")
    },
     
     
    {
      path: "/SchedulePrint",
      name: "SchedulePrint",
      meta: {
        title: "课程表打印",
        icon: "el-icon-house",
        roles: ["admin", "staff"]
      },
      component: () => import("@/views/DataManage/SchedulePrint.vue")
    }
 
  ]
}, 


  {
    path: "/userManage",
    name: "userManage",
    component: Layout,
    hidden: true,
    redirect: "/accountData",
    children: [
      {
        path: "/accountData",
        name: "accountData",
        meta: { title: "账户管理", icon: "el-icon-s-custom", roles: ["admin"] },
        component: () => import("@/views/UserManage/AccountData.vue")
      }
    ]
  },
  {
    path: "/user",
    component: Layout,
    redirect: "/userInfo",
    hidden: false,
    children: [
      {
        path: "/userInfo",
        name: "userInfo",
        meta: { title: "个人中心" },
        component: () => import("@/views/UserManage/UserInfo.vue")
      }
    ]
  },
  {
    path: "/404",
    name: "404",
    hidden: false,
    meta: { title: "404" },
    component: () => import("@/views/404.vue")
  },
  {
    path: "*",
    redirect: "/404"
  },
  {
    path: "/login",
    name: "login",
    hidden: false,
    meta: { title: "系统登录" },
    component: () => import("@/views/Login/Login.vue")
  },
  {
    path: "/password",
    name: "password",
    hidden: false,
    meta: { title: "找回密码" },
    component: () => import("@/views/Login/Password.vue")
  }
];

const router: any = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: asyncRouterMap
});

router.beforeEach((to: any, from: any, next: any) => {
  const isLogin = localStorage.tsToken ? true : false;
  if (to.path == "/login" || to.path == "/password") {
    next();
  } else {
    if (isLogin) {
      const decoded: any = jwt_decode(localStorage.tsToken);
      const { key } = decoded;
      // 权限判断
      if (hasPermission(key, to)) {
        next();
      } else {
        next("/404"); // 没有权限进入
      }
    } else {
      next("/login");
    }
  }
});

/**
 * 判断是否有权限
 * @param roles 当前角色
 * @param route 当前路由对象
 * */
function hasPermission(roles: string, route: any) {
  if (route.meta && route.meta.roles) {
    // 如果meta.roles是否包含角色的key值,如果包含那么就是有权限,否则无权限
    return route.meta.roles.some((role: string) => role.indexOf(roles) >= 0);
  } else {
    // 默认不设置有权限
    return true;
  }
}

export default router;
