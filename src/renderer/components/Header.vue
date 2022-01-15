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
    <section class="left" style="font-weight: 600;font-family: sans-serif;">
      Kobo eReader Exporter
    </section>
  </header>
</template>
<script>
import packageJson from "../../../package.json";

export default {
  data() {
    return {
      currentVersion: packageJson.version,
      updateText: "",
      downloadProgress: null,
      downloadInfo: {
        percent: null,
        totalMB: 0,
        KBPerSecond: 0,
      },
      updateModalShow: false,
      updateInfo: {
        releaseName: "",
        releaseNotes: "",
        releaseDate: "",
        version: "",
      },
    };
  },
  methods: {
    minWindows() {
      this.$electron.ipcRenderer.send("min-window");
    },
    maxWindows() {
      this.$electron.ipcRenderer.send("max-window");
    },
    closeWindows() {
      this.$electron.ipcRenderer.send("close-window");
    },
    showUpdateModal() {
      this.updateModalShow = true;
    },
    updateConfirm() {
      this.updateModalShow = false;
      this.$electron.ipcRenderer.send("update-now");
    },
    closeUpdateModal() {
      this.updateModalShow = false;
      this.updateText = "更新已取消";
    },
    update() {
      this.$electron.ipcRenderer.on("update-message", (event, msg) => {
        const message = msg.message;
        const data = msg.data;
        switch (message) {
          case "error":
            this.updateText = "检查更新失败";
            this.downloadInfo = this.$options.data().downloadInfo;
            break;
          case "update-available":
            this.updateText = "有可用更新";
            this.updateInfo = {
              releaseDate:
                new Date(data.releaseDate).getTime() -
                new Date().getTimezoneOffset() * 60 * 1000,
              releaseName: data.releaseName,
              releaseNotes: data.releaseNotes,
              version: data.version,
            };
            break;
          case "update-not-available":
            this.updateText = "已經是最新版";
            break;
          case "download-progress":
            this.updateText = "";
            this.downloadInfo = {
              percent: data.percent.toFixed(2),
              totalMB: (data.total / 1024 / 1024).toFixed(3),
              KBPerSecond: (data.bytesPerSecond / 1024).toFixed(3),
            };
            break;
          case "update-downloaded":
            this.updateText = "";
            this.downloadInfo = this.$options.data().downloadInfo;
            this.showUpdateModal();
            break;
          default:
            this.updateText = "";
            this.downloadInfo = this.$options.data().downloadInfo;
        }
      });
    },
  },
  created() {
    this.update();
  },
};
</script>
