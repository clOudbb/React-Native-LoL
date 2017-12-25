'use strict';

import React,{Component, PropTypes} from 'react';
import ActionButton from 'react-native-action-button';
import {StackNavigator, } from 'react-navigation';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter' ;
import AlertSelected from "./AlertCustom";
import {
    lolListApi,
    lolBannerApi,
    _handleCount,
    kTouchBannerNotification,
    kContainScrollViewScroll,
} from './RemoteManager'
import {WebViewController, SecondViewController} from './App'
import PLBanner,{kBannerViewHeight} from './PLBanner'
import PLSectionHeaderView from './PLSectionHeaderView'
import CustomizeNaviBar from './CustomizeNaviBar'
import LOLGeneralController from './GeneralController/LOLGeneralController'
import LOLSpeicalColumnController from './GeneralController/LOLSpeicalColumnController'
import LOLSpeicalColumnDetailController from './GeneralController/LOLSpeicalColumnDetailController'

import {
    store,
    reduxScrollValue,
    _scrollViewState,
    mapDispatchProps,
    mapToState
} from './DataManager/ReduxManager'
import {
    connect,
    Provider,
} from 'react-redux'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Alert,
    Button,
    Modal,
    NativeModules,
    NativeAppEventEmitter,
    FlatList,
    Dimensions,
    Image,
    TouchableHighlight,
    NavigatorIOS,
    Animated,
    LayoutAnimation,
    RefreshControl,
    SectionList,
    ScrollView,
} from 'react-native';
import {GeneralControllerCell} from "./GeneralController/Views/GeneralControllerCell";
import TabNavigator from "react-native-tab-navigator";

/*
 <NavigatorIOS
 initialRoute={{
 component: BaseNavigationController,
 title: 'React Native',
 passProps: { myProp: 'foo' },
 }}
 style={{flex: 1}}
 translucent={false}
 />
 */

const kScreenWidth = Dimensions.get('window').width
const kScreenHeight = Dimensions.get('window').height

const tabBarItemName = {
    home : 'home',
    mine : 'mine'
}

class RNHighScores extends React.Component {

    constructor(props) {
        super(props);
        console.log('view did load')

        console.log('screenH' + kScreenHeight)
        this.state = {
            naviBarHidden:false,
            selectedTab : tabBarItemName.home
        }

        /**
         * 这里由于RN如果使用了桥接原声内容，目前0.50版本会警告RCTBatchedBridge未来版本会被废弃并移除掉
         * 暂时不去处理毕竟是练手项目，使用console屏蔽掉该警告
         * 未来使用查资料好像是会使用react-cxx-bridge框架
         */
        console.ignoredYellowBox = ["RCTBatchedBridge is deprecated and will be removed in a future React Native release."];
    }

    componentDidMount() {

    }


    _onScroll(value){
        console.log('scroll call back value ='+value)
        //这里为了实现navibar隐藏，用了setState去控制render重新渲染，但是实际效果不是很理想可能有闪屏情况
        //而且也不知性能是否会有影响
        //目前理解为了实现隐藏效果只能这样操作
        //单纯修改opacity在React中只是单纯降低了控件透明度，
        //但是控件还是占用空间，就是看似透明但是还可以点击
        if (this._naviBar) {
            this._naviBar._setNativeProps({
                style:{opacity:value}
            })
        }

        if (value === 0) {
            if (this.state.naviBarHidden === false) {
                this.setState({
                    naviBarHidden:true,
                })
            }
        } else {
            if (this.state.naviBarHidden === true) {
                this.setState({
                    naviBarHidden:false,
                })
            }
        }

    }

    firstTabBarItem(){
        return (
            <View style={styles.divLayout}>
                <Provider store={store}>
                    <View>
                        <BaseViewController navigation={this.props.navigation}
                                            onScrollCall={(value)=>this._onScroll(value)}
                                            naviHidden={this.state.naviBarHidden}>
                        </BaseViewController>
                        {
                            this.state.naviBarHidden?null:<CustomizeNaviBar ref={(nv) => this._naviBar = nv}/>
                        }
                    </View>
                </Provider>
            </View>
        )
    }

    secondTabBarItem(){
        return (
            <View style={styles.divLayout}>

            </View>
        )
    }

