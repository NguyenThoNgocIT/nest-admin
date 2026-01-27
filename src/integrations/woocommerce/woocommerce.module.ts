import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CouponController } from './controllers/coupon.controller'
import { CustomerController } from './controllers/customer.controller'
import { DataController } from './controllers/data.controller'
import { OrderActionsController } from './controllers/order-actions.controller'
import { OrderRefundController } from './controllers/order-refund.controller'
import { OrderController } from './controllers/order.controller'
import { PaymentGatewayController } from './controllers/payment-gateway.controller'
import { ProductAttributeTermController } from './controllers/product-attribute-term.controller'
import { ProductAttributeController } from './controllers/product-attribute.controller'
import { ProductCategoryController } from './controllers/product-category.controller'
import { ProductReviewController } from './controllers/product-review.controller'
import { ProductShippingClassController } from './controllers/product-shipping-class.controller'
import { ProductTagController } from './controllers/product-tag.controller'
import { ProductVariationController } from './controllers/product-variation.controller'
import { ProductController } from './controllers/product.controller'
import { RefundController } from './controllers/refund.controller'
import { ReportController } from './controllers/report.controller'
import { SettingController } from './controllers/setting.controller'
import { ShippingMethodController } from './controllers/shipping-method.controller'
import { ShippingZoneController } from './controllers/shipping-zone.controller'
import { StoreController } from './controllers/store.controller'
import { SystemStatusToolController } from './controllers/system-status-tool.controller'
import { SystemStatusController } from './controllers/system-status.controller'
import { TaxClassController } from './controllers/tax-class.controller'
import { TaxRateController } from './controllers/tax-rate.controller'
import { WebhookController } from './controllers/webhook.controller'
import { WooCommerceCouponEntity } from './entities/woocommerce-coupon.entity'
import { WooCommerceCustomerEntity } from './entities/woocommerce-customer.entity'
import { WooCommerceOrderNoteEntity } from './entities/woocommerce-order-note.entity'
import { WooCommerceOrderRefundEntity } from './entities/woocommerce-order-refund.entity'
import { WooCommerceOrderEntity } from './entities/woocommerce-order.entity'
import { WooCommercePaymentGatewayEntity } from './entities/woocommerce-payment-gateway.entity'
import { WooCommerceProductAttributeTermEntity } from './entities/woocommerce-product-attribute-term.entity'
import { WooCommerceProductAttributeEntity } from './entities/woocommerce-product-attribute.entity'
import { WooCommerceProductCategoryEntity } from './entities/woocommerce-product-category.entity'
import { WooCommerceProductReviewEntity } from './entities/woocommerce-product-review.entity'
import { WooCommerceProductShippingClassEntity } from './entities/woocommerce-product-shipping-class.entity'
import { WooCommerceProductTagEntity } from './entities/woocommerce-product-tag.entity'
import { WooCommerceProductVariationEntity } from './entities/woocommerce-product-variation.entity'
import { WooCommerceProductEntity } from './entities/woocommerce-product.entity'
import { WooCommerceSettingGroupEntity } from './entities/woocommerce-setting-group.entity'
import { WooCommerceSettingOptionEntity } from './entities/woocommerce-setting-option.entity'
import { WooCommerceShippingMethodEntity } from './entities/woocommerce-shipping-method.entity'
import { WooCommerceShippingZoneLocationEntity } from './entities/woocommerce-shipping-zone-location.entity'
import { WooCommerceShippingZoneEntity } from './entities/woocommerce-shipping-zone.entity'
import { WooCommerceStoreEntity } from './entities/woocommerce-store.entity'
import { WooCommerceTaxClassEntity } from './entities/woocommerce-tax-class.entity'
import { WooCommerceTaxRateEntity } from './entities/woocommerce-tax-rate.entity'
import { WooCommerceWebhookEntity } from './entities/woocommerce-webhook.entity'
import { CouponService } from './services/coupon.service'
import { CustomerService } from './services/customer.service'
import { DataService } from './services/data.service'
import { OrderActionsService } from './services/order-actions.service'
import { OrderRefundService } from './services/order-refund.service'
import { OrderService } from './services/order.service'
import { PaymentGatewayService } from './services/payment-gateway.service'
import { ProductAttributeTermService } from './services/product-attribute-term.service'
import { ProductAttributeService } from './services/product-attribute.service'
import { ProductCategoryService } from './services/product-category.service'
import { ProductReviewService } from './services/product-review.service'
import { ProductShippingClassService } from './services/product-shipping-class.service'
import { ProductTagService } from './services/product-tag.service'
import { ProductVariationService } from './services/product-variation.service'
import { ProductService } from './services/product.service'
import { ReportService } from './services/report.service'
import { SettingService } from './services/setting.service'
import { ShippingMethodService } from './services/shipping-method.service'
import { ShippingZoneService } from './services/shipping-zone.service'
import { StoreCredentialsService } from './services/store-credentials.service'
import { SystemStatusToolService } from './services/system-status-tool.service'
import { SystemStatusService } from './services/system-status.service'
import { TaxClassService } from './services/tax-class.service'
import { TaxRateService } from './services/tax-rate.service'
import { WebhookService } from './services/webhook.service'
import { WooCommerceClientService } from './services/woocommerce-client.service'
import { WooCommerceAdapter } from './woocommerce.adapter'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WooCommerceSettingGroupEntity,
      WooCommerceSettingOptionEntity,
      WooCommerceStoreEntity,
      WooCommerceProductEntity,
      WooCommerceProductVariationEntity,
      WooCommerceProductAttributeEntity,
      WooCommerceProductAttributeTermEntity,
      WooCommerceProductCategoryEntity,
      WooCommerceProductShippingClassEntity,
      WooCommerceProductTagEntity,
      WooCommerceTaxClassEntity,
      WooCommerceTaxRateEntity,
      WooCommerceProductReviewEntity,
      WooCommercePaymentGatewayEntity,
      WooCommerceShippingMethodEntity,
      WooCommerceShippingZoneEntity,
      WooCommerceShippingMethodEntity,
      WooCommerceShippingZoneLocationEntity,
      WooCommerceOrderEntity,
      WooCommerceOrderNoteEntity,
      WooCommerceOrderRefundEntity,
      WooCommerceCouponEntity,
      WooCommerceWebhookEntity,
      WooCommerceCustomerEntity,
    ]),
  ],
  controllers: [
    ShippingMethodController,
    ShippingZoneController,
    PaymentGatewayController,
    SettingController,
    SystemStatusController,
    SystemStatusToolController,
    StoreController,
    ProductController,
    ProductVariationController,
    ProductAttributeController,
    ProductAttributeTermController,
    ProductCategoryController,
    ProductShippingClassController,
    ProductTagController,
    ReportController,
    ProductReviewController,
    RefundController,
    TaxRateController,
    TaxClassController,
    WebhookController,
    OrderController,
    CouponController,
    CustomerController,
    DataController,
    OrderActionsController,
    OrderRefundController,
  ],
  providers: [
    StoreCredentialsService,
    ShippingZoneService,
    ShippingMethodService,
    PaymentGatewayService,
    WooCommerceClientService,
    SettingService,
    SystemStatusService,
    SystemStatusToolService,
    ProductService,
    ProductVariationService,
    ProductAttributeService,
    ProductAttributeTermService,
    ProductCategoryService,
    ProductShippingClassService,
    ProductTagService,
    ProductReviewService,
    ReportService,
    TaxRateService,
    TaxClassService,
    WebhookService,
    OrderService,
    OrderActionsService,
    OrderRefundService,
    CouponService,
    CustomerService,
    DataService,
    WooCommerceAdapter,
  ],
  exports: [
    ShippingZoneService,
    ShippingMethodService,
    WooCommerceAdapter,
    PaymentGatewayService,
    SettingService,
    SystemStatusService,
    SystemStatusToolService,
    ProductService,
    ProductVariationService,
    ProductAttributeService,
    ProductAttributeTermService,
    ProductCategoryService,
    ProductShippingClassService,
    ProductTagService,
    ProductReviewService,
    ReportService,
    TaxRateService,
    TaxClassService,
    WebhookService,
    OrderService,
    StoreCredentialsService,
    CouponService,
    CustomerService,
    DataService,
    OrderActionsService,
    OrderRefundService,
  ],
})
export class WooCommerceModule {}
