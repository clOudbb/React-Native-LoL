/**
 * Created by zhangzhenghong on 2017/12/25.
 */


export var userModel = {
    img:require('../Image/1.jpg'),
    name : 'paladin',
    war:[
        warModelFirst,
        warModelSecond,
        warModelThird
    ]
}


var warModelFirst = {
    hero:'瑞兹',
    img:require('../Image/1.jpg'),
    time:'2016-10-1',
    kill:'19',
    dead:'0',
    assists:'5',
}

var warModelSecond = {
    hero:'阿兹尔',
    img:require('../Image/1.jpg'),
    time:'2016-10-1',
    kill:'22',
    dead:'3',
    assists:'9',
}

var warModelThird = {
    hero:'维克托',
    img:require('../Image/1.jpg'),
    time:'2016-10-1',
    kill:'10',
    dead:'1',
    assists:'2',
}