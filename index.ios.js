'use strict';

import React,{Component, PropTypes} from 'react';
import ActionButton from 'react-native-action-button';
import {StackNavigator, } from 'react-navigation';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter' ;
import AlertSelected from "./AlertCustom";
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
} from './RemoteManager'
import {WebViewController, SecondViewController} from './App'
import PLBanner from './PLBanner'
import PLSectionHeaderView from './PLSectionHeaderView'
import CustomizeNaviBar from './CustomizeNaviBar'

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

} from 'react-native';

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

const selectedArr = ["拍照", "图库"];
const kScreenWidth = Dimensions.get('window').width
const kScreenHeight = Dimensions.get('window').height

class RNHighScores extends React.Component {

    constructor(props) {
        super(props);
        console.log('view did load')

        console.log('screenH' + kScreenHeight)
    }


    _onScroll(value){
        console.log('scroll call back value ='+value)
        this._naviBar._setNativeProps({
            style:{opacity:value}
        })
    }

    render(){
        return(
            <View style={styles.divLayout}>
                {/*<NavigatorIOS*/}
                {/*initialRoute={{*/}
                {/*component: BaseNavigationController,*/}
                {/*title: 'React Native',*/}
                {/*passProps: { myProp: 'foo' },*/}
                {/*}}*/}
                {/*style={{flex: 1}}*/}
                {/*translucent={false}*/}
                {/*/>*/}

                <BaseNavigationController navigation={this.props.navigation}
                                          onScrollCall={(value)=>this._onScroll(value)}
                >
                </BaseNavigationController>
                <CustomizeNaviBar ref={(nv) => this._naviBar = nv}>

                </CustomizeNaviBar>

            </View>
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

    componentDidMount(){
        this._datahandle()

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
            <View style={styles.cellLaytout}>

                <TouchableHighlight style={styles.cellTouchableStyle}
                                    onPress={()=>{this._touchAction(item, index)}}>
                    <View style={styles.cellContainStyle}>

                        <Image style={styles.imageViewLayout}
                               source={{uri:item.image_url_small}}
                        />
                        <View style={styles.cellTextLayout}>
                            <Text style={styles.textLayout} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.summaryTextStyle} numberOfLines={2}>{item.summary}</Text>
                            <Text style={[styles.summaryTextStyle, styles.dateTextStyle]}>
                                {item.publication_date + ' '}
                                <Text style={styles.summaryTextStyle}>{this._handleCount(item) + '万阅'}</Text>
                            </Text>
                        </View>

                    </View>
                </TouchableHighlight>

            </View>

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

    _sectionHeader(section){
        return(
            <PLSectionHeaderView ref={(header)=>this._sectionHeaderView=header}>

            </PLSectionHeaderView>
        )
    }

    _handleCount = (item)=> {
        var count = 10;
        for (var i = 0; i < item.pv.length - 2; i++) {
            count = count * 10;
        }
        return Math.round(item.pv / count)
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
    }

    render()
    {
        return (
            <View style={styles.divLayout}>
                <SectionList ref={(c)=>this._sectionList = c}
                    data={this.state.dataSourceArr}
                             ListHeaderComponent = {()=> this._banner()}
                             renderSectionHeader={({section}) => (this._sectionHeader())}
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

                />

            </View>

        );
    }
}
const showAlert = (string) => {
    Alert.alert(''+stirng);
};



const naviBarHeight = (kScreenHeight>=812?88:64)
const tabBarHeight = (kScreenHeight>=812?83:49)
const cellMargin = 10;
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
        marginTop:84,
        marginBottom:0,
        marginLeft:0,
        marginRight:0,
        flex:1,
    },

    divLayout:{
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'flex-start',
        backgroundColor:'gray',
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
        marginTop:5,
        marginBottom:0,
        marginLeft:cellMargin,
        marginRight:cellMargin,
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
        width:60,
        height: 60,
        borderRadius:0,
        marginLeft: cellMargin,
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