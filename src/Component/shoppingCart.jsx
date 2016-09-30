import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {OrderHead,OrderFoot, DataLoad, Footer, GetData} from './common/Index';



/**
 * (循环列表)
 * 
 * @class List
 * @extends {Component}
 */
class List extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <ul className="shoppingcart_list">
                {
                    this.props.list.map((item, index) => {
                        return <ListItem editCart={this.props.editCart} chooseAllProduct={this.props.chooseAllProduct} updataBybutton={this.props.updataBybutton} chooseIcon key={index} index={index} {...item}/>
                    })
                }
            </ul>
        );
    }
}

/**
 * (失效商品循环列表)
 * 
 * @class Disabled
 * @extends {Component}
 */


class Disabled extends Component {
    render() {
        return (
            <div className='disabled'>
                <h1 className='disabled_header'>失效商品</h1>
                <ul className="index_list">
                    {
                        this.props.list.map((item, index) => {
                            return <ListItem editCart={this.props.editCart} chooseAllProduct={this.props.chooseAllProduct} updataBybutton={this.props.updataBybutton} deleteIcon uselessStatus key={index} index={index} {...item} />
                        })
                    }{/*等到获取数据后使用，现在不用*/}
                </ul>
            </div>
        );
    }
}


/**
 * (商品详情)
 * 
 * @class ListItem
 * @extends {Component}
 */
