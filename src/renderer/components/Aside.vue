<style lang="less">
@import "../assets/less/global.less";

aside {
  position: relative;
  background-color: @aside-color;
  box-shadow: 0 0 7px #000;
  .layout-menu-left {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 40px;
  }
  .aside-drop-menu {
    position: absolute;
    height: 40px;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    .ivu-dropdown {
      .ivu-dropdown-rel {
        cursor: pointer;
      }
    }
  }
}

.aboutText {
  p {
    line-height: 26px;
  }
}

.psText {
  margin-top: 20px;
}
</style>

<template>
  <aside>
    <Menu
      ref="menu"
      @on-select="selectMenu"
      theme="dark"
      width="100%"
      :active-name="activeMenuName"
      accordion
      class="layout-menu-left"
    >
      <Menu-item v-for="(menu, index) in MENU" :name="menu.path" :key="index">
        <Tooltip :content="menu.title" placement="right" :delay="800">
          <Icon :type="menu.icon" :size="20"></Icon>
        </Tooltip>
      </Menu-item>
    </Menu>
    <div class="aside-drop-menu">
      <Dropdown trigger="click" placement="top-start" @on-click="dropMenuClick">
        <Icon type="navicon-round" :size="26" color="white"></Icon>
        <DropdownMenu slot="list">
          <DropdownItem name="about"> About </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <Modal v-model="modalShow" title="About">
      <div class="aboutText">
        <p>
          <strong>Kobo eReader Exporter {{ version }}</strong>
        </p>
        <p>A GUI application that makes you export data from the Kobo eReader database.</p>
        <p>If you have any problems when using this application, Please feel free to contact me.</p>
        <p>My email: <strong>benxu.huang@gmail.com</strong></p>
      </div>
      <div slot="footer">
        <Button @click="modalShow = false">Close</Button>
      </div>
    </Modal>
  </aside>
</template>

<script>
import MENU from "../menu";
import packageJson from "../../../package.json";
import { docDir } from "../utils/settings";

export default {
  data() {
    return {
      MENU,
      activeMenuName: "",
      modalShow: false,
      version: packageJson.version,
      docDir,
    };
  },
  methods: {
    selectMenu(path) {
      this.$router.push({ path });
    },
    dropMenuClick(name) {
      switch (name) {
        case "update":
          console.log("check update");
          break;
        case "about":
          this.modalShow = true;
          break;
        default:
          null;
      }
    },
    openUrl(url) {
      this.$electron.shell.openExternal(url);
    },
    openPath(path) {
      this.$electron.shell.openItem(path);
    },
  },
  watch: {
    $route() {
      this.activeMenuName = this.$route.path;
      this.$nextTick(() => {
        this.$refs.menu.updateActiveName();
      });
    },
  },
  created() {
    this.activeMenuName = this.$route.path;
    this.$nextTick(() => {
      this.$refs.menu.updateActiveName();
    });
  },
};
</script>
