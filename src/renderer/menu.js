import ShowKoboWordList from "./pages/menu/ShowKoboWordList.vue";
import ShowKoboBookmark from "./pages/menu/ShowKoboBookmark.vue";
import ImportKoboDatabase from "./pages/menu/ImportKoboDatabase.vue";
import ShowKoboStat from "./pages/menu/ShowKoboStat.vue";

const menu = [
  {
    name: 'ImportKoboDatabase',
    icon: "upload",
    title: "Import Kobo Database",
    path: "/ImportKoboDatabase",
    component: ImportKoboDatabase,
  },
  {
    name: 'ShowKoboStat',
    icon: "bookmark",
    title: "Show Kobo Stat",
    path: "/ShowKoboStat",
    component: ShowKoboStat,
  },
  {
    name: 'ShowKoboWordList',
    icon: "document",
    title: "Show Kobo Word List",
    path: "/ShowKoboWordList/:volumeId?",
    component: ShowKoboWordList,
  },
  {
    name: 'ShowKoboBookmark',
    icon: "document",
    title: "Show Kobo Bookmark",
    path: "/ShowKoboBookmark/:volumeId?",
    component: ShowKoboBookmark,
  },
];
export default menu;
