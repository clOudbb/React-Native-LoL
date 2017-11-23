/**
 * Created by zhangzhenghong on 2017/10/24.
 */

import React,{Component, PropTypes} from 'react';
import {
    fetch,
    StyleSheet,
    Dimensions
} from 'react-native';


/**
 *
 * notification name
 */
export const kTouchBannerNotification = '_kTouchBannerNotification'
export const kContainScrollViewScroll = 'kContainScrollViewScroll'

/**
 * remote api
 * @type {string}
 */
//总体分栏列表
export const lolAllChannel = 'http://qt.qq.com/lua/lol_news/channel?plat=ios&version=9755';
//轮播
export const lolBannerApi = 'http://qt.qq.com/static/pages/news/phone/c13_list_1.shtml';
//首页
export const lolListApi = 'http://qt.qq.com/php_cgi/news/php/varcache_getnews.php?id=12&page=0&plat=ios&version=33';
//季前赛版本改动、焦点
export const lolBetaChange = 'http://qt.qq.com/lua/lol_news/recommend?cid=367&areaid=1&plat=ios&version=9755';
//季前赛
export const loljiqiansai = 'http://qt.qq.com/php_cgi/news/php/varcache_getnews.php?id=367&page=0&plat=ios&version=9678&version=9689'
//英雄限免
export const lolFreeHeroWeek = 'http://qt.qq.com/php_cgi/lol_mobile/hero_group/php/cards.php?uuid=f0ad26da-b715-426e-a467-f85fa4c767bc&area_id=1&plat=ios&version=9755'
//英雄
export const lolHeroChannel = 'http://qt.qq.com/php_cgi/lol_mobile/hero_group/php/cards.php?uuid=f0ad26da-b715-426e-a467-f85fa4c767bc&area_id=1&plat=ios&version=9755'
//专栏
export const lolDingyueApi = 'http://qt.qq.com/lua/lol_news/columnlist?page=0&plat=ios&version=9680';
//视频-全部视频
export const lolAllVideo = 'http://apps.game.qq.com/lol/act/website2013/video.php?page=1&pagesize=10&r1=1&source=lolapp'
//视频-热门英雄
export const lolHotHero = 'ttp://apps.game.qq.com/lol/act/website2013/video.php?page=1&p3=412&page=1&pagesize=10&r1=1&source=lolapp'

//官方
export const lolGuanfangApi = 'http://qt.qq.com/php_cgi/news/php/varcache_getnews.php?id=3&page=0&plat=ios&version=33';
//活动
export const lolActivityApi = 'http://qt.qq.com/php_cgi/news/php/varcache_getnews.php?id=23&page=0&plat=ios&version=33';
//攻略
export const lolGonglueApi = 'http://qt.qq.com/php_cgi/news/php/varcache_getnews.php?id=10&page=0&plat=ios&version=33';
//娱乐
export const lolYule = 'http://qt.qq.com/php_cgi/news/php/varcache_getnews.php?id=18&page=0&plat=ios&version=33'

export const bilibiliApi = 'https://app.bilibili.com/x/feed/index?access_key=fe8c182f3151970812cb27d53eb264fa&actionKey=appkey&appkey=27eb53fc9058f8c3&build=6050&device=phone&idx=1496939923&login_event=2&mobi_app=iphone&network=wifi&open_event=cold&platform=ios&pull=1&sign=e1db2778b06164605bcc424a0df1d4e2&style=2&ts=1504144289'

export const _keyExtractor = (item, index)=>{
    return item.title
}

/**
 * 设置订阅数方法
 * @param item
 * @returns {number}
 * @private
 */
export const _handleCount = (item)=> {
    var count = 10;
    for (var i = 0; i < item.pv.length - 2; i++) {
        count = count * 10;
    }
    return Math.round(item.pv / count)
}

/**
 * 公共styles
 * @type {number}
 */

export const kScreenWidth = Dimensions.get('window').width
export const kScreenHeight = Dimensions.get('window').height
export const naviBarHeight = (kScreenHeight>=812?88:64)
export const tabBarHeight = (kScreenHeight>=812?83:49)
export const cellMargin = 10;
export const tableViewTop = (kScreenHeight>=812?44:0)
export const statusBarHeight = (kScreenHeight>=812?44:20)
export const generalStyles = StyleSheet.create({
    summaryTextStyle:{
        fontSize:14,
        color:'gray',
        marginLeft:10,
        marginRight:cellMargin,
    },
})