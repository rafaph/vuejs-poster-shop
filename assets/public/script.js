var PRICE = 9.99;
var LOAD_NUM = 10;

new Vue({
    el: '#app',
    data: {
        total: 0.0,
        items: [],
        results: [],
        cart: [],
        newSearch: '90s',
        lastSearch: '',
        loading: false,
        price: PRICE
    },
    methods: {
        appendItems: function () {
            var append;

            if (this.items.length < this.results.length) {
                append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
                this.items = this.items.concat(append);
            }
        },
        onSubmit: function () {
            var self;
            if (this.newSearch.length) {
                self = this;
                this.items = [];
                self.results = [];
                this.loading = true;

                this.$http
                    .get('/search/'.concat(this.newSearch))
                    .then(function (res) {
                        self.lastSearch = self.newSearch;
                        self.loading = false;
                        self.results = res.data;
                        self.appendItems();
                    });
            }
        },
        addItem: function (index) {
            var i;
            var cartSize = this.cart.length;
            var item = this.items[index];

            this.total += PRICE;

            for (i = 0; i < cartSize; i++) {
                if (this.cart[i].id == item.id) {
                    this.cart[i].qty++;
                    return;
                }
            }

            this.cart.push({
                id: item.id,
                title: item.title,
                qty: 1,
                price: PRICE
            });
        },
        inc: function (item) {
            item.qty++;
            this.total += item.price;
        },
        dec: function (item) {
            var i;
            var cartSize = this.cart.length;

            item.qty--;
            this.total -= item.price;

            if (item.qty <= 0) {
                for (i = 0; i < cartSize; i++) {
                    if (this.cart[i].id == item.id) {
                        this.cart.splice(i, 1);
                        break;
                    }
                }
            }
        }
    },
    computed: {
        noMoreItems: function () {
            return this.items.length === this.results.length && this.results.length > 0;
        }
    },
    filters: {
        currency: function (price) {
            return '$'.concat(price.toFixed(2));
        }
    },
    mounted: function () {
        this.onSubmit();

        var self = this;
        var elem = document.getElementById('product-list-bottom');
        var watcher = scrollMonitor.create(elem);

        watcher.enterViewport(function () {
            self.appendItems();
        });
    }
});