import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import { getUser } from "@/utils/auth";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "layout",
    redirect: {
      path: "/login",
    },
    component: () => import("@/views/layout.vue"),
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/home.vue"),
        meta: {
          requireAuth: true,
        },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login.vue"),
  },
  {
    path: "/:pathMatch(.*)",
    name: "error",
    redirect: {
      path: "/login",
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes,
});

// 路由拦截
router.beforeEach((to, from, next) => {
  NProgress.start();
  
  const token: string | null = getUser("token");
  if (!token && to.meta.requireAuth) {
    next({
      path: "/login",
      replace: true,
    });
    return;
  }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
