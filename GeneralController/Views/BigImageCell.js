/**
 * Created by zhangzhenghong on 2017/11/23.
 */

import React, { Component } from 'react';
import {
    kScreenHeight,
    kScreenWidth,
    generalStyles,
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
export default class BigImageCell extends React.Component
{
    constructor(props){
        super(props)
        this.state = {
        }
    }

    componentDidMount(){

    }

    _touchAction(item, index){
        this.props._touchAction(item, index)
    }

    _renderItem = (item, index) => {
        return (
            <TouchableHighlight style={{flex:1}}
                                onPress={()=>{this._touchAction(item, index)}}>
                <View style={styles.cellLaytout}>
                <Text style={styles.textLayout} numberOfLines={0}>
                    {item.title}
                </Text>
                <Image source={{uri:item.image_url_big}}
                       style={styles.bigImageLayout}/>
                <View style={{
                    flex:1,
                    flexDirection:'row',
                    width:kScreenWidth,
                    marginTop:10,
                    marginBottom:10,
                }}>
                    <Text style={generalStyles.summaryTextStyle}>
                        {item.author}
                    </Text>
                </View>
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
        )
    }

    render(){
        return(
            this._renderItem(this.props.item, this.props.index)
        )
    }
}

const styles = StyleSheet.create({

    cellLaytout:{
        flex:1,
        flexDirection:'column',
        width:Dimensions.get('window').width,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
    },

    textLayout:{
        marginLeft:cellMargin,
        marginRight:cellMargin,
        fontSize:18,
        top:cellMargin,
    },

    bigImageLayout : {
        marginTop:20,
        width:kScreenWidth - 20,
        height:kScreenWidth * 1 / 2.1,
        borderRadius: 4,
    }
});