    render(){
        return(
            <TabNavigator   tabBarStyle={{
                height: tabBarHeight,
                // overflow: 'hidden'
            }}
                            sceneStyle={{
                                paddingBottom: 100
                            }}>
                <TabNavigator.Item
                    selected={this.state.selectedTab === tabBarItemName.home}
                    title=" "
                    renderIcon={() => <Image source={require('./Image/tabBarIcon/tab_home_n.png')} />}
                    renderSelectedIcon={() => <Image source={require('./Image/tabBarIcon/tab_home_h.png')} />}
                    badgeText=""
                    onPress={() => this.setState({ selectedTab: tabBarItemName.home })}
                    tabStyle={{
                        justifyContent:'center',
                    }}
                >
                    {
                        this.firstTabBarItem()
                    }
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === tabBarItemName.mine}
                    title=' '
                    renderIcon={() => <Image source={require('./Image/tabBarIcon/tabbar_me_n.png')} />}
                    renderSelectedIcon={() => <Image source={require('./Image/tabBarIcon/tabbar_me_h.png')} />}
                    badgeText=""
                    onPress={() => this.setState({ selectedTab: tabBarItemName.mine })}
                    tabStyle={{
                        justifyContent:'center',
                    }}
                >
                    {
                        this.secondTabBarItem()
                    }
                </TabNavigator.Item>
            </TabNavigator>
        );
    }
}