class ListItem extends Component {
    constructor(props ,context) {
        super(props ,context);
        this.state = {
            chooseState:true ,//默认选中商品，为false则不选中
            productNum:this.props.quantity,  //单个商品总数
            totalMoney:this.props.quantity*this.props.price, // 单个商品总价格
            id:null, // 商品id
            singlePrice:this.props.price, // 单个商品价格
            maxNum:this.props.useful||1000000000, // 最大库存
            showalert:false, // 显示弹出框
            showFooter:'none', // 是否显示商品选择界面
            changeByself:false, // 是否是商品本身的选择按钮状态变化，是则无论父级有无变化，自身变化优先级最高
            productName:this.props.sku_str // 商品名称
        }

        this.getId = (id,name,price,quantity) => {//切换不同商品
            Tool.alert('成功选择商品')
            
            if (this.state.id != id) {
                if (this.state.productNum > quantity) {
                    this.state.productNum = quantity;
                    Tool.alert('商品库存不够了')
                }
                let allMoney = this.state.productNum*price;
                this.state.id = id;
                this.state.maxNum = quantity;
                this.setState({
                    productName:name,
                    singlePrice:price,
                    totalMoney:allMoney,
                    showFooter:'none'
                })
                this.transmitInform(price,id,this.state.productNum,this.props.index,this.state.chooseState,allMoney)
            }else{
                this.setState({
                    showFooter:'none'
                })
            }
        }

        this.chooseProduct = () => {   //选择按钮
            let choosed = null;
            let allMoney = 0;
            if (this.state.chooseState) {
                choosed = false;
                this.setState({
                    chooseState:false
                })
            }else{
                choosed = true;
                allMoney = this.state.totalMoney;
                this.setState({
                    chooseState:true
                })
            }
            this.state.changeByself = true;

            if (!this.props.uselessStatus) { //不是无效商品则船值到父级，如果是无效状态，则只能传递是否选择态，其他值传不了。
                this.transmitInform(this.state.singlePrice,this.state.id,this.state.productNum,this.props.index,choosed,allMoney)
            }else{
                this.context.transmitUseLess(this.props.index,choosed)
            }

        }

        this.getProductNum = (type) => {  //点击加减按钮时计算商品数量
            let num = 1;
            let allMoney = 0;
            if (type == 'reduce'&&this.state.productNum > 1) {
                num = this.state.productNum - 1;
                allMoney = num*this.state.singlePrice;
                if (num <= this.state.maxNum) { //判断是否超出库存数量,如果超出则弹出提示框
                    this.setState({
                        productNum: num, 
                        totalMoney: allMoney
                    });
                }else {
                    Tool.alert('库存不够了')
                    this.setState({
                        showalert:true, 
                        productNum: num, 
                        totalMoney: allMoney
                    });
                }
            }else if (type == 'add') {
                num = this.state.productNum + 1;
                allMoney = num*this.state.singlePrice;
                if (num <= this.state.maxNum) {
                    this.setState({
                        productNum: num, 
                        totalMoney: allMoney
                    });
                }else {
                    Tool.alert('库存不够了')
                    this.setState({
                        showalert:true, 
                        productNum: num, 
                        totalMoney: allMoney
                    });
                }
            }
            this.transmitInform(this.state.singlePrice,this.state.id,num,this.props.index,this.state.chooseState,allMoney)
        }

        this.handleChange = (event) => {   //直接修改商品数量时调用
            let newValue = event.target.value;
            newValue = Number(newValue.replace((/\D+/gi),''));
            let allMoney = newValue*this.state.singlePrice;
            if (newValue <= this.state.maxNum) {
                this.setState({
                    showalert: false, 
                    productNum:newValue, 
                    totalMoney: allMoney
                })
            }else{
                Tool.alert('库存不够了')
                this.setState({
                    showalert:true, 
                    productNum:newValue, 
                    totalMoney: allMoney
                });
            }
            this.transmitInform(this.state.singlePrice,this.state.id,newValue,this.props.index,this.state.chooseState,allMoney)
        }

        this.handleBlur = (event) => {   //当input失去焦点时判断数字是否小于1，如果小于则设置为1
            let newValue = event.target.value;
            if (newValue <= 0) {
                newValue = 1;
                let allMoney = newValue*this.state.singlePrice;
                this.setState({
                    productNum:newValue, 
                    totalMoney: allMoney
                });
                this.transmitInform(this.state.singlePrice,this.state.id,newValue,this.props.index,this.state.chooseState,allMoney)
            }
        }

        this.handleShowFooter = () => { //点击向下箭头调出商品选择页面
            this.setState({
                showFooter:'block'
            })
        }
        this.showDetail = () => {   //点击关闭页面，关闭选择商品页面
            this.setState({
                showFooter:'none'
            })
        }

        this.transmitInform = (price,id,num,index,choosed,singleTotalMoney) => {  //商品变化时调用父级函数，将商品数据传送给父级
            this.context.submitBuyCart(price,id,num,index,choosed,singleTotalMoney)
        }

        this.deleteProduct = (id) => {  //删除失效商品
            id = id.toString()
            Tool.post('/product/cart/delete',{sku_id:id},(res) => {
                if (res.http_code == 200) {
                    this.context.getShoppingCartList()
                }else{
                    Tool.alert(res.msg)
                }
            },(error) => {
                Tool.alert('删除失败')
                console.log(error)
            })
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            this.state.id = nextProps.id;
        }     
    }
    render() {
        let {deleteIcon, uselessStatus, chooseAllProduct , updataBybutton ,chooseIcon, editCart,icon, id, price, product_id, quantity, sku_str, title ,index ,useful } = this.props;
        let productNum = this.state.productNum;
        var showFooter = this.state.showFooter;
        let productName = this.state.productName;
        if (this.state.changeByself) {
            var selectStatus = this.state.chooseState;
            this.state.changeByself = false;
        }else if (updataBybutton) {
            this.state.chooseState = chooseAllProduct;
            var selectStatus = chooseAllProduct;
        }else{
            var selectStatus = this.state.chooseState;
        }
        
        if (chooseIcon) {  //显示选择按钮
            chooseIcon = (<span className={selectStatus?'back_img':'back_disable'} onClick={this.chooseProduct}></span>) //选择按钮
        }

        if (deleteIcon) {   //显示删除按钮
            deleteIcon = (<span className='delete_prodcut right' onClick={this.deleteProduct.bind(this,id)}></span>)
        }

        if (editCart&&!deleteIcon) {  //判断是否是编辑状态
            var  editState = (<div className='item_right'>
                <div className='reduce_add'>
                    <span className='edit_style reduce' onClick={this.getProductNum.bind(this,'reduce')}></span>
                    <input type='text'value={productNum} onChange={this.handleChange} onBlur={this.handleBlur}/>
                    <span className='edit_style add'  onClick={this.getProductNum.bind(this,'add')}></span>
                </div>
                <div className='clear product_bottom'>
                    <div className='product_discribe left'>{productName} </div>
                    <span className='selectType right' onClick={this.handleShowFooter}></span>
                </div>
            </div>)
        }else if (editCart&&deleteIcon) {
            deleteIcon = null;
            var editState = (<div className='item_right'>
                <p className='clear'>{title}{deleteIcon}</p>
                <p>{productName}</p>
                <p className='clear'>¥ {this.state.singlePrice}/<i>箱</i><span className='right item_number'>X{productNum}</span></p>
            </div>)

            chooseIcon = (<span className={selectStatus?'back_img':'back_disable'} onClick={this.chooseProduct}></span>) //选择按钮
        }else{
            var editState = (<div className='item_right'>
                <p className='clear'>{title}{deleteIcon}</p>
                <p>{productName}</p>
                <p className='clear'>¥ {this.state.singlePrice}/<i>箱</i><span className='right item_number'>X{productNum}</span></p>
            </div>)
        }

        if (showFooter == 'block') {
            showFooter = (<Footer  forSure replaceButton={'replaceButton'} alert showFun={this.showDetail} show={this.state.showHide} product_id={product_id} getId={this.getId} title={title} />)
        }else{
            showFooter = null
        }

        return (
            <li className='shoppingcart_item clear'>
                <div className='item_left'>
                    <span className='item_left_choose'>{chooseIcon}</span>
                    <img src={icon} className='item_left_img' />
                </div>
                {editState}
                {showFooter}
            </li>
        );
    }
}

