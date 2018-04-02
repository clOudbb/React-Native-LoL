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
    _handleCount,
    kScreenWidth,
    kScreenHeight,
    naviBarHeight,
    tabBarHeight,
    cellMargin,
    tableViewTop,
    statusBarHeight,
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
    Alert,
    Button,
} from 'react-native';
import {
    store,
    reduxScrollValue,
    _reduxSubscribeType,
    mapDispatchProps,
    mapToSubScribe,
    reduxUpdateControl,
} from '../DataManager/ReduxManager'
import {
    connect,
} from 'react-redux'

/**
 * test 使用原生模块
 */
import { requireNativeComponent } from 'react-native';

var RCTAlertView = requireNativeComponent('RCTAlertView', RCTAlertView);

let isButtonSub = false
class SpeicalColumnCell extends React.Component
{
    constructor(props){
        super(props)
    }

    componentDidMount() {

    }


    componentWillUnmount() {

    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.subscribeArray) return false
        return true
    }

    _getIsSubState(){
        const { store } = this.props;
        const state = store.getState();
        if (!state._subscribeArray) return false;
        let subscribeArray = state._subscribeArray
        let isSub = false
        for (let i = 0;i < subscribeArray.length;i++) {
            let model = subscribeArray[i]
            if (model.index === this.props.index && model.section === this.props.section) {
                isSub = model.isSub
            }
        }
        return isSub
    }

    _subsriAction() {
        let isSub = this._getIsSubState()
        isSub?Alert.alert('已取消订阅'):Alert.alert('已订阅')
        this.props._subscribe(_reduxSubscribeType, this.props.section, this.props.index, isSub)
    }

    //顶部导航栏与bug，隐藏后在出现，滚动条会恢复原始。修复方案 state用redux管理 (もうフィクス)
    showSubsriButton(){
        isButtonSub = this._getIsSubState()
        return(
            <TouchableHighlight onPress={()=>this._subsriAction()}
                                underlayColor='#cccccc' style={[styles.subscribeButton, isButtonSub?{backgroundColor:'#802a2a'}:null]}>
                <View style={{flex:1,justifyContent:'center'}}>
                    <Text style={isButtonSub?{fontSize:16, color:'#ffffff'}:{fontSize:16, color:'#802A2A'}}>
                        {isButtonSub?'已订阅':'订阅'}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    }

    render() {
        let item = this.props.item
        return (
            <TouchableHighlight style={{flex:1,}} onPress={()=>this.props.onPress(item, this.props.index, this.props.section)}>
                <View style={styles.cellContainViewStyle}>
                    <Image source={{uri:item.logo}} style={styles.imageViewLayout}/>
                    <View style={{flex:1,
                        marginLeft:cellMargin,
                        marginRight:cellMargin,
                    }}>
                        <Text style={{fontSize:20}}>{item.col_title}</Text>
                        {
                            this.props.showSubsri?
                                <View style={{marginTop:10,}}>
                                    <Text style={{fontSize:16, color:'#b1b1b1'}}>
                                        {item.author}
                                    </Text>
                                </View>
                                :null
                        }
                        <Text style={{fontSize:14, marginTop:10, color:'#cccccc'}} numberOfLines={1}>{item.col_des}</Text>
                    </View>
                    {
                        this.props.showSubsri?this.showSubsriButton():null
                    }
                </View>
            </TouchableHighlight>
        )
    }
}


class LOLSpeicalColumnController extends React.Component
{
    constructor(props){
        super(props)
        this.state = {
            dataSourceArr:new Array(),
            recommendArr : [],
            isRefreshing:false,
        }
    }
    componentDidMount(){
        this._listRemote()

    }

    _touchAction = (item, index, section)=>{
        const {navigate} = this.props.navigation
        const {store} = this.props
        navigate('ColumnDetail',{item : item, store:store, index: index, section: section})
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true
    }

    _listRemote = ()=> {
        return (
            fetch(lolDingyueApi).then((response)=>response.json())
                .then((responseJson)=>{
                    var unbook_list = []
                    unbook_list = responseJson.unbook_list
                    var recommend = [];
                    recommend = responseJson.recommend_list
                    this.setState({
                        dataSourceArr:unbook_list,
                        recommendArr:recommend,
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

    _onRefresh = () => {
        this._listRemote()
    }

    _firstSection = (item, index) => {
        return (
            <SpeicalColumnCellRedux item={item} index={index} section={0} onPress={(item, index,section)=>this._touchAction(item, index, section)}
                               showSubsri={false} />
        )
    }
    _secondSection = (item, index) => {
        return (
            <SpeicalColumnCellRedux item={item} index={index} section={1} onPress={(item, index, section)=>this._touchAction(item, index, section)}
                               showSubsri={true}/>
        )
    }

    _sectionHeader(section){
        if (section === 0) {
            return (
                <View style={styles.sectionLaytout}>
                    <Text style={styles.textLayout}>栏目推荐</Text>
                </View>
            )
        } else {
            return (
                <View style={styles.sectionLaytout}>
                    <Text style={styles.textLayout}>未订阅</Text>
                </View>
            )
        }
    }

    _onScroll(e){
        this.props.onScroll(e)
    }


    render(){
        return(
            <View style={styles.columnViewContainer}>
                <SectionList ref={(c)=>this._sectionList = c}
                             data={this.state.dataSourceArr}
                             style={styles.tableViewLayout}
                             renderSectionHeader={({section}) => (this._sectionHeader(section))}
                             sections={[ // 不同section渲染相同类型的子组件
                                 {data:this.state.recommendArr, renderItem:({item, index})=> this._firstSection(item, index)},
                                 {data:this.state.dataSourceArr, renderItem:({item, index}) => this._secondSection(item, index)},
                             ]}
                             keyExtractor={(item)=>item.col_title}
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

const SpeicalColumnCellRedux = connect(
    mapToSubScribe,
    mapDispatchProps,
)(SpeicalColumnCell)

export default connect(
    mapToSubScribe,
    mapDispatchProps,
)(LOLSpeicalColumnController)

const styles = StyleSheet.create({
    columnViewContainer: {
        backgroundColor: '#FFFFFF',
        width:kScreenWidth,
        height:kScreenHeight
    },

    tableViewLayout: {
        marginTop:tableViewTop,
        marginBottom:0,
        marginLeft:0,
        marginRight:0,
        flex:1,
    },

    sectionLaytout:{
        flex:1,
        justifyContent:'center',
        backgroundColor:'#e6e6e6',
        height:30,
    },

    cellContainViewStyle: {
        flex:1,
        backgroundColor:'white',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        height:100,
        width:kScreenWidth,
    },

    textLayout:{
        left : cellMargin,
    },

    imageViewLayout:{
        width:50,
        height:50,
        borderRadius: 25,
        marginLeft: cellMargin,
    },

    subscribeButton:{
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        width:70,
        height:30,
        borderColor:'#802A2A',
        borderRadius:4,
        position:'absolute',
        right:cellMargin,
        top:20,
    }
});