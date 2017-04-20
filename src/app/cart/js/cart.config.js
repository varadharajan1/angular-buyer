angular.module('orderCloud')
    .config(CartConfig)
;

function CartConfig($stateProvider) {
    $stateProvider
        .state('cart', {
            parent: 'base',
            url: '/cart',
            templateUrl: 'cart/templates/cart.html',
            controller: 'CartCtrl',
            controllerAs: 'cart',
            data: {
                pageTitle: 'Shopping Cart'
            },
            resolve: {
                LineItemsList: function($q, $state, toastr, OrderCloudSDK, ocLineItems, CurrentOrder) {
                    var dfd = $q.defer();
                    OrderCloudSDK.LineItems.List('outgoing', CurrentOrder.ID)
                        .then(function(data) {
                            if (!data.Items.length) {
                                dfd.resolve(data);
                            }
                            else {
                                ocLineItems.GetProductInfo(data.Items)
                                    .then(function() {
                                        dfd.resolve(data);
                                    });
                            }
                        })
                        .catch(function() {
                            toastr.warning('Your order does not contain any line items.');
                            dfd.reject();
                        });
                    return dfd.promise;
                },
                CurrentPromotions: function(CurrentOrder, OrderCloudSDK) {
                    return OrderCloudSDK.Orders.ListPromotions('outgoing', CurrentOrder.ID);
                }
            }
        });
}