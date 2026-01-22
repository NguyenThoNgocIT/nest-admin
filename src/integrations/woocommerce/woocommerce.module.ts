import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CouponController } from './controllers/coupon.controller'
import { CustomerController } from './controllers/customer.controller'
import { OrderActionsController } from './controllers/order-actions.controller'
import { OrderRefundController } from './controllers/order-refund.controller'
import { OrderController } from './controllers/order.controller'
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
import { StoreController } from './controllers/store.controller'
import { TaxClassController } from './controllers/tax-class.controller'
import { TaxRateController } from './controllers/tax-rate.controller'
import { WebhookController } from './controllers/webhook.controller'
import { WooCommerceCouponEntity } from './entities/woocommerce-coupon.entity'
import { WooCommerceCustomerEntity } from './entities/woocommerce-customer.entity'
import { WooCommerceOrderNoteEntity } from './entities/woocommerce-order-note.entity'
import { WooCommerceOrderRefundEntity } from './entities/woocommerce-order-refund.entity'
import { WooCommerceOrderEntity } from './entities/woocommerce-order.entity'
import { WooCommerceProductAttributeTermEntity } from './entities/woocommerce-product-attribute-term.entity'
import { WooCommerceProductAttributeEntity } from './entities/woocommerce-product-attribute.entity'
import { WooCommerceProductCategoryEntity } from './entities/woocommerce-product-category.entity'
import { WooCommerceProductReviewEntity } from './entities/woocommerce-product-review.entity'
import { WooCommerceProductShippingClassEntity } from './entities/woocommerce-product-shipping-class.entity'
import { WooCommerceProductTagEntity } from './entities/woocommerce-product-tag.entity'
import { WooCommerceProductVariationEntity } from './entities/woocommerce-product-variation.entity'
import { WooCommerceProductEntity } from './entities/woocommerce-product.entity'
import { WooCommerceStoreEntity } from './entities/woocommerce-store.entity'
import { WooCommerceTaxClassEntity } from './entities/woocommerce-tax-class.entity'
import { WooCommerceTaxRateEntity } from './entities/woocommerce-tax-rate.entity'
import { WooCommerceWebhookEntity } from './entities/woocommerce-webhook.entity'
import { CouponService } from './services/coupon.service'
import { CustomerService } from './services/customer.service'
import { OrderActionsService } from './services/order-actions.service'
import { OrderRefundService } from './services/order-refund.service'
import { OrderService } from './services/order.service'
import { ProductAttributeTermService } from './services/product-attribute-term.service'
import { ProductAttributeService } from './services/product-attribute.service'
import { ProductCategoryService } from './services/product-category.service'
import { ProductReviewService } from './services/product-review.service'
import { ProductShippingClassService } from './services/product-shipping-class.service'
import { ProductTagService } from './services/product-tag.service'
import { ProductVariationService } from './services/product-variation.service'
import { ProductService } from './services/product.service'
import { ReportService } from './services/report.service'
import { StoreCredentialsService } from './services/store-credentials.service'
import { TaxClassService } from './services/tax-class.service'
import { TaxRateService } from './services/tax-rate.service'
import { WebhookService } from './services/webhook.service'
import { WooCommerceClientService } from './services/woocommerce-client.service'
import { WooCommerceAdapter } from './woocommerce.adapter'

@Module({
  imports: [
    TypeOrmModule.forFeature([
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
      WooCommerceOrderEntity,
      WooCommerceOrderNoteEntity,
      WooCommerceOrderRefundEntity,
      WooCommerceCouponEntity,
      WooCommerceWebhookEntity,
      WooCommerceCustomerEntity,
    ]),
  ],
  controllers: [
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
    OrderActionsController,
    OrderRefundController,
  ],
  providers: [
    StoreCredentialsService,
    WooCommerceClientService,
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
    WooCommerceAdapter,
  ],
  exports: [
    WooCommerceAdapter,
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
    OrderActionsService,
    OrderRefundService,
  ],
})
export class WooCommerceModule {}
