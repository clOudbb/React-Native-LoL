/**
 * Created by zhangzhenghong on 2017/10/24.
 */

import React,{Component, PropTypes} from 'react';
import {
    fetch,
} from 'react-native';

//总体分栏列表
export const lolAllChannel = 'http://qt.qq.com/php_cgi/news/php/varcache_channel.php?plat=ios&version=9680';
//轮播
export const lolBannerApi = 'http://qt.qq.com/static/pages/news/phone/c13_list_1.shtml';
//首页
export const lolListApi = 'http://qt.qq.com/php_cgi/news/php/varcache_getnews.php?id=12&page=0&plat=ios&version=33';
//专栏
export const lolDingyueApi = 'http://qt.qq.com/lua/lol_news/columnlist?page=0&plat=ios&version=9680';
//官方
export const lolGuanfangApi = 'http://qt.qq.com/php_cgi/news/php/varcache_getnews.php?id=3&page=0&plat=ios&version=33';
//活动
export const lolActivityApi = 'http://qt.qq.com/php_cgi/news/php/varcache_getnews.php?id=23&page=0&plat=ios&version=33';
//攻略
export const lolGonglueApi = 'http://qt.qq.com/php_cgi/news/php/varcache_getnews.php?id=10&page=0&plat=ios&version=33';
//娱乐
export const lolYule = 'http://qt.qq.com/php_cgi/news/php/varcache_getnews.php?id=18&page=0&plat=ios&version=33'

export const bilibiliApi = 'https://app.bilibili.com/x/feed/index?access_key=fe8c182f3151970812cb27d53eb264fa&actionKey=appkey&appkey=27eb53fc9058f8c3&build=6050&device=phone&idx=1496939923&login_event=2&mobi_app=iphone&network=wifi&open_event=cold&platform=ios&pull=1&sign=e1db2778b06164605bcc424a0df1d4e2&style=2&ts=1504144289'

