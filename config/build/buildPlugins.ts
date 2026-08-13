import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'
import webpack, { Configuration, DefinePlugin } from 'webpack'
import { BuildOptions } from './types/types'

const grapheneUrl =
    process.env.GRAPHENE_URL ||
    'http://localhost:8000/graphql/graphene/';

const strawberryUrl =
    process.env.STRAWBERRY_URL ||
    'http://localhost:8000/graphql/strawberry/';

const websocketUrl =
    process.env.WEBSOCKET_URL ||
    'ws://localhost:8000/graphql/subscription/';

const backendUrl =
    process.env.BACKEND_URL ||
    'http://localhost:8000';

export function buildPlugins({mode, paths, analyzer}: BuildOptions): Configuration['plugins'] {
    const isDev = mode === 'development'
    const isProd = mode === 'production'

    const userAgent = process.env.USER_AGENT || ''; 
    const isMobile = /android|ios|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    const platform = isMobile ? 'mobile' : 'desktop';

    
    const plugins: Configuration['plugins'] = [
        new HtmlWebpackPlugin({template: paths.html}),
        new webpack.DefinePlugin({
            __PLATFORM__: JSON.stringify(platform),

            __BACKEND_URL__: JSON.stringify(backendUrl),
            __GRAPHENE_URL__: JSON.stringify(grapheneUrl),
            __STRAWBERRY_URL__: JSON.stringify(strawberryUrl),
            __WEBSOCKET_URL__: JSON.stringify(websocketUrl)
        })
    ]

    if(isDev) { 
        plugins.push(new webpack.ProgressPlugin())
    }

    if(isProd) {
        plugins.push(new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].css'
        }))
    }

    if (analyzer) {
        plugins.push(new BundleAnalyzerPlugin())
    }

    return plugins;
}