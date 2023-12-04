import { createWebHashHistory, createRouter } from "vue-router";
import Main from "@/pages/main/index.vue";
import { isLogin } from "@/utils";
import { useUserInfoStore } from "@/store";

const routes = [
  {
    path: "/",
    name: "main",
    redirect: "/home",
    component: Main,
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/pages/home/home.vue"),
      },
      {
        path: "/my",
        name: "my",
        component: () => import("@/pages/my/my.vue"),
      },
    ],
  },
  {
    path: "/apply",
    name: "apply",
    component: () => import("@/pages/apply/apply.vue"),
  },
  {
    path: "/update",
    name: "update",
    component: () => import("@/pages/modify-info/modify-info.vue"),
  },
  {
    path: "/tasks",
    name: "taskList",
    component: () => import("@/pages/task-list/task-list.vue"),
  },
  {
    path: "/detail",
    name: "taskDetail",
    component: () => import("@/pages/task-detail/task-detail.vue"),
  },
  {
    path: "/pdf-preview",
    name: "pdfPreviewer",
    component: () => import("@/pages/pdf-preview/pdf-preview.vue"),
  },
];
const router = createRouter({
  history: createWebHashHistory("/"),
  routes: routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

const HOME_PAGE = "home";
const whiteList = [HOME_PAGE];
router.beforeEach(async (to, from) => {
  const store = useUserInfoStore();
  if (isLogin()) {
    if (store.hasGetInfo) {
      return true;
    } else {
      await store.getUserInfo();
      return true;
    }
  } else {
    if (whiteList.includes(to.name)) {
      return true;
    } else if (from.name === HOME_PAGE) {
      return {
        name: HOME_PAGE,
        replace: true,
        query: {
          ...from.query,
          toLogin: true,
        },
      };
    }
    return {
      name: HOME_PAGE,
      query: {
        ...from.query,
        toLogin: true,
      },
    };
  }
});

export default router;
