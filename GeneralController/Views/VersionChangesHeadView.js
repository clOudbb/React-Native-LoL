/**
 * Created by zhangzhenghong on 2017/11/23.
 */
import React, { Component } from 'react';
import {
    cellSeparationLine,
    _keyExtractor,
    kScreenWidth,
    cellMargin
} from '../../RemoteManager'

import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    SectionList,
    TouchableHighlight,
    Animated,
    Image,
} from 'react-native';

//image_spec = 3 大图cell
export default class VersionChangesHeadView extends React.Component
{
    constructor(props){
        super(props)
        let model1 = new SessionChangeModel()
        model1.title = '新英雄'
        model1.num = '1'
        model1.color= 'green'
        let model2 = new SessionChangeModel()
        model2.title = '英雄改动'
        model2.num = '138'
        model2.color=  'orange'
        let model3 = new SessionChangeModel()
        model3.title = '皮肤'
        model3.num=  '29'
        model3.color = 'yellow'
        let model4 = new SessionChangeModel()
        model4.title = '装备改动'
        model4.num = '16'
        model4.color = 'blue'
        let model5 = new SessionChangeModel()
        model5.title = '游戏机制'
        model5.num = '8'
        model5.color = 'orange'
        this.state = {
            _listArr : [model1,model2, model3, model4, model5]
        }
    }

    componentDidMount(){

    }

    _touchAction(item, index){
        this.props._touchAction(item, index)
    }

    _renderItem(item, index){
        let right = 0
        if (index === this.state._listArr.length - 1){ right = 10 }
        return (
            <View style={styles.cellLayout}>
                <View style={{
                    borderRadius:4,
                    backgroundColor:item.color,
                    marginLeft:cellMargin,
                    marginTop:cellMargin,
                    marginBottom:cellMargin,
                    marginRight:right,
                    flex:1,
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center',
                }}>
                    <Text>{item.title}</Text>
                    <Text>{'共'+item.num+'个'}</Text>
                </View>
            </View>
        )
    }

    _onScroll(e){

    }

    render(){
        return(
            <View style={styles.containViewLayout}>
                <View style={styles.titleContainLayout}>
                    <Text style={styles.leftTextLabelLayout}>版本改动总览</Text>
                    <Text style={styles.rightTextLabelLayout}>距离上次游戏共更新6次</Text>
                </View>
                <SectionList ref={(c)=>this._sectionList = c}
                             style={styles.collectionViewLayout}
                             horizontal={true}
                             showsHorizontalScrollIndicator={false}
                             sections={[ // 不同section渲染相同类型的子组件
                                 {data:this.state._listArr, renderItem:({item, index}) => this._renderItem(item, index)},
                             ]}
                             keyExtractor = {(item, index)=>_keyExtractor(item, index)}
                             onScroll={(e)=>{this._onScroll(e)}}
                >
                </SectionList>
                {cellSeparationLine()}
            </View>
        )
    }
}

class SessionChangeModel extends React.Component
{
    constructor(props){
        super(props)
    }
}

const styles = StyleSheet.create({

    containViewLayout:{
        flex:1,
        flexDirection:'column',
        width:Dimensions.get('window').width,
        alignItems:'center',
        backgroundColor:'white',
    },

    titleContainLayout:{
        flexDirection:'row',
        width:kScreenWidth,
    },

    cellLayout:{
        flex:1,
        width:kScreenWidth / 2.5,
    },

    collectionViewLayout:{
        flex:1,
        height:100,
    },

    leftTextLabelLayout:{
        color:'black',
        fontSize:16,
        marginLeft:10,
    },
    rightTextLabelLayout:{
        color:'#cccccc',
        fontSize:16,
        right:10,
        position:'absolute',
    }
});