/**
 * Created by zhangzhenghong on 2017/12/12.
 */

import React, { Component } from 'react';

import {
    loldingYuePageHeadApi,
    lolDingYuePageApi,
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
    FlatList,
    TouchableHighlight,
    ScrollView,
    Animated,
    RefreshControl,
    Image,
    Button,
    PanResponder,
} from 'react-native';
import SpecialColumnHeadView from './Views/SpecialColumnHeadView'
import ParallaxScrollView from 'react-native-parallax-scroll-view';


class ColumnListCell extends React.Component
{
    constructor(props){
        super(props)
    }

    render(){
        let item = this.props.item
        return(
            <View style={cellStyles.cellLaytout}>

                <TouchableHighlight style={cellStyles.cellTouchableStyle}
                                    onPress={()=>{this.props.onPress(item, this.props.index)}}>
                    <View style={cellStyles.cellContainStyle}>

                        <View style={cellStyles.cellTextLayout}>
                            <Text style={cellStyles.textLayout} numberOfLines={1}>{item.title}</Text>
                            <Text style={cellStyles.summaryTextStyle} numberOfLines={2}>{item.summary}</Text>
                            <Text style={[cellStyles.summaryTextStyle, cellStyles.dateTextStyle]}>
                                {item.publication_date + ' '}
                                <Text style={cellStyles.summaryTextStyle}>{_handleCount(item) + '万阅'}</Text>
                            </Text>
                        </View>
                        <Image style={cellStyles.imageViewLayout}
                               source={{uri:item.image_url_small}}
                        />
                        <View style={{
                            position:'absolute',
                            backgroundColor:'#cccccc',
                            height:0.5,
                            left:20,
                            right:20,
                            bottom:0
                        }}>

                        </View>
                    </View>


                </TouchableHighlight>

            </View>
        )
    }
}


/**
 * 暂存外层scroll的contentOffsetY的值
 */
var tempScrollOffsetY = 0
/**
 * 存储手势释放时的外层Scroll 的contentOffset
 */
var tempOffsetY = 0
/**
 *　记录listview 的offsetY
 * @type {number}
 */
