/**
 * Created by zhangzhenghong on 2018/1/9.
 */

import React, { Component } from 'react';

import {
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
import {userModel} from '../Models/LOLUserModel'
import {LOLMineWarListCell} from "./Views/LOLMineWarListCell";
import {LOLMineHeadView} from "./Views/LOLMineHeadView";
import {LOLWarLevelCell} from "./Views/LOLWarLevelCell";

const kScreenWidth = Dimensions.get('window').width
const kScreenHeight = Dimensions.get('window').height

export default class LOLMineViewController extends React.Component
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

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true
    }

    _touchAction = (item, index)=>{
        // const {navigate} = this.props.navigation
        // navigate('Web',{url:item.article_url, item : item})
    }

    _listRemote = ()=> {
        this.setState({
            isRefreshing: true
        })
        let list = userModel.war
        return (
            this.timer = setTimeout(()=>{
                this.setState({
                    dataSourceArr: list,
                    isRefreshing: false
                })
            },1000)
        )
    }


    _onRefresh = () => {
        this._listRemote()
    }

    _renderItem = (item, index) => {
        return (
            <LOLMineWarListCell item={item} index={index} _touchAction={(item, index)=>this._touchAction(item,index)}>

            </LOLMineWarListCell>
        )
    }

    _levelRender = (index) => {
        return (
            <LOLWarLevelCell/>
        )
    }

    _onScroll(e){
        this.props.onScroll(e)
    }

    _sectionHeader = (section)=>{
        if (section.key === 'secondSection') {
            return (
                <View style={{
                    height: 50,
                    flex:1,
                    justifyContent:'center',
                    backgroundColor:'#ffffff',
                }}>
                    <View style={{
                        backgroundColor:'#cccccc',
                        height:0.5,
                        position:'absolute',
                        top:0,
                        left:0,
                        right:0,
                    }}>
                    </View>
                    <Text style={{
                        fontSize:20,
                        marginLeft:10,
                        fontFamily:'Helvetica Bold'
                    }}>战绩</Text>
                    <View style={{
                        backgroundColor:'#cccccc',
                        height:0.5,
                        position:'absolute',
                        bottom:0,
                        left:0,
                        right:0,
                    }}>
                    </View>
                </View>
            )
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={{backgroundColor: 'white',
                    flex :1,
                    width:kScreenWidth,
                    height:kScreenHeight - menuViewTop - tabBarHeight,
                }}>
                    <SectionList ref={(c)=>this._sectionList = c}
                                 ListHeaderComponent={()=>{
                                     return (
                                         <LOLMineHeadView/>
                                     )
                                 }}
                        // ListHeaderComponent = {()=> this._banner()}
                                 renderSectionHeader={({section}) => (this._sectionHeader(section))}
                                 style={styles.tableViewLayout}
                                 sections={[ // 不同section渲染相同类型的子组件
                                     {key:'firstSection', data:[userModel], renderItem:({index}) => this._levelRender(index)},
                                     {key:'secondSection', data:this.state.dataSourceArr, renderItem:({item, index}) => this._renderItem(item, index)},
                                 ]}
                                 keyExtractor = {(item, index)=>_keyExtractor(item, index)}
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

            </View>
        )
    }
}



const naviBarHeight = (kScreenHeight>=812?88:64)
const tabBarHeight = (kScreenHeight>=812?83:49)
const cellMargin = 10;
const tableViewTop = (kScreenHeight>=812?44:0)
const statusBarHeight = (kScreenHeight>=812?44:20)

const menuViewTop = 100
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },

    tableViewLayout: {
        flex:1,
        marginBottom:tabBarHeight
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