ListItem.contextTypes = {
  submitBuyCart: React.PropTypes.any,
  transmitUseLess:React.PropTypes.any,
  getShoppingCartList:React.PropTypes.any
};


/**
 * (导出组件)
 * 
 * @export
 * @class Main
 * @extends {Component}
 */
class Main extends Component {
    constructor(props ,context) {
        super(props ,context);

        this.state = {
             editCart:false,    //是否是编辑,默认不是编辑状态
             editContext:'编辑', // 编辑按钮显示文字
             use:[],            //有效商品数组
             useless:[],        //失效商品数组
             chooseAllProduct:true,  // 是否选定所有商品
             updataBybutton:false,  //  是否是全选按钮出发的自组件更新
             allBuyCart:[] ,   // 数组中存放所有商品的id,只是存放有效商品的状态 ，数量json格式文件
             totalMoney:0,     //总共的金额
             disabledProduct:[],   //失效商品数组
             useDeleteArr:[],   //被删除的有效商品id数组
             useLessDeleteArr:[],  // 被删除无效商品id数组
             commitOrdersId:'' ,  //点击提交时发生给服务器的数据,所有选中商品的id值
             shouldUpadta:false
        }

        this.editCartChange = () => {  //点击编辑，保存时切换
            if (this.state.editCart) {   
                this.setState({
                    editCart:false,
                    editContext:'编辑',
                    updataBybutton:false
                })
                this.psotProductCart()
            }else{
                this.setState({
                    editCart:true,
                    editContext:'保存',
                    updataBybutton:false
                })
            }
        }

        this.changeSelectStatus = () => {    // 全选按钮点击时，所有商品都跟随全选按钮变化
            if (this.state.chooseAllProduct) {
                for(var i = 0; i < this.state.allBuyCart.length; i++){
                    this.state.allBuyCart[i].choosed = false;
                    this.state.allBuyCart[i].singleTotalMoney = 0;
                }
                let allBuyCart = this.state.allBuyCart;
                this.setState({
                    chooseAllProduct:false,
                    updataBybutton:true,
                    totalMoney:0,
                    allBuyCart:allBuyCart,
                    commitOrdersId:''
                })
            }else{
                let allMoney = 0;
                let submitId = '';
                for(var i = 0; i < this.state.allBuyCart.length; i++){
                    this.state.allBuyCart[i].choosed = true;
                    this.state.allBuyCart[i].singleTotalMoney = this.state.allBuyCart[i].price*this.state.allBuyCart[i].quantity;
                    allMoney += this.state.allBuyCart[i].singleTotalMoney;
                    submitId += this.state.allBuyCart[i].id + ',';
                }
                submitId = submitId.substring(0,submitId.lastIndexOf(','));
                let allBuyCart = this.state.allBuyCart;
                this.setState({
                    chooseAllProduct:true,
                    updataBybutton:true,
                    totalMoney:allMoney,
                    allBuyCart:allBuyCart,
                     commitOrdersId:submitId
                })
            }
        }

        this.submitBuyCart = (price,id,num,index,choosed,singleTotalMoney) => {  //编辑状态时，商品的每次变化都会传递到此处进行保存，以便提交购物车数据
            if (this.state.allBuyCart.length > 0) {  //防止返回数据为空数组，则数据的underfind的bug
                this.state.allBuyCart[index]['price'] = price;
                this.state.allBuyCart[index]['id'] = id;
                this.state.allBuyCart[index]['quantity'] = num;
                this.state.allBuyCart[index]['choosed'] = choosed;
                this.state.allBuyCart[index]['singleTotalMoney'] = singleTotalMoney;
                let allMoney = 0;
                let submitId = '';
                let allProductStatus = true; 
                for(var i = 0; i < this.state.allBuyCart.length; i++){
                    allMoney += this.state.allBuyCart[i].singleTotalMoney;
                    if (this.state.allBuyCart[i].choosed) {
                        submitId += this.state.allBuyCart[i].id + ',';
                    }
                    allProductStatus = allProductStatus&&this.state.allBuyCart[i].choosed;
                }

                submitId = submitId.substring(0,submitId.lastIndexOf(','));
               
                this.setState({
                    totalMoney:allMoney,
                    updataBybutton:false,
                    commitOrdersId:submitId,
                    chooseAllProduct:allProductStatus
                })
            }  
        }
        this.getShoppingCartList = () => {    //获取购物车数据
            Tool.get('/product/cart/view',{}, (res) => {
                if (res.http_code == 200) {
                    this.setState({
                        shouldUpadta:true,
                        use:res.data.use,
                        useless:res.data.useless
                    })
                }else{
                    Tool.alert(res.msg)
                }
            }, (err) => {
                console.log('error')
            })
        }

        this.transmitUseLess = (index,choosed) => {   //失效商品选择状态记录
            this.state.disabledProduct[index].choosed = choosed;
        }


        this.psotProductCart = () => {  //将购物车数据提交服务器
            var data = {};
            for (var i = 0 ; i < this.state.allBuyCart.length;  i++) {
                data[i] = {id:this.state.allBuyCart[i].id,quantity:this.state.allBuyCart[i].quantity}
            }
            data = JSON.stringify(data)
            Tool.post('/product/cart/edit',{skus:data},(res) => {
                if (res.http_code == 200) {
                    window.location.reload()
                }else{
                    Tool.alert(res.msg)
                }
            },(error) => {
                console.log(error)
            })
        }

        this.deleteAll = () => {    //点击删除按钮，批量删除选中状态商品
            if (this.state.allBuyCart.length > 0 ||this.state.disabledProduct.length > 0 ) {  //防止返回数据为空数组，则数据的underfind的bug
                let useid = '';
                let uselessId = '';
                for (let i = 0 ; i < this.state.allBuyCart.length;  i++) {
                    if (this.state.allBuyCart[i].choosed) {
                        useid += this.state.allBuyCart[i].initialId + ',';
                    }
                }
                this.state.useDeleteArr = useid.split(',');
                this.state.useDeleteArr.splice(this.state.useDeleteArr.length-1,1);
                for (let i = 0 ; i < this.state.disabledProduct.length;  i++) {
                    if (this.state.disabledProduct[i].choosed) {
                        uselessId += this.state.disabledProduct[i].id + ',';
                    }
                }
                this.state.useLessDeleteArr = uselessId.split(',');
                this.state.useLessDeleteArr.splice(this.state.useLessDeleteArr.length-1,1)
                let allArr = this.state.useDeleteArr.concat(this.state.useLessDeleteArr)
                let id = allArr.join(',')
                if (allArr.length == 0) {
                    Tool.alert('请选择想要删除的商品')
                }else{
                    Tool.post('/product/cart/delete',{sku_id:id},(res) => {
                        if (res.http_code == 200) {
                            this.getShoppingCartList()
                        }else{
                            Tool.alert(res.msg)
                        }
                    },(error) => {
                         Tool.alert('删除失败')
                        console.log(error)
                    })
                }
            }
        }
    }


