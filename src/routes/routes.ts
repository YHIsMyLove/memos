import AnalysisPage from "../pages/analysisPage.svelte";
import HomePage from "../pages/homePage.svelte";
import SettingPage from "../pages/settingPage.svelte";
import TimeLinePage from "../pages/timeLinePage.svelte";

export default {
    "*": HomePage,
    "/setting": SettingPage,
    "/time": TimeLinePage,
    "/analysis": AnalysisPage,
}