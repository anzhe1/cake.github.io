// DOM元素
const cartButton = document.getElementById('cart-button');
const cartModal = document.getElementById('cart-modal');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartButton = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartCount = document.querySelector('.cart-count');
const clearCartButton = document.getElementById('clear-cart-btn');
const checkoutButton = document.getElementById('checkout-btn');


// 实时搜索
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
    //  获取用户输入的关键词
    const key = searchInput.value.trim().toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
        // (value )获取商品名称（从data-name属性）
        const txt = card.dataset.name.toLowerCase();
        // 判断商品名称是否包含关键词
        card.style.display = txt.includes(key) ? 'block' : 'none';
    });
});


// 创建空数组存储购物车商品
let cart = [];

//打开购物车
function openCart() {
    cartModal.classList.add('open');     // 添加'open'类显示购物车模态框
    cartOverlay.style.display = 'block'; // 显示遮罩层
    updateCartDisplay();                 // 更新购物车显示内容
}

// 关闭购物车
function closeCart() {
    cartModal.classList.remove('open');  // 移除'open'类隐藏购物车
    cartOverlay.style.display = 'none';  // 隐藏遮罩层
}

// 更新购物车显示
function updateCartDisplay() {
    // 清空购物车显示
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        // 显示空购物车消息
        cartItemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>购物车是空的</p>
                        <p>快去挑选喜欢的蛋糕吧！</p>
                    </div>
                `;
        cartTotalPrice.textContent = '¥0';
        cartCount.textContent = '0';//更新圆点的商品总数
        return;
    }

    // 计算总价和总数量
    let totalPrice = 0;
    let totalCount = 0;

    //遍历购物车数组，为每个商品创建HTML元素
    cart.forEach(item => {
        totalPrice += item.price * item.quantity; // 累加商品总价
        totalCount += item.quantity;             // 累加商品数量
        
        // 创建商品卡片元素
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.dataset.id = item.id; // 存储商品ID用于后续操作
        cartItemElement.innerHTML = `
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">¥${item.price}</div>
                 
                    </div>
                `;
        // 将创建的元素添加到购物车容器中
        cartItemsContainer.appendChild(cartItemElement);
    });

    // 更新总价和商品数量
    cartTotalPrice.textContent = `¥${totalPrice}`;
    cartCount.textContent = totalCount;
   
}

// 添加商品到购物车
function addToCart(productCard) {
    const id = parseInt(productCard.dataset.id);
    const name = productCard.dataset.name;
    const price = parseInt(productCard.dataset.price);
    const image = productCard.dataset.image;

    // 检查商品是否已在购物车中
    const existingItemIndex = cart.findIndex(item => item.id === id);

    if (existingItemIndex !== -1) {
        // 如果已存在，增加数量
        cart[existingItemIndex].quantity += 1;
    } else {
        // 如果不存在，添加新商品
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    // 更新购物车显示
    updateCartDisplay();//
    saveCartToStorage();
}

// 清空购物车
function clearCart() {
    if (cart.length === 0) return;

    if (confirm('确定要清空购物车吗？')) {
        cart = [];
        updateCartDisplay();
        saveCartToStorage();
    }
}

// 结算
function checkout() {
    if (cart.length === 0) {
        alert('购物车是空的，请先添加商品！');
        return;
    }

    let orderSummary = '您的购物车商品：\n\n';
    let totalPrice = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        orderSummary += `${item.name} x${item.quantity} = ¥${itemTotal}\n`;
    });

    orderSummary += `\n总计：¥${totalPrice}\n\n确认结算吗？`;

    if (confirm(orderSummary)) {
        alert('结算成功！感谢您的购买。\n订单已提交，我们将尽快为您准备商品。');
        cart = [];
        updateCartDisplay();
        saveCartToStorage();
        closeCart();
    }
}

// 保存购物车到本地存储
function saveCartToStorage() {
    localStorage.setItem('cakeShopCart', JSON.stringify(cart));
}

// 从本地存储加载购物车
//使用 localStorage 保存购物车状态
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cakeShopCart');
    if (savedCart) {
        // 使用 JSON.parse() 将字符串转换回 JavaScript 对象
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// 事件监听器
cartButton.addEventListener('click', openCart);
closeCartButton.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart); // 点击遮罩层关闭
clearCartButton.addEventListener('click', clearCart);
checkoutButton.addEventListener('click', checkout);


// 详情页打开详情
function openDetail(card) {
    const d = card.dataset;
    document.getElementById('detailImg').src = d.image; // 设置图片源
    document.getElementById('detailName').textContent = d.name;
    document.getElementById('detailPrice').textContent = '¥' + d.price; // 设置文本内容

    document.getElementById('detailOverlay').style.display = 'flex';  // 显示遮罩
    document.getElementById('detailIngredients').textContent = d.ingredients || '见描述';

    window._currentCard = card;//临时存储当前商品卡片
}
// 关闭详情
function closeDetail() {
    document.getElementById('detailOverlay').style.display = 'none';
}

// 给所有商品卡片绑定点击
//querySelectorAll('.product-card')，获取所有class为product-card的元素
document.querySelectorAll('.product-card').forEach(c =>
     c.addEventListener('click', e => {
    if (!e.target.classList.contains('add-to-cart')) openDetail(c);
}));



// 轮播图
(function initCarousel() {
    const slide = document.querySelector('.carousel-slide');  // 轮播容器
    const items = document.querySelectorAll('.carousel-item'); // 所有轮播项
    const total = items.length;

    if (!slide || total === 0) return;

    let index = 0;  // 当前显示的图片索引
    let timer = null; // 定时器ID

    //克隆第一张放最后，实现无缝 
    const first = items[0].cloneNode(true);
    slide.appendChild(first);

    // 更新位置 
    //goto函数控制移动
    //withTransition：是否使用过渡动画，通过transform: translateX(-100%)横向移动容器
    function goTo(i, withTransition = true) {
        slide.style.transition = withTransition ? 'transform 600ms ease' : 'none';
        slide.style.transform = `translateX(-${i * 100}%)`;
    }

    // 自动播放 ，使用next函数
    function next() {
        index++;
        goTo(index, true);

        //无缝瞬间回 0 
        if (index === total) {  // 当显示到克隆的图片时（即最后一张）
            setTimeout(() => {
                index = 0;      // 重置索引为0
                goTo(index, false);   //无动画跳回真正的第一张
            }, 600);
        }
    }

    /* 轮播图时间控制*/
    function play() {
        if (timer) clearInterval(timer);// 清除旧定时器
        timer = setInterval(next, 2000);//间隔时间，setInterval控制自动播放
    }
    //启动
    play();
})();


// 添加购物车按钮功能，控制主页面的按钮
const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', function () {
        const productCard = this.closest('.product-card');
        addToCart(productCard);
    });
});