export default class BaseNavigationController extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            hideView:true,
            isShowAlert:false,
            fadeAnim:new Animated.Value(1),
            dataSourceArr:new Array(),
            bannerArr : new Array(),
            isRefreshing:false,
        }

        //通知
        RCTDeviceEventEmitter.emit('emit', 'message')
    }

    shouldComponentUpdate(nextProps, nextState) {
        let next = nextProps.naviHidden
        let props = this.props.naviHidden
        if (next !== props) return false
        else return true
    }

    componentDidMount(){
        this._datahandle()
        this.notifi = RCTDeviceEventEmitter.addListener(kTouchBannerNotification, (index)=>{
            this._scrollView.scrollTo({
                x : 0,
                y : index * kScreenWidth,
                animated:false,
            })
        })
    }

    componentWillUnmount() {
        this.notifi.remove()
    }

    _datahandle = ()=> {
        console.log(lolListApi)
        this.setState({
            isRefreshing: true,
        })
        this._bannerRemote()
        this._listRemote()
    }

    _listRemote = ()=> {
        return (
            fetch(lolListApi).then((response)=>response.json())
                .then((responseJson)=>{
                    var arr = new Array()
                    arr = responseJson.list
                    this.setState({
                        dataSourceArr:arr
                    })
                    console.log(arr)
                    this.setState({
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

    _bannerRemote = ()=> {
        return(
            fetch(lolBannerApi).then((response)=>response.json())
                .then((responseJson)=>{
                    var banner = responseJson.list;
                    this.setState({
                        bannerArr: banner,
                    })
                    console.log('banner data = ' + this.state.bannerArr)
                })
        )
    }

    //cell点击方法
    _touchAction = (item, index)=>{
        const {navigate} = this.props.navigation
        navigate('Web',{url:item.article_url, item : item})
    }

    _onRefresh = () => {
        this._datahandle()
    }


    _renderItem = (item, index) => {
        let imageURL = './image/sgs' + index + '.jpg';
        let _index = index;


        return (
            <GeneralControllerCell item={item}
                                   index={index}
                                   _touchAction={(item, index)=>this._touchAction(item, index)}>
            </GeneralControllerCell>
        )
    }

    _banner = () => {
        return(
            <PLBanner
                dataSourceArr = {this.state.bannerArr}
                _onPress={(i, url)=>this._bannerOnPress(i, url)}
            >

            </PLBanner>
        )
    }

    _bannerOnPress(i, url){
        console.log('i = '+i + '\nurl = ' + url)
        const {navigate} = this.props.navigation
        navigate('Web',{url:url, item : i})
    }


    keyExtractor(item, index){
        return item.title
    }

    _onScroll(e){
        var contentOffsetX = e.nativeEvent.contentOffset.x
        var contentOffsetY = e.nativeEvent.contentOffset.y
        console.log(contentOffsetY)
        var value = contentOffsetY / 100
        if (contentOffsetY <= 0) value=0;
        if (value > 1) value = 1;
        console.log('opacity = '+ value)

        this.props.onScrollCall(value)
        let missionOffset = kBannerViewHeight - statusBarHeight;
        // if (contentOffsetY >= missionOffset && contentOffsetY < kBannerViewHeight)
        // {
        //     this._sectionHeaderView._setNativeProps(contentOffsetY - missionOffset)
        // }
        // else if (contentOffsetY < missionOffset)
        // {
        //     this._sectionHeaderView._setNativeProps(0)
        // }
        // else if (contentOffsetY >= kBannerViewHeight)
        // {
        //     this._sectionHeaderView._setNativeProps(naviBarHeight - statusBarHeight)
        // }
    }

    _scrollViewOnScroll(e){
        let contentOffsetX = e.nativeEvent.contentOffset.x
        let index = contentOffsetX / kScreenWidth
        if (index % 1 !== 0) return;
        RCTDeviceEventEmitter.emit(kContainScrollViewScroll, index)

        this.props._scrollValue(_scrollViewState,index)
    }

    render()
    {
        return (

            <ScrollView style = {{
                backgroundColor:'gray',
            }}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ref={list=>this._scrollView=list}
                        pagingEnabled={true} onScroll={(e)=>this._scrollViewOnScroll(e)}
                        scrollEventThrottle={1}>

                <View style={styles.divLayout}>

                    <SectionList ref={(c)=>this._sectionList = c}
                                 data={this.state.dataSourceArr}
                                 ListHeaderComponent = {()=> this._banner()}
                        // renderSectionHeader={({section}) => (this._sectionHeader())}
                                 style={styles.tableViewLayout}
                                 sections={[ // 不同section渲染相同类型的子组件
                                     {data:this.state.dataSourceArr, renderItem:({item, index}) => this._renderItem(item, index)},
                                 ]}
                                 keyExtractor = {(item, index)=>this.keyExtractor(item, index)}
                                 onScroll={(e)=>{this._onScroll(e)}}
                                 scrollEventThrottle={1}  //监听频率
                                 refreshControl={
                                     <RefreshControl
                                         refreshing={this.state.isRefreshing}
                                         onRefresh={this._onRefresh}
                                         tintColor="#ffffff"
                                         title="Loading..."
                                         titleColor="#000000"
                                         colors={['#ff0000', '#00ff00', '#0000ff']}
                                         progressBackgroundColor="#ffff00"
                                     />
                                 }

                    >
                    </SectionList>
                </View>

                <LOLGeneralController navigation={this.props.navigation}
                                      onScroll={(e)=>this._onScroll(e)}>

                </LOLGeneralController>
                <LOLSpeicalColumnController navigation={this.props.navigation}
                                            onScroll={(e)=>this._onScroll(e)}>
                </LOLSpeicalColumnController>
            </ScrollView>

        );
    }
}

const BaseViewController = connect(
    mapToState,
    mapDispatchProps,
)(BaseNavigationController)

const showAlert = (string) => {
    Alert.alert(''+stirng);
};

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
    highScoresTitle: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    scores: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    buttonLayout:{
        alignItems:'center',
        width:100,
        height:30,
        backgroundColor:'#328388',
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


const StackNavigatorConfig = {
    // initialRouteName: 'Home',
    initialRouteParams: {opacity: 1},
    // navigationOptions: {
    //     title: '标题',
    //     headerTitleStyle: {fontSize: 18, color: '#666666'},
    //     headerStyle: {height: 48, backgroundColor: '#fff'},
    // },
    // paths: 'page/main',
    // mode: 'card',
    headerMode: 'screen',
    // cardStyle: {backgroundColor: "#ffffff"},
    // transitionConfig: (() => ({
    //     screenInterpolator: CardStackStyleInterpolator.forHorizontal,
    // })),
    onTransitionStart: (() => {
        console.log('页面跳转动画开始');
    }),
    onTransitionEnd: (() => {
        console.log('页面跳转动画结束');
    }),
};

const App = StackNavigator({
    Main: {
        screen: RNHighScores,
        navigationOptions:{
            headerTitle:'Main',
            headerStyle:styles.navigationBarStyle,
            header:null,
        }
    },
    Second: {
        screen : SecondViewController,
        navigationOptions : {
            title : 'SecondViewController',
            headerStyle : styles.navigationBarStyle,
        },
    },
    ColumnDetail: {
        screen: LOLSpeicalColumnDetailController,
        navigationOptions: {
            title: 'detail',
            header:null,
            headerStyle : styles.navigationBarStyle,
        }
    },
    Web: {
        screen : WebViewController,
        navigationOptions : {
            title : 'WebViewController',
            headerStyle : styles.navigationBarStyle,
        },
    },

}, StackNavigatorConfig);



// 整体js模块的名称
AppRegistry.registerComponent('OC_React', () => App);