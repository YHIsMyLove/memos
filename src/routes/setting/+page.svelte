<script lang="ts">
  import { theme } from "$lib/stores/theme";
  import { webdav } from "$lib/stores/webdav";
  import { onMount } from "svelte";
  import Header from "../../components/Header.svelte";

  let backupLocation = "";
  let username = "";
  let password = "";
  let currentTheme: string;
  let backupStatus = "";

  theme.subscribe((value) => {
    currentTheme = value;
  });

  webdav.subscribe((config) => {
    backupLocation = config.url;
    username = config.username;
    password = config.password;
  });

  function handleThemeChange(event: Event) {
    const selectedTheme: any = (event.target as HTMLSelectElement).value;
    theme.setTheme(selectedTheme);
  }

  function updateWebDAVConfig() {
    webdav.setConfig({
      url: backupLocation,
      username,
      password,
    });
  }

  async function handleBackup() {
    try {
      backupStatus = "备份中...";
      const config = { url: backupLocation, username, password };
      await webdav.backup({}, config);
      backupStatus = "备份成功";
    } catch (error) {
      backupStatus = `${error}`;
    } finally {
      const timeOut = setTimeout(() => {
        backupStatus = "";
        clearTimeout(timeOut);
      }, 10000);
    }
  }

  async function handleRestore() {
    try {
      backupStatus = "恢复中...";
      const config = { url: backupLocation, username, password };
      const restoredData = await webdav.restore(config);
      console.log(restoredData);
      backupStatus = "恢复成功";
    } catch (error) {
      backupStatus = `${error}`;
    } finally {
      const timeOut = setTimeout(() => {
        backupStatus = "";
        clearTimeout(timeOut);
      }, 10000);
    }
  }

  async function handleTest() {
    try {
      backupStatus = "测试连接中...";
      const config = { url: backupLocation, username, password };
      await webdav.testConnection(config);
      backupStatus = "连接成功";
    } catch (error) {
      backupStatus = `${error}`;
    } finally {
      const timeOut = setTimeout(() => {
        backupStatus = "";
        clearTimeout(timeOut);
      }, 10000);
    }
  }

  onMount(() => {
    theme.initialize();
  });
</script>

<div class=" w-full">
  <Header />
</div>
<div class="w-full max-w-lg space-y-3">
  <!-- Backup Settings -->
  <div class=" bg-secondary rounded-lg shadow-md p-4 mb-4">
    <h2 class="text-sm font-medium mb-2.5 text-content">备份设置</h2>
    <div class="flex justify-between items-start text-secondary-content">
      <div class="space-y-2.5 w-full">
        <div>
          <p class="block text-xs mb-1 text-content-secondary">网盘地址</p>
          <input
            type="text"
            bind:value={backupLocation}
            placeholder="请输入网盘地址"
            class="w-full px-2 py-1 text-sm rounded bg-primary text-content"
            on:change={updateWebDAVConfig}
          />
        </div>
        <div>
          <p class="block text-xs mb-1 text-content-secondary">账号</p>
          <input
            type="text"
            bind:value={username}
            placeholder="请输入账号"
            class="w-full px-2 py-1 text-sm rounded bg-primary text-content"
            on:change={updateWebDAVConfig}
          />
        </div>
        <div>
          <p class="block text-xs mb-1 text-content-secondary">密码</p>
          <input
            type="password"
            bind:value={password}
            placeholder="请输入密码"
            class="w-full px-2 py-1 text-sm rounded bg-primary text-content"
            on:change={updateWebDAVConfig}
          />
        </div>
        <div class="flex flex-col w-full justify-center items-start gap-2 pt-2">
          <button class="btn" on:click={handleBackup}> 立即备份 </button>
          <button class="btn" on:click={handleRestore}> 读取备份 </button>
          <button class="btn" on:click={handleTest}> 测试连接 </button>
        </div>
        {#if backupStatus}
          <p
            class="text-sm mt-2 {backupStatus.includes('失败')
              ? 'text-error'
              : 'text-success'}"
          >
            {backupStatus}
          </p>
        {/if}
      </div>
    </div>
  </div>

  <!-- Theme Settings -->
  <div class=" bg-secondary rounded-lg shadow-md p-4 mb-4">
    <h2 class="text-sm font-medium mb-2.5 text-content">主题设置</h2>
    <div class="flex justify-between items-start text-secondary-content">
      <div class="space-y-2.5 w-full">
        <div>
          <p class="block text-xs mb-1 text-content-secondary">主题模式</p>
          <select
            value={currentTheme}
            on:change={handleThemeChange}
            class="w-full px-2 py-1 text-sm rounded bg-primary text-content"
          >
            <option value="light">浅色模式</option>
            <option value="dark">深色模式</option>
            <option value="system">跟随系统</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</div>
