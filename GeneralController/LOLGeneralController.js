/**
 * Created by zhangzhenghong on 2017/11/22.
 */

import React, { Component } from 'react';

import {
    lolListApi,
    bilibiliApi,
    lolActivityApi,
    lolAllChannel,
    lolBannerApi,
    lolDingyueApi,
    lolGonglueApi,
    lolGuanfangApi,
    lolYule,
    lolBetaChange,
    loljiqiansai,
    lolFreeHeroWeek,
    lolHeroChannel,
    lolAllVideo,
    lolHotHero,
    _keyExtractor,
    _handleCount,
} from '../RemoteManager';


import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    SectionList,
    TouchableHighlight,
    ScrollView,
    Animated,
    RefreshControl,
    Image,
} from 'react-native';
import {GeneralControllerCell} from "./Views/GeneralControllerCell";
import BigImageCell from './Views/BigImageCell'
import VersionChangesHeadView from "./Views/VersionChangesHeadView";

const kScreenWidth = Dimensions.get('window').width
const kScreenHeight = Dimensions.get('window').height

export default class LOLGeneralController extends React.Component
{
    constructor(props){
        super(props)
        this.state = {
            dataSourceArr:new Array(),
            isRefreshing:false,
        }
    }
    componentDidMount(){
        this._listRemote()
    }

    _touchAction = (item, index)=>{
        const {navigate} = this.props.navigation
        navigate('Web',{url:item.article_url, item : item})
    }

    _listRemote = ()=> {
        return (
            fetch(loljiqiansai).then((response)=>response.json())
                .then((responseJson)=>{
                    var arr = new Array()
                    arr = responseJson.list
                    this.setState({
                        dataSourceArr:arr,
                        isRefreshing: false,
                    })
                }).catch((error)=>{
                console.log(error)
                this.setState({
                    isRefreshing: false,
                })
            })
        )
    }

    _otherRemote = ()=>{
        return (
            fetch(lolBetaChange)
                .then((response)=>response.json())
                .then((responseJson)=>{

            })
        )
    }

    _onRefresh = () => {
        this._listRemote()
    }

    _renderItem = (item, index) => {
        if (item.image_spec == 3) {
            return (
                <BigImageCell item={item} index={index} _touchAction={(item,index)=>this._touchAction(item, index)}>

                </BigImageCell>
            )
        }
        return (
            <GeneralControllerCell item={item} index={index} _touchAction={(item, index)=>this._touchAction(item,index)}>

            </GeneralControllerCell>
        )
    }

    _onScroll(e){
        this.props.onScroll(e)
    }

    render(){
        return(
            <View style={styles.container}>
                <SectionList ref={(c)=>this._sectionList = c}
                             data={this.state.dataSourceArr}
                             ListHeaderComponent={()=>{
                                 return (
                                     <VersionChangesHeadView/>
                                 )
                             }}
                             // ListHeaderComponent = {()=> this._banner()}
                    // renderSectionHeader={({section}) => (this._sectionHeader())}
                             style={styles.tableViewLayout}
                             sections={[ // 不同section渲染相同类型的子组件
                                 {data:this.state.dataSourceArr, renderItem:({item, index}) => this._renderItem(item, index)},
                             ]}
                             keyExtractor = {(item, index)=>_keyExtractor(item, index)}
                             onScroll={(e)=>{this._onScroll(e)}}
                             scrollEventThrottle={1}  //监听频率
                             refreshControl={
                                 <RefreshControl
                                     refreshing={this.state.isRefreshing}
                                     onRefresh={this._onRefresh}
                                     tintColor="#cccccc"
                                     title="Loading..."
                                     titleColor="#000000"
                                     colors={['#ff0000', '#00ff00', '#0000ff']}
                                     progressBackgroundColor="#ffff00"
                                 />
                             }

                >
                </SectionList>
            </View>
        )
    }
}

const naviBarHeight = (kScreenHeight>=812?88:64)
const tabBarHeight = (kScreenHeight>=812?83:49)
const cellMargin = 10;
const tableViewTop = (kScreenHeight>=812?44:0)
const statusBarHeight = (kScreenHeight>=812?44:20)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },

    tableViewLayout: {
        marginTop:tableViewTop,
        marginBottom:0,
        marginLeft:0,
        marginRight:0,
        flex:1,
    },

    divLayout:{
        // flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'flex-start',
        backgroundColor:'gray',
        width:kScreenWidth,
        height:kScreenHeight
    },


    cellLaytout:{
        flex:1,
        flexDirection:'row',
        width:Dimensions.get('window').width,
        justifyContent:'center',
        height : 100,
        alignItems:'center',
        backgroundColor:'#cccccc',
    },

    cellTouchableStyle:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },

    cellContainStyle:{
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        // marginTop:5,
        // marginBottom:0,
        // marginLeft:10,
        // marginRight:10,
        backgroundColor:'#ffffff',
    },

    cellTextLayout:{
        flex:1,
        flexDirection:'column',
        height:90,
        justifyContent:'flex-start',
        backgroundColor:'#FFFFFF',
        marginLeft : 0,
        marginTop: 0,
    },

    textLayout:{
        marginLeft:10,
        fontSize:18,
        marginRight:cellMargin,
        marginTop:10,
    },

    summaryTextStyle:{
        fontSize:14,
        color:'gray',
        marginLeft:10,
        marginRight:cellMargin,
    },

    dateTextStyle:{
        position:'absolute',
        bottom: 5,
    },

    textLayout_second:{
        marginTop:20,
    },

    imageViewLayout:{
        width:90,
        height: 70,
        borderRadius:4,
        marginRight: cellMargin,
    },

    cellButtonLaytout:{
        width: 20,
        height: 30,
        marginRight : 20,
        flex: 0.5,
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
    },
    cellButtonFont:{
        fontSize:18,
    },

    navigationBarStyle:{
        backgroundColor:'white',
        height:naviBarHeight,
        borderBottomWidth:0.5,
        opacity:1,
    },

    hideNavigationBarStyle:{
        opacity:0,
    },

    customizeNavibarStye:{
        backgroundColor:'white',
        width:kScreenWidth,
        height:naviBarHeight,
        borderBottomWidth:0.5,
        opacity:1,
        position:'absolute',
        top:0,
    }
});