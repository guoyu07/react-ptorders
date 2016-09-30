import {Tool, merged} from '../Tool';


const DB = (_ID = '', seting = {}) => {
    const cb = {
        setDefaut: () => {
            var defaults = merged({
                path: '', //当前页面的href
                data: null, //页面的数据
                scrollX: 0, //滚动条X
                scrollY: 0, //滚动条Y 
            }, seting);
            return {
                defaults,
                path: {}
            };
        },
        setState: (state, target) => {
            state.path[target.path] = target;
            return merged(state);
        }
    }
    return (state = {}, action = {}) => {

        if (action._ID && action._ID !== _ID) {
            return state;
        } else if (cb[action.type]) {
            return cb[action.type](state, action.target);
        } else {
            return cb.setDefaut();
        }
    }
}


const IndexList = DB('IndexList', {req_page: 1, nextBtn: true, limit: 20, data: [] }); //首页
const shoppingcart = DB('shoppingcart'); //购物车
const confirmOrders = DB('confirmOrders'); //确认订单
const confirmOrdersSuccess = DB('confirmOrdersSuccess'); //订单提交成功
const productRule = DB('productRule'); //商品政策
const myTeam = DB('myTeam'); //个人团队
const myTeamEdit = DB('myTeamEdit'); //编辑团队
const MyMessages = DB('MyMessages'); //个人信息
const MyAddress = DB('MyAddress'); //收货地址
const MyNewAddress = DB('MyNewAddress'); //新增收货地址
const MyOrders = DB('MyOrders'); //订单页面
const MyOrdersDetails = DB('MyOrdersDetails'); //订单详情页面
export default { IndexList , shoppingcart ,confirmOrders,confirmOrdersSuccess,productRule,myTeam,myTeamEdit, MyMessages, MyAddress,MyNewAddress,MyOrders,MyOrdersDetails}