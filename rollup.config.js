import deckyPlugin from "@decky/rollup";
import importAssets from "rollup-plugin-import-assets";

import manifest from "./package.json" with { type: "json" };

const plugin = deckyPlugin({});
const assetsPluginIndex = plugin.plugins.findIndex(p => p.name === 'assets');
if (assetsPluginIndex >= 0) {
    plugin.plugins[assetsPluginIndex] = importAssets({
        publicPath: `http://127.0.0.1:1337/plugins/${manifest.name}/`,
        include: [/\.gif$/i, /\.jpg$/i, /\.png$/i, /\.svg$/i, /\.css$/i],
        fileNames: 'assets/[name].[ext]',
        emitAssets: false,
    });
}

// noinspection JSUnusedGlobalSymbols
export default [plugin];
