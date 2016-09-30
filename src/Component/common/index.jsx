import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory,History, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../../Action/Index';
import {Tool, merged} from '../../Tool';
import GetData from './GetData';

export {GetData}
/**
 * (加载动画)
 *
 * @class DataLoad
 * @extends {Component}
 */
export class DataLoad extends Component { //加载动画
    render() {
        let {loadAnimation, loadMsg} = this.props;
        return (
            <div className={'data-load data-load-' + loadAnimation}>
                <div className="msg">{loadMsg}</div>
            </div>
        );
    }
}
DataLoad.defaultProps = {
    loadAnimation: true, //默认显示加载动画
    loadMsg: '正在加载中'
}

/**
 * 公共头部
 *
 * @export
 * @class Header
 * @extends {Component}
 */
export class Header extends Component {  //头部标题
     constructor(props,context) {
        super(props,context);
        this.state = {
            showHide :'none', // 显示右侧菜单，默认隐藏
            quantity:0, // 购物车数量
            searchState:'icon', //切换搜索状态，团队列表页面
            searchInput:null, //搜索框
            searchContext:null // 搜索框内容
        }

        this.showNav = () => { //显示右侧导航栏
            if (this.state.showHide == 'block') {
                this.setState({showHide:'none'})
            }else{
                this.setState({showHide:'block'})
            }
        }

        this.startSearch = (type) => {  //切换搜索状态
            this.setState({
                searchState:type
            })
        }
        this.submit = (event) => {
            event.preventDefault()
            this.props.searchUser(this.refs.submittext.value)
            this.refs.submittext.value = '';
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if (this.props.productNum !== nextProps.productNum) {
            this.state.quantity = nextProps.productNum||0;
        }     
    }
    componentDidMount() {
        Tool.get('/product/cart/quantity',{}, (res) => {
            if (res.http_code == 200) {
                this.setState({
                    quantity:res.data.quantity
                })
            }
        }, (err) => {
            console.log('error')
        })
    }

    render() {
        let {nav, logo , myMessage , shoppingCart ,title ,searchIcon ,productNum ,HideList ,searchUser} = this.props;
        let navState = this.state.showHide;
        if (nav) {
            nav = (
                <div className='head_menu' onClick={this.showNav} >
                    <ul className='head_listname'  style={{display:navState}} >
                        <li>
                            <Link to="/index">
                                <span>首页</span>
                                <span className='head_arrow'></span>
                            </Link>
                        </li>
                        <li>
                            <Link to='/myorders'>
                                <span>我的订单</span>
                                <span className='head_arrow'></span>
                            </Link>
                        </li>
                        <li>
                            <Link to='/productrule'>
                                <span>商品政策</span>
                                <span className='head_arrow'></span>
                            </Link>
                        </li>
                        <li>
                            <Link to='/myteam'>
                                <span>团队管理</span>
                                <span className='head_arrow'></span>
                            </Link>
                        </li>
                    </ul>
                </div>
            );
        }
        if (logo) {
            logo = (
                <div className='head_logo'></div>
            );
        }
        if (title) {
            title = (
                <span className='head_title'>{title}</span>
            );
        }
        if (myMessage) {
            myMessage = (
                <Link to="/mymessages" className='head_my'>
                   
                </Link>
            );
        }
        if (shoppingCart) {
            shoppingCart = (
                <Link to="/shoppingcart" className='head_buycart'>
                    {
                        this.state.quantity!=0?<span className="head_num">{this.state.quantity}</span>:null
                    }
                </Link>
            );
        }
        if (searchIcon&&this.state.searchState === 'icon') {
            this.state.searchContext = (<span className='searchIcon' onClick={this.startSearch.bind(this,'text')}></span>)
            this.state.searchInput = null;
            title = (
                <span className='head_title'>{title}</span>
            )
        }else if (searchIcon&&this.state.searchState === 'text') {
            title = null;
            this.state.searchContext = (<span className='searchtext' onClick={this.startSearch.bind(this,'icon')}>取消</span>)
            this.state.searchInput = (<form onSubmit={this.submit} className='searchForm'><input className='searchInput' ref='submittext' placeholder='请输入想要搜索的分销商名称' type='text'/></form>)
        }


        return (
            <header className="head-list" onClick={HideList?HideList.bind(this,'none'):null}>
                {nav}
                {logo}
                {myMessage}
                {shoppingCart}
                {this.state.searchInput}
                {this.state.searchContext}
                {title}
            </header>
        );
    }
}
Header.contextTypes = {
    router: React.PropTypes.object.isRequired //传入的类型必须是对象
}


/**
 * 购物车及订单页头部
 *
 * @export
 * @class OrderHead
 * @extends {Component}
 */
export class OrderHead extends Component {
    constructor(props,context){
        super(props,context);
        this.goBack = () => {
            window.history.back();
        }
    }
    render() {
         let {edit,editContext ,editCartChange, addAddress,title,back,backToIndex,complete,save,postInform,addNewAddress,fromConfirm,buy_type,sku_id,totalMoney} = this.props; 
         if (backToIndex) {
            backToIndex = (<Link to='/index' className='go_back_index'>
                    <span className='icon_arrow'></span>返回首页
                </Link>)
         }
         if (back) {
            back = (<span  className='go_back_index' onClick = {this.goBack}>
                    <span className='icon_arrow'></span>返回
                </span>)
         }

         if (complete) {
            complete = (<div className='shoppingcart_edit' onClick={addNewAddress}>完成</div>)
         }else{
            complete = null
         }

        if (save) {
            save = (<div className='shoppingcart_edit' onClick={postInform}>保存</div>)
         }

         if (edit) {
            edit = (<div className='shoppingcart_edit' onClick={editCartChange}>{editContext}</div>)
         }
         if (fromConfirm == 'fromConfirm') {
            var toConfirm = (<Link  to={'/confirmorders?buy_type='+buy_type+'&sku_id='+sku_id+'&totalMoney='+totalMoney}  className='shoppingcart_edit'>完成</Link>)
         }else{
             var toConfirm = null;
         }

         if (addAddress) {
            addAddress = (<Link to={'/myaddress?fromConfirm=fromConfirm&buy_type='+buy_type+'&sku_id='+sku_id+'&totalMoney='+totalMoney} className='shoppingcart_edit'>添加地址</Link>)
         }
        return (
            <header className='shoppingcart_head'>
               {backToIndex}
               {back}
                <div className='shoppingcart_title'>
                    {title}
                </div>
                {complete}
                {save}
                {edit}
                {toConfirm}
                {addAddress}
            </header>
        );
    }
}

OrderHead.contextTypes = {
    router: React.PropTypes.object.isRequired //传入的类型必须是对象
}

/**
 * 购物车及订单页底部
 *
 * @export
 * @class OrderFoot
 * @extends {Component}
 */
export class OrderFoot extends Component {
    constructor(props,context) {
        super(props,context);

        this.state = {

        };

        this.wxPay = (data,order_id) => {
            var self = this;
            wx.ready(function(){
                wx.chooseWXPay({
                    timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                    package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: data.paySign, // 支付签名
                    success: function (res) {
                        // 支付成功后的回调函数
                        Tool.alert('支付成功');
                        self.transToSuccess('online',order_id);
                    },
                    fail:function(){
                        Tool.alert('支付失败');
                        self.transtoDetail(order_id);
                    },
                    cancel:function(){
                        Tool.alert('支付取消');
                        self.transtoDetail(order_id);
                    }
                });
            });

            wx.error(function(res){
                Tool.alert('支付失败');
            });
        }

        this.transToPay = (order_id) => { //获取微信支付参数，调用微信支付接口
            order_id = Number(order_id)
            Tool.post('/order/order/toPay',{order_id:order_id,payment_type :'WX_JSAPI'},(res) => {
                if (res.http_code == 200) {
                    let data = JSON.parse(res.data.code)
                    this.wxPay(data,order_id)
                }else{
                    Tool.alert(res.msg)
                }
            },(error) => {
                console.log(error);
            })
        }

        this.saveOrders = () => { //保存订单
            Tool.post('/order/order/save',{buy_type:this.props.buy_type,sku_id:this.props.sku_id,address_id:this.props.address_id,pay_type:this.props.pay_type},(res) => {
                if (res.http_code == 200) {
                    if (this.props.pay_type == 5) {
                        this.transToPay(res.data.order_id)
                    }else if (this.props.pay_type == 7) {
                        Tool.alert('订单保存成功');
                        this.transToSuccess('offline',res.data.order_id);
                    }
                }else{
                    Tool.alert(res.msg)
                }
            },(error) => {
                console.log(error);
            })
        }

        this.transToSuccess = (type,order_id) => { //跳转到支付成功页面
            setTimeout(function(){
                this.context.router.push('/confirmorderssuccess?type='+type+'&totalMoney='+this.props.totalMoney+'&order_id='+order_id)
            }.bind(this),1500)
        }

        this.transtoDetail = (order_id) => { //跳转到商品详情页面
            setTimeout(function(){
                this.context.router.push('/myordersdetails?order_id='+order_id)
            }.bind(this),1500)
        }

        this.emptyCartTip = (msg) => {
            Tool.alert(msg)
        }
    }
    componentWillUpdate(nextProps, nextState) {
        // this.setState({
        //     children: nextProps.children
        // });
    }
    render() {
        let {chooseAll,selectFun, totalMoney , buy_type , sku_id, address_id ,pay_type,chooseAllProduct, content, transToConfirmorders, transToSuccess, showAllMoney ,deleteProduct,deleteAll,ProductNum} = this.props; 
        if (totalMoney) {
            totalMoney = totalMoney.toFixed(2);
        }
        if (transToConfirmorders > 0&&sku_id!=='') {
            var toConfirm = (<Link to={'/confirmorders?buy_type=' + buy_type +'&sku_id=' + sku_id +'&totalMoney=' + totalMoney} className='footer_payButton right' >
                                   {content}
                               </Link>)
        }else if(transToConfirmorders > 0&&sku_id==''){
            var toConfirm = (<div className='footer_payButton right' onClick={this.emptyCartTip.bind(this,'请选择商品')}>{content}</div>)
        }else if(transToConfirmorders == 0){
            var toConfirm = (<div className='footer_payButton right' onClick={this.emptyCartTip.bind(this,'您的购物车还没有有效商品哦')}>{content}</div>)
        }else{
            var toConfirm = null;
        }

        if (ProductNum&&(ProductNum == 0)) {
            transToSuccess = (<div className='footer_payButton right' onClick={this.emptyCartTip.bind(this,'您还没有选择商品')}>
                                   {content}
                               </div>)
        }else if (transToSuccess=='noAddress') {
            transToSuccess = (<div className='footer_payButton right' onClick={this.emptyCartTip.bind(this,'您还没有收货地址，请添加收货地址')}>
                                   {content}
                               </div>)
        }else if ((transToSuccess=='hasAddress')&&(pay_type == 5)) {
            transToSuccess = (<div className='footer_payButton right' onClick={this.saveOrders}>
                                   {content}
                               </div>)
        }else if ((transToSuccess=='hasAddress')&&(pay_type == 7)) {
            transToSuccess = (<div  className='footer_payButton right'  onClick={this.saveOrders}>
                                   {content}
                               </div>)    
        }

        if (deleteProduct) {
            deleteProduct = (<div className='footer_payButton right' onClick={deleteAll}>删除</div>)
        }

        if (chooseAll) {
            chooseAll = (<div className='footer_chooseAll left' onClick={selectFun}>
                           <span className={chooseAllProduct?'choose_all':'notchoose_all'} ></span>
                            全选
                        </div>
                        )
        }

        if (showAllMoney) {
            showAllMoney = ( <div className='footer_allMoney right'>
                   <p className='total_price'>合计: <i>¥</i><span>{totalMoney}</span></p>
                   <p className='deliver_type'>不含运费</p>
               </div>)
        }

        return (
             <footer className='shoppingcart_footer clear' >
                {toConfirm}
                {transToSuccess}
                {showAllMoney}
                {deleteProduct}
                {chooseAll}
           </footer>
        );
    }
}

OrderFoot.contextTypes = {
    router: React.PropTypes.object.isRequired //传入的类型必须是对象
}


/**
 * 首页及购物车选中商品底部
 *
 * @export
 * @class Footer
 * @extends {Component}
 */
class FooterInit extends Component {  
    constructor(props , context) {
        super(props , context);

        this.state = {
            productCount: 1, // 选中的商品数量
            index:0, // 被选中的商品索引值
            sku_id:null, // 商品id
            quantity:null, // 库存总量
            singlePrice:null, // 单个商品的价格
            typeList:null, // 商品列表
            totalMoney:0, // 总价格
            productName:null // 商品名称
        };
        this.selectType = (id,quantity,index,price,name) => { //切换商品
            this.state.sku_id = id;
            this.state.quantity = quantity;
            this.state.singlePrice = price;
            this.setState({
                index:index,
                productCount:1,
                totalMoney:price,
                productName:name
            });
        } 
        this.getProductCount = (type) => {  // 商品数量加减时进行计算
            if (type == 'reduce'&&this.state.productCount > 1) {
                let num = this.state.productCount - 1;
                let allMoney = num*this.state.singlePrice;
                if (num <= this.state.quantity) {
                    this.setState({
                        productCount: num, 
                        totalMoney: allMoney
                    });
                }else {
                    Tool.alert('库存不足了')
                    this.setState({
                        productCount: num, 
                        totalMoney: allMoney
                    });
                }
            }else if (type == 'add') {
                let num = this.state.productCount + 1;
                let allMoney = num*this.state.singlePrice;
                if (num <= this.state.quantity) {
                    this.setState({
                        productCount: num, 
                        totalMoney: allMoney
                    });
                }else {
                    Tool.alert('库存不足了')
                    this.setState({
                        productCount: num, 
                        totalMoney: allMoney
                    });
                }
            }
        }

        this.handleChange = (event) => {  // input值改变的时候进行判断赋值  
            let newValue = event.target.value;
            newValue = Number(newValue.replace((/\D+/gi),''));
            let allMoney = newValue*this.state.singlePrice;
            if (newValue <= this.state.quantity) {
                this.setState({
                    productCount:newValue, 
                    totalMoney: allMoney
                })
            }else{
                Tool.alert('库存不足了')
                this.setState({ 
                    productCount:newValue, 
                    totalMoney: allMoney
                });
            }
        }

        this.handleBlur = (event) => { // input失焦的时候进行判断赋值
            let newValue = event.target.value;
            if (newValue <= 0) {
                newValue = 1;
                let allMoney = newValue*this.state.singlePrice;
                this.setState({
                    productCount:newValue, 
                    totalMoney: allMoney
                });
            }
        }

        this.addToBuyCart = () => { //加入购物车
            Tool.post('/product/cart/add',{  
                sku_id:this.state.sku_id , 
                quantity:this.state.productCount 
            },(res) => {
                if (res.http_code == 200) {
                    Tool.alert('添加购物车成功')
                    this.context.showNum(res.data.totalNum);
                }else{
                    Tool.alert(res.msg)
                }
            },(error) => {
                Tool.alert('添加购物车失败')
            })
        }
    }


