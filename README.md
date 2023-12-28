# how to configure webpack.

to use webpack we first need below dependency

```
npm i webpack webpack-cli --save-dev

```

these will allow us to use webpack make below change in package.json file

```diff
	{
	...
	"scripts": {
		...
+	    "build": "webpack --entry ./src/index.js --output-filename bundle.js --output-path ./dist"
	  },
	}

```


now when you run build script it will tell webpack to build the project and ./src/index.js file is the entry file
for this project and output the build file to ./dist folder and build file should be name bundle.js

we can continue to configure webpack this way but it's not recommend as it will become very ugly very quickly
for that we use configuration file

create a file named webpack.config.js at the root of project with below content

```diff

+	const path = require('path');
+
+	module.exports = {
+	entry: './src/index.js',
+	output: {
+	filename: 'bundle.js',
+	path: path.resolve(__dirname, 'dist'),
+	},
+	};


```

then update the build script with below content

```diff
	{
	...
	"scripts": {
		...
-	    "build": "webpack --entry ./src/index.js --output-filename bundle.js --output-path ./dist"
+	    "build": "webpack --config webpack.config.js",
	  },
	}
```

this will work the same way as earlier but make managing configuration easy.


# how to handle other file then "js"

to handle other type of file like css,scss,svg,png etc we have add a webpack loader for that kind of file 
for any kind of file there will a loader available below are some names.

* css-loader
* style-loader
* babel-loader

to use css within the project we can make below configuration changes in webpack.config.js file
and install below dependency first.

```
npm i -D  css-loader style-loader

```

```diff
	{
	  ...
	    module: {
		rules: [
			...
			,
+		        {
+			test: /\.css$/i,
+			use: ["style-loader", "css-loader"],
+			}
	        ],
	    },

	}

```

above will instruct the webpack that any file that end's with .css it has to use style-loader and css-loader to parse it.

NOTE: loader order matter here and they run right to left for above example,
css-loader run first then style-loader.

css-loader parse the css file then style loader eject the css file content in html on run time with the help of javascript.


# how to configure webpack for real-world application.

for real-world application we will require a dev server and that will help us in development phase, so we don't have to build file on every change and refresh browser for every time to see new changes, and for production build we want to make sure the build is well optimized.


now we can see that we will going need two webpack file one for production and one for development, to avoid duplication in the files we will create one common file that will going to have some base/common things that we need in both files and in the production,development webpack config file we will going to use a utility package (webpack-merge) to merge common file in these two files.

now create three webpack configuration file at the project root like below.

```diff
    
+   ├── webpack.common.js 
+   ├── webpack.dev.js 
+   ├── webpack.prod.js 

```

* webpack.common.js file contain the common configuration
* webpack.dev.js file extend the common configuration file by adding development time rules 
* webpack.dev.js file extend the common configuration file by adding production time rules 

add below content in these respective files.

and add below dependency.

```
npm i -D @babel/core @babel/preset-env babel-loader css-loader css-minimizer-webpack-plugin html-webpack-plugin mini-css-extract-plugin style-loader terser-webpack-plugin webpack-dev-server


```



webpack.common.js

```diff

+   const path = require("path");
+   const HtmlWebpackPlugin = require("html-webpack-plugin");
   
+   const BuildDirectoryPath = path.join(__dirname, "./dist");
   
+   module.exports = {
+     entry: "./src/index.js,
+     module: {
+       rules: [
+         {
+           test: /\.(png|svg|jpg|jpeg|gif)$/i,
+           type: "asset/resource",
+         },
+         {
+           test: /\.(woff|woff2|eot|ttf|otf)$/i,
+           type: "asset/resource",
+         },
+         {
+           test: /\.(js|jsx)$/,
+           exclude: /[\\/]node_modules[\\/]/,
+           use: {
+             loader: "babel-loader",
+           },
+         },
+       ],
+     },
+     plugins: [
+       new HtmlWebpackPlugin({
+         inject: true,
+         title: "Webpack Management",
+         chunks: ["indexPage"],
+         filename: "index.html",
+       }),
+     ],
+     output: {
+       filename: "[name].[contenthash].js",
+       path: BuildDirectoryPath,
+       clean: true,
+     },
+   };



```


webpack.dev.js

```diff
+    const { merge } = require("webpack-merge");
+    const commonConfig = require("./webpack.common.js");
+    
+    module.exports = merge(commonConfig, {
+      mode: "development",
+      devtool: "inline-source-map",
+      devServer: {
+        static: "./dist",
+      },
+      module: {
+        rules: [
+          {
+            test: /\.css$/i,
+            use: ["style-loader", "css-loader"],
+          },
+        ],
+      },
+    });

```

webpack.prod.js

```diff

+   const { merge } = require("webpack-merge");
+   const MiniCssExtractPlugin = require("mini-css-extract-plugin");
+   const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
+   const TerserPlugin = require('terser-webpack-plugin')
   
+   const commonConfig = require("./webpack.common.js");
   
   
+   module.exports = merge(commonConfig, {
+     mode: "production",
+     plugins: [new MiniCssExtractPlugin()],
+     module: {
+       rules: [
+         {
+           test: /\.css$/i,
+           use: [MiniCssExtractPlugin.loader, "css-loader"],
+         },
+       ],
+     },
+     optimization: {
+       minimizer: [
+      new CssMinimizerPlugin(),
+         new TerserPlugin(),
+       ],
+     },
+   });


```

now create a babelrc file as it will allow us to use new javascript features and it will compile to backward compatible syntax will below content.

```diff

+ {
+   "presets": ["@babel/preset-env"]
+ }


```



let understand what going in these files let's start with the webpack.common.js file


* this file define the common/base configuration for the project 
* we use "[name].[contenthash].js" in the output section this will tell webpack name files like "[file name here].[file content hash].js" this will allow use to browser cache efficiently and we will only re-download the file if file name is change and that is going to change only when file content is change. (we have to set the cache-control header when sent the file from server to clint)
* because over file change every time file content is changed that will make hard to link the file from html to solve this problem will are going to use "HtmlWebpackPlugin" this will manage link add part in the html and will can configure it more to add more thing in html.




now let understand webpack.dev.js

* first we will set the mode to development that will instruct webpack to not optimize the file as it will do for the production because that will make the process slow.
* then we set css loader for the development phase. 


now let understand webpack.prod.js
* first we will set the mode to production that will tell the webpack to optimize the files as we are ready to deploy it to production.
* then we add the css loader
* then we add css minify plugin this will minify the css file and for js files we use the terser plugin.


now update the script in package json file as below

```diff
{
	...
	scripts{
+	 "build": "webpack --config webpack.prod.js",
+	 "dev": "webpack serve  --config webpack.dev.js --open"

	}
}


```

