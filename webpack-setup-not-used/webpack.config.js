const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
	entry: './public/js/index_bundle.js',

	// when webpack creates the single file bundle,
	// it will create/output it in 'project_path/public/js/index_bundle.js'
	output: {
		path: path.resolve(__dirname, 'public/js'),
		filename: 'index_bundle.js'
	},

	module: {
		// let webpack know how to transform React and JSX code to regular JS
		rules: [
			{ 
				test: /\.(js)$/,     // search for any .js file
			  	use: 'babel-loader' 	// transform using babel-loader
			},
			{
				test: /\.css$/,		// search for any .css file
				use: [ 'style-loader', 'css-loader']  // make those styles active on resulting page
			}
		]
	},

	mode: 'development',   // to deploy, change to 'production' (and some other changes)

	node: { 
		fs: 'empty' // Get rid of compile error: Can't resolve 'fs' in node_modules/dotenv/lib
	},
	
	plugins: [
		// new HtmlWebpackPlugin({
		// 	template: 'src/index.html'
		// }),
		new Dotenv()
	],
	// devServer: {
		// port: 3000,
		// proxy: {
		// 	'/': 'http://localhost:3000'
		// },
     	// headers: {
      //    'Access-Control-Allow-Origin': '*',
      //    'Access-Control-Allow-Headers': '*',
      //    'Access-Control-Allow-Methods': '*',
      // },
    // },
}