    getChildContext () {   //上下文传递函数及变量
        return {
            submitBuyCart: this.submitBuyCart,
            transmitUseLess:this.transmitUseLess,
            getShoppingCartList:this.getShoppingCartList
        }
    }
   
   componentWillUpdate(nextProps, nextState) {
        if ((this.props !== nextProps)) {
            let {data} = nextProps.state;
            this.state.use = data&&data.data&&data.data.use||[];
            this.state.useless = data&&data.data&&data.data.useless||[]; 
            this.state.use = nextState.use;
            
            this.state.useless = nextState.useless;
            if (this.state.use.length > 0) {       
                for(let i = 0; i < this.state.use.length ; i++){
                    let singleTotalMoney = this.state.use[i].price*this.state.use[i].quantity;
                    this.state.allBuyCart[i] = {price:this.state.use[i].price,id:this.state.use[i].id,quantity:this.state.use[i].quantity,choosed:true,singleTotalMoney:singleTotalMoney,initialId:this.state.use[i].id};
                    this.state.totalMoney += singleTotalMoney;
                    this.state.commitOrdersId += this.state.use[i].id + ',';
                }
                this.state.commitOrdersId = this.state.commitOrdersId.substring(0,this.state.commitOrdersId.lastIndexOf(','))
            }else{
                this.state.allBuyCart = [];
                this.state.totalMoney = 0;
                this.state.commitOrdersId = '';
            }
            if (this.state.useless.length > 0) {               
                for(let j = 0 ;j < this.state.useless.length ; j++){
                    this.state.disabledProduct[j] = {id:this.state.useless[j].id,choosed:true}
                }
            }else{
                this.state.disabledProduct = [];
            }
        }
   }
   componentDidMount() {
    }
    render() {
        let editContext = this.state.editContext;
        if (this.state.shouldUpadta) {
            if (this.state.use.length > 0) {       
                this.state.allBuyCart = [];
                for(let i = 0; i < this.state.use.length ; i++){
                    let singleTotalMoney = this.state.use[i].price*this.state.use[i].quantity;
                    this.state.allBuyCart[i] = {price:this.state.use[i].price,id:this.state.use[i].id,quantity:this.state.use[i].quantity,choosed:false,singleTotalMoney:singleTotalMoney,initialId:this.state.use[i].id};
                    this.state.totalMoney += singleTotalMoney;
                    this.state.commitOrdersId += this.state.use[i].id + ',';
                }
                this.state.commitOrdersId = this.state.commitOrdersId.substring(0,this.state.commitOrdersId.lastIndexOf(','))
            }else{
                this.state.allBuyCart = [];
                this.state.totalMoney = 0;
                this.state.commitOrdersId = '';
            }
            if (this.state.useless.length > 0) {               
                for(let j = 0 ;j < this.state.useless.length ; j++){
                    this.state.disabledProduct[j] = {id:this.state.useless[j].id,choosed:true}
                }
            }else{
                this.state.disabledProduct = [];
            }
            this.state.updataBybutton = true;
            this.state.shouldUpadta = false;
            this.state.chooseAllProduct = false;
        }

        if (this.state.use.length == 0&&this.state.useless.length == 0) {
            var emptyCart = (<div className='empty_container'>
                <div className='empty_backImg'></div>
                <div className='empty_text'>您还没有相关商品</div>
                <Link to='/index' className='empty_button'>去逛逛</Link>
            </div>)
        }

        if ((this.state.use.length > 0)&&editContext == '编辑') {
           editContext = (<OrderFoot content='去结算' buy_type='2' sku_id={this.state.commitOrdersId} totalMoney={this.state.totalMoney} showAllMoney chooseAllProduct={this.state.chooseAllProduct} selectFun={this.changeSelectStatus} chooseAll transToConfirmorders={this.state.use.length}/>) 
        }else if(this.state.use.length > 0){
           editContext = (<OrderFoot deleteProduct deleteAll={this.deleteAll} totalMoney={this.state.totalMoney} chooseAllProduct={this.state.chooseAllProduct} selectFun={this.changeSelectStatus} chooseAll />) 
        }else{
            editContext = null;
        }
        return (
            <div className='shoppingcart_container'>
                <OrderHead backToIndex edit editContext={this.state.editContext} editCartChange={this.editCartChange} title='购物车'/>
                {emptyCart}
                {
                    this.state.use.length > 0 ? <List editCart={this.state.editCart} chooseAllProduct={this.state.chooseAllProduct} updataBybutton={this.state.updataBybutton} list={this.state.use} /> : null
                }
                {
                    this.state.useless.length > 0 ? <Disabled editCart={this.state.editCart} chooseAllProduct={this.state.chooseAllProduct} updataBybutton={this.state.updataBybutton} list={this.state.useless} /> : null
                }{/*失效商品*/}
                {editContext}
            </div>
        );
    }
}

Main.childContextTypes = {
    submitBuyCart: React.PropTypes.any,
    transmitUseLess:React.PropTypes.any,
    getShoppingCartList:React.PropTypes.any

};


export default GetData({
    id: 'shoppingcart',  //应用关联使用的redux
    component: Main, //接收数据的组件入口
    url: '/product/cart/view',
    data: {},
    success: (state) => { return state; }, //请求成功后执行的方法
    error: (state) => { return state } //请求失败后执行的方法
});