var tempSectionListOffsetY = 0
let headViewHeight = 200
let boundsY = headViewHeight - naviBarHeight
//特別の番組　とくべつのばんぐみ
export default class LOLSpeicalColumnDetailController extends React.Component
{
    constructor(props){
        super(props)
        this.state = {
            dataSourceArr:new Array(),
            isRefreshing:false,
            item:this.props.navigation.state.params.item,
        }


        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (e, g) => this._startShouldSetPanResponder(e, g),
            onStartShouldSetPanResponderCapture: (evt, gestureState) => this._startShouldSetPanResponderCapture(evt, gestureState),
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => this._moveShouldSetPanResponderCapture(evt, gestureState),
            onPanResponderGrant: () => {

            },
            onPanResponderRelease: (e, g)=> this._onPanResponderRelease(e, g),
            onMoveShouldSetResponder:(e, g)=> this._onMoveShouldSetResponder(e, g),
            onPanResponderMove: (evt, gestureState)=>this._panMoveGesture(evt, gestureState),
        });

    }

    shouldComponentUpdate(nextProps, nextState) {
        return true
    }

    componentDidMount(){
        this._listRemote()
        tempScrollOffsetY = 0
        tempOffsetY = 0
    }

    _touchAction = (item, index)=>{
        const {navigate} = this.props.navigation
        navigate('Web',{url:item.article_url, item : item})
    }

    _listRemote = ()=> {
        if (this.state.isRefreshing) return
        this.setState({
            isRefreshing:true,
        })
        let propsItem = this.state.item
        //http://qt.qq.com/php_cgi/news/php/varcache_getcols.php?cid=126&page=0&plat=ios&version=9755
        let api = 'http://qt.qq.com/php_cgi/news/php/varcache_getcols.php?cid='+propsItem.col_id+'&page=0&plat=ios&version=9755'
        return (
            fetch(api).then((response)=>response.json())
                .then((responseJson)=>{
                    var list = []
                    list = responseJson.list
                    this.setState({
                        dataSourceArr:list,
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
            <ColumnListCell item={item} index={index} onPress={(item, index)=>this._touchAction(item, index)}/>
        )
    }


    _sectionListScroll(e){
        var contentOffsetY = e.nativeEvent.contentOffset.y
        tempSectionListOffsetY = contentOffsetY
    }

    _scrollViewOnScroll(e){
        var contentOffsetY = e.nativeEvent.contentOffset.y
        tempScrollOffsetY = contentOffsetY
        if (contentOffsetY >= 0 && contentOffsetY <= (200 - naviBarHeight)) {
            let opac = contentOffsetY / (200 - naviBarHeight)
            this.cusNavi.setNativeProps({
                style:{
                    opacity: opac,
                }
            })
        } else if (contentOffsetY > (200 - naviBarHeight)) {
            if (this.cusNavi.props.style.opacity !== 1) {
                this.cusNavi.setNativeProps({
                    style:{
                        opacity: 1,
                    }
                })
            }
        }

    }

    /**
     * 这里对原版的实现，RN里暂时不知道如何去实现
     * 原版是头部滑动到一定位置后，列表会获得焦点进行滑动
     * 应该是ScrollView的嵌套，但是RN中不知道怎么实现无缝衔接，因为一旦设置state，势必刷新render
     * 导致页面会停顿一下，会打断手势焦点的获取
     *
     * 问题攻克
     * 最终选择了使用手势来监听屏幕滑动，达到不同区域滑动分离的效果
     * 整体效果最终优化还不错，目前看细微上可能还有些不同，但是整体效果还可以
     */

    headerViewComponent(){
        let propsItem = this.state.item
        let store = this.props.navigation.state.params.store
        let index = this.props.navigation.state.params.index
        let section = this.props.navigation.state.params.section
        return (
            <SpecialColumnHeadView style={{
                backgroundColor:'#2E8B57',
                opacity:1,
                height:headViewHeight,
                marginTop:0,
            }} item={propsItem} ref={(headerView)=>this.headerView=headerView} navigation={this.props.navigation}
            store={store}
            index={index}
            section={section}/>
        )
    }

    backButtonAction(){
        const {goBack} = this.props.navigation
        goBack()
    }


    _panMoveGesture(evt, gestureState){

        let offsetY = gestureState.dy
        let pageY = evt.nativeEvent.pageY
        let moveY = gestureState.moveY
        console.log('offsetY = ' + offsetY)
        console.log('moveY = ' + moveY)
        console.log('pageY = ' + pageY)
        console.log('tempScrollOffsetY = ' + tempScrollOffsetY)
        if (offsetY <= 0 && offsetY >= -boundsY) {
            //上滑
            if (offsetY === 0) return
            if (tempScrollOffsetY >= 0 && tempScrollOffsetY <= boundsY) {
                this._scrollView.scrollTo({
                    x:0,
                    y:-offsetY + tempOffsetY,
                    animated:false,
                })
            }

            // this.containView.setNativeProps({
            //     style:{
            //         top:offsetY,
            //     }
            // })
        } else {
            //下拉
            if (tempScrollOffsetY >= 0) {
                if (tempScrollOffsetY > 0) {
                    this._scrollView.scrollTo({
                        x:0,
                        y:-offsetY + tempOffsetY,
                        animated:false,
                    })
                    return
                }
                //外层scroll 固定时
                this._sectionList.scrollToOffset({
                    animated:false,
                    offset:- offsetY,
                })
            } else {
                if (tempScrollOffsetY < 0) {
                    this._scrollView.scrollTo({
                        x:0,
                        y:0,
                        animated:false,
                    })
                    tempScrollOffsetY = 0
                    return
                }
                this._sectionList.scrollToOffset({
                    animated:false,
                    offset: 0,
                })
            }
        }
    }

    /**
     * 手势释放事件
     */
    _onPanResponderRelease(evt, gestureState){
        let offsetY = gestureState.dy
        if (tempScrollOffsetY >= 0 && offsetY > 0) {
            this._sectionList.scrollToOffset({
                animated:true,
                offset: 0,
            })
        }
        if (tempSectionListOffsetY >= 200) {
            this._listRemote()
        }
        tempOffsetY = tempScrollOffsetY
    }

    /**
     * 是否成为响应者
     * @param evt
     */

    _startShouldSetPanResponder(evt, gestureState) {
        return true
    }

    /**
     * 该手势持有者如果不是第一响应者，可以使用返回true拦截住
     */
    _startShouldSetPanResponderCapture(evt, gestureState) {
        let offsetY = gestureState.dy
        console.log('start set pan capture')
        if (offsetY <= 0 && offsetY >= -boundsY ) {
            return true
        }
        return false
    }

    _moveShouldSetPanResponderCapture(evt, gestureState) {
        let offsetY = gestureState.dy
        console.log('move set pan capture = ' + offsetY)
        if (offsetY <= 0 && offsetY >= -boundsY ) {
            return true
        }
        return false
    }

    _onMoveShouldSetResponder(evt, gestureState) {
        return true
    }


    render(){
        return(
            <View>
                <View
                    ref={(containView)=>this.containView= containView}
                    style={{
                        top:0,
                    }}
                    {...this._panResponder.panHandlers}
                >
                    <ScrollView style = {{
                        backgroundColor:'#2E8B57',
                    }}
                                showsHorizontalScrollIndicator={false}
                                ref={list=>this._scrollView=list}
                                onScroll={(e)=>this._scrollViewOnScroll(e)}
                                bounces={false}
                                scrollEnabled={false}
                                scrollEventThrottle={1}
                    >
                        {
                            this.headerViewComponent()
                        }
                        <FlatList ref={(c)=>this._sectionList = c}
                                  data={this.state.dataSourceArr}
                                  style={styles.tableViewLayout}
                            // ListHeaderComponent={()=>this.headerViewComponent()}
                            //          sections={[ // 不同section渲染相同类型的子组件
                            //              {data:this.state.dataSourceArr, renderItem:({item, index})=> this._firstSection(item, index)},
                            //          ]}
                                  renderItem={({item, index})=>this._firstSection(item, index)}
                                  keyExtractor={(item)=>item.title}
                                  onScroll={(e)=>{this._sectionListScroll(e)}}
                                  scrollEventThrottle={1}  //监听频率
                                  scrollEnabled={true}
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
                                  }>
                        </FlatList>
                    </ScrollView>

                </View>

                <View style={{
                    width:kScreenWidth,
                    height:naviBarHeight,
                    position:'absolute',
                    top:0,
                }}>
                    <View style={{
                        backgroundColor:'#2E8B57',
                        opacity:0,
                        flex:1,
                    }} ref={(cusNavi)=>this.cusNavi=cusNavi}>
                    </View>
                    <View style={{
                        width:60,
                        height:30,
                        position:'absolute',
                        top:30,
                        left:10,
                    }}>
                        <Button
                            onPress={()=>this.backButtonAction()}
                            title="Back"
                            color='white'
                        />
                    </View>
                </View>

            </View>
        )
    }
}



const styles = StyleSheet.create({
    columnViewContainer: {
        backgroundColor: '#FFFFFF',
        width:kScreenWidth,
        height:kScreenHeight
    },

    tableViewLayout: {
        marginTop:0,
        marginBottom:0,
        marginLeft:0,
        marginRight:0,
        backgroundColor:'white',
    },

    cellContainViewStyle: {
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        height:200,
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
        top:70,
    },

    headerViewStyle:{
        backgroundColor:'#2E8B57',
    }
});

const cellStyles = StyleSheet.create({
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
})