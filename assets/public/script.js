new Vue({
    el: '#app',
    data: {
        total: 0.0,
        items: [],
        cart: [],
        newSearch: 'anime',
        lastSearch: '',
        loading: false
    },
    methods: {
        onSubmit: function () {
            var self = this;

            this.items = [];
            this.loading = true;

            this.$http
                .get('/search/'.concat(this.newSearch))
                .then(function (res) {
                    self.lastSearch = self.newSearch;
                    self.loading = false;
                    self.items = res.data;
                });
        },
        addItem: function (index) {
            var i;
            var cartSize = this.cart.length;
            var item = this.items[index];

            this.total += 9.99;

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
                price: 9.99
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
    filters: {
        currency: function (price) {
            return '$'.concat(price.toFixed(2));
        }
    },
    created: function() {
        this.onSubmit();
    }
});