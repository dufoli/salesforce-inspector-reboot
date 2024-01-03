const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
    entry: {
        //index: "./src/index.tsx",
        //background: path.resolve(__dirname, 'src', 'background.ts'),
        //inspectInline: path.resolve(__dirname, 'src', 'inspect-inline.ts'),
        //links: path.resolve(__dirname, 'src', 'links.ts'),
        //setupLinks: path.resolve(__dirname, 'src', 'setup-links.ts'),
        //inspector: path.resolve(__dirname, 'src', 'inspector.ts'),
        //button: path.resolve(__dirname, 'src', 'button.tsx')
    },
    mode: "production",
    module: {
        rules: [
            {
              test: /\.tsx?$/,
               use: [
                 {
                  loader: "ts-loader",
                   options: {
                     compilerOptions: { noEmit: false },
                    }
                  }],
               exclude: /node_modules/,
            },
            {
              exclude: /node_modules/,
              test: /\.css$/i,
               use: [
                  "style-loader",
                  "css-loader"
               ]
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "public"},
            ],
        }),
        ...getHtmlPlugins(["index"]),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.join(__dirname, "addon"),
        filename: "[name].js",
    },
};

function getHtmlPlugins(chunks) {
    return chunks.map(
        (chunk) =>
            new HTMLPlugin({
                title: "React extension",
                filename: `${chunk}.html`,
                chunks: [chunk],
            })
    );
}