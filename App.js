/**
 * Created by zhangzhenghong on 2017/10/23.
 */

import React,{Component, PropTypes} from 'react';

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
    WebView,
} from 'react-native';


export class SecondViewController extends React.Component
{
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.user}`,
    });

    render()
    {
        return (
            <View style={{backgroundColor: 'blue', flex: 1}}>

            </View>
        )
    }
}

export class WebViewController extends React.Component
{
    // static navigationOptions = ({navigation})=>({
    //     headerTitle:'WebViewController',
    //     headerStyle:{backgroundColor:'white', height:84, borderBottomWidth:0.5, opacity:navigation.state.params.opacity}
    // })
    constructor(props)
    {
        super(props)
        console.log(this.props.navigation.state.params.url)
        var url = this.props.navigation.state.params.url
        this.state = {
            url : url,
        }

        // this.props.navigation.setParams({
        //     opacity:1,
        // })
    }

    /**
     * 很多H5和原生页面交互很多都是用过这中<a>标签私有协议进行。这种标签的链接的格式一般都不是标准的http和https协议
     * 也就是说webView可能会接收到不标准的url，导致会第一时间无法加载成功页面显示错误
     * 在这里进行一次
     */
    onShouldStartLoadWithRequest= (e) => {
        var scheme = e.url.split('://')[0]
        if(scheme === 'http' || scheme === 'https'){
            return true
        }
        return false
    }

    render()
    {
        return(
            <WebView
                style={{
                    flex:1,
                    backgroundColor:'white',
                }}
                source={{uri : this.state.url}}
                onShouldStartLoadWithRequest = {(e)=>this.onShouldStartLoadWithRequest(e)}
            >

            </WebView>
        )
    }
}


// AppRegistry.registerComponent('OC_React', () => App);


class RNHighScores_Save extends React.Component {


    constructor(props) {
        super(props);

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

                <BaseNavigationController navigation={this.props.navigation}>
                </BaseNavigationController>
            </View>
        );
    }


}


class BaseNavigationController_Save extends React.Component {


    constructor(props){
        super(props)
        this.state = {
            hideView:true,
            isShowAlert:false,
            fadeAnim:new Animated.Value(1),
            dataSourceArr:new Array(),
        }
        //通知
        RCTDeviceEventEmitter.emit('emit', 'message')
    }

    componentDidMount(){
        this._datahandle()
    }

    _datahandle = ()=> {
        console.log(lolListApi)
        return (
            fetch(lolListApi).then((response)=>response.json())
                .then((responseJson)=>{
                    var arr = new Array()
                    arr = responseJson.list
                    this.setState({
                        dataSourceArr:arr
                    })
                    console.log(arr)
                }).catch((error)=>{
                console.log(error)
            })
        )
    }

    static navigationOptions = {
        title:'MainScreen',
    }

    _push = ()=> {
        const {navigate} = this.props.navigation;
        navigate('Second' , {user : 'SecondViewController'});
    }

    _touchAction = (index)=> {
        if (index == 0) {
            this._push();
            return
        } else if (index == 1) {
            if (this.state.fadeAnim._value == 1)
                Animated.timing(
                    this.state.fadeAnim,{
                        toValue:0,
                    }
                ).start()
            else
                Animated.timing(
                    this.state.fadeAnim,{
                        toValue:1,
                    }
                ).start()
            return
        } else if (index == 2) {
            this.customAlert.show("请选择照片", selectedArr, '#333333', this.callbackSelected);
            return
        }
        if (this.state.hideView) {
            this.setState({hideView:false})
        } else {
            this.setState({hideView:true})
        }
    }

    _renderItem = (item, index) => {
        let imageURL = './image/sgs' + index + '.jpg';
        let _index = index;


        return (
            <View style={styles.cellLaytout}>
                <Image style={styles.imageViewLayout}
                    // source={{uri: 'http://www.qq1234.org/uploads/allimg/150420/100A5G63-1.jpg'}}
                       source={{uri:item.image_url_small}}
                />
                <View style={styles.cellTextLayout}>
                    <Text style={styles.textLayout}>{item.title}</Text>
                </View>
                <TouchableHighlight
                    onPress={() => {
                        this._touchAction(index)
                    }}
                    style={styles.cellButtonLaytout}>
                    <Text style={styles.cellButtonFont}>{index}</Text>
                </TouchableHighlight>

                {
                    index==1?
                        <Animated.View style={{
                            backgroundColor:'red',
                            width:30,
                            height:30,
                            opacity:this.state.fadeAnim,
                        }}>

                        </Animated.View>:null
                }

            </View>

        )
    }

    _dataSourceArr = () => {
        var arr = new Array;
        for (var i= 0; i < 20 ; i++) {
            arr.push({key : 'personal name' + i});
        }
        return arr;
    }


    render()
    {
        return (
            <View style={styles.divLayout}>
                <FlatList data={this.state.dataSourceArr}
                          renderItem={({item, index}) => this._renderItem(item, index)}
                          style={styles.tableViewLayout}
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

                {
                    this.state.hideView?null:
                        <TouchableHighlight
                            style={{
                                backgroundColor: "orange",
                                width: Dimensions.get('window').width,
                                height: Dimensions.get('window').height,
                                position: 'absolute',
                                flex:1,
                            }}
                            onPress={()=>this._touchAction()}>
                            <View style={{
                                backgroundColor: "orange",
                            }
                            }>
                            </View>
                        </TouchableHighlight>
                }

                {
                    <AlertSelected ref={(customAlert) => {
                        this.customAlert = customAlert
                    }}/>
                }


            </View>

        );
    }
}
