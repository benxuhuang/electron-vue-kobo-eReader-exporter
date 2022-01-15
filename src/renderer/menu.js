import ShowKoboWordList from "./pages/menu/ShowKoboWordList.vue";
import ImportKoboDatabase from "./pages/menu/ImportKoboDatabase.vue";

const menu = [
  {
    icon: "upload",
    title: "Import Kobo Database",
    path: "/ImportKoboDatabase",
    component: ImportKoboDatabase,
  },
  {
    icon: "document",
    title: "Show Kobo Word List",
    path: "/ShowKoboWordList",
    component: ShowKoboWordList,
  },
];
export default menu;
