import ShowKoboWordList from "./pages/menu/ShowKoboWordList.vue";
import ShowKoboBookmark from "./pages/menu/ShowKoboBookmark.vue";
import ImportKoboDatabase from "./pages/menu/ImportKoboDatabase.vue";
import ShowKoboStat from "./pages/menu/ShowKoboStat.vue";

const menu = [
  {
    icon: "upload",
    title: "Import Kobo Database",
    path: "/ImportKoboDatabase",
    component: ImportKoboDatabase,
  },
  {
    icon: "bookmark",
    title: "Show Kobo Stat",
    path: "/ShowKoboStat",
    component: ShowKoboStat,
  },
  {
    icon: "document",
    title: "Show Kobo Word List",
    path: "/ShowKoboWordList",
    component: ShowKoboWordList,
  },
  {
    icon: "document",
    title: "Show Kobo Bookmark",
    path: "/ShowKoboBookmark",
    component: ShowKoboBookmark,
  },
];
export default menu;