    componentWillMount() { 
        this.setState({
            productCount:1,
            index:0
        });
    }
    componentDidMount() {
        Tool.get('/product/product/spec',{product_id:this.props.product_id}, (res) => {
            let data = res.data;
            this.setState( {
                typeList: data , 
                sku_id: data.sku[0]&&data.sku[0].id ||'', 
                quantity: data.sku[0]&&data.sku[0].quantity ||'', 
                singlePrice: data.sku[0]&&data.sku[0].price||'', 
                totalMoney: data.sku[0]&&data.sku[0].price||'',
                productName:(data.sku[0]&&data.sku[0].skuSpec[0]+data.sku[0]&&data.sku[0].skuSpec[0])||''
            } );
        }, (err) => {
            console.log('error')
        })
    }
    render() {
        
        let {title, getId, stockNum, chooseType,gotoPay,reduceAdd,commit,alert,showFun,replaceButton,forSure ,product_id,addToCart} = this.props;
        let typeList = this.state.typeList&&this.state.typeList.sku||[];//判断返回值是否存在，不存在则返回空数组
        let selectIndex = this.state.index;//当前被选中的商品索引值
        let imgPath = typeList[selectIndex]&&typeList[selectIndex].icon;
        let price = typeList[selectIndex]&&typeList[selectIndex].price;
        let totalPrice = this.state.totalMoney;
        if (gotoPay) {
            gotoPay = (
                <footer className='goto_pay'>
                    <div className='right pay_button' onClick={this.addToBuyCart}>加入购物车</div>
                    <div className='right all_money ellips'>¥ {totalPrice}</div>
                    <div className='right all_text'>合计:</div>
                </footer>
            );
        }
        if (reduceAdd) {
            reduceAdd = (
                <div className='edit_number'>
                    <span className='order_numbers'>订货数量:</span>
                    <span className='reduce_add'>
                        <span className='reduce edit_style' onClick={this.getProductCount.bind(this,'reduce')}></span>
                        <input type='text' value={this.state.productCount} onChange={this.handleChange} onBlur={this.handleBlur}/>
                        <span className='add edit_style' onClick={this.getProductCount.bind(this,'add')}></span>
                    </span>
                </div>
            );
        }
        if (commit) {
            commit = (
                <div className='commit pay_button'>确认</div>
            );
        }

        if (forSure) {
            forSure = (<div className='forSure' onClick={getId.bind(this,this.state.sku_id,this.state.productName,this.state.singlePrice,this.state.quantity)}>确定</div>)
        }
        return (
            <div className="choose_item">
                <div className='cover'></div>
                <div className="choose_detail">
                    <header className="item_header clear">
                        <div className='item_header_left left'>
                            <img src={imgPath} alt='商品图片'/>
                        </div>
                        <div className='item_header_right left'>
                            <p className='item_header_close' onClick={showFun}></p>
                            <p className='item_header_name'>{title}</p>
                            <p className='item_header_price'>¥ {price} / 箱</p>
                            <p className='item_header_price'>{stockNum}</p>
                            <p className='item_header_price'>{chooseType}</p>
                        </div>
                    </header>
                    <section className='item_center'>
                        <div className='item_size'>
                            规格:
                        </div>
                        <ul className={'item_options clear ' + replaceButton}>
                            {
                                typeList.map(( item, index ) => {
                                    let hasNoProduct = '';
                                    let selectProduct = selectIndex==index?'choosed':'';
                                    if (item == 2) {
                                        hasNoProduct = 'has_no_products';
                                    }
                                    return (
                                        <li key={index} className={ hasNoProduct+selectProduct } 
                                            onClick={ this.selectType.bind(this,item.id,item.quantity,index, item.price ,(item.skuSpec[0]||'')+(item.skuSpec[1]||'')) }>
                                            {item.skuSpec[0]}{item.skuSpec[1]}</li>
                                        )
                                })
                            }
                        </ul>

                        {reduceAdd}
                    </section>
                    {gotoPay}
                    {commit}
                    {forSure}
                </div>
            </div>
        );
    }
    // shouldComponentUpdate(np, ns) {
    //     return this.props.index !== np.index || this.state.messageCount !== ns.messageCount; //防止组件不必要的更新
    // }
    // componentDidUpdate() {
    //     this.getMessageCount();
    // }
}

FooterInit.contextTypes = {
  showNum: React.PropTypes.any
};

FooterInit.defaultProps = {
    index: 0
};


var Footer = connect((state) => { return { User: state.User }; }, action('User'))(FooterInit);

export {Footer}


/**
 * 商品列表及商品详情页商品信息
 * 
 * @class OrderItem
 * @extends {Component}
 */
export class OrderItem extends Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            orderStatusID:this.props.orderStatusID //订单id
        }
        this.setTime = (time) => { //时间小于十位，前面加个0，并将所有时间转换为字符串
            return time < 10?'0'+time:time+''
        }
        this.deleteOrder = (order_id) => {   // 取消订单
            Tool.get('/order/cancel',{order_id:order_id},(res) => {
                if (res.http_code == 200) {
                    Tool.alert('订单取消成功')
                    this.setState({
                        orderStatusID:7
                    })
                }else{
                    Tool.alert(res.msg)
                }
            },(error) => {
                Tool.alert('订单取消失败')
                console.log(error);
            })
        }


        this.wxPay = (data,order_id) => {
            var self = this;
        
            wx.ready(function(){
                wx.chooseWXPay({
                    timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                    package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: data.paySign, // 支付签名
                    success: function (res) {
                        // 支付成功后的回调函数
                        Tool.alert('支付成功');
                        self.transToSuccess(order_id);
                    },
                    fail:function(){
                        Tool.alert('支付失败');
                        self.transtoDetail(order_id);
                    },
                    cancel:function(){
                        Tool.alert('支付取消');
                        self.transtoDetail(order_id);
                    }
                });
            });

            wx.error(function(res){
                Tool.alert('支付失败');
            });
        }

        this.transToPay = (order_id) => {  // 获取微信支付所需要的参数
            order_id = Number(order_id)
            Tool.post('/order/order/toPay',{order_id:order_id,payment_type :'WX_JSAPI'},(res) => {
                if (res.http_code == 200) {
                    let data = JSON.parse(res.data.code)
                    this.wxPay(data,order_id)
                }else{
                    Tool.alert(res.msg)
                }
            },(error) => {
                console.log(error);
            })
        }

        this.transToSuccess = (order_id) => { //跳到支付成功页面
            setTimeout(function(){
                this.context.router.push('/confirmorderssuccess?type=online&totalMoney='+this.props.totalPrice+'&order_id='+order_id)
            }.bind(this),1500)
        }
        this.transtoDetail = (order_id) => { //跳转到订单详情页面
            setTimeout(function(){
                this.context.router.push('/myordersdetails?order_id='+order_id)
            }.bind(this),1500)
        }

    }
    componentWillUpdate(nextProps, nextState) {

        if (this.props !== nextProps) {
            this.state.orderStatusID = nextProps.orderStatusID;
        }     
    }
    
    componentDidMount() {
        
    }
    render() {
        let {order_sn ,pay_status,deliver_type,create_time,pay_type,totalPrice,product,buy_type ,order_id,orderStatusID,orderDetailPage} = this.props;

        let sku_id = '';
        if (product) { 
            for (var i = 0; i < product.length; i++) {
                sku_id += product[i].sku_id + ',';
            }   

            sku_id = sku_id.substring(0,sku_id.lastIndexOf(','))
        }
        let date = new Date();
        let year = '';
        let month = '';
        let day = '';
        let hours = '';
        let minutes = '';
        let seconds = '';
        if (create_time) { 
            create_time = create_time*1000;
            date = new Date(create_time);
            year = date.getFullYear();
            month = date.getMonth()+1;
            day = date.getDate();
            hours = this.setTime(date.getHours());
            minutes = this.setTime(date.getMinutes());
            seconds = this.setTime(date.getSeconds());
        }

        if (this.state.orderStatusID == 1) {
            var payText = '待支付';
            var classStatus = 0;
        }else if (this.state.orderStatusID == 2) {
            var payText = '等待发货';
            var classStatus = 1;
        }else if(this.state.orderStatusID == 3){
            var payText = '正在准备商品';
            var classStatus = 1;
        }else if(this.state.orderStatusID == 4){
            var payText = '已发货';
            var classStatus = 1;
        }else if(this.state.orderStatusID == 5){
            var payText = '已签收';
            var classStatus = 1;
        }else if(this.state.orderStatusID == 6){
            var payText = '已完成';
            var classStatus = 1;
        }else if(this.state.orderStatusID == 7){
            var payText = '订单关闭';
            var classStatus = 1;
        }
        if (pay_type == '在线支付') {
            var gotoPay = (<span className='pay_money pay_style right' onClick={this.transToPay.bind(this,order_id)}>马上支付</span>)
        }else{
            var gotoPay = null;
        }
        
        if (orderDetailPage) {
            var linkToDetails = (<div>
                    <header className='order_head'>
                        <span>订单号：{order_sn}</span>
                        <span className={'order_state' + classStatus}>
                            {payText}
                        </span>
                    </header>
                    <section className='order_inform'>
                        <p>配送方式： {deliver_type}</p>
                        <p>付款方式： {pay_type} {payText}</p>
                        <p>下单时间： {year}-{month}-{day} {hours}:{minutes}:{seconds}</p>
                    </section>
                </div>  )
        }else{
            var linkToDetails = (<Link to={'/myordersdetails?order_id=' + order_id}>
                    <header className='order_head'>
                        <span>订单号：{order_sn}</span>
                        <span className={'order_state' + classStatus}>
                            {payText}
                        </span>
                    </header>
                    <section className='order_inform'>
                        <p>配送方式： {deliver_type}</p>
                        <p>付款方式： {pay_type} {payText}</p>
                        <p>下单时间： {year}-{month}-{day} {hours}:{minutes}:{seconds}</p>
                    </section>
                </Link>  )
        }
        return (
            <li className='order_item'>
               {linkToDetails}
                <footer className='order_money clear'>
                    订单金额: &nbsp; 
                    <span className='money_num'>¥ {totalPrice}</span>
                    {
                        this.state.orderStatusID == 1?<div className='right'>
                                {gotoPay}
                                <span className='close_order pay_style right' onClick={this.deleteOrder.bind(this,order_id)}>关闭订单</span>
                            </div>:null
                    }
                </footer>
            </li>
        );
    }
}

OrderItem.contextTypes = {
    router: React.PropTypes.object.isRequired //传入的类型必须是对象
}

