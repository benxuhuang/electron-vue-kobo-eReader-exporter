<style lang="less">
@import "../assets/less/global.less";

header {
  font-family: "Microsoft YaHei";
  font-size: 14px;
  overflow: hidden;
  background: linear-gradient(90deg, @header-color, @bg-color);
  -webkit-app-region: drag;
  .left {
    float: left;
    margin-left: 8px;
  }
  .version {
    font-size: 12px;
    float: left;
    margin-left: 20px;
    .ivu-tooltip {
      -webkit-app-region: no-drag;
    }
  }
  .right {
    float: right;
    a {
      -webkit-app-region: no-drag;
      color: #000;
      margin-right: 10px;
    }
  }
}
</style>

<template>
  <header>
    <section class="left" style="font-weight: 600; font-family: sans-serif">
      Kobo eReader Exporter
    </section>
    <Modal
      v-model="updateModalShow"
      :mask-closable="false"
      :closable="false"
      title="Upgrade"
    >
      <div class="aboutText">
        <Card>
          <p>New Version: {{ newVersion }}</p>
          <p>Release Name: {{ releaseName }}</p>
          <p>Release Notes: {{ releaseNotes }}</p>
          <p>
            macOS:
            <a
              @click="
                openUrl(
                  `https://github.com/benxuhuang/easy-invoices/releases/tag/v${newVersion}`
                )
              "
              >Download update from the web</a
            >
          </p>
          <p style="color: blue">{{ updateText }}</p>
          <Button
            type="primary"
            v-if="showRestartBtn"
            @click="restartApp"
            style="margin-top: 5px"
          >
            Restart App
          </Button>
        </Card>
      </div>
      <div slot="footer">
        <Button @click="closeUpdateModal">Close</Button>
      </div>
    </Modal>
  </header>
</template>
<script>
import packageJson from "../../../package.json";

export default {
  data() {
    return {
      currentVersion: packageJson.version,
      newVersion: "",
      releaseDate: "",
      releaseName: "",
      releaseNotes: "",
      updateModalShow: false,
      updateText: "",
      showRestartBtn: false,
    };
  },
  methods: {
    updateConfirm() {
      this.tryUpdate();
    },
    closeUpdateModal() {
      this.updateModalShow = false;
      this.updateText = "更新已取消";
    },
    tryUpdate() {
      console.log("tryUpdate");

      this.$electron.ipcRenderer.on("update_available", (event, msg) => {
        console.log("update_available");
        this.updateModalShow = true;

        const releaseDate =
          new Date(msg.data.releaseDate).getTime() -
          new Date().getTimezoneOffset() * 60 * 1000;

        this.releaseDate = releaseDate;
        this.newVersion = msg.data.version;
        this.releaseName = msg.data.releaseName;
        this.releaseNotes = msg.data.releaseNotes;

        console.log("newVersion: ", msg.data.version);
        console.log("releaseDate: ", releaseDate);
        console.log("releaseName: ", msg.data.releaseName);
        console.log("releaseNotes: ", msg.data.releaseNotes);

        this.$electron.ipcRenderer.removeAllListeners("update_available");
        this.updateText = "A new update is available. Downloading now...";
      });

      this.$electron.ipcRenderer.on("update_downloaded", () => {
        console.log("update_downloaded");

        this.$electron.ipcRenderer.removeAllListeners("update_downloaded");
        this.updateText =
          "Update Downloaded. It will be installed on restart. Restart now?";

        this.showRestartBtn = true;
      });
    },
    restartApp() {
      console.log("restartApp");
      this.$electron.ipcRenderer.send("restart_app");
    },
    openUrl(url) {
      this.$electron.shell.openExternal(url);
    },
  },
  created() {
    this.tryUpdate();
  },
};
</script>
